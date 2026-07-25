// page-pulse-ui/src/App.tsx
import React from "react";
import { Layout } from "./components/layout/Layout";
import { UrlInput } from "./components/ui/UrlInput";
import { ResultCard } from "./components/audit/ResultCard";
import { useAudit } from "./hooks/useAudit";
import { motion, AnimatePresence } from "framer-motion";

const App: React.FC = () => {
  const { data, isLoading, error, auditUrl } = useAudit();

  return (
    <Layout>
      {/* Decorative Enterprise Background Blur */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-slate-200/50 blur-[120px]" />
      </div>

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center pt-12 pb-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Production Grade
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Verify with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Precision.
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            A high-performance analysis engine. Enter a URL below to instantly
            traverse redirect chains, extract core metadata, and measure network
            latency.
          </p>
        </motion.div>

        <UrlInput
          onSubmit={auditUrl}
          isLoading={isLoading}
          externalError={error}
        />

        <AnimatePresence mode="wait">
          {data && (
            <motion.div
              key={data.requestId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
              className="w-full flex justify-center mt-8"
            >
              <ResultCard result={data} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default App;
