"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

const navigation = [
  { href: "/", label: "Beranda" },
  { href: "/produk/?s=pulsa", label: "Produk" },
  { href: "/invoice/", label: "Cek Invoice" },
  { href: "/bantuan/", label: "Bantuan" },
];

function activeLabel(pathname: string) {
  if (pathname === "/") return "Beranda";
  if (pathname.startsWith("/produk")) return "Produk";
  if (pathname.startsWith("/invoice")) return "Cek Invoice";
  if (pathname.startsWith("/bantuan")) return "Bantuan";
  return "";
}

export function SiteHeader() {
  const rawPathname = usePathname();
  const pathname = rawPathname.replace(/\/+$/, "") || "/";
  const active = activeLabel(pathname);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-[#FEFFF1]/80 backdrop-blur-xl transition-colors ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <div className="wrap relative flex h-[68px] items-center justify-between gap-4">
        <Logo />

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full border border-line bg-white p-1.5 text-sm font-semibold lg:flex"
          aria-label="Navigasi utama"
        >
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active === item.label ? "page" : undefined}
              className={`rounded-full px-4 py-2 transition-colors ${
                active === item.label
                  ? "bg-ink text-cream"
                  : "text-moss hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/produk/?s=pulsa"
            className="btn btn-red hidden min-h-0 py-2.5 lg:inline-flex"
          >
            Top up
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white lg:hidden"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Icon name={open ? "x" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className="wrap pb-6 lg:hidden">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={active === item.label ? "page" : undefined}
              className={`flex items-center justify-between border-b border-line py-3.5 font-display text-[26px] font-extrabold tracking-[-0.03em] ${
                active === item.label ? "text-leaf" : "text-ink"
              }`}
            >
              {item.label}
              <Icon name="arrow" className="h-5 w-5" />
            </Link>
          ))}
          <Link
            href="/produk/?s=pulsa"
            onClick={() => setOpen(false)}
            className="btn btn-red mt-5 w-full py-4 text-lg"
          >
            Top up sekarang
          </Link>
        </div>
      ) : null}
    </header>
  );
}
