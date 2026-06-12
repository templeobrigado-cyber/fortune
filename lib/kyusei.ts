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
  // 本命星
  star: KyuseiStar;
  starNumber: number;
  // 月命星
  getsumeiStar: KyuseiStar;
  getsumeiStarNumber: number;
  // 日命星
  nisshomeiStar: KyuseiStar;
  nisshomeiStarNumber: number;
  // 傾斜宮
  keishakyu: string;
  // 運気
  luckScore: number;
  turningPointScore: number;
  currentPhase: string;
  phaseDescription: string;
  workLuck: number;
  moneyLuck: number;
  relationLuck: number;
  // キーワード・方位
  keywords: string[];
  luckyDirection: Direction;
  cautionDirection: Direction;
  nextTurningPoint: string;
  monthsLuck: { month: string; score: number }[];
  // 各星の説明
  honmeiDescription: string;
  getsumeiDescription: string;
  nisshomeiDescription: string;
  keishakyuDescription: string;
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

// 1-9 の範囲に正規化
function mod9(n: number): number {
  return ((n - 1) % 9 + 9) % 9 + 1;
}

// ─── 節入り ────────────────────────────────────────────────
// 月ごとの節入り概算日 [月(1-12), 日] × 12ヶ月（寅月=1〜丑月=12）
const SETSU: [number, number][] = [
  [2, 4],  // 寅月(月1)
  [3, 6],  // 卯月(月2)
  [4, 5],  // 辰月(月3)
  [5, 6],  // 巳月(月4)
  [6, 6],  // 午月(月5)
  [7, 7],  // 未月(月6)
  [8, 7],  // 申月(月7)
  [9, 8],  // 酉月(月8)
  [10, 8], // 戌月(月9)
  [11, 7], // 亥月(月10)
  [12, 7], // 子月(月11)
  [1, 6],  // 丑月(月12) ← 翌年1月
];

// 節入り基準の月番号(1〜12)を返す
function getKyuseiMonth(date: Date): number {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  // 丑月(月12)：1月6日〜2月3日
  if (m === 1) return d >= 6 ? 12 : 11;
  // 月12以外：節入り日以降が当月、未満が前月
  for (let i = 0; i < 12; i++) {
    const [sm, sd] = SETSU[i];
    const [nm, nd] = SETSU[(i + 1) % 12];
    if (m === sm && d >= sd) return i + 1;
    if (i === 11) break;
    if (m === nm && d < nd) return i + 1;
  }
  return 1;
}

// 節分基準の年（2月4日より前は前年扱い）
function getKyuseiYear(date: Date): number {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const y = date.getFullYear();
  if (m === 1 || (m === 2 && d <= 3)) return y - 1;
  return y;
}

// ─── 共通: 桁の和 ────────────────────────────────────────
function digitSum(n: number): number {
  while (n >= 10) {
    n = String(n)
      .split("")
      .reduce((a, b) => a + parseInt(b), 0);
  }
  return n;
}

// ─── 本命星 ──────────────────────────────────────────────
export function calcHonmeiStar(birthDate: Date): {
  star: KyuseiStar;
  number: number;
} {
  const year = getKyuseiYear(birthDate);
  const s = digitSum(year);
  const starNum = mod9(11 - s);
  return { star: STARS[starNum - 1], number: starNum };
}

// ─── 月命星 ──────────────────────────────────────────────
// 本命星グループごとの寅月(月1)の月命星
const GETSUMEI_BASE: Record<number, number> = {
  1: 8, // グループA (1,4,7) → 寅月=八白
  2: 5, // グループB (2,5,8) → 寅月=五黄
  0: 2, // グループC (3,6,9) → 寅月=二黒
};

export function calcGetsumeiStar(
  birthDate: Date,
  honmeiNum: number
): { star: KyuseiStar; number: number } {
  const monthNum = getKyuseiMonth(birthDate); // 1〜12
  const group = honmeiNum % 3; // 1→1, 4→1, 7→1 / 2→2, 5→2, 8→2 / 3→0, 6→0, 9→0
  const base = GETSUMEI_BASE[group];
  const starNum = mod9(base - (monthNum - 1));
  return { star: STARS[starNum - 1], number: starNum };
}

