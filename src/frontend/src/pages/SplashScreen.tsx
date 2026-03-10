import { motion } from "motion/react";
import { useEffect } from "react";

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full"
      style={{ background: "#075E54" }}
      data-ocid="splash.page"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        {/* WhatsApp icon */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <svg
            role="img"
            aria-label="WhatsApp"
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M28 4C14.745 4 4 14.745 4 28c0 4.24 1.115 8.22 3.065 11.665L4 52l12.735-3.335A23.878 23.878 0 0028 52c13.255 0 24-10.745 24-24S41.255 4 28 4z"
              fill="white"
            />
            <path
              d="M20.5 17.5c-.5-1.1-1.05-1.12-1.535-1.14-.4-.015-.86-.015-1.32-.015-.46 0-1.21.172-1.845.86-.635.687-2.42 2.366-2.42 5.773 0 3.407 2.476 6.7 2.82 7.16.345.46 4.8 7.62 11.83 10.38 5.85 2.3 7.034 1.843 8.3 1.727 1.267-.117 4.085-1.67 4.661-3.283.576-1.612.576-2.995.403-3.283-.172-.288-.632-.46-1.323-.805-.69-.344-4.085-2.02-4.72-2.248-.634-.23-1.093-.345-1.553.346-.46.69-1.78 2.248-2.18 2.708-.4.46-.805.518-1.497.173-.69-.346-2.913-1.073-5.55-3.43-2.05-1.833-3.434-4.097-3.835-4.787-.4-.69-.043-1.063.3-1.406.31-.31.69-.805 1.035-1.207.346-.4.46-.69.69-1.15.23-.46.115-.863-.057-1.208-.173-.344-1.52-3.77-2.13-5.16z"
              fill="#25D366"
            />
          </svg>
        </div>

        <div className="text-center">
          <h1 className="text-white text-3xl font-bold tracking-tight">
            WhatsApp
          </h1>
          <p className="text-white/60 text-sm mt-1">from Meta</p>
        </div>
      </motion.div>

      {/* Bottom loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="absolute bottom-16 flex flex-col items-center gap-3"
      >
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </motion.div>
    </div>
  );
}
