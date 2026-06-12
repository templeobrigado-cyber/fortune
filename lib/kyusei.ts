// 九星気学 計算ロジック

export type KyuseiStar =
  | "一白水星"
  | "二黒土星"
  | "三碧木星"
  | "四緑木星"
  | "五黄土星"
  | "六白金星"
  | "七赤金星"
  | "八白土星"
  | "九紫火星";

export type Direction =
  | "北"
  | "北東"
  | "東"
  | "南東"
  | "南"
  | "南西"
  | "西"
  | "北西"
  | "中央";

export interface DiagnosisResult {
  star: KyuseiStar;
  starNumber: number;
  luckScore: number; // 1-5
  turningPointScore: number; // 0-100
  currentPhase: string;
  phaseDescription: string;
  workLuck: number; // 1-5
  moneyLuck: number;
  relationLuck: number;
  keywords: string[];
  luckyDirection: Direction;
  cautionDirection: Direction;
  nextTurningPoint: string;
  monthsLuck: { month: string; score: number }[];
}

const STARS: KyuseiStar[] = [
  "一白水星",
  "二黒土星",
  "三碧木星",
  "四緑木星",
  "五黄土星",
  "六白金星",
  "七赤金星",
  "八白土星",
  "九紫火星",
];

// 節分基準の年を返す（2月4日以降が新年）
function getKyuseiYear(date: Date): number {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  if (month === 1 || (month === 2 && day <= 3)) {
    return year - 1;
  }
  return year;
}

// 年の各桁の和を1桁になるまで繰り返す
function digitSum(n: number): number {
  while (n >= 10) {
    n = String(n).split("").reduce((a, b) => a + parseInt(b), 0);
  }
  return n;
}

// 本命星を計算
export function calcHonmeiStar(birthDate: Date): { star: KyuseiStar; number: number } {
  const year = getKyuseiYear(birthDate);
  const s = digitSum(year);
  let starNum = 11 - s;
  if (starNum > 9) starNum -= 9;
  if (starNum <= 0) starNum += 9;
  return { star: STARS[starNum - 1], number: starNum };
}

// 年盤本命星から今年の運気を算出
function calcYearLuck(starNum: number, currentYear: number): number {
  const yearStar = getYearStar(currentYear);
  // 各星の相性マップ
  const compatibility: Record<number, number[]> = {
    1: [6, 7],
    2: [8, 5],
    3: [4, 9],
    4: [3, 9],
    5: [2, 8],
    6: [1, 7],
    7: [6, 1],
    8: [2, 5],
    9: [3, 4],
  };
  if (compatibility[yearStar]?.includes(starNum)) return 5;
  if (Math.abs(starNum - yearStar) === 4) return 2;
  return 3;
}

function getYearStar(year: number): number {
  const s = digitSum(year);
  let starNum = 11 - s;
  if (starNum > 9) starNum -= 9;
  if (starNum <= 0) starNum += 9;
  return starNum;
}

// 吉方位マップ
const LUCKY_DIRECTIONS: Record<number, Direction> = {
  1: "南東",
  2: "南",
  3: "東",
  4: "北",
  5: "南西",
  6: "西",
  7: "北西",
  8: "北東",
  9: "北",
};

const CAUTION_DIRECTIONS: Record<number, Direction> = {
  1: "南西",
  2: "東",
  3: "西",
  4: "南西",
  5: "北東",
  6: "南東",
  7: "東",
  8: "南",
  9: "南西",
};

