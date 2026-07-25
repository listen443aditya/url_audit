// page-pulse-ui/src/components/audit/ResultCard.tsx
import React, { useState } from "react";
import { motion, AnimatePresence, } from "framer-motion";
import type { AuditResponse } from "../../types/audit";
import {
  Activity,
  ShieldCheck,
  Search,
  LayoutDashboard,
  CheckCircle,
  AlertTriangle,
  Zap,
  Server,
  Code,
  Globe,
  Clock,
  HardDrive,
  FileText,
  Image as ImageIcon,
  Link2,
} from "lucide-react";

export const ResultCard: React.FC<{ result: AuditResponse }> = ({ result }) => {
  const { data, cached, requestId } = result;
  const [activeTab, setActiveTab] = useState<
    "summary" | "network" | "security" | "seo"
  >("summary");

  if (!data) return null;

  // Re-wired to access the nested Dreadnought payload
  const titleLen = data.seo.title?.length || 0;
  const descLen = data.seo.description?.length || 0;
  const isHttps = data.finalUrl.startsWith("https://");
  const redirectCount = data.redirects.length;

  let perfScore = 100;
  if (data.responseTime > 300) perfScore -= 10;
  if (data.responseTime > 800) perfScore -= 20;
  if (data.responseTime > 1500) perfScore -= 30;
  if (data.contentLength && Number(data.contentLength) > 2000000)
    perfScore -= 15;

  let secScore = 100;
  if (!isHttps) secScore -= 50;
  if (redirectCount > 2) secScore -= 20;
  if (!data.headers["strict-transport-security"]) secScore -= 10;

  let seoScore = 100;
  if (!data.seo.title) seoScore -= 40;
  else if (titleLen < 30 || titleLen > 65) seoScore -= 15;
  if (!data.seo.description) seoScore -= 20;
  if (data.structure.imagesWithoutAlt > 0)
    seoScore -= Math.min(20, data.structure.imagesWithoutAlt * 5);
  if (data.structure.h1Count === 0) seoScore -= 10;
  if (data.structure.h1Count > 1) seoScore -= 5;

  const overallScore = Math.round((perfScore + secScore + seoScore) / 3);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 70) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-emerald-50 border-emerald-200";
    if (score >= 70) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const tabs = [
    { id: "summary", icon: LayoutDashboard, label: "Executive Summary" },
    { id: "network", icon: Activity, label: "Network & Headers" },
    { id: "security", icon: ShieldCheck, label: "Routing & Security" },
    { id: "seo", icon: Search, label: "Deep SEO & HTML" },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mt-8 bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
    >
      <div className="bg-slate-900 text-white p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Globe className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest rounded-full border border-blue-500/30">
              Assault Complete
            </span>
            {cached && (
              <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest rounded-full border border-emerald-500/30">
                <Zap className="w-3 h-3" /> Cached Intelligence
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-1 truncate">
            {data.url}
          </h2>
          <p className="text-slate-400 font-mono text-sm">
            Req ID: {requestId} | {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 px-4 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap ${
              activeTab === tab.id
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-8 bg-white min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div
                  className={`col-span-1 md:col-span-4 flex items-center justify-between p-6 rounded-xl border ${getScoreBg(overallScore)}`}
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Overall Health Matrix
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Aggregated scoring based on deep HTML and network
                      extraction.
                    </p>
                  </div>
                  <div
                    className={`text-5xl font-extrabold tracking-tighter ${getScoreColor(overallScore)}`}
                  >
                    {overallScore}
                    <span className="text-2xl text-slate-400 font-medium">
                      /100
                    </span>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-slate-100 bg-slate-50 flex flex-col justify-between">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Performance
                  </span>
                  <span
                    className={`text-3xl font-bold ${getScoreColor(perfScore)}`}
                  >
                    {perfScore}
                  </span>
                </div>
                <div className="p-6 rounded-xl border border-slate-100 bg-slate-50 flex flex-col justify-between">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Security
                  </span>
                  <span
                    className={`text-3xl font-bold ${getScoreColor(secScore)}`}
                  >
                    {secScore}
                  </span>
                </div>
                <div className="p-6 rounded-xl border border-slate-100 bg-slate-50 flex flex-col justify-between">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Search className="w-4 h-4" /> SEO
                  </span>
                  <span
                    className={`text-3xl font-bold ${getScoreColor(seoScore)}`}
                  >
                    {seoScore}
                  </span>
                </div>
                <div className="p-6 rounded-xl border border-slate-100 bg-slate-50 flex flex-col justify-between">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Code className="w-4 h-4" /> HTTP Status
                  </span>
                  <span
                    className={`text-3xl font-bold ${data.status >= 200 && data.status < 400 ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {data.status}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
                Tactical Recommendations
              </h3>
              <div className="space-y-4">
                {data.structure.imagesWithoutAlt > 0 && (
                  <div className="flex gap-4 p-4 rounded-lg bg-amber-50 border border-amber-100">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        Missing Image Attributes
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Detected {data.structure.imagesWithoutAlt} image(s)
                        missing alt tags. This damages both accessibility and
                        image search rankings.
                      </p>
                    </div>
                  </div>
                )}
                {!data.seo.description && (
                  <div className="flex gap-4 p-4 rounded-lg bg-red-50 border border-red-100">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        Missing Meta Description
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Search engines will arbitrarily pull text from your page
                        to display in search results, killing your click-through
                        rate.
                      </p>
                    </div>
                  </div>
                )}
                {!data.headers["strict-transport-security"] && (
                  <div className="flex gap-4 p-4 rounded-lg bg-amber-50 border border-amber-100">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        HSTS Missing
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        The Server is not enforcing Strict-Transport-Security.
                        This leaves the site vulnerable to protocol downgrade
                        attacks.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "network" && (
            <motion.div
              key="network"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-slate-900">
                      Latency Analysis
                    </h3>
                  </div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm text-slate-500 font-medium">
                      Total Response Time
                    </span>
                    <span className="text-2xl font-bold font-mono text-slate-900">
                      {data.responseTime}
                      <span className="text-sm text-slate-400">ms</span>
                    </span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                    <HardDrive className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-slate-900">
                      Payload Analysis
                    </h3>
                  </div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm text-slate-500 font-medium">
                      Transfer Size
                    </span>
                    <span className="text-2xl font-bold font-mono text-slate-900">
                      {data.contentLength
                        ? `${(Number(data.contentLength) / 1024).toFixed(2)} KB`
                        : "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                  <Server className="w-4 h-4 text-slate-500" />
                  <h3 className="font-bold text-slate-900">
                    Raw HTTP Response Headers
                  </h3>
                </div>
                <div className="p-6 bg-slate-900 overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300 font-mono">
                    <tbody>
                      {Object.entries(data.headers).map(([key, value]) => (
                        <tr
                          key={key}
                          className="border-b border-slate-800/50 last:border-0"
                        >
                          <td className="py-2 pr-4 text-blue-400 w-1/3 align-top">
                            {key}
                          </td>
                          <td className="py-2 break-all">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-8"
            >
              <table className="w-full text-left text-sm border-collapse">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <th className="py-4 font-semibold text-slate-600 w-1/3">
                      Target URL
                    </th>
                    <td className="py-4 text-slate-900 font-mono truncate max-w-xs">
                      {data.url}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <th className="py-4 font-semibold text-slate-600">
                      Final Resolved URL
                    </th>
                    <td className="py-4 text-slate-900 font-mono truncate max-w-xs">
                      {data.finalUrl}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <th className="py-4 font-semibold text-slate-600">
                      Protocol Security
                    </th>
                    <td className="py-4">
                      {isHttps ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-bold text-xs uppercase">
                          <ShieldCheck className="w-3.5 h-3.5" /> TLS Enabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 text-red-700 font-bold text-xs uppercase">
                          <AlertTriangle className="w-3.5 h-3.5" /> Insecure
                          Connection
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              {data.ssl && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> SSL Certificate Profile
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">
                        Issuer
                      </p>
                      <p className="text-sm font-mono text-slate-900">
                        {data.ssl.issuer}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">
                        Protocol
                      </p>
                      <p className="text-sm font-mono text-slate-900">
                        {data.ssl.tlsVersion}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">
                        Valid Until
                      </p>
                      <p className="text-sm font-mono text-slate-900">
                        {data.ssl.validTo}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">
                        Status
                      </p>
                      <p
                        className={`text-sm font-bold ${data.ssl.valid ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {data.ssl.valid ? "Authorized" : "Unauthorized/Expired"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Redirect Timeline
                </h3>
                {redirectCount === 0 ? (
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Direct
                    resolution. No intermediary hops detected.
                  </p>
                ) : (
                  <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-slate-200 pl-8">
                    {data.redirects.map((url, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-slate-50" />
                        <p className="text-sm font-mono text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-lg truncate shadow-sm">
                          {url}
                        </p>
                      </div>
                    ))}
                    <div className="relative">
                      <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-slate-50" />
                      <div className="text-sm font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg truncate shadow-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> {data.status} OK:{" "}
                        {data.finalUrl}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "seo" && (
            <motion.div
              key="seo"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-xl p-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Title Tag
                  </h3>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg mb-4">
                    <p className="text-sm font-medium text-slate-900">
                      {data.seo.title || (
                        <span className="text-slate-400 italic">Missing</span>
                      )}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Length</span>
                    <span
                      className={`font-mono font-bold px-2 py-1 rounded ${titleLen >= 30 && titleLen <= 65 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {titleLen} chars
                    </span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-6">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Meta Description
                  </h3>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg mb-4">
                    <p className="text-sm font-medium text-slate-900 line-clamp-3">
                      {data.seo.description || (
                        <span className="text-slate-400 italic">Missing</span>
                      )}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Length</span>
                    <span
                      className={`font-mono font-bold px-2 py-1 rounded ${descLen >= 120 && descLen <= 160 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {descLen} chars
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="text-slate-500 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> H1 Tags
                  </div>
                  <div
                    className={`text-2xl font-bold ${data.structure.h1Count === 1 ? "text-emerald-600" : "text-amber-600"}`}
                  >
                    {data.structure.h1Count}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="text-slate-500 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> H2 Tags
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {data.structure.h2Count}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="text-slate-500 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Total Images
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {data.structure.images}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="text-slate-500 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Missing ALT
                  </div>
                  <div
                    className={`text-2xl font-bold ${data.structure.imagesWithoutAlt === 0 ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {data.structure.imagesWithoutAlt}
                  </div>
                </div>
              </div>

              {data.seo.canonical && (
                <div className="p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                  <Link2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-900">
                      Canonical Routing Configured
                    </p>
                    <p className="text-sm text-slate-600 truncate font-mono mt-1">
                      {data.seo.canonical}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
