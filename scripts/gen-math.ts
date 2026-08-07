import { randInt, randFloat, pick, fractionString, numericDistractors, buildChoices, GeneratedQuestion } from "./gen-utils";

type Gen = () => GeneratedQuestion;

// ---------------------------------------------------------------------------
// ALGEBRA
// ---------------------------------------------------------------------------

const genLinearOneStep: Gen = () => {
  const a = pick([2, 3, 4, 5, 6, 7, 8, 9]);
  const x = randInt(-12, 12);
  const c = a * x;
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(String(x), numericDistractors(x, 3, 4));
  return {
    subject: "MATH",
    mathTopic: "ALGEBRA",
    difficulty: "EASY",
    prompt: `Solve for x: ${a}x = ${c}`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `Divide both sides by ${a}: x = ${c} / ${a} = ${x}.`,
    tags: "linear-equation,one-step",
  };
};

const genLinearTwoStep: Gen = () => {
  const a = pick([2, 3, 4, 5, 6, -2, -3, -4]);
  const x = randInt(-10, 10);
  const b = randInt(-15, 15);
  const c = a * x + b;
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(String(x), numericDistractors(x, 3, 4));
  return {
    subject: "MATH",
    mathTopic: "ALGEBRA",
    difficulty: "MEDIUM",
    prompt: `Solve for x: ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `Subtract ${b} from both sides: ${a}x = ${c - b}. Divide by ${a}: x = ${x}.`,
    tags: "linear-equation,two-step",
  };
};

const genDistributive: Gen = () => {
  const a = randInt(2, 6);
  const b = randInt(1, 9);
  const x = randInt(-8, 8);
  const rhs = a * (x + b);
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(String(x), numericDistractors(x, 3, 4));
  return {
    subject: "MATH",
    mathTopic: "ALGEBRA",
    difficulty: "MEDIUM",
    prompt: `Solve for x: ${a}(x + ${b}) = ${rhs}`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `Distribute: ${a}x + ${a * b} = ${rhs}. Subtract ${a * b}: ${a}x = ${rhs - a * b}. Divide by ${a}: x = ${x}.`,
    tags: "distributive-property",
  };
};

const genSystemsSubstitution: Gen = () => {
  const x = randInt(-6, 6);
  const y = randInt(-6, 6);
  const a1 = randInt(1, 4);
  const b1 = randInt(1, 4);
  const c1 = a1 * x + b1 * y;
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(String(x), numericDistractors(x, 3, 4));
  const b1y = b1 * y;
  return {
    subject: "MATH",
    mathTopic: "ALGEBRA",
    difficulty: "HARD",
    prompt: `If y = ${y} and ${a1}x + ${b1}y = ${c1}, what is the value of x?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `Substitute y = ${y}: ${a1}x ${b1y >= 0 ? "+" : "-"} ${Math.abs(b1y)} = ${c1}, so ${a1}x = ${c1 - b1y}, and x = ${x}.`,
    tags: "systems-of-equations",
  };
};

// ---------------------------------------------------------------------------
// GEOMETRY
// ---------------------------------------------------------------------------

const genRectangleArea: Gen = () => {
  const w = randInt(2, 20);
  const h = randInt(2, 20);
  const area = w * h;
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(String(area), numericDistractors(area, 3, 6));
  return {
    subject: "MATH",
    mathTopic: "GEOMETRY",
    difficulty: "EASY",
    prompt: `A rectangle has a width of ${w} and a height of ${h}. What is its area?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `Area = width × height = ${w} × ${h} = ${area}.`,
    tags: "area,rectangle",
  };
};

const genTriangleArea: Gen = () => {
  const b = randInt(2, 20) * 2;
  const h = randInt(2, 20);
  const area = (b * h) / 2;
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(String(area), numericDistractors(area, 3, 5));
  return {
    subject: "MATH",
    mathTopic: "GEOMETRY",
    difficulty: "EASY",
    prompt: `A triangle has a base of ${b} and a height of ${h}. What is its area?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `Area = (base × height) / 2 = (${b} × ${h}) / 2 = ${area}.`,
    tags: "area,triangle",
  };
};

