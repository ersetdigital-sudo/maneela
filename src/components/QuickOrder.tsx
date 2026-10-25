"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  detectOperator,
  formatRupiah,
  itemsFor,
  normalizePhone,
  services,
} from "@/lib/catalog";
import { Icon } from "./Icon";

export function QuickOrder() {
  const router = useRouter();
  const [number, setNumber] = useState("");
  const [operator, setOperator] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const options = itemsFor(services.pulsa, operator ?? "Telkomsel");
  const digits = normalizePhone(number).length;
  const item = selected !== null ? options[selected] : null;
  const canContinue = !!operator && !!item && digits >= 10;

  function handleNumber(value: string) {
    setNumber(value);
    const detected = detectOperator(value);
    if (detected !== operator) {
      setOperator(detected);
      setSelected(null);
    }
  }

  function handleContinue() {
    if (!operator || !item) return;
    const params = new URLSearchParams({
      s: "pulsa",
      p: operator,
      i: item.name,
      n: normalizePhone(number),
      a: String(item.price),
    });
    router.push(`/bayar/?${params.toString()}`);
  }

  const hint = operator
    ? `Nominal untuk ${operator}.`
    : digits >= 4
      ? "Operator tidak dikenali, cek lagi nomornya."
      : "Operator terdeteksi otomatis dari 4 digit awal.";

  return (
    <div className="card relative z-10 mx-auto -mt-20 max-w-4xl p-5 shadow-[0_24px_60px_-36px_rgba(19,36,15,0.4)] sm:p-7 lg:-mt-24">
      <div className="grid items-start gap-5 lg:grid-cols-[300px_1fr] lg:gap-7">
        <div>
          <h2 className="font-display text-2xl font-extrabold">Order kilat</h2>
          <p className="mt-1 text-sm text-moss">Isi pulsa dalam 3 detik.</p>

          <label htmlFor="quick-phone" className="mb-2 mt-4 block text-sm font-semibold">
            Nomor HP
          </label>
          <div className="relative">
            <input
              id="quick-phone"
              value={number}
              onChange={(event) => handleNumber(event.target.value)}
              inputMode="numeric"
              autoComplete="tel"
              placeholder="0812 3456 7890"
              className="input pr-28 focus-visible:outline-none!"
            />
            <span
              className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-leaf/20 bg-[#EDF7ED] px-3 py-1.5 text-xs font-semibold text-leaf ${
                operator ? "" : "hidden"
              }`}
            >
              {operator}
            </span>
          </div>
          <p className="mt-2 text-xs text-moss">{hint}</p>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {options.map((option, index) => {
              const isActive = selected === index;
              return (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => setSelected(index)}
                  aria-pressed={isActive}
                  className={`opt !min-h-[72px] !p-3 ${
                    isActive ? "border-leaf bg-[#F3FAF3]" : ""
                  }`}
                >
                  <span
                    className={`tick absolute right-2.5 top-2.5 h-[22px] w-[22px] place-items-center ${
                      isActive ? "grid" : "hidden"
                    }`}
                  >
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                  <div className="font-display text-lg font-extrabold">
                    {option.name.replace("Pulsa ", "")}
                  </div>
                  <div className="mt-0.5 text-sm font-bold text-leaf">
                    {formatRupiah(option.price)}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue}
              className="btn btn-red flex-1"
            >
              Lanjut
            </button>
            <Link href="#layanan" className="btn btn-ghost">
              Layanan lain
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