// ─── 日命星 ──────────────────────────────────────────────
// ユリウス通日(JDN)を計算
function calcJDN(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const a = Math.floor((14 - m) / 12);
  const year = y + 4800 - a;
  const month = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * month + 2) / 5) +
    365 * year +
    Math.floor(year / 4) -
    Math.floor(year / 100) +
    Math.floor(year / 400) -
    32045
  );
}

// 日命星: (-JDN) mod 9 で算出（基準: 1981/5/22=四緑木星(4) で検証済み）
export function calcNisshomeiStar(birthDate: Date): {
  star: KyuseiStar;
  number: number;
} {
  const jdn = calcJDN(birthDate);
  const starNum = mod9((-jdn % 9) + 9 + 1);
  // mod9の引数: (-jdn%9+9) は 0-8 → +1して1-9にするとずれるので再計算
  const raw = ((-jdn % 9) + 9) % 9; // 0-8
  const num = raw === 0 ? 9 : raw;
  return { star: STARS[num - 1], number: num };
}

// ─── 傾斜宮 ──────────────────────────────────────────────
// 月命星が中宮に来たとき、本命星が落ちる宮を求める
// 後天定位: 1=坎, 2=坤, 3=震, 4=巽, 5=中, 6=乾, 7=兌, 8=艮, 9=離
const PALACE_NAMES: Record<number, string> = {
  1: "坎宮", 2: "坤宮", 3: "震宮", 4: "巽宮", 5: "中宮",
  6: "乾宮", 7: "兌宮", 8: "艮宮", 9: "離宮",
};

export function calcKeishakyu(
  honmeiNum: number,
  getsumeiNum: number
): string {
  // 月命星が中宮のとき、各宮のstarはoriginal+(getsumei-5)
  // 本命星がどの宮に来るか: original = honmei-(getsumei-5) = honmei-getsumei+5
  const defStar = mod9(honmeiNum - getsumeiNum + 5);
  return PALACE_NAMES[defStar] + "傾斜";
}

// ─── 年盤 / 運気 ─────────────────────────────────────────
function getYearStar(year: number): number {
  const s = digitSum(year);
  return mod9(11 - s);
}

function calcYearLuck(starNum: number, currentYear: number): number {
  const yearStar = getYearStar(currentYear);
  const compatibility: Record<number, number[]> = {
    1: [6, 7], 2: [8, 5], 3: [4, 9], 4: [3, 9],
    5: [2, 8], 6: [1, 7], 7: [6, 1], 8: [2, 5], 9: [3, 4],
  };
  if (compatibility[yearStar]?.includes(starNum)) return 5;
  if (Math.abs(starNum - yearStar) === 4) return 2;
  return 3;
}

// ─── 方位 ────────────────────────────────────────────────
const LUCKY_DIRECTIONS: Record<number, Direction> = {
  1: "南東", 2: "南",  3: "東",  4: "北",
  5: "南西", 6: "西",  7: "北西", 8: "北東", 9: "北",
};

const CAUTION_DIRECTIONS: Record<number, Direction> = {
  1: "南西", 2: "東",  3: "西",  4: "南西",
  5: "北東", 6: "南東", 7: "東", 8: "南", 9: "南西",
};

// ─── テキスト ─────────────────────────────────────────────
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
  1: ["内省", "学び", "準備"],   2: ["誠実", "協調", "基盤"],
  3: ["挑戦", "直感", "行動"],   4: ["縁", "コミュニケーション", "拡大"],
  5: ["変革", "決断", "転機"],   6: ["責任", "信頼", "実績"],
  7: ["喜び", "交流", "表現"],   8: ["変化", "達成", "新境地"],
  9: ["輝き", "認知", "完成"],
};

