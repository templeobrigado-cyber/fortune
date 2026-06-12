"use client";

import { useState } from "react";
import { DiagnosisResult } from "@/lib/kyusei";
import type { FormData } from "@/app/page";

interface Props {
  result: DiagnosisResult;
  formData: FormData;
}

const LINE_URL = "https://line.me/R/ti/p/%40qfw8348c";

function buildDiagnosisText(result: DiagnosisResult): string {
  const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);
  return [
    "【九星気学 診断結果】",
    `本命星：${result.star}`,
    `月命星：${result.getsumeiStar}`,
    `日命星：${result.nisshomeiStar}`,
    `傾斜宮：${result.keishakyu}`,
    `転機指数：${result.turningPointScore}点（${result.currentPhase}）`,
    `仕事運：${stars(result.workLuck)}`,
    `金運：${stars(result.moneyLuck)}`,
    `人間関係運：${stars(result.relationLuck)}`,
    `キーワード：${result.keywords.join("・")}`,
    "",
    "↑この結果をLINEに貼り付けて送ってください✨",
  ].join("\n");
}

function LineRegisterButton({ result }: { result: DiagnosisResult }) {
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"idle" | "copied">("idle");

  function handleClick() {
    const text = buildDiagnosisText(result);
    navigator.clipboard.writeText(text).catch(() => {
      // fallback: select text
    });
    setCopied(true);
    setStep("copied");
    setTimeout(() => {
      window.open(LINE_URL, "_blank");
    }, 600);
  }

  return (
    <div>
      {step === "copied" && (
        <div
          className="mb-4 p-4 rounded-xl text-sm text-left"
          style={{ background: "rgba(6,199,85,0.12)", border: "1px solid rgba(6,199,85,0.4)", color: "#a0e8a0" }}
        >
          ✅ 診断結果をコピーしました！<br />
          <span style={{ color: "#c8e8c8" }}>LINEが開いたら、トーク画面に貼り付けて送ってください。</span>
        </div>
      )}
      <button
        onClick={handleClick}
        className="w-full py-5 text-lg font-bold rounded-full transition-all"
        style={{
          background: copied
            ? "linear-gradient(135deg, #00a844, #007733)"
            : "linear-gradient(135deg, #06c755, #00a844)",
          color: "#fff",
          boxShadow: "0 4px 30px rgba(6,199,85,0.4)",
        }}
      >
        {copied ? "✅ LINEを開いています..." : "LINE登録して続きを見る →"}
      </button>
      <p className="mt-3 text-xs text-center" style={{ color: "#6a9a6a" }}>
        ※ 登録後、診断結果をトークに貼り付けると詳細レポートをお送りします
      </p>
    </div>
  );
}

function Stars({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <span className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className="text-xl"
          style={{ color: i < score ? "#c9a84c" : "rgba(201,168,76,0.2)" }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="w-full rounded-full h-3 overflow-hidden" style={{ background: "rgba(201,168,76,0.15)" }}>
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{
          width: `${score}%`,
          background: "linear-gradient(90deg, #8a6abf, #c9a84c, #e8c97a)",
        }}
      />
    </div>
  );
}

const cardStyle = {
  background: "rgba(26,26,62,0.6)",
  border: "1px solid rgba(201,168,76,0.25)",
  borderRadius: "16px",
  padding: "24px",
};

