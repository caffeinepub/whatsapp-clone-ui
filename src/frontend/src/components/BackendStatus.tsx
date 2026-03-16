import { motion } from "motion/react";

interface BackendStatusProps {
  isConnected: boolean;
}

export default function BackendStatus({ isConnected }: BackendStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute bottom-20 left-3 z-20 pointer-events-none"
      data-ocid="backend.status.panel"
    >
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium shadow-md border backdrop-blur-sm ${
          isConnected
            ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-300"
            : "bg-zinc-900/80 border-zinc-700/30 text-zinc-400"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            isConnected
              ? "bg-emerald-400 animate-pulse shadow-[0_0_4px_#34d399]"
              : "bg-zinc-500"
          }`}
        />
        {isConnected ? "Backend Connected" : "Offline Mode"}
      </div>
    </motion.div>
  );
}