// 本命星ごとの「気質・個性」説明
const HONMEI_DESC: Record<number, string> = {
  1: "柔軟で愛情深く、誰に対しても偏見なく接することができます。水の如く環境に馴染む適応力と、深い洞察力を持っています。",
  2: "誠実で忍耐強く、縁の下の力持ち。人を支えることに喜びを感じ、着実に信頼を積み重ねる力を持っています。",
  3: "行動力とチャレンジ精神に溢れ、新しいことへの好奇心が旺盛。直感が鋭く、時代の流れをいち早く掴みます。",
  4: "コミュニケーション能力が高く、人と人をつなぐ橋渡し役。穏やかな風のように周囲に良い影響を与えます。",
  5: "強力なカリスマ性と変革の力を持つ中心的存在。物事の核心を見抜く力があり、大きな転換をもたらします。",
  6: "高い志と責任感を持ち、リーダーとして道を切り拓きます。正義感が強く、品格ある行動で周囲を導きます。",
  7: "喜びを生み出す才能と、人を魅了する表現力を持ちます。豊かな感性と社交性で、場を明るく彩ります。",
  8: "変化と革新の力を秘め、山のように揺るぎない意志を持ちます。蓄積した力を一気に開花させる潜在能力があります。",
  9: "鋭い直感と明るいエネルギーで周囲を照らします。表現力と認知される力に長け、才能が自然と輝きます。",
};

// 月命星ごとの「隠れた才能」説明
const GETSUMEI_DESC: Record<number, string> = {
  1: "深い洞察力と感受性を内に秘めています。水面下で情報を収集・分析し、重要な局面で本質を見抜く力が発揮されます。",
  2: "誰かを支え、育てる才能が内在しています。縁の下から場を整えることで、大きな成果を引き出せる力があります。",
  3: "素早い判断力と行動力が才能の核心です。チャンスをいち早く掴み、変化を味方につける直感的な力があります。",
  4: "人脈を広げ、縁をつなぐ才能があります。橋渡し役として力を発揮し、情報や人を巧みにコーディネートできます。",
  5: "圧倒的な存在感と変革力が秘められています。物事の核心に触れる力があり、人の上に立ち導くリーダーシップがあります。",
  6: "高い判断力と決断力を内に秘めています。長期的な視野と正義感を持ち、組織や人を牽引する才能があります。",
  7: "人を喜ばせ、場を和ませる天性の才能があります。豊かな表現力とユーモアセンスで周囲を引きつけます。",
  8: "粘り強さと蓄積する力が才能の源泉です。コツコツと力を蓄え、大きな変革を起こすエネルギーを持っています。",
  9: "輝かしい表現力と先見性が内在しています。注目を集め、ビジョンを示すことで周囲を動かす力があります。",
};

// 日命星ごとの「仕事運・天職」説明
const NISSHOMEI_DESC: Record<number, string> = {
  1: "人の話を聞き、感じ取る力が仕事運の鍵です。カウンセラー、コンサルタント、クリエイティブな仕事で才能が開花します。",
  2: "サポート・育成・調整の仕事で力を発揮します。教育、人事、チームを支えるポジションに強い適性があります。",
  3: "スピードと革新が求められる仕事が天職です。企画、営業、起業、ITなど変化の激しい分野で輝きます。",
  4: "コミュニケーションと調整が必要な仕事に適しています。PR、コーディネーター、外交的な役割で才能が活きます。",
  5: "リーダーシップと決断力が求められる仕事が天職です。経営者、プロデューサー、変革を担うポジションに向いています。",
  6: "高い専門性と責任が必要な仕事で力を発揮します。士業、管理職、プロフェッショナルとして信頼を築きます。",
  7: "人を喜ばせる仕事が天職です。接客、エンタメ、マーケティング、美容など感性を活かす仕事で輝きます。",
  8: "変革と刷新を担う仕事に強い適性があります。新規事業、組織改革、スタートアップなどで才能が開花します。",
  9: "表現力を活かした仕事が天職です。デザイン、メディア、教育、ブランディングなど「伝える」仕事で輝きます。",
};

