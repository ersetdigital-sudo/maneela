export const QRIS_IMAGE =
  "https://res.cloudinary.com/dqjh7utdb/image/upload/v1792161327/camhvfeu1lcm0ps8ieiz.jpg";

export const ADMIN_WHATSAPP = "085711172317";
export const ADMIN_WHATSAPP_URL = "https://wa.me/6285711172317";

export type Slug =
  | "pulsa"
  | "paket-data"
  | "e-wallet"
  | "pln"
  | "pdam"
  | "tv-internet"
  | "game"
  | "bpjs"
  | "multifinance";

export type Category = "isi" | "tagihan" | "hiburan";

export type Item = { name: string; price: number; sub?: string };

export type Bill = Item & {
  customer: string;
  period: string;
  base: number;
  admin: number;
};

export type Service = {
  slug: Slug;
  name: string;
  cat: Category;
  catL: string;
  icon: Slug;
  desc: string;
  label: string;
  ph: string;
  phone?: boolean;
  bill?: boolean;
  admin?: number;
  providers: string[];
  items?: Item[];
  byProvider?: Record<string, Item[]>;
};

const rp = (value: number) => `Rp${Math.round(value).toLocaleString("id-ID")}`;
const fmt = (value: number) => value.toLocaleString("id-ID");

const OPS: Record<string, string[]> = {
  Telkomsel: ["0811", "0812", "0813", "0821", "0822", "0823", "0851", "0852", "0853"],
  Indosat: ["0814", "0815", "0816", "0855", "0856", "0857", "0858"],
  XL: ["0817", "0818", "0819", "0859", "0877", "0878"],
  Axis: ["0831", "0832", "0833", "0838"],
  Tri: ["0895", "0896", "0897", "0898", "0899"],
  Smartfren: ["0881", "0882", "0883", "0884", "0885", "0886", "0887", "0888", "0889"],
};

const ops = Object.keys(OPS);
const ewal = ["DANA", "OVO", "GoPay", "ShopeePay", "LinkAja"];

const pulsaBase: [number, number][] = [
  [5, 6200],
  [10, 11000],
  [20, 20900],
  [25, 25800],
  [50, 50800],
  [100, 100200],
];

const opAdj: Record<string, number> = {
  Telkomsel: 0,
  Indosat: -150,
  XL: -100,
  Axis: -200,
  Tri: -250,
  Smartfren: -300,
};

const pulsaItems = (operator: string): Item[] =>
  pulsaBase.map(([nominal, price]) => ({
    name: `Pulsa ${nominal}rb`,
    price: price + opAdj[operator] * (nominal >= 50 ? 2 : 1),
  }));

const dataBase: [string, number][] = [
  ["Data 3GB · 7 hari", 15000],
  ["Data 8GB · 30 hari", 38000],
  ["Data 15GB · 30 hari", 62000],
  ["Data 25GB · 30 hari", 88000],
  ["Data 50GB · 30 hari", 135000],
  ["Unlimited Harian · 30 hari", 99000],
];

const paketItems = (operator: string): Item[] =>
  dataBase.map(([name, price]) => ({
    name,
    price: price + opAdj[operator] * 10,
  }));

const nominal = (values: number[], admin: number, label = "Saldo"): Item[] =>
  values.map((value) => ({
    name: `${label} ${fmt(value)}`,
    price: value + admin,
    sub: `Admin ${rp(admin)}`,
  }));

const fill = <T,>(list: string[], fn: (item: string) => T): Record<string, T> =>
  Object.fromEntries(list.map((item) => [item, fn(item)]));

const games: Record<string, [string, number][]> = {
  "Mobile Legends": [
    ["86 Diamonds", 24500],
    ["172 Diamonds", 48500],
    ["257 Diamonds", 72000],
    ["344 Diamonds", 97000],
    ["706 Diamonds", 198000],
    ["Weekly Diamond Pass", 34900],
  ],
  "Free Fire": [
    ["70 Diamonds", 10900],
    ["140 Diamonds", 21500],
    ["355 Diamonds", 51000],
    ["720 Diamonds", 101000],
    ["1450 Diamonds", 196000],
  ],
  "PUBG Mobile": [
    ["60 UC", 17500],
    ["325 UC", 80500],
    ["660 UC", 167000],
  ],
};

const bpjsBase: Record<string, number> = {
  "Kelas 1": 150000,
  "Kelas 2": 100000,
  "Kelas 3": 35000,
};

