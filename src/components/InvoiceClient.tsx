"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ADMIN_WHATSAPP_URL,
  formatRupiah,
  services,
} from "@/lib/catalog";
import { findOrder, getOrders, type Order } from "@/lib/store";
import { Icon, ServiceIcon } from "./Icon";

const steps = [
  { label: "Dibuat", state: "done" },
  { label: "Dicek", state: "current" },
  { label: "Diproses", state: "next" },
];

export function InvoiceClient() {
  const params = useSearchParams();
  const initialId = params.get("id") ?? "";
  const [query, setQuery] = useState(initialId);
  const [result, setResult] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [history, setHistory] = useState<Order[]>([]);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(getOrders().slice(0, 5));
  }, []);

  useEffect(() => {
    if (!initialId) return;
    setQuery(initialId);
    setResult(findOrder(initialId));
    setSearched(true);
  }, [initialId]);

  function show(value: string) {
    setResult(findOrder(value));
    setSearched(true);
  }

  function selectHistory(order: Order) {
    setQuery(order.id);
    setResult(order);
    setSearched(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }

  async function copyCode(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="wrap pb-16 pt-4 sm:pt-6">
      <section className="relative overflow-hidden rounded-[32px] bg-leaf px-5 py-10 text-center text-cream sm:px-10 sm:py-14">
        <div aria-hidden="true" className="hidden lg:block">
          <div className="float absolute left-12 top-8 h-12 w-12 rounded-full bg-sun" />
          <div
            className="float absolute bottom-8 right-14 h-16 w-16 rotate-12 rounded-2xl border-[3px] border-sun/60"
            style={{ animationDelay: "-3s" }}
          />
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-sun">
          Lacak pesanan
        </span>
        <h1 className="relative mt-3 font-display text-[34px] font-black leading-[1.02] sm:text-6xl">
          Pesananmu,
          <br />
          lagi di mana?
        </h1>
        <p className="relative mx-auto mt-4 max-w-md opacity-80">
          Tempel kode invoice MNL- di bawah, status dan detailnya langsung
          kelihatan.
        </p>

        <form
          className="relative mx-auto mt-7 flex max-w-xl gap-1.5 rounded-full bg-white p-1.5 text-left shadow-[0_0_0_4px_rgba(255,219,89,0.35)]"
          onSubmit={(event) => {
            event.preventDefault();
            show(query);
          }}
        >
          <span className="grid shrink-0 place-items-center pl-3 text-leaf">
            <Icon name="search" className="h-5 w-5" />
          </span>
          <label htmlFor="invoice-query" className="sr-only">
            Kode invoice
          </label>
          <input
            id="invoice-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="MNL-XXXXXX"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent px-2 font-display text-base font-bold uppercase tracking-[0.04em] text-ink outline-none placeholder:text-moss/60"
          />
          <button type="submit" className="btn btn-red min-h-[44px] shrink-0 px-5">
            Lacak
          </button>
        </form>
      </section>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.35fr_1fr]">
        <div ref={resultRef} className="scroll-mt-24" aria-live="polite">
          {!searched ? (
            <EmptyTicket
              title="Belum ada yang dilacak"
              copy="Masukkan kode invoice di atas, atau pilih salah satu dari riwayat di samping."
              cta={!history.length}
            />
          ) : result ? (
            <Ticket
              order={result}
              copied={copied}
              onCopy={() => copyCode(result.id)}
            />
          ) : (
            <EmptyTicket
              title={`${query.trim().toUpperCase() || "Kode"} nggak ketemu`}
              copy="Cek lagi kodenya ya. Riwayat cuma tersimpan di browser tempat kamu bertransaksi."
              cta={false}
            />
          )}
        </div>

        <aside>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-extrabold">Terakhir kamu beli</h2>
            <span className="text-xs font-semibold text-moss">5 terbaru</span>
          </div>

          <div className="relative mt-5 space-y-3 pl-7">
            <div
              className="absolute bottom-3 left-[9px] top-3 w-0.5 bg-leaf/15"
              aria-hidden="true"
            />
            {history.length ? (
              history.map((order) => {
                const active = result?.id === order.id;
                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => selectHistory(order)}
                    className={`card relative w-full p-4 text-left transition hover:-translate-y-0.5 ${
                      active ? "border-leaf" : ""
                    }`}
                  >
                    <span
                      className="absolute -left-[27px] top-6 grid h-5 w-5 place-items-center rounded-full border-2 border-leaf bg-cream"
                      aria-hidden="true"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
                    </span>
                    <span className="flex justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block truncate font-bold">{order.item}</span>
                        <span className="mt-0.5 block text-xs text-moss">
                          {order.id} · {formatDate(order.createdAt)}
                        </span>
                      </span>
                      <span className="shrink-0 font-display font-extrabold text-leaf">
                        {formatRupiah(order.amount)}
                      </span>
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="card p-5 text-sm text-moss">
                Belum ada transaksi di perangkat ini.{" "}
                <a href="/#layanan" className="font-semibold text-leaf">
                  Coba top up pertama →
                </a>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-sun/30 p-4 text-sm">
            <Icon name="clock" className="h-5 w-5 shrink-0 text-leaf" />
            <p>
              <b>Pembayaran dicek manual.</b>{" "}
              <span className="text-moss">
                Status berubah setelah admin memverifikasi QRIS. Data tersimpan di
                browser ini.
              </span>
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function EmptyTicket({
  title,
  copy,
  cta,
}: {
  title: string;
  copy: string;
  cta: boolean;
}) {
  return (
    <div className="card shadow-off p-8 text-center sm:p-10">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sun/45 text-leaf">
        <Icon name="receipt" className="h-8 w-8" />
      </div>
      <h3 className="mt-5 font-display text-2xl font-black">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-moss">{copy}</p>
      {cta ? (
        <a href="/#layanan" className="btn btn-red mt-6">
          Mulai belanja
        </a>
      ) : null}
    </div>
  );
}

function Ticket({
  order,
  copied,
  onCopy,
}: {
  order: Order;
  copied: boolean;
  onCopy: () => void;
}) {
  const service = services[order.slug];
  const waUrl = `${ADMIN_WHATSAPP_URL}?text=${encodeURIComponent(
    `Halo admin Maneela, saya ingin cek pesanan ${order.id}.`,
  )}`;

  return (
    <article className="card shadow-off">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-leaf text-cream">
              <ServiceIcon slug={order.slug} className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-moss">{order.product}</div>
              <div className="break-words font-display text-lg font-extrabold leading-tight">
                {order.item}
              </div>
            </div>
          </div>
          <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-sun px-3 py-1.5 text-xs font-bold text-ink">
            <span className="dot" />
            Sedang diproses
          </span>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {steps.map((step, index) => (
            <div key={step.label} className="flex items-center gap-2 text-[13px] font-semibold">
              <i
                className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full ${
                  index === 0
                    ? "bg-leaf text-cream"
                    : index === 1
                      ? "bg-sun text-leaf"
                      : "border border-leaf/25 bg-cream text-moss"
                }`}
              >
                {index === 0 ? (
                  <Icon name="check" className="h-3 w-3" />
                ) : index === 1 ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
                ) : (
                  "3"
                )}
              </i>
              {step.label}
            </div>
          ))}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-leaf/10">
          <div className="h-full w-1/2 rounded-full bg-leaf" />
        </div>
      </div>

      <div className="relative mx-6 border-t-2 border-dashed border-leaf/20">
        <span
          className="absolute -left-[39px] -top-3.5 h-7 w-7 rounded-full border border-line bg-cream"
          aria-hidden="true"
        />
        <span
          className="absolute -right-[39px] -top-3.5 h-7 w-7 rounded-full border border-line bg-cream"
          aria-hidden="true"
        />
      </div>

      <div className="p-6 text-sm sm:p-8">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-moss">Kode invoice</div>
            <div className="font-display text-2xl font-black tracking-wide">
              {order.id}
            </div>
          </div>
          <button
            type="button"
            onClick={onCopy}
            className="grid h-10 w-10 place-items-center rounded-full bg-cream text-leaf"
            aria-label="Salin kode invoice"
          >
            <Icon name={copied ? "check" : "copy"} className="h-5 w-5" />
          </button>
        </div>

        {[
          ["Waktu", formatDate(order.createdAt)],
          ["Tujuan", order.target],
          ["Provider", order.provider],
          ["Metode bayar", "QRIS"],
          ["Harga", formatRupiah(order.amount)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between gap-4 border-b border-line py-2 last:border-b-0"
          >
            <span className="text-moss">{label}</span>
            <span className="break-all text-right font-semibold">{value}</span>
          </div>
        ))}

        <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
          <span className="text-moss">Total dibayar</span>
          <span className="font-display text-3xl font-black text-leaf">
            {formatRupiah(order.amount)}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-leaf underline underline-offset-4"
          >
            Tanya admin soal pesanan ini →
          </a>
          <span className="text-moss">
            {service ? "Pembayaran QRIS dicek manual oleh admin." : ""}
          </span>
        </div>
      </div>
    </article>
  );
}

function formatDate(value: number) {
  return new Date(value).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
