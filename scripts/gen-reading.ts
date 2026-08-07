import { READING_PASSAGES, ReadingPassage } from "./reading-passages";
import { shuffle, buildChoices, GeneratedQuestion } from "./gen-utils";

const MAIN_IDEA_STEMS = [
  "Which choice best states the main idea of the passage?",
  "What is the central idea of the passage?",
  "Which statement best summarizes the passage as a whole?",
  "Which choice best captures the passage's overall main point?",
];

const PURPOSE_STEMS = [
  "What is the author's main purpose in the passage?",
  "Why did the author most likely write this passage?",
  "Which choice best describes the author's purpose?",
  "What is the primary purpose of the passage?",
];

const VOCAB_STEMS = (word: string) => [
  `As used in the passage, what does the word "${word}" most nearly mean?`,
  `In the context of the passage, the word "${word}" most nearly means`,
  `Which of the following is closest in meaning to the word "${word}" as it is used in the passage?`,
  `The word "${word}" as used in the passage most nearly means`,
];

const EVIDENCE_STEMS = (claim: string) => [
  `Which quotation from the passage best supports the idea ${claim}?`,
  `Which detail from the passage provides the strongest evidence ${claim}?`,
  `The passage most strongly supports the idea ${claim} through which quotation?`,
  `Which line from the passage best serves as evidence ${claim}?`,
];

function difficultyForTopic(topic: string): "EASY" | "MEDIUM" | "HARD" {
  if (topic === "MAIN_IDEA" || topic === "AUTHORS_PURPOSE") return "EASY";
  if (topic === "VOCABULARY") return "MEDIUM";
  return "HARD"; // INFERENCE, EVIDENCE, COMMAND_OF_EVIDENCE
}

function mainIdeaQuestions(p: ReadingPassage): GeneratedQuestion[] {
  return MAIN_IDEA_STEMS.map((stem) => {
    const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(p.mainIdea.correct, p.mainIdea.wrong);
    return {
      subject: "READING" as const,
      readingTopic: "MAIN_IDEA",
      difficulty: difficultyForTopic("MAIN_IDEA"),
      prompt: stem,
      passage: p.text,
      choiceA,
      choiceB,
      choiceC,
      choiceD,
      correct,
      explanation: `The passage centers on the idea that ${p.mainIdea.correct.toLowerCase()} The other options either misstate a detail or contradict the passage.`,
      tags: `${p.genre},main-idea`,
    };
  });
}

function purposeQuestions(p: ReadingPassage): GeneratedQuestion[] {
  return PURPOSE_STEMS.map((stem) => {
    const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(p.purpose.correct, p.purpose.wrong);
    return {
      subject: "READING" as const,
      readingTopic: "AUTHORS_PURPOSE",
      difficulty: difficultyForTopic("AUTHORS_PURPOSE"),
      prompt: stem,
      passage: p.text,
      choiceA,
      choiceB,
      choiceC,
      choiceD,
      correct,
      explanation: `The passage's content and tone indicate the author's purpose was ${p.purpose.correct}.`,
      tags: `${p.genre},authors-purpose`,
    };
  });
}

function vocabQuestions(p: ReadingPassage): GeneratedQuestion[] {
  return VOCAB_STEMS(p.vocab.word).map((stem) => {
    const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(p.vocab.correctMeaning, p.vocab.wrongMeanings);
    return {
      subject: "READING" as const,
      readingTopic: "VOCABULARY",
      difficulty: difficultyForTopic("VOCABULARY"),
      prompt: stem,
      passage: p.text,
      choiceA,
      choiceB,
      choiceC,
      choiceD,
      correct,
      explanation: `In this context, "${p.vocab.word}" means "${p.vocab.correctMeaning}."`,
      tags: `${p.genre},vocabulary`,
    };
  });
}

function inferenceQuestions(p: ReadingPassage): GeneratedQuestion[] {
  const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(p.inference.correct, p.inference.wrong);
  return [
    {
      subject: "READING" as const,
      readingTopic: "INFERENCE",
      difficulty: difficultyForTopic("INFERENCE"),
      prompt: p.inference.question,
      passage: p.text,
      choiceA,
      choiceB,
      choiceC,
      choiceD,
      correct,
      explanation: `The passage implies that ${p.inference.correct.toLowerCase()}`,
      tags: `${p.genre},inference`,
    },
  ];
}

function evidenceQuestions(p: ReadingPassage): GeneratedQuestion[] {
  const stems = EVIDENCE_STEMS(p.evidence.claim);
  const results: GeneratedQuestion[] = [];
  stems.forEach((stem, i) => {
    const topic = i % 2 === 0 ? "EVIDENCE" : "COMMAND_OF_EVIDENCE";
    const { choiceA, choiceB, choiceC, choiceD, correct } = buildChoices(p.evidence.correctQuote, p.evidence.wrongQuotes);
    results.push({
      subject: "READING" as const,
      readingTopic: topic,
      difficulty: difficultyForTopic(topic),
      prompt: stem,
      passage: p.text,
      choiceA,
      choiceB,
      choiceC,
      choiceD,
      correct,
      explanation: `The quotation "${p.evidence.correctQuote}" most directly supports ${p.evidence.claim}.`,
      tags: `${p.genre},evidence`,
    });
  });
  return results;
}

export function generateReadingQuestions(): GeneratedQuestion[] {
  const all: GeneratedQuestion[] = [];
  for (const p of READING_PASSAGES) {
    all.push(...mainIdeaQuestions(p));
    all.push(...purposeQuestions(p));
    all.push(...vocabQuestions(p));
    all.push(...inferenceQuestions(p));
    all.push(...evidenceQuestions(p));
  }
  return shuffle(all);
}