const genCircleArea: Gen = () => {
  const r = randInt(2, 12);
  const area = `${r * r}π`;
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(area, [
    `${2 * r}π`,
    `${r * r * 2}π`,
    `${(r + 1) * (r + 1)}π`,
  ]);
  return {
    subject: "MATH",
    mathTopic: "GEOMETRY",
    difficulty: "MEDIUM",
    prompt: `A circle has a radius of ${r}. What is its area, in terms of π?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `Area = πr² = π(${r})² = ${r * r}π.`,
    tags: "area,circle",
  };
};

const genPythagorean: Gen = () => {
  const triples = [
    [3, 4, 5],
    [5, 12, 13],
    [6, 8, 10],
    [8, 15, 17],
    [7, 24, 25],
    [9, 12, 15],
    [10, 24, 26],
    [20, 21, 29],
  ];
  const [a, b, c] = pick(triples);
  const scale = randInt(1, 3);
  const legs = [a * scale, b * scale];
  const hyp = c * scale;
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(String(hyp), numericDistractors(hyp, 3, 6));
  return {
    subject: "MATH",
    mathTopic: "GEOMETRY",
    difficulty: "MEDIUM",
    prompt: `A right triangle has legs of length ${legs[0]} and ${legs[1]}. What is the length of the hypotenuse?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `By the Pythagorean theorem, c² = ${legs[0]}² + ${legs[1]}² = ${legs[0] ** 2} + ${legs[1] ** 2} = ${hyp * hyp}, so c = ${hyp}.`,
    tags: "pythagorean-theorem",
  };
};

const genAngleSum: Gen = () => {
  const a1 = randInt(30, 100);
  const a2 = randInt(30, 100);
  const a3 = 180 - a1 - a2;
  if (a3 <= 0) return genAngleSum();
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(String(a3), numericDistractors(a3, 3, 8));
  return {
    subject: "MATH",
    mathTopic: "GEOMETRY",
    difficulty: "EASY",
    prompt: `In a triangle, two of the angles measure ${a1}° and ${a2}°. What is the measure of the third angle?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `The angles of a triangle sum to 180°. 180 − ${a1} − ${a2} = ${a3}°.`,
    tags: "triangle-angles",
  };
};

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

const genLinearFunctionEval: Gen = () => {
  const a = randInt(-6, 6) || 2;
  const b = randInt(-10, 10);
  const x = randInt(-8, 8);
  const result = a * x + b;
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(String(result), numericDistractors(result, 3, 6));
  return {
    subject: "MATH",
    mathTopic: "FUNCTIONS",
    difficulty: "EASY",
    prompt: `If f(x) = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}, what is f(${x})?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `f(${x}) = ${a}(${x}) ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${a * x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${result}.`,
    tags: "function-evaluation,linear",
  };
};

const genQuadraticEval: Gen = () => {
  const a = randInt(1, 4);
  const b = randInt(-5, 5);
  const c = randInt(-10, 10);
  const x = randInt(-5, 5);
  const result = a * x * x + b * x + c;
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(String(result), numericDistractors(result, 3, 8));
  return {
    subject: "MATH",
    mathTopic: "FUNCTIONS",
    difficulty: "MEDIUM",
    prompt: `If f(x) = ${a}x² ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)}, what is f(${x})?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `f(${x}) = ${a}(${x})² ${b >= 0 ? "+" : "-"} ${Math.abs(b)}(${x}) ${c >= 0 ? "+" : "-"} ${Math.abs(c)} = ${result}.`,
    tags: "function-evaluation,quadratic",
  };
};

const genFunctionShift: Gen = () => {
  const a = randInt(2, 5);
  const shift = randInt(1, 6);
  const x = randInt(1, 8);
  const result = a * (x - shift);
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(String(result), numericDistractors(result, 3, 6));
  return {
    subject: "MATH",
    mathTopic: "FUNCTIONS",
    difficulty: "HARD",
    prompt: `If g(x) = ${a}(x − ${shift}), what is g(${x})?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `g(${x}) = ${a}(${x} − ${shift}) = ${a}(${x - shift}) = ${result}.`,
    tags: "function-transformation",
  };
};

// ---------------------------------------------------------------------------
// ADVANCED MATH
// ---------------------------------------------------------------------------

const genExponentRules: Gen = () => {
  const base = pick([2, 3, 4, 5]);
  const e1 = randInt(1, 5);
  const e2 = randInt(1, 5);
  const result = `${base}^${e1 + e2}`;
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(result, [
    `${base}^${e1 * e2}`,
    `${base}^${Math.abs(e1 - e2)}`,
    `${base * 2}^${e1 + e2}`,
  ]);
  return {
    subject: "MATH",
    mathTopic: "ADVANCED_MATH",
    difficulty: "MEDIUM",
    prompt: `Simplify: ${base}^${e1} × ${base}^${e2}`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `When multiplying powers with the same base, add the exponents: ${base}^${e1} × ${base}^${e2} = ${base}^${e1 + e2}.`,
    tags: "exponent-rules",
  };
};

