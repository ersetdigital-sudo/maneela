"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  billFor,
  detectOperator,
  formatRupiah,
  isSlug,
  itemsFor,
  normalizePhone,
  providerInitials,
  serviceSlugs,
  services,
  type Bill,
  type Item,
  type Slug,
} from "@/lib/catalog";
import { Icon, ServiceIcon } from "./Icon";

export function ProdukClient() {
  const router = useRouter();
  const params = useSearchParams();
  const requested = params.get("s");
  const slug: Slug = isSlug(requested) ? requested : "pulsa";
  const service = services[slug];
  const query = params.toString();

  const [target, setTarget] = useState("");
  const [provider, setProvider] = useState<string | null>(
    service.phone
      ? null
      : service.providers.length === 1
        ? service.providers[0]
        : null,
  );
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const next = services[slug];
    setTarget("");
    setProvider(
      next.phone
        ? null
        : next.providers.length === 1
          ? next.providers[0]
          : null,
    );
    setSelected(null);
    document.title = `${next.name} · Maneela`;
  }, [slug, query]);

  const normalized = normalizePhone(target);
  const operator = service.phone ? detectOperator(target) : null;
  const activeProvider = service.phone ? operator : provider;
  const targetOK = service.phone
    ? !!operator && normalized.length >= 10
    : target.trim().replace(/\s/g, "").length >= 5;

  const billItem: Bill | null =
    service.bill && activeProvider && target.replace(/\D/g, "").length >= 6
      ? billFor(slug, activeProvider, target)
      : null;
  const list = service.bill ? [] : itemsFor(service, activeProvider);
  const item: Item | Bill | null = service.bill
    ? billItem
    : selected !== null
      ? list[selected] ?? null
      : null;
  const valid = targetOK && !!activeProvider && !!item;

  function handleTarget(value: string) {
    setTarget(value);
    if (!service.phone) return;
    const detected = detectOperator(value);
    if (detected !== activeProvider) {
      setProvider(detected);
      setSelected(null);
    }
  }

  function handleProvider(name: string) {
    setProvider(name);
    setSelected(null);
  }

  function pay() {
    if (!valid || !activeProvider || !item) return;
    const next = new URLSearchParams({
      s: slug,
      p: activeProvider,
      i: item.name,
      n: service.phone ? normalized : target.trim(),
      a: String(item.price),
    });
    router.push(`/bayar/?${next.toString()}`);
  }

  const itemStep = service.phone ? "2" : "3";
  const providerTitle =
    slug === "bpjs" ? "Pilih kelas" : slug === "game" ? "Pilih game" : "Pilih provider";

  const summary: [string, string][] = [
    ["Produk", service.name],
    [service.phone ? "Operator" : "Provider", activeProvider ?? "–"],
    ["Item", item?.name ?? "–"],
    ["Tujuan", target || "–"],
  ];

  const footerStatus = !targetOK
    ? service.phone
      ? "Isi nomor HP dulu"
      : `Isi ${service.label.toLowerCase()} dulu`
    : !activeProvider
      ? "Pilih provider dulu"
      : !item
        ? service.bill
          ? "Tagihan belum muncul"
          : "Pilih nominal dulu"
        : item.name;

  return (
    <main className="pb-safe">
      <div className="wrap pt-4 sm:pt-6">
        <section className="relative overflow-hidden rounded-[26px] bg-leaf p-6 text-cream sm:p-9">
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-10 hidden h-56 w-56 rounded-full border-[28px] border-sun/20 lg:block"
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-cream text-leaf">
              <ServiceIcon slug={service.icon} className="h-8 w-8" />
            </div>
            <div>
              <div className="text-sm font-semibold opacity-75">{service.catL}</div>
              <h1 className="mt-1 font-display text-4xl font-black leading-none sm:text-5xl">
                {service.name}
              </h1>
              <p className="mt-2 max-w-lg opacity-85">{service.desc}</p>
            </div>
          </div>
          <div className="relative mt-6 flex flex-wrap gap-2">
            {[
              ["bolt", "Proses ±5 detik"],
              ["refund", "Gagal = refund"],
              ["clock", "Buka 24 jam"],
            ].map(([icon, label]) => (
              <span key={label} className="chip">
                <Icon name={icon} className="h-4 w-4" />
                {label}
              </span>
            ))}
          </div>
        </section>

        <div className="hscroll mt-4">
          {serviceSlugs.map((entrySlug) => {
            const entry = services[entrySlug];
            const active = entrySlug === slug;
            return (
              <Link
                key={entrySlug}
                href={`/produk/?s=${entrySlug}`}
                className={`prov ${active ? "border-leaf bg-leaf text-cream" : ""}`}
              >
                <span className={`av ${active ? "bg-cream text-leaf" : ""}`}>
                  <ServiceIcon slug={entry.icon} className="h-4 w-4" />
                </span>
                {entry.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="wrap mt-6 grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <section className="card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className={`step-n ${targetOK ? "done" : ""}`}>1</span>
              <h2 className="font-display text-xl font-extrabold">{service.label}</h2>
            </div>
            <div className="mt-4">
              <label htmlFor="target" className="sr-only">
                {service.label}
              </label>
              <div className="relative">
                <input
                  id="target"
                  value={target}
                  onChange={(event) => handleTarget(event.target.value)}
                  inputMode={slug === "game" ? "text" : "numeric"}
                  autoComplete="off"
                  placeholder={service.ph}
                  className={`input focus-visible:outline-none! ${
                    service.phone ? "pr-28" : ""
                  }`}
                />
                {service.phone && operator ? (
                  <span className="badge absolute right-2 top-1/2 -translate-y-1/2 text-xs">
                    {operator}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-xs text-moss">
                {service.phone
                  ? operator
                    ? `Nomor ${operator} terdeteksi.`
                    : normalized.length >= 4
                      ? "Operator tidak dikenali, cek lagi nomornya."
                      : "Operator terdeteksi otomatis. Bisa pakai awalan 08 atau 62."
                  : service.bill
                    ? "Tagihan muncul otomatis setelah ID diisi (data simulasi)."
                    : "Pastikan nomor/ID sudah benar sebelum bayar."}
              </p>
            </div>
          </section>

          {service.phone ? null : (
            <section className="card p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className={`step-n ${activeProvider ? "done" : ""}`}>2</span>
                <h2 className="font-display text-xl font-extrabold">{providerTitle}</h2>
              </div>
              <div className="hscroll mt-4 sm:flex-wrap">
                {service.providers.map((name) => {
                  const active = activeProvider === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleProvider(name)}
                      aria-pressed={active}
                      className={`prov ${active ? "border-leaf bg-leaf text-cream" : ""}`}
                    >
                      <span
                        className={`av ${active ? "bg-cream text-leaf" : ""}`}
                      >
                        {providerInitials(name)}
                      </span>
                      {name}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <section className="card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className={`step-n ${item ? "done" : ""}`}>{itemStep}</span>
              <h2 className="font-display text-xl font-extrabold">
                {service.bill ? "Cek tagihan" : "Pilih nominal"}
              </h2>
            </div>

            <div className="mt-4">
              {service.bill ? (
                billItem ? (
                  <div className="rounded-2xl border border-dashed border-leaf/30 bg-cream p-5">
                    <div className="flex justify-between gap-3">
                      <div>
                        <div className="text-xs text-moss">Nama pelanggan</div>
                        <div className="font-bold">{billItem.customer}</div>
                      </div>
                      <span className="badge h-fit text-xs">Belum dibayar</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-moss">Periode</div>
                        <b>{billItem.period}</b>
                      </div>
                      <div>
                        <div className="text-xs text-moss">Provider</div>
                        <b>{activeProvider}</b>
                      </div>
                      <div>
                        <div className="text-xs text-moss">Tagihan</div>
                        <b>{formatRupiah(billItem.base)}</b>
                      </div>
                      <div>
                        <div className="text-xs text-moss">Admin</div>
                        <b>{formatRupiah(billItem.admin)}</b>
                      </div>
                    </div>
                    <div className="mt-4 flex items-end justify-between border-t border-dashed border-leaf/20 pt-3">
                      <span className="text-sm text-moss">Total</span>
                      <span className="font-display text-xl font-black text-leaf">
                        {formatRupiah(billItem.price)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-moss">Data tagihan masih simulasi.</p>
                  </div>
                ) : (
                  <p className="rounded-2xl border border-dashed border-leaf/25 p-5 text-sm text-moss">
                    {!activeProvider ? "Pilih provider dulu. " : ""}
                    Isi ID pelanggan minimal 6 digit untuk melihat tagihan.
                  </p>
                )
              ) : !activeProvider ? (
                <p className="rounded-2xl border border-dashed border-leaf/25 p-5 text-sm text-moss">
                  {service.phone
                    ? "Isi nomor HP dulu, nominal muncul sesuai operator."
                    : "Pilih provider dulu."}
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2 md:grid-cols-3">
                  {list.map((option, index) => {
                    const active = selected === index;
                    return (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => setSelected(index)}
                        aria-pressed={active}
                        className={`opt ${active ? "border-leaf shadow-[4px_4px_0_#FFDB59]" : ""}`}
                      >
                        {index === 2 ? <span className="pop">Populer</span> : null}
                        <span
                          className={`tick absolute right-2.5 top-2.5 h-[22px] w-[22px] place-items-center ${
                            active ? "grid" : "hidden"
                          }`}
                        >
                          <Icon name="check" className="h-3.5 w-3.5" />
                        </span>
                        <div className="pr-6 font-display text-[14px] font-extrabold leading-tight sm:text-[17px]">
                          {option.name}
                        </div>
                        {option.sub ? (
                          <div className="mt-1 text-xs text-moss">{option.sub}</div>
                        ) : null}
                        <div className="mt-2 font-bold text-leaf">
                          {formatRupiah(option.price)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="hidden lg:block lg:sticky lg:top-[88px]">
          <div className="card shadow-off p-6">
            <h3 className="font-display text-xl font-extrabold">Ringkasan</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {summary.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-moss">{label}</dt>
                  <dd className="break-all text-right font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
              <span className="text-sm text-moss">Total</span>
              <span className="font-display text-3xl font-black text-leaf">
                {item ? formatRupiah(item.price) : "Rp0"}
              </span>
            </div>
            <button
              type="button"
              onClick={pay}
              disabled={!valid}
              className="btn btn-red mt-5 w-full"
            >
              Lanjut bayar
            </button>
            <p className="mt-3 text-center text-xs text-moss">
              Tanpa akun. Gagal = refund otomatis.
            </p>
          </div>
        </aside>
      </div>

      <div className="fbar lg:hidden">
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs opacity-70">{footerStatus}</div>
          <div className="font-display text-lg font-black leading-tight">
            {item ? formatRupiah(item.price) : "Rp0"}
          </div>
        </div>
        <button
          type="button"
          onClick={pay}
          disabled={!valid}
          className="btn btn-red disabled:cursor-not-allowed disabled:opacity-45"
        >
          Bayar
        </button>
      </div>
    </main>
  );
}
