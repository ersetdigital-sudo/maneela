"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ADMIN_WHATSAPP,
  ADMIN_WHATSAPP_URL,
  formatRupiah,
  isSlug,
  QRIS_IMAGE,
  services,
} from "@/lib/catalog";
import { createOrder } from "@/lib/db/client";
import { toPublicError } from "@/lib/db/errors";
import { rememberInvoice } from "@/lib/store";
import { Icon, ServiceIcon } from "./Icon";

function clock(total: number) {
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
    total % 60,
  ).padStart(2, "0")}`;
}

export function CheckoutClient({
  brandSlug,
  qrisMethodId,
  qrisImageUrl,
}: {
  brandSlug: string;
  qrisMethodId: string | null;
  qrisImageUrl: string | null;
}) {
  const params = useSearchParams();
  const requested = params.get("s");
  const slug = isSlug(requested) ? requested : null;
  const service = slug ? services[slug] : null;
  const provider = params.get("p") ?? "";
  const item = params.get("i") ?? "";
  const target = params.get("n") ?? "";
  const amount = Number(params.get("a")) || 0;
  const serviceId = params.get("sid") ?? "";
  const productId = params.get("pid") ?? "";
  const valid = !!service && !!provider && !!item && !!target && amount > 0;

  const [inv, setInv] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [expiresAt, setExpiresAt] = useState(0);
  const [left, setLeft] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [creating, setCreating] = useState(false);
  const [payError, setPayError] = useState("");
  const [paid, setPaid] = useState(false);
  const createdRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  async function create() {
    if (!service || !valid) return;
    if (!serviceId || !productId) {
      setPayError("Data pesanan belum lengkap. Ulangi dari halaman produk.");
      createdRef.current = false;
      return;
    }
    if (!brandSlug || !qrisMethodId) {
      setPayError("Pembayaran belum tersedia. Coba lagi sebentar.");
      createdRef.current = false;
      return;
    }

    setCreating(true);
    setPayError("");
    try {
      const created = await createOrder({
        brandSlug,
        serviceId,
        productId,
        nomorTujuan: target.trim(),
        input: { provider, item, nomor_tujuan: target.trim() },
        paymentMethodId: qrisMethodId,
      });
      const expiry = new Date(created.expires_at).getTime();
      setInv(created.ref);
      setOrderTotal(created.total);
      setExpiresAt(expiry);
      setLeft(Math.max(1, Math.ceil((expiry - Date.now()) / 1000)));
      setTimedOut(false);
      rememberInvoice({
        ref: created.ref,
        label: item,
        amount: created.total,
        createdAt: Date.now(),
      });
    } catch (failure) {
      setPayError(toPublicError(failure).message);
      createdRef.current = false;
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    if (!valid || createdRef.current) return;
    createdRef.current = true;
    void create();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valid]);

  useEffect(() => {
    if (!expiresAt || paid) return;
    const tick = () => {
      const next = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setLeft(next);
      if (next <= 0) setTimedOut(true);
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt, paid]);

  if (!service || !valid) {
    return (
      <main className="wrap pb-16 pt-6 sm:pt-10">
        <div className="card shadow-off mx-auto mt-6 max-w-lg p-8 text-center sm:p-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-sun text-leaf">
            <Icon name="receipt" className="h-8 w-8" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-black">Belum ada pesanan</h1>
          <p className="mt-2 text-moss">
            Pilih produk dulu, nanti ringkasan pesananmu muncul di sini.
          </p>
          <Link href="/#layanan" className="btn btn-red mt-6">
            Pilih produk
          </Link>
        </div>
      </main>
    );
  }

  const displayTotal = inv ? orderTotal : amount;
  const waConfirm = `${ADMIN_WHATSAPP_URL}?text=${encodeURIComponent(
    `Halo admin Maneela, saya sudah bayar QRIS${inv ? ` untuk invoice ${inv}` : "."}`,
  )}`;
  const payDisabled = creating || !inv || timedOut;

  return (
    <main className="pb-safe">
      <div className="wrap pt-6 sm:pt-10">
        <Link
          href={`/produk/?s=${slug}`}
          className="text-sm font-semibold text-moss transition-colors hover:text-leaf"
        >
          ← Ubah pesanan
        </Link>
        <h1 className="mt-3 font-display text-4xl font-black sm:text-5xl">
          Pembayaran
        </h1>

        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {paid ? (
              <section className="card p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-leaf text-cream">
                    <Icon name="check" className="h-6 w-6" />
                  </span>
                  <div>
                    <p aria-live="polite" className="font-display text-2xl font-extrabold leading-tight">
                      Terima kasih, pembayaran Anda sedang diproses
                    </p>
                    <p className="mt-2 text-sm text-moss">
                      Admin akan memverifikasi pembayaran QRIS Anda secara manual.
                      Simpan kode invoice untuk melacak pesanan.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-cream p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-moss">
                    Kode invoice
                  </p>
                  <p className="mt-1 font-display text-2xl font-black">
                    {inv || "—"}
                  </p>
                  <p className="mt-2 text-sm text-moss">
                    Total {formatRupiah(displayTotal)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm">
                    <Link href={`/invoice/?id=${inv}`} className="btn btn-red">
                      Cek status
                    </Link>
                    <a
                      href={waConfirm}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost"
                    >
                      Konfirmasi via WhatsApp
                    </a>
                  </div>
                </div>
              </section>
            ) : (
              <section className="card p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-extrabold">Pembayaran QRIS</h2>
                    <p className="mt-1 text-sm text-moss">
                      Scan dari e-wallet atau m-banking apa pun.
                    </p>
                  </div>
                  <span className="badge">QRIS</span>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-moss">
                      Kode invoice
                    </p>
                    <p className="font-display text-lg font-black">
                      {inv || (creating ? "Menyiapkan…" : "—")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-moss">
                      Selesaikan dalam
                    </p>
                    <p className="font-display text-lg font-black">
                      {!inv ? "—" : timedOut ? "Waktu habis" : clock(left)}
                    </p>
                  </div>
                </div>

                {payError ? (
                  <div className="mt-4 rounded-2xl border border-red-300 bg-red-50 p-4 text-xs text-red-700">
                    <p className="font-bold">{payError}</p>
                    <button
                      type="button"
                      onClick={() => {
                        if (!creating) {
                          createdRef.current = true;
                          void create();
                        }
                      }}
                      className="mt-2 rounded-full border border-red-400 px-3 py-1.5 font-bold"
                    >
                      Coba lagi
                    </button>
                  </div>
                ) : null}

                <div className="mt-5 grid items-center gap-6 rounded-2xl bg-cream p-4 sm:grid-cols-[220px_1fr] sm:p-5">
                  <div className="rounded-xl bg-white p-3">
                    <img
                      src={qrisImageUrl || QRIS_IMAGE}
                      alt="QRIS pembayaran Maneela"
                      width={440}
                      height={440}
                      className="h-auto w-full"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-moss">
                      Total bayar
                    </p>
                    <p className="mt-1 font-display text-3xl font-black text-leaf">
                      {formatRupiah(displayTotal)}
                    </p>
                    <ol className="mt-4 space-y-2 text-sm text-moss">
                      <li>1. Buka e-wallet atau m-banking.</li>
                      <li>2. Scan QRIS di samping.</li>
                      <li>3. Bayar sesuai nominal.</li>
                      <li>4. Tekan “Saya sudah bayar”.</li>
                    </ol>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {["Semua e-wallet", "Semua m-banking", "Dicek admin"].map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-line bg-cream px-3 py-1.5 text-xs font-semibold"
                    >
                      {label}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setPaid(true)}
                  disabled={payDisabled}
                  className="btn btn-red mt-4 hidden w-full disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
                >
                  {creating ? "Menyiapkan…" : "Saya sudah bayar"}
                </button>

                <p className="mt-4 rounded-xl border border-dashed border-leaf/20 bg-cream p-4 text-xs text-moss">
                  Bayar sesuai nominal agar mudah diverifikasi. Kalau status belum
                  berubah, kirim bukti bayar ke WhatsApp admin.
                </p>
              </section>
            )}

            <section className="card p-5 sm:p-6">
              <h3 className="font-display text-lg font-extrabold">Butuh bantuan?</h3>
              <p className="mt-1 text-sm text-moss">
                Admin Maneela siap bantu cek pembayaran atau kendala pesanan.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={ADMIN_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-red"
                >
                  WhatsApp {ADMIN_WHATSAPP}
                </a>
                <Link href="/invoice/" className="btn btn-ghost">
                  Cek invoice
                </Link>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-[88px]">
            <div className="card shadow-off p-6">
              <h3 className="font-display text-xl font-extrabold">Ringkasan pesanan</h3>

              <div className="mt-4 flex items-center gap-3 rounded-xl bg-cream p-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-leaf text-cream">
                  <ServiceIcon slug={service.slug} className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <b className="block truncate">{item}</b>
                  <div className="truncate text-xs text-moss">
                    {service.name} · {provider}
                  </div>
                </div>
              </div>

              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-moss">Tujuan</dt>
                  <dd className="break-all text-right font-semibold">{target}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-moss">Harga</dt>
                  <dd className="font-semibold">{formatRupiah(amount)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-moss">Metode</dt>
                  <dd className="font-semibold">QRIS</dd>
                </div>
              </dl>

              <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
                <span className="text-sm text-moss">Total bayar</span>
                <span className="font-display text-3xl font-black text-leaf">
                  {formatRupiah(displayTotal)}
                </span>
              </div>

              {paid || inv ? (
                <div className="mt-4 rounded-xl bg-cream p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-moss">
                    Status
                  </p>
                  <p className="mt-1 inline-flex items-center gap-2 font-bold">
                    <span className="dot" />
                    {paid ? "Sedang diproses" : "Menunggu pembayaran"}
                  </p>
                  {inv ? (
                    <p className="mt-1 text-xs text-moss">Invoice {inv}</p>
                  ) : null}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPaid(true)}
                  disabled={payDisabled}
                  className="btn btn-red mt-5 hidden w-full disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
                >
                  {creating ? "Menyiapkan…" : "Saya sudah bayar"}
                </button>
              )}

              <p className="mt-3 text-center text-xs text-moss">
                Pembayaran dicek manual oleh admin.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {paid ? null : (
        <div className="fbar lg:hidden">
          <div className="min-w-0 flex-1">
            <div className="text-xs opacity-70">Total bayar</div>
            <div className="font-display text-lg font-black leading-tight">
              {formatRupiah(displayTotal)}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPaid(true)}
            disabled={payDisabled}
            className="btn btn-red disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating ? "Menyiapkan…" : "Saya sudah bayar"}
          </button>
        </div>
      )}
    </main>
  );
}
