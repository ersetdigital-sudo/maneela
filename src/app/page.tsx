import Link from "next/link";
import { BentoGrid } from "@/components/BentoGrid";
import { CountUp } from "@/components/CountUp";
import { Icon } from "@/components/Icon";
import { QuickOrder } from "@/components/QuickOrder";
import { getStorefront } from "@/lib/catalog-hydrate";
import { Reveal } from "@/components/Reveal";
import { WordRotator } from "@/components/WordRotator";

const transactions = [
  ["0812•••88", "Pulsa 50rb", "Telkomsel"],
  ["ML •••421", "172 Diamonds", "Mobile Legends"],
  ["5123•••01", "Token 100rb", "PLN"],
  ["0857•••12", "Data 15GB", "Indosat"],
  ["DANA •••77", "Saldo 100.000", "DANA"],
  ["FF •••903", "355 Diamonds", "Free Fire"],
  ["BPJS •••90", "2 bulan", "Kelas 2"],
  ["0878•••30", "Pulsa 25rb", "XL"],
];

const faqs = [
  {
    question: "Harus bikin akun dulu?",
    answer:
      "Nggak usah. Isi tujuan, bayar, beres. Simpan kode invoice kalau mau cek status nanti.",
  },
  {
    question: "Secepat apa sih prosesnya?",
    answer:
      "Setelah pembayaran QRIS dicek admin, biasanya ±5 detik. Kalau operator lagi gangguan, bisa sedikit lebih lama.",
  },
  {
    question: "Kalau gagal, uangku gimana?",
    answer:
      "Aman. Dana balik otomatis ke metode bayar yang kamu pakai. Butuh dibantu? Kirim kode invoice ke CS kami.",
  },
  {
    question: "Bisa bayar pakai apa aja?",
    answer: "QRIS — bisa dari semua e-wallet dan m-banking.",
  },
];

const steps = [
  {
    title: "Pilih kebutuhanmu",
    copy: "Masukkan nomor atau ID, lalu tentukan nominal. Operator kebaca sendiri.",
    tone: "white",
  },
  {
    title: "Scan QRIS",
    copy: "Bayar dari e-wallet atau m-banking apa pun. Satu kode untuk semua.",
    tone: "white",
  },
  {
    title: "Beres, sekejap",
    copy: "Setelah pembayaran dicek, pesanan diproses ±5 detik. Gagal? Dana balik otomatis.",
    tone: "green",
  },
];