const genFactoring: Gen = () => {
  const p = randInt(-8, 8) || 1;
  const q = randInt(-8, 8) || 2;
  const b = -(p + q); // (x - p)(x - q) = x^2 - (p+q)x + pq
  const c = p * q;
  const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`;
  const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
  const roots = [p, q].sort((x, y) => x - y);
  const rootStr = `x = ${roots[0]} or x = ${roots[1]}`;
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(rootStr, [
    `x = ${roots[0] + 1} or x = ${roots[1]}`,
    `x = ${roots[0]} or x = ${roots[1] + 1}`,
    `x = ${-roots[0]} or x = ${-roots[1]}`,
  ]);
  return {
    subject: "MATH",
    mathTopic: "ADVANCED_MATH",
    difficulty: "HARD",
    prompt: `What are the solutions to x² ${bStr} ${cStr} = 0?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `The expression factors as (x − ${p})(x − ${q}) = 0, so x = ${p} or x = ${q}.`,
    tags: "quadratic-factoring",
  };
};

const genRationalSimplify: Gen = () => {
  const num = randInt(2, 12);
  const den = randInt(2, 12);
  const scale = randInt(2, 6);
  const simplified = fractionString(num, den);
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(simplified, [
    fractionString(num + 1, den),
    fractionString(num, den + 1),
    fractionString(num * scale, den * scale + 1),
  ]);
  return {
    subject: "MATH",
    mathTopic: "ADVANCED_MATH",
    difficulty: "MEDIUM",
    prompt: `Simplify the expression: ${num * scale}/${den * scale}`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `Divide numerator and denominator by their greatest common factor (${scale}): ${num * scale}/${den * scale} = ${simplified}.`,
    tags: "rational-expressions",
  };
};

// ---------------------------------------------------------------------------
// DATA ANALYSIS & STATISTICS
// ---------------------------------------------------------------------------

const genMean: Gen = () => {
  const nums = Array.from({ length: 5 }, () => randInt(1, 50));
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = Math.round((sum / nums.length) * 10) / 10;
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(String(mean), numericDistractors(Math.round(mean), 3, 4));
  return {
    subject: "MATH",
    mathTopic: "DATA_ANALYSIS",
    difficulty: "EASY",
    prompt: `What is the mean of the data set: ${nums.join(", ")}?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `Mean = sum ÷ count = ${sum} ÷ ${nums.length} = ${mean}.`,
    tags: "mean,data-analysis",
  };
};

const genMedian: Gen = () => {
  const nums = Array.from({ length: 5 }, () => randInt(1, 60)).sort((a, b) => a - b);
  const median = nums[2];
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(String(median), numericDistractors(median, 3, 5));
  return {
    subject: "MATH",
    mathTopic: "DATA_ANALYSIS",
    difficulty: "EASY",
    prompt: `What is the median of the data set: ${[...nums].sort(() => Math.random() - 0.5).join(", ")}?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `Sorted, the data set is ${nums.join(", ")}. The median (middle value) is ${median}.`,
    tags: "median,data-analysis",
  };
};

const genPercentChange: Gen = () => {
  const original = randInt(20, 200);
  const pct = pick([10, 15, 20, 25, 30, 40, 50]);
  const increase = Math.random() > 0.5;
  const newValue = increase ? Math.round(original * (1 + pct / 100)) : Math.round(original * (1 - pct / 100));
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(String(newValue), numericDistractors(newValue, 3, Math.max(4, Math.round(original * 0.1))));
  return {
    subject: "MATH",
    mathTopic: "DATA_ANALYSIS",
    difficulty: "MEDIUM",
    prompt: `A value of ${original} is ${increase ? "increased" : "decreased"} by ${pct}%. What is the new value?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `${increase ? "Increase" : "Decrease"}: ${original} × (1 ${increase ? "+" : "−"} ${pct}/100) = ${newValue}.`,
    tags: "percent-change",
  };
};

const genProbability: Gen = () => {
  const total = randInt(10, 30);
  const favorable = randInt(1, total - 1);
  const answer = fractionString(favorable, total);
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(answer, [
    fractionString(favorable + 1, total),
    fractionString(favorable, total + 1),
    fractionString(total - favorable, total),
  ]);
  return {
    subject: "MATH",
    mathTopic: "STATISTICS",
    difficulty: "MEDIUM",
    prompt: `A bag contains ${total} marbles, of which ${favorable} are red. If one marble is drawn at random, what is the probability it is red?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `Probability = favorable outcomes ÷ total outcomes = ${favorable}/${total} = ${answer}.`,
    tags: "probability",
  };
};

