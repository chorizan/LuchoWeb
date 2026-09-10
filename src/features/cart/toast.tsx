"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface CartToastContextValue {
  showToast: (message: string) => void;
}

const CartToastContext = createContext<CartToastContextValue | null>(null);

export function CartToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2500);
  }, []);

  return (
    <CartToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-[100] flex items-center gap-2 bg-olive text-white px-5 py-3 rounded-full shadow-lg text-sm font-medium"
          >
            <Check className="h-4 w-4" />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </CartToastContext.Provider>
  );
}

export function useCartToast() {
  const ctx = useContext(CartToastContext);
  if (!ctx) {
    return { showToast: () => {} };
  }
  return ctx;
}
