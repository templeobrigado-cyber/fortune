"use client";

import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import ConcernSection from "@/components/ConcernSection";
import WhatYouLearnSection from "@/components/WhatYouLearnSection";
import DiagnosisForm from "@/components/DiagnosisForm";
import ResultSection from "@/components/ResultSection";
import SupervisorCard from "@/components/SupervisorCard";
import SplashScreen from "@/components/SplashScreen";
import { DiagnosisResult, diagnose } from "@/lib/kyusei";

export type FormData = {
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  gender: string;
  prefecture: string;
  city: string;
  themes: string[];
};

export default function Home() {
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  function handleDiagnose(data: FormData) {
    const birthDate = new Date(
      parseInt(data.birthYear),
      parseInt(data.birthMonth) - 1,
      parseInt(data.birthDay)
    );
    const res = diagnose(birthDate, data.gender, data.prefecture, data.themes);
    setResult(res);
    setFormData(data);
    setTimeout(() => {
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <>
      {/* スプラッシュ：ヒーローのDOMはすでにレンダリング済み、上に被せる */}
      <SplashScreen />

      <main className="min-h-screen" style={{ background: "linear-gradient(180deg, #0d0d2b 0%, #0a0a0f 30%)" }}>
        <HeroSection />
        <ConcernSection />
        <WhatYouLearnSection />
        <DiagnosisForm onSubmit={handleDiagnose} />

        {/* フォーム直後の監修者カード */}
        <SupervisorCard />

        {result && formData && (
          <div id="result">
            <ResultSection result={result} formData={formData} />
            {/* 診断結果末尾にも監修者カードを再掲 */}
            <SupervisorCard />
          </div>
        )}
      </main>
    </>
  );
}
