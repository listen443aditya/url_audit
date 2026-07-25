// page-pulse-ui/src/components/ui/UrlInput.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertCircle, Loader2, ArrowRight } from "lucide-react";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  externalError?: string | null;
}

export const UrlInput: React.FC<UrlInputProps> = ({
  onSubmit,
  isLoading,
  externalError,
}) => {
  const [inputUrl, setInputUrl] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setValidationError("URL cannot be empty.");
      return false;
    }
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        setValidationError("Protocol must be strictly HTTP or HTTPS.");
        return false;
      }
      setValidationError(null);
      return true;
    } catch (e) {
      setValidationError("Malformed URL structure. Please include https://");
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUrl(inputUrl)) onSubmit(inputUrl);
  };

  const displayError = validationError || externalError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl mx-auto z-10 relative"
    >
      <form
        onSubmit={handleSubmit}
        className="relative group shadow-2xl shadow-blue-900/5 rounded-2xl bg-white/50 backdrop-blur-xl border border-white p-2"
      >
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300" />
        </div>

        <input
          type="text"
          value={inputUrl}
          onChange={(e) => {
            setInputUrl(e.target.value);
            if (validationError) setValidationError(null);
          }}
          disabled={isLoading}
          placeholder="https://example.com"
          className="block w-full pl-12 pr-36 py-4 text-slate-900 bg-transparent rounded-xl focus:outline-none transition-all disabled:opacity-50 text-lg placeholder:text-slate-300 font-medium"
        />

        <button
          type="submit"
          disabled={isLoading || !inputUrl.trim()}
          className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/20 transition-all duration-300 disabled:bg-slate-200 disabled:text-slate-400 flex items-center justify-center min-w-[120px] shadow-sm"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Audit <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <AnimatePresence>
        {displayError && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="mt-4 flex items-center text-sm text-red-600 bg-red-50/80 backdrop-blur-md p-4 rounded-xl border border-red-100 shadow-sm"
          >
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="font-medium">{displayError}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
