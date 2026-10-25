"use client";

import Link from "next/link";
import { useState } from "react";
import { ADMIN_WHATSAPP, ADMIN_WHATSAPP_URL } from "@/lib/catalog";
import { Icon } from "./Icon";

type Category = "Pembayaran" | "Pesanan" | "Refund" | "Akun";

type Faq = {
  category: Category;
  question: string;
  answer: string;
};

const faqs: Faq[] = [
  {
    category: "Pembayaran",
    question: "Bisa bayar pakai apa aja?",
    answer: "QRIS — bisa dari semua e-wallet dan m-banking.",
  },
  {
    category: "Pembayaran",
    question: "Udah bayar, kok statusnya belum berubah?",
    answer:
      "Pembayaran QRIS dicek manual oleh admin. Kalau lewat 15 menit masih sama, kirim kode invoice dan bukti bayar ke WhatsApp kami.",
  },
  {
    category: "Pembayaran",
    question: "Ada biaya tersembunyi nggak?",
    answer:
      "Nggak ada. Harga yang tampil di ringkasan sudah final, tanpa biaya metode tambahan.",
  },
  {
    category: "Pesanan",
    question: "Secepat apa pesananku masuk?",
    answer:
      "Setelah pembayaran dicek admin, biasanya ±5 detik. Kalau operator lagi gangguan, bisa sedikit lebih lama.",
  },
  {
    category: "Pesanan",
    question: "Salah ketik nomor tujuan, bisa dibatalin?",
    answer:
      "Transaksi yang sudah sukses nggak bisa ditarik lagi. Cek ulang nomor di ringkasan sebelum tekan bayar.",
  },
  {
    category: "Pesanan",
    question: "Token PLN-ku muncul di mana?",
    answer:
      "Kode token tampil di halaman lacak setelah pembayaran terverifikasi dan pesanan diproses.",
  },
  {
    category: "Refund",
    question: "Transaksi gagal, uangku aman?",
    answer:
      "Aman. Dana dikembalikan lewat refund ke metode pembayaran awal, paling lama 1x24 jam.",
  },
  {
    category: "Refund",
    question: "Berapa lama refund masuk?",
    answer:
      "Refund diproses maksimal 1x24 jam di hari kerja. Sertakan kode invoice saat menghubungi admin.",
  },
  {
    category: "Akun",
    question: "Harus bikin akun dulu?",
    answer:
      "Nggak usah. Isi tujuan, bayar, beres. Simpan kode invoice biar gampang cek status.",
  },
  {
    category: "Akun",
    question: "Riwayat transaksiku kok hilang?",
    answer:
      "Riwayat disimpan di browser kamu. Ganti HP atau hapus data browser bikin riwayatnya nggak kebawa.",
  },
];

const categories: ("Semua" | Category)[] = [
  "Semua",
  "Pembayaran",
  "Pesanan",
  "Refund",
  "Akun",
];

export function BantuanClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Semua");

  const needle = query.trim().toLowerCase();
  const filtered = faqs.filter((item) => {
    if (category !== "Semua" && item.category !== category) return false;
    if (!needle) return true;
    return `${item.category} ${item.question} ${item.answer}`
      .toLowerCase()
      .includes(needle);
  });

  return (
    <main className="wrap pt-6 sm:pt-10">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-black leading-[1.02] sm:text-6xl">
          Ada yang bikin bingung?
        </h1>
        <div className="relative mt-6">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-moss">
            <Icon name="search" className="h-5 w-5" />
          </span>
          <label htmlFor="faq-search" className="sr-only">
            Cari pertanyaan
          </label>
          <input
            id="faq-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ketik aja, misal: refund"
            autoComplete="off"
            className="input pl-12 focus-visible:outline-none!"
          />
        </div>

        <div
          className="hscroll mt-4"
          role="group"
          aria-label="Filter pertanyaan"
        >
          {categories.map((item) => {
            const active = category === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={active}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-leaf bg-leaf text-cream"
                    : "border-line bg-white text-moss hover:border-leaf/40"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-3">
          {filtered.map((item) => (
            <details key={item.question} className="faq">
              <summary>
                <span>
                  <span className="badge mb-2 px-2.5 py-0.5 text-[11px]">
                    {item.category}
                  </span>
                  <span className="block">{item.question}</span>
                </span>
                <span className="pl">
                  <Icon name="plus" className="h-[22px] w-[22px]" />
                </span>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
          {filtered.length === 0 ? (
            <div className="card p-6 text-moss">
              Belum ada jawaban buat “<b>{query}</b>”. Coba kata lain atau hubungi
              CS.
            </div>
          ) : null}
        </div>

        <aside
          id="kontak"
          className="card shadow-off scroll-mt-24 p-6 lg:sticky lg:top-[88px]"
        >
          <h2 className="font-display text-2xl font-extrabold">
            Masih butuh teman ngobrol?
          </h2>
          <p className="mt-2 text-sm text-moss">
            Admin membalas secepatnya. Siapkan kode invoice MNL- biar cepat beres.
          </p>

          <div className="mt-5 space-y-2.5">
            <a
              href={ADMIN_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-cream p-3 transition hover:bg-sun"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-leaf text-cream">
                <Icon name="chat" className="h-5 w-5" />
              </span>
              <span>
                <b className="block">WhatsApp</b>
                <span className="text-sm text-moss">{ADMIN_WHATSAPP}</span>
              </span>
            </a>

            <Link
              href="/invoice/"
              className="flex items-center gap-3 rounded-2xl bg-cream p-3 transition hover:bg-sun"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-leaf text-cream">
                <Icon name="receipt" className="h-5 w-5" />
              </span>
              <span>
                <b className="block">Cek invoice</b>
                <span className="text-sm text-moss">Lihat status pesananmu</span>
              </span>
            </Link>

            <Link
              href="/#cara"
              className="flex items-center gap-3 rounded-2xl bg-cream p-3 transition hover:bg-sun"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-leaf text-cream">
                <Icon name="qr" className="h-5 w-5" />
              </span>
              <span>
                <b className="block">Cara bayar QRIS</b>
                <span className="text-sm text-moss">Panduan singkat</span>
              </span>
            </Link>
          </div>

          <p className="mt-3 text-xs text-moss">
            Pembayaran QRIS dicek manual oleh admin.
          </p>
        </aside>
      </div>
    </main>
  );
}
