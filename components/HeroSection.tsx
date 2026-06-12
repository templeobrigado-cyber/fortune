"use client";

import { useEffect, useRef } from "react";

export default function HeroSection() {
  const starsRef = useRef<HTMLDivElement>(null);

  // 星はクライアント側のみ生成（hydration mismatch対策）
  useEffect(() => {
    const container = starsRef.current;
    if (!container) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 40; i++) {
      const s = document.createElement("span");
      const isGold = Math.random() < 0.3;
      const size = (Math.random() * 2.2 + 0.8).toFixed(1);
      const left = (Math.random() * 100).toFixed(2);
      const top = (Math.random() * 100).toFixed(2);
      const d = (Math.random() * 4 + 3).toFixed(1);
      const delay = (Math.random() * 5).toFixed(1);
      s.className = "star-dot";
      s.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        `left:${left}%`,
        `top:${top}%`,
        `background:${isGold ? "var(--gold-bright)" : "var(--ivory)"}`,
        `opacity:.5`,
        `--tw-d:${d}s`,
        `--tw-delay:${delay}s`,
      ].join(";");
      frag.appendChild(s);
    }
    container.appendChild(frag);
    return () => { container.innerHTML = ""; };
  }, []);

  function scrollToForm(e: React.MouseEvent) {
    e.preventDefault();
    document.getElementById("diagnosis-form")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(48px,8vh,96px) 24px",
        background: `
          radial-gradient(ellipse 120% 80% at 50% -20%, var(--ink-3) 0%, transparent 60%),
          radial-gradient(ellipse 80% 60% at 50% 110%, #161230 0%, transparent 55%),
          linear-gradient(180deg, var(--ink) 0%, var(--ink-2) 55%, var(--ink) 100%)
        `,
        textAlign: "center",
        overflowX: "hidden",
      }}
    >
      {/* 星空 */}
      <div
        ref={starsRef}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}
      />

      {/* 方位盤（SVG） */}
      <div
        className="compass-wrap"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: "min(135vmin, 1100px)",
          aspectRatio: "1",
          transform: "translate(-50%, -52%)",
          pointerEvents: "none",
          opacity: .55,
        }}
      >
        <svg viewBox="0 0 1000 1000" fill="none" style={{ width: "100%", height: "100%", display: "block" }}>
          <defs>
            <radialGradient id="fadeMask" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#fff" stopOpacity=".9" />
              <stop offset="70%"  stopColor="#fff" stopOpacity=".45" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="m">
              <rect width="1000" height="1000" fill="url(#fadeMask)" />
            </mask>
          </defs>
          <g mask="url(#m)">
            {/* 外周リング：八方位の目盛 */}
            <g className="ring-slow" stroke="#D9B45B" strokeOpacity=".22">
              <circle cx="500" cy="500" r="470" strokeWidth="1" />
              <circle cx="500" cy="500" r="436" strokeWidth=".6" />
              <g strokeWidth="1">
                <line x1="500" y1="30"  x2="500" y2="64" />
                <line x1="500" y1="936" x2="500" y2="970" />
                <line x1="30"  y1="500" x2="64"  y2="500" />
                <line x1="936" y1="500" x2="970" y2="500" />
                <line x1="167.6" y1="167.6" x2="191.7" y2="191.7" />
                <line x1="808.3" y1="808.3" x2="832.4" y2="832.4" />
                <line x1="167.6" y1="832.4" x2="191.7" y2="808.3" />
                <line x1="808.3" y1="191.7" x2="832.4" y2="167.6" />
              </g>
              <g fill="#D9B45B" fillOpacity=".4" stroke="none"
                 fontFamily="'Shippori Mincho B1',serif" fontSize="30" textAnchor="middle">
                <text x="500" y="108">北</text>
                <text x="500" y="922">南</text>
                <text x="906" y="510">東</text>
                <text x="94"  y="510">西</text>
              </g>
            </g>
            {/* 内周リング：逆回転 */}
            <g className="ring-rev" stroke="#AFA0E0" strokeOpacity=".18">
              <circle cx="500" cy="500" r="330" strokeWidth=".8" />
              <circle cx="500" cy="500" r="300" strokeWidth=".5" strokeDasharray="2 10" />
              <path strokeWidth=".8"
                d="M500 200 L712 288 L800 500 L712 712 L500 800 L288 712 L200 500 L288 288 Z" />
              <path strokeWidth=".5" strokeOpacity=".6"
                d="M500 200 L500 800 M200 500 L800 500 M288 288 L712 712 M712 288 L288 712" />
            </g>
            {/* 中央の九星格子 */}
            <g stroke="#D9B45B" strokeOpacity=".1" strokeWidth=".7">
              <rect x="410" y="410" width="180" height="180" />
              <line x1="470" y1="410" x2="470" y2="590" />
              <line x1="530" y1="410" x2="530" y2="590" />
              <line x1="410" y1="470" x2="590" y2="470" />
              <line x1="410" y1="530" x2="590" y2="530" />
            </g>
          </g>
        </svg>
      </div>

      {/* コンテンツ */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: "1100px", width: "100%" }}>
        <p className="hero-badge">九星気学 × 開運戦略診断</p>

        <h1 style={{
          marginTop: "clamp(36px,6vh,56px)",
          fontWeight: 700,
          lineHeight: 1.5,
          letterSpacing: ".06em",
        }}>
          <span style={{
            display: "block",
            fontSize: "clamp(24px,4.2vw,44px)",
            opacity: 0,
            animation: "rise 1s cubic-bezier(.22,1,.36,1) .35s forwards",
          }}>
            あなたは今、
          </span>
          <span style={{
            display: "block",
            fontSize: "clamp(34px,6.6vw,76px)",
            marginTop: ".1em",
            opacity: 0,
            animation: "rise 1s cubic-bezier(.22,1,.36,1) .65s forwards",
          }}>
            <span style={{ color: "var(--ivory-dim)", fontWeight: 500 }}>「</span>
            <span className="word-attack">攻めるべき時期</span>
            <span style={{ color: "var(--ivory-dim)", fontWeight: 500 }}>」</span>
            <span style={{ fontSize: ".62em", color: "var(--ivory)", fontWeight: 600, letterSpacing: ".04em" }}>ですか？</span>
          </span>
          <span style={{
            display: "block",
            fontSize: "clamp(20px,3.4vw,36px)",
            marginTop: ".35em",
            color: "var(--ivory-dim)",
            fontWeight: 600,
            opacity: 0,
            animation: "rise 1s cubic-bezier(.22,1,.36,1) 1.05s forwards",
          }}>
            それとも──
          </span>
          <span style={{
            display: "block",
            fontSize: "clamp(34px,6.6vw,76px)",
            marginTop: ".1em",
            opacity: 0,
            animation: "rise 1s cubic-bezier(.22,1,.36,1) 1.3s forwards",
          }}>
            <span style={{ color: "var(--ivory-dim)", fontWeight: 500 }}>「</span>
            <span className="word-guard">守るべき時期</span>
            <span style={{ color: "var(--ivory-dim)", fontWeight: 500 }}>」</span>
            <span style={{ fontSize: ".62em", color: "var(--ivory)", fontWeight: 600, letterSpacing: ".04em" }}>ですか？</span>
          </span>
        </h1>

        {/* 仕切り線 */}
        <div
          aria-hidden="true"
          style={{
            width: "1px",
            height: "clamp(32px,5vh,52px)",
            margin: "clamp(28px,4.5vh,44px) auto clamp(24px,4vh,36px)",
            background: "linear-gradient(180deg, transparent, var(--gold), transparent)",
            opacity: 0,
            animation: "fade 1s ease 1.7s forwards",
          }}
        />

        {/* リード文 */}
        <p style={{
          fontSize: "clamp(14px,1.9vw,18px)",
          lineHeight: 2.2,
          letterSpacing: ".12em",
          color: "rgba(244,239,226,.88)",
          opacity: 0,
          animation: "rise 1s cubic-bezier(.22,1,.36,1) 1.85s forwards",
        }}>
          生年月日と居住地から、
          <em style={{ fontStyle: "normal", color: "var(--gold-bright)", borderBottom: "1px solid rgba(217,180,91,.4)", paddingBottom: "2px" }}>人生の転機</em>
          と
          <em style={{ fontStyle: "normal", color: "var(--gold-bright)", borderBottom: "1px solid rgba(217,180,91,.4)", paddingBottom: "2px" }}>開運方位</em>
          を診断。
          <br />
          仕事・独立・転職・人間関係の意思決定をサポートします。
        </p>

        {/* CTA */}
        <div style={{
          marginTop: "clamp(36px,6vh,60px)",
          opacity: 0,
          animation: "rise 1s cubic-bezier(.22,1,.36,1) 2.15s forwards",
        }}>
          <a
            href="#diagnosis-form"
            onClick={scrollToForm}
            className="cta-btn"
          >
            無料で診断する
            <span className="arrow" aria-hidden="true">→</span>
          </a>

          <p style={{
            marginTop: "22px",
            fontFamily: "var(--gothic)",
            fontSize: "clamp(11px,1.4vw,13px)",
            letterSpacing: ".22em",
            color: "var(--ivory-dim)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "18px",
            opacity: 0,
            animation: "fade 1s ease 2.5s forwards",
          }}>
            <span>所要時間 約1分</span>
            <span aria-hidden="true" style={{ width: "3px", height: "3px", borderRadius: "50%", background: "var(--gold)", opacity: .7, display: "inline-block" }} />
            <span>完全無料</span>
            <span aria-hidden="true" style={{ width: "3px", height: "3px", borderRadius: "50%", background: "var(--gold)", opacity: .7, display: "inline-block" }} />
            <span>登録不要</span>
          </p>
        </div>
      </div>
    </section>
  );
}