// 傾斜宮ごとの「魅力・恋愛力」説明
const KEISHAKYU_DESC: Record<string, string> = {
  "坎宮傾斜": "異性としての色気が抜群です。黙っていても異性を引き寄せる神秘的な魅力を持ち、深い愛情で相手を包みます。",
  "坤宮傾斜": "母のような温かさと包容力が魅力です。相手を受け入れ支える愛情深さで、自然と信頼関係を築きます。",
  "震宮傾斜": "行動力と情熱的な愛情表現が魅力です。積極的にアプローチし、新鮮なときめきを生み出す力があります。",
  "巽宮傾斜": "爽やかさと聡明さが魅力です。コミュニケーション上手で、相手の心を自然と開かせる優しさがあります。",
  "中宮傾斜": "強い存在感とカリスマ性が魅力です。唯一無二のオーラで相手を惹きつけ、深い縁を引き寄せます。",
  "乾宮傾斜": "品格と頼もしさが魅力です。リーダーシップと誠実さで相手に安心感を与え、長く愛される存在です。",
  "兌宮傾斜": "明るさと愛嬌が溢れる魅力があります。笑顔と楽しい雰囲気で場を和ませ、自然と周囲を惹きつけます。",
  "艮宮傾斜": "誠実で粘り強い愛情表現が魅力です。一途に想い続ける力と、じっくり関係を深める安心感があります。",
  "離宮傾斜": "華やかさと知性が輝く魅力があります。情熱的でインスピレーション豊かな愛情で相手を魅了します。",
};

function calcTurningPointScore(
  starNum: number,
  birthDate: Date,
  currentYear: number
): number {
  const age = currentYear - birthDate.getFullYear();
  const cyclePos = age % 9;
  const base = [55, 60, 75, 80, 70, 65, 72, 82, 68];
  return base[(starNum + cyclePos - 1) % 9];
}

function calcNextTurningPoint(currentYear: number): string {
  const offset = (5 - getYearStar(currentYear) + 9) % 9;
  const nextYear = currentYear + (offset === 0 ? 9 : offset);
  return `${nextYear}年〜${nextYear + 1}年`;
}

function calcMonthsLuck(starNum: number): { month: string; score: number }[] {
  const baseScores = [3, 3, 4, 4, 5, 5, 4, 3, 3, 4, 5, 4];
  const offset = (starNum - 1) % 4;
  const monthNames = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  return Array.from({ length: 6 }, (_, i) => {
    const idx = (new Date().getMonth() + i) % 12;
    const score = Math.min(5, baseScores[(idx + offset) % 12] + (i === 2 || i === 4 ? 1 : 0));
    return { month: monthNames[idx], score };
  });
}

// ─── メイン診断関数 ───────────────────────────────────────
export function diagnose(
  birthDate: Date,
  gender: string,
  prefecture: string,
  themes: string[]
): DiagnosisResult {
  const currentYear = new Date().getFullYear();

  // 本命星
  const { star, number: starNum } = calcHonmeiStar(birthDate);
  // 月命星
  const { star: gStar, number: gNum } = calcGetsumeiStar(birthDate, starNum);
  // 日命星
  const { star: nStar, number: nNum } = calcNisshomeiStar(birthDate);
  // 傾斜宮
  const keishakyu = calcKeishakyu(starNum, gNum);

  const luckScore = calcYearLuck(starNum, currentYear);
  const turningPointScore = calcTurningPointScore(starNum, birthDate, currentYear);
  const { phase, description } = PHASES[starNum];
  const themeBonus = themes.includes("経営") || themes.includes("独立") ? 1 : 0;

  return {
    star,
    starNumber: starNum,
    getsumeiStar: gStar,
    getsumeiStarNumber: gNum,
    nisshomeiStar: nStar,
    nisshomeiStarNumber: nNum,
    keishakyu,
    luckScore,
    turningPointScore,
    currentPhase: phase,
    phaseDescription: description,
    workLuck: Math.min(5, luckScore + themeBonus),
    moneyLuck: Math.min(5, luckScore - 1 + (themes.includes("金運") ? 1 : 0)),
    relationLuck: Math.min(5, luckScore + (themes.includes("人間関係") ? 1 : 0)),
    keywords: KEYWORDS[starNum],
    luckyDirection: LUCKY_DIRECTIONS[starNum],
    cautionDirection: CAUTION_DIRECTIONS[starNum],
    nextTurningPoint: calcNextTurningPoint(currentYear),
    monthsLuck: calcMonthsLuck(starNum),
    honmeiDescription: HONMEI_DESC[starNum],
    getsumeiDescription: GETSUMEI_DESC[gNum],
    nisshomeiDescription: NISSHOMEI_DESC[nNum],
    keishakyuDescription: KEISHAKYU_DESC[keishakyu] ?? "",
  };
}