const genRange: Gen = () => {
  const nums = Array.from({ length: 6 }, () => randInt(1, 100));
  const range = Math.max(...nums) - Math.min(...nums);
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(String(range), numericDistractors(range, 3, 6));
  return {
    subject: "MATH",
    mathTopic: "STATISTICS",
    difficulty: "EASY",
    prompt: `What is the range of the data set: ${nums.join(", ")}?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `Range = maximum − minimum = ${Math.max(...nums)} − ${Math.min(...nums)} = ${range}.`,
    tags: "range,statistics",
  };
};

// ---------------------------------------------------------------------------
// WORD PROBLEMS
// ---------------------------------------------------------------------------

const genRateTimeDistance: Gen = () => {
  const rate = randInt(20, 80);
  const time = randInt(2, 8);
  const distance = rate * time;
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(String(distance), numericDistractors(distance, 3, 20));
  const name = pick(["Maria", "James", "Priya", "Carlos", "Aisha", "Liam", "Yuki", "Noah"]);
  return {
    subject: "MATH",
    mathTopic: "WORD_PROBLEMS",
    difficulty: "EASY",
    prompt: `${name} drives at a constant speed of ${rate} miles per hour for ${time} hours. How many miles does ${name} travel?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `Distance = rate × time = ${rate} × ${time} = ${distance} miles.`,
    tags: "rate-time-distance",
  };
};

const genUnitPrice: Gen = () => {
  const units = pick([3, 4, 5, 6, 8, 10, 12]);
  const pricePerUnit = randInt(2, 15);
  const total = units * pricePerUnit;
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(`$${total}`, [
    `$${total + units}`,
    `$${total - units}`,
    `$${total + pricePerUnit}`,
  ]);
  const item = pick(["notebooks", "tickets", "sandwiches", "T-shirts", "books", "posters", "plants"]);
  return {
    subject: "MATH",
    mathTopic: "WORD_PROBLEMS",
    difficulty: "EASY",
    prompt: `Each ${item.slice(0, -1)} costs $${pricePerUnit}. What is the total cost of ${units} ${item}?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `Total cost = price per item × number of items = $${pricePerUnit} × ${units} = $${total}.`,
    tags: "unit-rate",
  };
};

const genRatioProportion: Gen = () => {
  const ratioA = randInt(2, 9);
  const ratioB = randInt(2, 9);
  const scale = randInt(2, 8);
  const totalA = ratioA * scale;
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(String(totalA), numericDistractors(totalA, 3, 5));
  return {
    subject: "MATH",
    mathTopic: "WORD_PROBLEMS",
    difficulty: "MEDIUM",
    prompt: `In a class, the ratio of boys to girls is ${ratioA}:${ratioB}. If there are ${ratioB * scale} girls, how many boys are there?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `The scale factor is ${ratioB * scale} ÷ ${ratioB} = ${scale}. Boys = ${ratioA} × ${scale} = ${totalA}.`,
    tags: "ratio,proportion",
  };
};

const genMixtureWordProblem: Gen = () => {
  const groupA = randInt(5, 30);
  const groupB = randInt(5, 30);
  const priceA = randInt(1, 10);
  const priceB = randInt(1, 10);
  const total = groupA * priceA + groupB * priceB;
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(`$${total}`, [
    `$${total + groupA}`,
    `$${total - groupB}`,
    `$${total + priceA + priceB}`,
  ]);
  return {
    subject: "MATH",
    mathTopic: "WORD_PROBLEMS",
    difficulty: "HARD",
    prompt: `A vendor sells ${groupA} apples at $${priceA} each and ${groupB} oranges at $${priceB} each. What is the total revenue from both fruits?`,
    choiceA,
    choiceB,
    choiceC,
    choiceD,
    correct,
    explanation: `Total = (${groupA} × $${priceA}) + (${groupB} × $${priceB}) = $${groupA * priceA} + $${groupB * priceB} = $${total}.`,
    tags: "word-problem,mixture",
  };
};

export const MATH_GENERATORS: Gen[] = [
  genLinearOneStep,
  genLinearTwoStep,
  genDistributive,
  genSystemsSubstitution,
  genRectangleArea,
  genTriangleArea,
  genCircleArea,
  genPythagorean,
  genAngleSum,
  genLinearFunctionEval,
  genQuadraticEval,
  genFunctionShift,
  genExponentRules,
  genFactoring,
  genRationalSimplify,
  genMean,
  genMedian,
  genPercentChange,
  genProbability,
  genRange,
  genRateTimeDistance,
  genUnitPrice,
  genRatioProportion,
  genMixtureWordProblem,
];
