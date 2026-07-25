// src/utils/fetchPage.ts
import { fetchSemaphore } from "./semaphore";
import * as cheerio from "cheerio";
import * as tls from "tls";
import { URL } from "url";
import type { AuditData } from "../types/audit";

async function getSslDetails(targetUrl: string): Promise<AuditData["ssl"]> {
  return new Promise((resolve) => {
    try {
      const url = new URL(targetUrl);
      if (url.protocol !== "https:") return resolve(null);

      const socket = tls.connect(
        {
          host: url.hostname,
          port: Number(url.port) || 443,
          servername: url.hostname,
          rejectUnauthorized: false,
        },
        () => {
          const cert = socket.getPeerCertificate();
          const valid = socket.authorized;
          const tlsVersion = socket.getProtocol();
          socket.destroy();

          const rawIssuer = cert.issuer?.O || cert.issuer?.CN || undefined;
          let issuer: string | null = null;
          if (rawIssuer !== undefined) {
            if (Array.isArray(rawIssuer)) issuer = rawIssuer[0] || null;
            else issuer = String(rawIssuer);
          }

          resolve({
            valid,
            issuer: issuer || "Unknown",
            validTo: cert.valid_to || null, // Fixed: Node.js uses snake_case here
            tlsVersion: tlsVersion || "Unknown",
          });
        },
      );

      socket.on("error", () => resolve(null));
      socket.setTimeout(3000, () => {
        socket.destroy();
        resolve(null);
      });
    } catch {
      resolve(null);
    }
  });
}

export async function fetchWithMetadata(
  targetUrl: string,
  timeoutMs = 15000,
): Promise<AuditData> {
  const startTime = performance.now();
  const redirects: string[] = [];
  let currentUrl = targetUrl;
  let status = 200;
  let response: Response | null = null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  await fetchSemaphore.acquire();

  try {
    for (let i = 0; i < 5; i++) {
      response = await fetch(currentUrl, {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": "PagePulse-Auditor/3.0 (Dreadnought)",
          Accept: "text/html,application/xhtml+xml",
        },
      });

      status = response.status;
      if (status >= 300 && status < 400 && response.headers.has("location")) {
        redirects.push(currentUrl);
        currentUrl = new URL(
          response.headers.get("location")!,
          currentUrl,
        ).toString();
      } else {
        break;
      }
    }

    if (!response) throw new Error("Failed to resolve response");

    const contentType = response.headers.get("content-type") || "";
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const sslDetails = await getSslDetails(currentUrl);

    // Fixed: Explicitly typed to satisfy the strict compiler
    const seo: AuditData["seo"] = {
      title: null,
      description: null,
      canonical: null,
      robots: null,
      language: null,
      favicon: null,
      openGraph: false,
      twitterCard: false,
    };
    const structure: AuditData["structure"] = {
      h1Count: 0,
      h2Count: 0,
      images: 0,
      imagesWithoutAlt: 0,
      links: 0,
      internalLinks: 0,
      externalLinks: 0,
      scripts: 0,
      stylesheets: 0,
    };

    const securityHeaders = {
      hsts: !!headers["strict-transport-security"],
      csp: !!headers["content-security-policy"],
      xFrameOptions: !!headers["x-frame-options"],
      xContentTypeOptions: !!headers["x-content-type-options"],
    };

    if (contentType.includes("text/html")) {
      const html = await response.text();
      const $ = cheerio.load(html);
      const parsedUrl = new URL(currentUrl);

      seo.title = $("title").first().text().trim() || null;
      seo.description =
        $('meta[name="description"]').attr("content")?.trim() || null;
      seo.canonical = $('link[rel="canonical"]').attr("href")?.trim() || null;
      seo.robots = $('meta[name="robots"]').attr("content")?.trim() || null;
      seo.language = $("html").attr("lang")?.trim() || null;
      seo.favicon =
        $('link[rel="icon"], link[rel="shortcut icon"]').attr("href")?.trim() ||
        null;
      seo.openGraph = $('meta[property^="og:"]').length > 0;
      seo.twitterCard = $('meta[name^="twitter:"]').length > 0;

      structure.h1Count = $("h1").length;
      structure.h2Count = $("h2").length;
      structure.scripts = $("script").length;
      structure.stylesheets = $('link[rel="stylesheet"]').length;

      const $images = $("img");
      structure.images = $images.length;
      $images.each((_, el) => {
        if (!$(el).attr("alt")?.trim()) structure.imagesWithoutAlt++;
      });

      const $links = $("a");
      structure.links = $links.length;
      $links.each((_, el) => {
        const href = $(el).attr("href");
        if (href) {
          if (href.startsWith("/") || href.includes(parsedUrl.hostname))
            structure.internalLinks++;
          else if (href.startsWith("http")) structure.externalLinks++;
        }
      });
    }

    return {
      url: targetUrl,
      finalUrl: currentUrl,
      status,
      responseTime: Math.round(performance.now() - startTime),
      timestamp: new Date().toISOString(),
      contentType,
      contentLength: headers["content-length"] || null,
      server: headers["server"] || null,
      headers,
      redirects,
      securityHeaders,
      ssl: sslDetails,
      seo,
      structure,
    };
  } catch (error: any) {
    if (error.name === "AbortError") throw new Error("TIMEOUT");
    throw error;
  } finally {
    clearTimeout(timeoutId);
    fetchSemaphore.release();
  }
}
