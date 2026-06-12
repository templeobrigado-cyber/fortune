const items = [
  { icon: "◎", title: "現在の運気", desc: "今があなたにとって「攻める時期」か「守る時期」かを判定します" },
  { icon: "⟳", title: "人生の転機指数", desc: "今後の転機が訪れる確率を0〜100のスコアで表示" },
  { icon: "↗", title: "吉方位", desc: "移動・行動・ビジネス展開に有利な方角を特定" },
  { icon: "⚠", title: "注意時期", desc: "慎重に行動すべき時期と避けるべきアクションを提示" },
  { icon: "✦", title: "開運アクション", desc: "あなたの本命星に合った具体的な開運行動を提案" },
  { icon: "💼", title: "仕事運・金運・人間関係運", desc: "3つの運気を星5段階で可視化" },
];

export default function WhatYouLearnSection() {
  return (
    <section className="py-24 px-6" style={{ background: "linear-gradient(180deg, #0a0a0f 0%, #0d0d2b 100%)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm tracking-widest mb-4" style={{ color: "#c9a84c" }}>
            WHAT YOU LEARN
          </p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "#f0e8d8" }}>
            診断でわかること
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-xl"
              style={{
                background: "rgba(26,26,62,0.6)",
                border: "1px solid rgba(201,168,76,0.25)",
              }}
            >
              <div className="text-3xl mb-4" style={{ color: "#c9a84c" }}>
                {item.icon}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#f0e8d8" }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#8a7a6a" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg" style={{ color: "#c8b89a" }}>
            さらに LINE 登録で
          </p>
          <p className="text-xl font-bold mt-2" style={{ color: "#c9a84c" }}>
            吉方位の詳細・今後3ヶ月の運気推移・初回鑑定クーポン
          </p>
          <p className="text-lg mt-2" style={{ color: "#c8b89a" }}>
            がもらえます
          </p>
        </div>
      </div>
    </section>
  );
}
