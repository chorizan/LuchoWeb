"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ question, answer, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border-b border-beige-dark last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span className="font-serif text-base md:text-lg font-semibold group-hover:text-olive transition-colors">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-olive" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm md:text-base text-text-muted leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FAQAccordionProps {
  items: { question: string; answer: string }[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-white rounded-3xl px-6 md:px-8 shadow-sm">
      {items.map((item, i) => (
        <AccordionItem
          key={item.question}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  );
}

interface ComparisonTableProps {
  title: string;
  rows: { aspect: string; maras?: string; refined?: string; panela?: string }[];
  leftLabel: string;
  rightLabel: string;
  leftKey: "maras" | "panela";
  rightKey: "refined";
}

export function ComparisonTable({
  title,
  rows,
  leftLabel,
  rightLabel,
  leftKey,
}: ComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="px-6 py-5 bg-olive/5 border-b border-beige-dark">
        <h3 className="font-serif text-xl font-semibold">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="border-b border-beige-dark">
              <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wide w-1/4">
                Aspecto
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-olive w-[37.5%]">
                {leftLabel}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-muted w-[37.5%]">
                {rightLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.aspect}
                className={cn(
                  "border-b border-beige-dark/50 last:border-0",
                  i % 2 === 0 && "bg-cream/50"
                )}
              >
                <td className="px-6 py-4 text-sm font-medium">{row.aspect}</td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  {row[leftKey]}
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  {row.refined}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
