"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "Förderprogramme", sub: "KfW, BAFA, Länder & Kommunen" },
  { value: "70 %", label: "Zeitersparnis", sub: "vs. manuelle Recherche" },
  { value: "24 h", label: "Aktualisierung", sub: "KI-Agent überwacht täglich" },
  { value: "4 Tiers", label: "Flexible Pakete", sub: "Von Free bis Enterprise" },
];

export default function StatsSection() {
  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="section-container py-12">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center lg:text-left lg:pl-8 lg:border-l border-slate-100 first:border-l-0 first:pl-0"
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
              }}
            >
              <div className="text-3xl font-extrabold text-[#1B4F72] tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-800 mt-1">
                {stat.label}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