export const services: Record<Slug, Service> = {
  pulsa: {
    slug: "pulsa",
    name: "Pulsa",
    cat: "isi",
    catL: "Isi ulang",
    icon: "pulsa",
    desc: "Isi pulsa semua operator, masuk dalam hitungan detik.",
    label: "Nomor HP",
    ph: "0812 3456 7890",
    phone: true,
    providers: ops,
    byProvider: fill(ops, pulsaItems),
  },
  "paket-data": {
    slug: "paket-data",
    name: "Paket Data",
    cat: "isi",
    catL: "Isi ulang",
    icon: "paket-data",
    desc: "Kuota internet harian sampai bulanan, langsung aktif.",
    label: "Nomor HP",
    ph: "0812 3456 7890",
    phone: true,
    providers: ops,
    byProvider: fill(ops, paketItems),
  },
  "e-wallet": {
    slug: "e-wallet",
    name: "E-Wallet",
    cat: "isi",
    catL: "Isi ulang",
    icon: "e-wallet",
    desc: "Top up saldo DANA, OVO, GoPay, ShopeePay & LinkAja.",
    label: "Nomor HP terdaftar",
    ph: "0812 3456 7890",
    providers: ewal,
    items: nominal([10000, 20000, 25000, 50000, 100000, 200000], 1500),
  },
  pln: {
    slug: "pln",
    name: "Token PLN",
    cat: "tagihan",
    catL: "Tagihan",
    icon: "pln",
    desc: "Beli token listrik prabayar, kode token langsung muncul.",
    label: "Nomor meter / ID pelanggan",
    ph: "5123 4567 8901",
    providers: ["PLN Prabayar"],
    items: nominal([20000, 50000, 100000, 200000, 500000], 2500, "Token"),
  },
  pdam: {
    slug: "pdam",
    name: "PDAM",
    cat: "tagihan",
    catL: "Tagihan",
    icon: "pdam",
    desc: "Bayar tagihan air PDAM se-Indonesia tanpa antre.",
    label: "ID pelanggan PDAM",
    ph: "0123456789",
    bill: true,
    admin: 2500,
    providers: ["PDAM Jakarta", "PDAM Surabaya", "PDAM Bandung", "PDAM Medan"],
  },
  "tv-internet": {
    slug: "tv-internet",
    name: "TV & Internet",
    cat: "tagihan",
    catL: "Tagihan",
    icon: "tv-internet",
    desc: "IndiHome, Biznet, First Media, MyRepublic, semua bisa.",
    label: "Nomor pelanggan",
    ph: "1234 5678 90",
    bill: true,
    admin: 2500,
    providers: ["IndiHome", "Biznet", "First Media", "MyRepublic"],
  },
  game: {
    slug: "game",
    name: "Voucher Game",
    cat: "hiburan",
    catL: "Hiburan",
    icon: "game",
    desc: "Diamond, UC, dan voucher game favoritmu.",
    label: "User ID (dan Zone ID)",
    ph: "12345678 (1234)",
    providers: Object.keys(games),
    byProvider: Object.fromEntries(
      Object.entries(games).map(([game, list]) => [
        game,
        list.map(([name, price]) => ({ name, price })),
      ]),
    ),
  },
  bpjs: {
    slug: "bpjs",
    name: "BPJS Kesehatan",
    cat: "tagihan",
    catL: "Tagihan",
    icon: "bpjs",
    desc: "Iuran BPJS Kesehatan per kelas, bisa bayar beberapa bulan.",
    label: "Nomor VA / No. BPJS",
    ph: "8888 8012 3456 7890",
    providers: ["Kelas 1", "Kelas 2", "Kelas 3"],
    byProvider: fill(["Kelas 1", "Kelas 2", "Kelas 3"], (kelas) => {
      const base = bpjsBase[kelas];
      return [1, 2, 3, 6, 12].map((months) => ({
        name: `${months} bulan`,
        price: base * months + 2500,
        sub: `${rp(base)}/bln + admin`,
      }));
    }),
  },
  multifinance: {
    slug: "multifinance",
    name: "Multifinance",
    cat: "tagihan",
    catL: "Tagihan",
    icon: "multifinance",
    desc: "Cicilan motor & mobil: Adira, FIF, BAF, WOM.",
    label: "Nomor kontrak",
    ph: "010203040506",
    bill: true,
    admin: 3000,
    providers: ["Adira Finance", "FIF Group", "BAF", "WOM Finance"],
  },
};

export const serviceSlugs: Slug[] = [
  "pulsa",
  "paket-data",
  "e-wallet",
  "pln",
  "pdam",
  "tv-internet",
  "game",
  "bpjs",
  "multifinance",
];

export const categories: { value: "all" | Category; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "isi", label: "Isi ulang" },
  { value: "tagihan", label: "Tagihan" },
  { value: "hiburan", label: "Hiburan" },
];

export function isSlug(value: string | null | undefined): value is Slug {
  return !!value && value in services;
}

export function formatRupiah(value: number) {
  return rp(value);
}

export function normalizePhone(raw: string) {
  let value = (raw || "").replace(/\D/g, "");
  if (value.startsWith("62")) value = `0${value.slice(2)}`;
  else if (value.startsWith("8")) value = `0${value}`;
  return value;
}

export function detectOperator(raw: string): string | null {
  const prefix = normalizePhone(raw).slice(0, 4);
  if (prefix.length < 4) return null;
  return Object.keys(OPS).find((operator) => OPS[operator].includes(prefix)) ?? null;
}

export function providerInitials(name: string) {
  return name
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function itemsFor(service: Service, provider: string | null): Item[] {
  if (!provider) return service.items ?? [];
  return service.byProvider?.[provider] ?? service.items ?? [];
}

export function billFor(slug: Slug, provider: string, target: string): Bill | null {
  const service = services[slug];
  if (!service.bill) return null;

  let hash = 0;
  for (const character of target + provider) {
    hash = (hash * 31 + character.charCodeAt(0)) % 100000;
  }

  const baseMap: Partial<Record<Slug, number>> = {
    pdam: 85000,
    "tv-internet": 330000,
    multifinance: 780000,
  };
  const base = baseMap[slug] ?? 85000;
  const amount =
    Math.round((base + hash * (slug === "multifinance" ? 3 : 1.5)) / 100) * 100;
  const names = ["Budi Santoso", "Siti Rahma", "Andi Wijaya", "Dewi Lestari", "Rizky Pratama", "Nur Aini"];
  const months = ["Okt 2026", "Sep–Okt 2026"];
  const admin = service.admin ?? 2500;

  return {
    name: `Tagihan ${months[0]}`,
    price: amount + admin,
    customer: names[hash % names.length],
    period: months[hash % 2],
    base: amount,
    admin,
  };
}
