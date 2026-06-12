// 固定の星データ（Math.random()はhydration mismatchを引き起こすため使用不可）
const STARS = [
  { w: 2, op: 0.5, top: 8, left: 12 }, { w: 1.5, op: 0.3, top: 15, left: 78 },
  { w: 3, op: 0.7, top: 22, left: 45 }, { w: 1, op: 0.4, top: 31, left: 90 },
  { w: 2.5, op: 0.6, top: 5, left: 60 }, { w: 1.5, op: 0.3, top: 42, left: 25 },
  { w: 2, op: 0.5, top: 55, left: 83 }, { w: 3, op: 0.4, top: 18, left: 33 },
  { w: 1, op: 0.7, top: 70, left: 10 }, { w: 2, op: 0.3, top: 65, left: 55 },
  { w: 2.5, op: 0.5, top: 38, left: 68 }, { w: 1.5, op: 0.6, top: 80, left: 40 },
  { w: 1, op: 0.4, top: 12, left: 95 }, { w: 3, op: 0.3, top: 50, left: 72 },
  { w: 2, op: 0.5, top: 88, left: 18 }, { w: 1.5, op: 0.7, top: 75, left: 88 },
  { w: 2.5, op: 0.4, top: 28, left: 5 }, { w: 1, op: 0.6, top: 92, left: 62 },
  { w: 2, op: 0.3, top: 45, left: 48 }, { w: 3, op: 0.5, top: 60, left: 30 },
];

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24"
      style={{
        background: "radial-gradient(ellipse at top, #1a1a4e 0%, #0a0a0f 65%)",
      }}
    >
      {/* 星のデコレーション */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: star.w + "px",
              height: star.w + "px",
              backgroundColor: "#c9a84c",
              opacity: star.op,
              top: star.top + "%",
              left: star.left + "%",
            }}
          />
        ))}
      </div>

      {/* 上部ラベル */}
      <div
        className="mb-8 inline-block px-5 py-2 rounded-full text-sm tracking-widest"
        style={{
          border: "1px solid #c9a84c",
          color: "#c9a84c",
          background: "rgba(201,168,76,0.08)",
        }}
      >
        九星気学 × 開運戦略診断
      </div>

      {/* メインコピー */}
      <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: "#f0e8d8" }}>
        あなたは今
        <br />
        <span
          className="text-5xl md:text-7xl"
          style={{
            background: "linear-gradient(135deg, #c9a84c, #e8c97a, #c9a84c)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          「攻めるべき時期」
        </span>
        ですか？
        <br />
        それとも
        <br />
        <span
          className="text-5xl md:text-7xl"
          style={{
            background: "linear-gradient(135deg, #8a7abf, #b8a8e0, #8a7abf)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          「守るべき時期」
        </span>
        ですか？
      </h1>

      {/* サブコピー */}
      <p className="text-lg md:text-xl max-w-2xl leading-relaxed mb-12" style={{ color: "#c8b89a" }}>
        生年月日と居住地から、人生の転機と開運方位を診断。
        <br />
        仕事・独立・転職・人間関係の意思決定をサポートします。
      </p>

      {/* CTA */}
      <a
        href="#diagnosis-form"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("diagnosis-form")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="inline-block px-10 py-5 text-lg font-bold rounded-full transition-all duration-300 pulse-gold"
        style={{
          background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
          color: "#0a0a0f",
          boxShadow: "0 4px 30px rgba(201,168,76,0.4)",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.transform = "translateY(-2px)";
          (e.target as HTMLElement).style.boxShadow = "0 8px 40px rgba(201,168,76,0.6)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.transform = "translateY(0)";
          (e.target as HTMLElement).style.boxShadow = "0 4px 30px rgba(201,168,76,0.4)";
        }}
      >
        無料で診断する →
      </a>

      <p className="mt-4 text-sm" style={{ color: "#8a7a6a" }}>
        所要時間 約1分 ・ 完全無料
      </p>

      {/* 下矢印 */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        style={{ color: "#c9a84c", opacity: 0.5 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