export default function ResultSection({ result, formData }: Props) {
  return (
    <section
      className="py-24 px-6 fade-in"
      style={{ background: "linear-gradient(180deg, #0a0a0f 0%, #0d0d2b 50%, #0a0a0f 100%)" }}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="text-center">
          <div
            className="inline-block px-5 py-2 rounded-full text-sm tracking-widest mb-6"
            style={{ border: "1px solid #c9a84c", color: "#c9a84c", background: "rgba(201,168,76,0.08)" }}
          >
            診断結果
          </div>
          <h2 className="text-3xl font-bold" style={{ color: "#f0e8d8" }}>
            あなたの本命星
          </h2>
        </div>

        {/* 九星盤サマリー */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "radial-gradient(ellipse, #1a1a4e 0%, #0d0d2b 100%)", border: "1px solid rgba(201,168,76,0.4)" }}>
          <div className="text-center pt-10 pb-6 px-6">
            <p className="text-sm tracking-widest mb-4" style={{ color: "#c9a84c" }}>HONMEI-SEI</p>
            <p
              className="text-5xl md:text-6xl font-bold"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #e8c97a, #c9a84c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {result.star}
            </p>
            <p className="mt-2 text-sm" style={{ color: "#8a7a6a" }}>
              {formData.prefecture}{formData.city && `・${formData.city}`}
            </p>
          </div>
          {/* 月命星・日命星・傾斜宮 */}
          <div className="grid grid-cols-3 divide-x" style={{ borderTop: "1px solid rgba(201,168,76,0.25)", borderColor: "rgba(201,168,76,0.2)" }}>
            {[
              { label: "月命星", value: result.getsumeiStar, sub: "隠れた才能" },
              { label: "日命星", value: result.nisshomeiStar, sub: "仕事・天職" },
              { label: "傾斜宮", value: result.keishakyu.replace("傾斜", ""), sub: "魅力・恋愛" },
            ].map(({ label, value, sub }) => (
              <div key={label} className="text-center py-5 px-2" style={{ borderColor: "rgba(201,168,76,0.2)" }}>
                <p className="text-xs mb-1" style={{ color: "#8a7a6a" }}>{label}</p>
                <p className="text-sm font-bold" style={{ color: "#e8c97a" }}>{value}</p>
                <p className="text-xs mt-1" style={{ color: "#6a6a8a" }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 現在の運気 */}
        <div style={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{ color: "#f0e8d8" }}>現在の運気</h3>
            <Stars score={result.luckScore} />
          </div>
          <p className="leading-relaxed" style={{ color: "#c8b89a" }}>
            {result.phaseDescription}
          </p>
        </div>

        {/* 転機指数 */}
        <div style={cardStyle}>
          <h3 className="text-lg font-bold mb-4" style={{ color: "#f0e8d8" }}>人生の転機指数</h3>
          <div className="flex items-end gap-4 mb-4">
            <span
              className="text-6xl font-bold"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {result.turningPointScore}
            </span>
            <span className="text-2xl mb-2" style={{ color: "#8a7a6a" }}>/ 100</span>
          </div>
          <ScoreBar score={result.turningPointScore} />
          <div
            className="mt-4 p-4 rounded-lg text-center"
            style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}
          >
            <p className="font-bold" style={{ color: "#c9a84c" }}>{result.currentPhase}</p>
          </div>
        </div>

        {/* 運勢サマリー */}
        <div style={cardStyle}>
          <h3 className="text-lg font-bold mb-6" style={{ color: "#f0e8d8" }}>運勢サマリー</h3>
          <div className="space-y-4">
            {[
              { label: "仕事運", score: result.workLuck },
              { label: "金運", score: result.moneyLuck },
              { label: "人間関係運", score: result.relationLuck },
            ].map(({ label, score }) => (
              <div key={label} className="flex items-center justify-between">
                <span style={{ color: "#c8b89a", minWidth: "100px" }}>{label}</span>
                <Stars score={score} />
              </div>
            ))}
          </div>
        </div>

        {/* 開運キーワード */}
        <div style={cardStyle}>
          <h3 className="text-lg font-bold mb-4" style={{ color: "#f0e8d8" }}>開運キーワード</h3>
          <div className="flex gap-3 flex-wrap">
            {result.keywords.map((kw) => (
              <span
                key={kw}
                className="px-4 py-2 rounded-full text-sm font-bold"
                style={{ background: "rgba(201,168,76,0.15)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.3)" }}
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* 4つの鑑定カード */}
        {[
          {
            label: "本命星",
            badge: result.star,
            title: "気質と個性",
            desc: result.honmeiDescription,
            color: "#c9a84c",
          },
          {
            label: "月命星",
            badge: result.getsumeiStar,
            title: "隠れた才能",
            desc: result.getsumeiDescription,
            color: "#9a8abf",
          },
          {
            label: "日命星",
            badge: result.nisshomeiStar,
            title: "仕事運・天職",
            desc: result.nisshomeiDescription,
            color: "#7aaabf",
          },
          {
            label: "傾斜宮",
            badge: result.keishakyu,
            title: "魅力・恋愛力",
            desc: result.keishakyuDescription,
            color: "#bf8a9a",
          },
        ].map(({ label, badge, title, desc, color }) => (
          <div key={label} style={cardStyle}>
            <div className="flex items-center gap-3 mb-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}
              >
                {label}
              </span>
              <span className="font-bold text-sm" style={{ color }}>
                【{badge}】
              </span>
            </div>
            <p className="text-sm font-bold mb-2" style={{ color: "#f0e8d8" }}>
              {title}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#c8b89a" }}>
              {desc}
            </p>
          </div>
        ))}

        {/* 方位診断（チラ見せ） */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ border: "1px solid rgba(201,168,76,0.4)", background: "rgba(26,26,62,0.7)" }}
        >
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#f0e8d8" }}>方位診断</h3>
            <p style={{ color: "#c8b89a" }}>現在あなたには</p>
            <p
              className="text-2xl font-bold my-3"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              「吉方位」が存在しています。
            </p>
            <p style={{ color: "#c8b89a" }}>
              その方位への移動や行動が、仕事運や対人運を後押しする可能性があります。
            </p>
          </div>
          {/* ぼかしオーバーレイ */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center pb-4"
            style={{ background: "linear-gradient(transparent, rgba(13,13,43,0.98))" }}
          >
            <span className="text-sm" style={{ color: "#8a7a6a" }}>
              🔒 LINE登録で詳細を確認
            </span>
          </div>
          <div className="h-8" />
        </div>

        {/* LINE登録セクション */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: "linear-gradient(135deg, #0d2b1a 0%, #0a1f12 100%)",
            border: "1px solid rgba(6,199,85,0.4)",
          }}
        >
          <div
            className="inline-block px-5 py-2 rounded-full text-sm tracking-widest mb-6"
            style={{ border: "1px solid rgba(6,199,85,0.5)", color: "#06c755", background: "rgba(6,199,85,0.1)" }}
          >
            LINE登録特典
          </div>
          <h3 className="text-2xl font-bold mb-4" style={{ color: "#f0e8d8" }}>
            あなた専用の
            <br />
            分析結果を作成済みです。
          </h3>
          <p className="mb-6" style={{ color: "#a0c8a8" }}>
            LINE登録で続きを確認できます
          </p>

          <div className="text-left mb-8 space-y-3">
            {[
              "あなたの吉方位",
              "今後3か月の運気推移",
              "人生の転機が訪れる時期",
              "引越し・旅行に適した方位",
              "避けるべき凶方位",
              "開運アクション詳細",
              "初回鑑定クーポン（2,200円OFF）",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span style={{ color: "#06c755" }}>✓</span>
                <span style={{ color: "#c8e8c8" }}>{item}</span>
              </div>
            ))}
          </div>

          <LineRegisterButton result={result} />

          <p className="mt-4 text-sm" style={{ color: "#6a8a6a" }}>
            登録無料・いつでも解除できます
          </p>
        </div>

        {/* 初回鑑定クーポン */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "rgba(26,26,62,0.6)", border: "1px solid rgba(201,168,76,0.4)" }}
        >
          <p className="text-sm tracking-widest mb-4" style={{ color: "#c9a84c" }}>SPECIAL OFFER</p>
          <h3 className="text-xl font-bold mb-2" style={{ color: "#f0e8d8" }}>
            転職・独立・引越し・事業拡大などの判断は、
          </h3>
          <p className="mb-6" style={{ color: "#c8b89a" }}>
            現在地と目的地の方位関係によって結果が大きく変わります。
            <br />
            詳細な方位鑑定や人生設計については個別鑑定でご案内しています。
          </p>

          <div className="mb-6">
            <span className="line-through text-lg mr-3" style={{ color: "#8a7a6a" }}>11,000円</span>
            <span
              className="text-4xl font-bold"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              8,800円
            </span>
          </div>
          <p className="text-sm mb-6" style={{ color: "#c9a84c" }}>初回限定 60分鑑定</p>

          <div className="flex flex-col gap-3">
            {/* 電話予約 */}
            <a
              href="tel:070-5545-3013"
              className="flex items-center justify-center gap-3 w-full py-5 text-lg font-bold rounded-full transition-all"
              style={{
                background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
                color: "#0a0a0f",
                boxShadow: "0 4px 30px rgba(201,168,76,0.4)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(201,168,76,0.6)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 30px rgba(201,168,76,0.4)";
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 5.37 5.37l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
              </svg>
              電話で予約する
            </a>

            {/* LINE予約 */}
            <a
              href="https://line.me/R/ti/p/%40qfw8348c"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-5 text-lg font-bold rounded-full transition-all"
              style={{
                background: "linear-gradient(135deg, #06c755, #00a844)",
                color: "#fff",
                boxShadow: "0 4px 30px rgba(6,199,85,0.35)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(6,199,85,0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 30px rgba(6,199,85,0.35)";
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              LINEで予約する
            </a>
          </div>

          <p className="mt-4 text-sm" style={{ color: "#8a7a6a" }}>
            営業時間：10:00〜20:00（不定休）
          </p>
        </div>
      </div>
    </section>
  );
}
