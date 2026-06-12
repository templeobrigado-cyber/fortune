"use client";

import { useEffect, useRef, useState } from "react";

export default function SupervisorCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        padding: "clamp(48px,8vw,80px) 24px",
        background: "var(--ink)",
      }}
    >
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(28px)",
          transition: "opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)",
        }}
      >
        {/* ラベル */}
        <p style={{
          textAlign: "center",
          fontFamily: "var(--gothic)",
          fontSize: "11px",
          letterSpacing: ".42em",
          textIndent: ".42em",
          color: "rgba(217,180,91,.55)",
          marginBottom: "28px",
        }}>
          監修
        </p>

        {/* カード本体 */}
        <div style={{
          background: "rgba(16,23,48,0.75)",
          border: "1px solid rgba(217,180,91,.28)",
          borderRadius: "20px",
          padding: "clamp(28px,5vw,44px)",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}>
          {/* 上段：写真 + 名前・肩書 */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
            {/* 顔写真プレースホルダー */}
            <div style={{
              flexShrink: 0,
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              border: "1.5px solid rgba(217,180,91,.35)",
              background: "rgba(26,35,72,.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/supervisor-placeholder.jpg"
                alt="清水淳陽"
                width={120}
                height={120}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                onError={(e) => {
                  // 画像がない場合はイニシャル表示
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector(".initials")) {
                    const span = document.createElement("span");
                    span.className = "initials";
                    span.textContent = "清";
                    span.style.cssText = "font-size:40px;color:rgba(217,180,91,.5);font-family:var(--serif)";
                    parent.appendChild(span);
                  }
                }}
              />
            </div>

            {/* 名前・肩書 */}
            <div>
              <p style={{
                fontFamily: "var(--gothic)",
                fontSize: "12px",
                letterSpacing: ".28em",
                color: "rgba(217,180,91,.6)",
                marginBottom: "6px",
              }}>
                開運鑑定士｜ボディクリスタル青山
              </p>
              <p style={{
                fontSize: "clamp(22px,3.2vw,30px)",
                fontWeight: 700,
                letterSpacing: ".12em",
                color: "var(--ivory)",
                lineHeight: 1.3,
              }}>
                清水淳陽
                <span style={{
                  display: "inline-block",
                  marginLeft: "10px",
                  fontSize: "clamp(12px,1.4vw,14px)",
                  fontWeight: 400,
                  letterSpacing: ".2em",
                  color: "var(--ivory-dim)",
                  verticalAlign: "middle",
                }}>
                  しみずじゅんや
                </span>
              </p>
            </div>
          </div>

          {/* 区切り */}
          <div style={{ height: "1px", background: "rgba(217,180,91,.15)" }} />

          {/* 紹介文 */}
          <p style={{
            fontSize: "clamp(14px,1.7vw,16px)",
            lineHeight: 2.1,
            letterSpacing: ".08em",
            color: "rgba(244,239,226,.78)",
          }}>
            易学・気学をもとに、悩みや心の迷いを解き明かし、
            これからの方向性を鑑定します。
          </p>

          {/* 導線文 */}
          <p style={{
            fontSize: "clamp(13px,1.5vw,15px)",
            lineHeight: 2.0,
            letterSpacing: ".06em",
            color: "rgba(175,160,224,.8)",
          }}>
            この診断は入口です。さらに深く知りたい方は、
            青山一丁目駅徒歩1分のサロンで対面鑑定も（完全予約制）
          </p>

          {/* リンクボタン */}
          <a
            href="https://bodycrystal.tokyo/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              alignSelf: "flex-start",
              padding: "14px 32px",
              borderRadius: "999px",
              border: "1px solid rgba(217,180,91,.45)",
              background: "rgba(217,180,91,.08)",
              color: "var(--gold-bright)",
              fontFamily: "var(--serif)",
              fontSize: "clamp(13px,1.5vw,15px)",
              fontWeight: 600,
              letterSpacing: ".12em",
              textDecoration: "none",
              transition: "background .25s ease, border-color .25s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(217,180,91,.16)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(217,180,91,.7)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(217,180,91,.08)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(217,180,91,.45)";
            }}
          >
            対面鑑定について見る
            <span aria-hidden="true" style={{ fontSize: "12px" }}>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
