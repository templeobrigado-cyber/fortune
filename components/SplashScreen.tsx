"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [phase, setPhase] = useState<"hidden" | "in" | "hold" | "out" | "done">("hidden");

  useEffect(() => {
    // prefers-reduced-motion チェック
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // sessionStorage フラグ確認
    if (sessionStorage.getItem("splash_shown")) return;
    sessionStorage.setItem("splash_shown", "1");

    // スクロールロック
    document.body.style.overflow = "hidden";

    // フェーズ制御
    // hidden → in (0ms): フェードイン開始
    // in → hold (800ms): 静止
    // hold → out (800+1200ms): フェードアウト開始
    // out → done (800+1200+800ms): 完了・スクロール解除

    setPhase("in");
    const t1 = setTimeout(() => setPhase("hold"), 800);
    const t2 = setTimeout(() => setPhase("out"), 800 + 1200);
    const t3 = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 800 + 1200 + 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "hidden" || phase === "done") return null;

  const overlayOpacity = phase === "out" ? 0 : 1;
  const textOpacity = phase === "in" ? 1 : phase === "hold" ? 1 : 0;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "var(--ink-3, #1A2348)",
        opacity: overlayOpacity,
        transition: phase === "out"
          ? "opacity .8s cubic-bezier(.4,0,.6,1)"
          : "opacity .8s cubic-bezier(.22,1,.36,1)",
        pointerEvents: phase === "out" ? "none" : "all",
      }}
    >
      <p
        style={{
          fontFamily: "var(--serif, 'Shippori Mincho B1', serif)",
          fontSize: "clamp(17px,2.6vw,26px)",
          fontWeight: 500,
          letterSpacing: ".18em",
          lineHeight: 1.8,
          textAlign: "center",
          color: "var(--ivory, #F4EFE2)",
          opacity: textOpacity,
          transition: "opacity .8s cubic-bezier(.22,1,.36,1)",
        }}
      >
        あなたの星は、もう動き始めているかもしれない
      </p>
    </div>
  );
}
