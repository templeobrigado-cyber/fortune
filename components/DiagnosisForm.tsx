"use client";

import { useState } from "react";
import type { FormData } from "@/app/page";

const THEMES = ["転職", "独立", "経営", "人間関係", "恋愛", "結婚", "金運", "引越し"];

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 80 }, (_, i) => currentYear - 15 - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

interface Props {
  onSubmit: (data: FormData) => void;
}

export default function DiagnosisForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState<FormData>({
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "",
    prefecture: "",
    city: "",
    themes: [],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  function toggleTheme(theme: string) {
    setFormData((prev) => ({
      ...prev,
      themes: prev.themes.includes(theme)
        ? prev.themes.filter((t) => t !== theme)
        : [...prev.themes, theme],
    }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!formData.birthYear) e.birthYear = "年を選択してください";
    if (!formData.birthMonth) e.birthMonth = "月を選択してください";
    if (!formData.birthDay) e.birthDay = "日を選択してください";
    if (!formData.gender) e.gender = "性別を選択してください";
    if (!formData.prefecture) e.prefecture = "都道府県を選択してください";
    setErrors(e as Partial<FormData>);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    onSubmit(formData);
  }

  const inputStyle = {
    background: "rgba(26,26,62,0.6)",
    border: "1px solid rgba(201,168,76,0.3)",
    color: "#f0e8d8",
    borderRadius: "8px",
    padding: "12px 16px",
    width: "100%",
    fontSize: "16px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    color: "#c8b89a",
    fontSize: "14px",
    letterSpacing: "0.05em",
  };

  return (
    <section id="diagnosis-form" className="py-24 px-6" style={{ background: "#0a0a0f" }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm tracking-widest mb-4" style={{ color: "#c9a84c" }}>
            FREE DIAGNOSIS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "#f0e8d8" }}>
            無料診断
          </h2>
          <p className="mt-4" style={{ color: "#8a7a6a" }}>
            生年月日・性別・お住まいを入力して診断スタート
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8"
          style={{ background: "rgba(26,26,62,0.5)", border: "1px solid rgba(201,168,76,0.3)" }}
        >
          {/* 生年月日 */}
          <div className="mb-8">
            <label style={labelStyle}>
              ① 生年月日 <span style={{ color: "#c9a84c" }}>必須</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <select
                  value={formData.birthYear}
                  onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">年</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}年</option>
                  ))}
                </select>
                {errors.birthYear && <p className="text-xs mt-1" style={{ color: "#e87a7a" }}>{errors.birthYear}</p>}
              </div>
              <div>
                <select
                  value={formData.birthMonth}
                  onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">月</option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}月</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={formData.birthDay}
                  onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">日</option>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{d}日</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 性別 */}
          <div className="mb-8">
            <label style={labelStyle}>
              ② 性別 <span style={{ color: "#c9a84c" }}>必須</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["男性", "女性", "その他"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: g })}
                  className="py-3 rounded-lg text-center transition-all"
                  style={{
                    background: formData.gender === g ? "rgba(201,168,76,0.2)" : "rgba(26,26,62,0.6)",
                    border: formData.gender === g ? "1px solid #c9a84c" : "1px solid rgba(201,168,76,0.2)",
                    color: formData.gender === g ? "#c9a84c" : "#c8b89a",
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
            {errors.gender && <p className="text-xs mt-1" style={{ color: "#e87a7a" }}>{errors.gender}</p>}
          </div>

          {/* お住まい */}
          <div className="mb-8">
            <label style={labelStyle}>
              ③ お住まい <span style={{ color: "#c9a84c" }}>必須</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <select
                  value={formData.prefecture}
                  onChange={(e) => setFormData({ ...formData, prefecture: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">都道府県</option>
                  {PREFECTURES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {errors.prefecture && <p className="text-xs mt-1" style={{ color: "#e87a7a" }}>{errors.prefecture}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="市区町村（例：港区）"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  style={inputStyle}
                />
                <p className="text-xs mt-1" style={{ color: "#8a7a6a" }}>※詳細住所は不要です</p>
              </div>
            </div>
          </div>

          {/* テーマ */}
          <div className="mb-10">
            <label style={labelStyle}>
              ④ 今気になっているテーマ <span style={{ color: "#8a7a6a" }}>任意・複数選択可</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => toggleTheme(theme)}
                  className="px-4 py-2 rounded-full text-sm transition-all"
                  style={{
                    background: formData.themes.includes(theme) ? "rgba(201,168,76,0.2)" : "transparent",
                    border: formData.themes.includes(theme) ? "1px solid #c9a84c" : "1px solid rgba(201,168,76,0.25)",
                    color: formData.themes.includes(theme) ? "#c9a84c" : "#8a7a6a",
                  }}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 text-lg font-bold rounded-full transition-all"
            style={{
              background: loading ? "rgba(201,168,76,0.4)" : "linear-gradient(135deg, #c9a84c, #e8c97a)",
              color: "#0a0a0f",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 30px rgba(201,168,76,0.4)",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span
                  className="inline-block w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: "#0a0a0f", borderTopColor: "transparent" }}
                />
                鑑定中...
              </span>
            ) : (
              "診断スタート →"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
