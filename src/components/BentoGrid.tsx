"use client";

import Link from "next/link";
import { useState } from "react";
import {
  categories,
  serviceSlugs,
  services,
  type Category,
} from "@/lib/catalog";
import { Icon, ServiceIcon } from "./Icon";
import { Reveal } from "./Reveal";

type Filter = "all" | Category;

export function BentoGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = serviceSlugs.filter(
    (slug) => filter === "all" || services[slug].cat === filter,
  );
  const widePulsa = filter === "all" || filter === "isi" ? services.pulsa : null;
  const cards = visible
    .filter((slug) => slug !== "pulsa")
    .map((slug) => services[slug]);

  return (
    <section id="layanan" className="wrap scroll-mt-20 pt-20">
      <Reveal className="text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.14em] text-leaf">
          9 layanan, 1 tempat
        </span>
        <h2 className="mt-3 font-display text-4xl font-black leading-[1.02] sm:text-6xl">
          Mau bayar apa hari ini?
        </h2>
        <div className="mt-6 flex justify-center">
          <div
            className="hscroll max-w-full rounded-full border border-line bg-white p-1.5"
            role="group"
            aria-label="Filter layanan"
          >
            {categories.map((category) => {
              const isActive = filter === category.value;
              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setFilter(category.value)}
                  aria-pressed={isActive}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-leaf text-cream"
                      : "text-moss hover:text-ink"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {widePulsa ? (
          <Link
            href="/produk/?s=pulsa"
            className="group col-span-2 flex flex-col gap-6 rounded-[26px] bg-sun p-6 text-ink transition hover:-translate-y-1 sm:p-8 lg:col-span-4 lg:flex-row lg:items-center lg:gap-10"
          >
            <div className="flex items-center gap-4 lg:w-[38%]">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-leaf text-cream">
                <ServiceIcon slug="pulsa" className="h-8 w-8" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.12em] opacity-70">
                  Paling laris
                </div>
                <h3 className="mt-1 font-display text-4xl font-black leading-none sm:text-5xl">
                  Pulsa
                </h3>
              </div>
            </div>
            <p className="max-w-sm opacity-80 lg:flex-1">
              {services.pulsa.desc} Nominal mulai 5rb sampai 100rb.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {["5rb", "10rb", "25rb", "50rb"].map((nominal) => (
                <span
                  key={nominal}
                  className="hidden rounded-full bg-white/70 px-3 py-1.5 text-sm font-bold sm:inline-flex"
                >
                  {nominal}
                </span>
              ))}
              <span className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-bold text-cream">
                Isi sekarang
                <Icon
                  name="arrow"
                  className="h-4 w-4 transition group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        ) : null}

        {cards.map((service) => {
          const number = String(serviceSlugs.indexOf(service.slug) + 1).padStart(2, "0");
          return (
            <Link
              key={service.slug}
              href={`/produk/?s=${service.slug}`}
              className="group card flex min-h-[170px] flex-col justify-between gap-6 p-4 transition hover:border-leaf sm:min-h-[210px] sm:p-6"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-full border border-leaf/35 text-leaf transition group-hover:bg-leaf group-hover:text-cream">
                  <ServiceIcon slug={service.icon} />
                </div>
                <span className="font-display text-sm font-bold text-moss">{number}</span>
              </div>
              <div>
                <h3 className="font-display text-lg font-extrabold leading-tight sm:text-2xl">
                  {service.name}
                </h3>
                <p className="mt-1.5 hidden text-sm leading-snug text-moss sm:block">
                  {service.desc}
                </p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-xs font-semibold text-moss">{service.catL}</span>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-cream transition group-hover:bg-leaf group-hover:text-cream">
                    <Icon name="arrow" className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