const PHASES: Record<number, { phase: string; description: string }> = {
  1: { phase: "充電期", description: "内なる力を蓄え、次のステージへの準備をする時期です。焦らず、学びと内省を深めましょう。" },
  2: { phase: "準備期", description: "基盤を固め、人脈を広げる時期です。信頼関係を丁寧に育てることが開運の鍵です。" },
  3: { phase: "発芽期", description: "新しい可能性が芽吹き始める時期です。直感を信じて、新しいことへの一歩を踏み出しましょう。" },
  4: { phase: "成長期", description: "人との縁が広がり、チャンスが増える時期です。コミュニケーションを積極的に取りましょう。" },
  5: { phase: "変容期", description: "大きな変化と転換点の時期です。過去を手放し、新しい自分へ進む勇気を持ちましょう。" },
  6: { phase: "収穫前期", description: "努力が形になり始める時期です。責任ある判断と行動が、大きな実りをもたらします。" },
  7: { phase: "充実期", description: "これまでの積み重ねが花開く時期です。喜びと交流を大切にしながら、才能を発揮しましょう。" },
  8: { phase: "収穫期", description: "大きな成果と変革が訪れる時期です。山の頂に立つ気持ちで、次の目標を見据えましょう。" },
  9: { phase: "輝き期", description: "注目を集め、才能が開花する時期です。表現力を活かし、周囲との調和を大切にしましょう。" },
};

const KEYWORDS: Record<number, string[]> = {
  1: ["内省", "学び", "準備"],
  2: ["誠実", "協調", "基盤"],
  3: ["挑戦", "直感", "行動"],
  4: ["縁", "コミュニケーション", "拡大"],
  5: ["変革", "決断", "転機"],
  6: ["責任", "信頼", "実績"],
  7: ["喜び", "交流", "表現"],
  8: ["変化", "達成", "新境地"],
  9: ["輝き", "認知", "完成"],
};

function calcTurningPointScore(starNum: number, birthDate: Date, currentYear: number): number {
  const age = currentYear - birthDate.getFullYear();
  // 年齢と本命星から転機指数を算出
  const cyclePeriod = 9;
  const cyclePos = age % cyclePeriod;
  const base = [55, 60, 75, 80, 70, 65, 72, 82, 68];
  const idx = (starNum + cyclePos - 1) % 9;
  return base[idx];
}

function calcNextTurningPoint(starNum: number, currentYear: number): string {
  // 次の大きな転機（本命星が5黄に重なる年）
  const offset = (5 - getYearStar(currentYear) + 9) % 9;
  const nextYear = currentYear + (offset === 0 ? 9 : offset);
  const nextNextYear = nextYear + 1;
  return `${nextYear}年〜${nextNextYear}年`;
}

function calcMonthsLuck(starNum: number): { month: string; score: number }[] {
  const baseScores = [3, 3, 4, 4, 5, 5, 4, 3, 3, 4, 5, 4];
  const offset = (starNum - 1) % 4;
  return Array.from({ length: 6 }, (_, i) => {
    const monthIdx = (new Date().getMonth() + i) % 12;
    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    const score = ((baseScores[(monthIdx + offset) % 12] + (i === 2 || i === 4 ? 1 : 0)) > 5) ? 5 : baseScores[(monthIdx + offset) % 12];
    return { month: monthNames[monthIdx], score };
  });
}

export function diagnose(
  birthDate: Date,
  gender: string,
  prefecture: string,
  themes: string[]
): DiagnosisResult {
  const currentYear = new Date().getFullYear();
  const { star, number: starNum } = calcHonmeiStar(birthDate);
  const luckScore = calcYearLuck(starNum, currentYear);
  const turningPointScore = calcTurningPointScore(starNum, birthDate, currentYear);
  const { phase, description } = PHASES[starNum];

  // テーマに基づいて運気スコアを微調整
  const themeBonus = themes.includes("経営") || themes.includes("独立") ? 1 : 0;

  return {
    star,
    starNumber: starNum,
    luckScore: Math.min(5, luckScore + (themes.length > 0 ? 0 : 0)),
    turningPointScore,
    currentPhase: phase,
    phaseDescription: description,
    workLuck: Math.min(5, luckScore + themeBonus),
    moneyLuck: Math.min(5, luckScore - 1 + (themes.includes("金運") ? 1 : 0)),
    relationLuck: Math.min(5, luckScore + (themes.includes("人間関係") ? 1 : 0)),
    keywords: KEYWORDS[starNum],
    luckyDirection: LUCKY_DIRECTIONS[starNum],
    cautionDirection: CAUTION_DIRECTIONS[starNum],
    nextTurningPoint: calcNextTurningPoint(starNum, currentYear),
    monthsLuck: calcMonthsLuck(starNum),
  };
}
