"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_WHATSAPP_URL, services, serviceSlugs } from "@/lib/catalog";
import { Logo } from "./Logo";

export function SiteFooter() {
  const rawPathname = usePathname();
  const pathname = rawPathname.replace(/\/+$/, "") || "/";
  const hideOnMobile = pathname === "/produk" || pathname === "/bayar";

  return (
    <footer className={`${hideOnMobile ? "hidden lg:block" : ""} mt-20`}>
      <div className="wrap">
        <div className="card grid gap-8 p-7 md:grid-cols-[1.5fr_1fr_1fr] md:p-10">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs leading-relaxed text-moss">
              Semua kebutuhan digital dalam satu tempat. Pulsa, kuota, e-wallet,
              game, sampai tagihan, beres sekejap.
            </p>
            <p className="mt-4 text-xs font-semibold text-leaf">
              QRIS · semua e-wallet &amp; m-banking
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-display font-bold">Layanan</h4>
            <ul className="space-y-2 text-moss">
              {serviceSlugs.slice(0, 6).map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/produk/?s=${slug}`}
                    className="transition-colors hover:text-leaf"
                  >
                    {services[slug].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-display font-bold">Butuh bantuan?</h4>
            <ul className="space-y-2 text-moss">
              <li>
                <Link href="/bantuan/" className="transition-colors hover:text-leaf">
                  Pusat bantuan
                </Link>
              </li>
              <li>
                <Link href="/invoice/" className="transition-colors hover:text-leaf">
                  Cek invoice
                </Link>
              </li>
              <li>
                <a
                  href={ADMIN_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-leaf"
                >
                  Ngobrol sama CS
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="py-6 text-center text-sm text-moss">
          © 2026 Maneela. Dibuat biar urusan digitalmu nggak ribet.
        </p>
      </div>
    </footer>
  );
}