export default async function HomePage() {
  const storefront = await getStorefront();

  return (
    <main>
      <section className="wrap pt-4 sm:pt-6">
        <div className="relative overflow-hidden rounded-[32px] bg-leaf px-5 pb-28 pt-10 text-center text-cream sm:px-10 sm:pt-16 lg:pb-36">
          <div aria-hidden="true" className="hidden lg:block">
            <div className="float absolute left-10 top-10 h-16 w-16 rounded-full bg-sun" />
            <div
              className="float absolute bottom-24 right-14 h-14 w-14 rotate-12 rounded-2xl bg-sun"
              style={{ animationDelay: "-3s" }}
            />
            <div
              className="float absolute right-24 top-20 h-24 w-24 rounded-full border-[3px] border-cream/25"
              style={{ animationDelay: "-1.5s" }}
            />
            <div
              className="float absolute bottom-28 left-24 h-10 w-10 rounded-xl border-[3px] border-sun/70"
              style={{ animationDelay: "-4s" }}
            />
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-cream/25 bg-cream/10 px-3 py-1.5 text-[13px] font-semibold">
            <span className="h-2 w-2 rounded-full bg-sun" />
            Buka terus, siang malam
          </span>

          <h1
            className="relative mx-auto mt-6 max-w-5xl font-display text-[36px] font-black leading-none sm:text-6xl lg:text-[78px]"
            aria-label="Semua kebutuhan digital, beres sekejap."
          >
            <span className="w" style={{ animationDelay: ".05s" }}>
              Semua
            </span>{" "}
            <span className="w" style={{ animationDelay: ".13s" }}>
              kebutuhan
            </span>{" "}
            <span className="w" style={{ animationDelay: ".21s" }}>
              digital,
            </span>
            <br />
            <span className="w" style={{ animationDelay: ".29s" }}>
              beres
            </span>{" "}
            <span className="w" style={{ animationDelay: ".37s" }}>
              <WordRotator />
            </span>
          </h1>

          <p className="relative mx-auto mt-5 max-w-xl text-base leading-relaxed opacity-85 sm:text-lg">
            Dari pulsa dan kuota, saldo e-wallet, diamond game, sampai tagihan
            listrik dan air. Satu tempat, harga jujur, nggak perlu bikin akun.
          </p>

          <div className="relative mt-8 flex justify-center gap-6 sm:gap-12">
            <div>
              <div className="font-display text-3xl font-black text-sun sm:text-4xl">
                <CountUp />
              </div>
              <div className="mt-1 text-xs opacity-75 sm:text-sm">kategori produk</div>
            </div>
            <div className="w-px bg-cream/25" />
            <div>
              <div className="font-display text-3xl font-black text-sun sm:text-4xl">
                24/7
              </div>
              <div className="mt-1 text-xs opacity-75 sm:text-sm">selalu buka</div>
            </div>
            <div className="w-px bg-cream/25" />
            <div>
              <div className="font-display text-3xl font-black text-sun sm:text-4xl">
                0
              </div>
              <div className="mt-1 text-xs opacity-75 sm:text-sm">akun wajib</div>
            </div>
          </div>
        </div>

        <QuickOrder service={storefront.services.pulsa} />
      </section>

      <div className="h-12" />

      <section className="border-y border-line bg-white py-5">
        <div className="mq">
          <div className="mq-in">
            {[...transactions, ...transactions].map(
              ([target, item, provider], index) => (
                <div
                  key={`${target}-${index}`}
                  className="flex items-center gap-3 whitespace-nowrap rounded-full border border-line bg-cream py-2 pl-2 pr-4"
                  aria-hidden={index >= transactions.length}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-leaf text-cream">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold">{item}</span>
                  <span className="text-sm text-moss">
                    {provider} · {target}
                  </span>
                  <span className="text-xs font-semibold text-leaf">
                    {((index * 3 + 2) % 9) + 1} dtk lalu
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <BentoGrid />

      <section id="cara" className="wrap scroll-mt-20 pt-24">
        <Reveal>
          <h2 className="font-display text-4xl font-black sm:text-5xl">
            Beres dalam tiga ketukan.
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal
              key={step.title}
              delay={index * 80}
              className={`card p-7 ${
                step.tone === "green"
                  ? "border-leaf bg-leaf text-cream"
                  : ""
              }`}
            >
              <div
                className={`font-display text-5xl font-black ${
                  step.tone === "green" ? "text-sun" : "text-leaf"
                }`}
              >
                0{index + 1}
              </div>
              <h3 className="mt-6 font-display text-2xl font-extrabold">
                {step.title}
              </h3>
              <p
                className={`mt-2 leading-relaxed ${
                  step.tone === "green" ? "text-cream/80" : "text-moss"
                }`}
              >
                {step.copy}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap grid gap-8 pt-24 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <h2 className="font-display text-4xl font-black leading-[1.02] sm:text-5xl">
            Masih ada yang mengganjal?
          </h2>
          <p className="mt-4 max-w-sm text-moss">
            Jawaban singkat untuk pertanyaan yang paling sering mampir. Sisanya
            ada di pusat bantuan.
          </p>
          <Link href="/bantuan/" className="btn btn-ghost mt-6">
            Buka pusat bantuan
          </Link>
        </Reveal>

        <Reveal className="space-y-3" delay={80}>
          {faqs.map((item, index) => (
            <details key={item.question} className="faq" open={index === 0}>
              <summary>
                {item.question}
                <span className="pl">
                  <Icon name="plus" className="h-[22px] w-[22px]" />
                </span>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </Reveal>
      </section>
    </main>
  );
}
