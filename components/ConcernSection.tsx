const concerns = [
  "独立のタイミングを迷っている",
  "転職するべきか悩んでいる",
  "事業拡大を検討している",
  "人間関係を整理したい",
  "引越しの時期を知りたい",
  "今の運気の流れを知りたい",
  "大きな決断を前に不安がある",
  "次のステージへ進むべきか迷っている",
];

export default function ConcernSection() {
  return (
    <section className="py-24 px-6" style={{ background: "#0a0a0f" }}>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm tracking-widest mb-4" style={{ color: "#c9a84c" }}>
          CONCERNS
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-16" style={{ color: "#f0e8d8" }}>
          こんなお悩みはありませんか？
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {concerns.map((concern, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-lg text-left"
              style={{
                background: "rgba(26,26,62,0.5)",
                border: "1px solid rgba(201,168,76,0.2)",
              }}
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "rgba(201,168,76,0.15)", color: "#c9a84c" }}
              >
                ✓
              </span>
              <span style={{ color: "#c8b89a" }}>{concern}</span>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-2xl" style={{ background: "rgba(26,26,62,0.7)", border: "1px solid rgba(201,168,76,0.3)" }}>
          <p className="text-xl leading-relaxed" style={{ color: "#f0e8d8" }}>
            九星気学は、2000年以上の歴史を持つ東洋の哲学。
            <br />
            <span style={{ color: "#c9a84c" }}>「攻める時期」と「守る時期」を知るだけで、</span>
            <br />
            意思決定の精度が変わります。
          </p>
        </div>
      </div>
    </section>
  );
}
