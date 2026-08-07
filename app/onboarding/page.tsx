"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogoWordmark } from "@/components/shared/Logo";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { PracticeFocus, Difficulty } from "@/types";
import { BookOpen, Sigma, Layers, Feather, Flame, Skull, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const FOCUS_OPTIONS: { value: PracticeFocus; label: string; description: string; icon: LucideIcon }[] = [
  { value: "READING", label: "Reading", description: "Main idea, inference, evidence, vocabulary, and more.", icon: BookOpen },
  { value: "MATH", label: "Math", description: "Algebra, geometry, functions, data analysis, and more.", icon: Sigma },
  { value: "BOTH", label: "Both", description: "A balanced mix of Reading and Math questions.", icon: Layers },
];

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; description: string; icon: LucideIcon }[] = [
  { value: "EASY", label: "Easy", description: "Foundational questions to build confidence and core skills.", icon: Feather },
  { value: "MEDIUM", label: "Medium", description: "Test-like difficulty for steady, balanced practice.", icon: Flame },
  { value: "HARD", label: "Hard", description: "Challenging questions to sharpen your top-end score.", icon: Skull },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [step, setStep] = useState(1);
  const [focus, setFocus] = useState<PracticeFocus | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  useEffect(() => {
    if (!isLoading && !profile) router.replace("/login");
    if (!isLoading && profile?.onboardingDone) router.replace("/dashboard");
  }, [isLoading, profile, router]);

  const finish = async () => {
    if (!focus || !difficulty) return;
    await updateProfile.mutateAsync({ practiceFocus: focus, difficulty, onboardingDone: true });
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-blocksat-hero px-4 py-12 text-white">
      <div className="mb-8"><LogoWordmark className="text-2xl" /></div>
      <div className="w-full max-w-xl glass-card rounded-2xl p-8">
        <div className="mb-6 flex items-center gap-2">
          <div className={cn("h-1.5 flex-1 rounded-full", step >= 1 ? "bg-orange-400" : "bg-white/20")} />
          <div className={cn("h-1.5 flex-1 rounded-full", step >= 2 ? "bg-orange-400" : "bg-white/20")} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="mb-1 text-2xl font-bold">What would you like to practice?</h1>
              <p className="mb-6 text-sm text-white/70">You can change this anytime in Settings.</p>
              <div className="flex flex-col gap-3">
                {FOCUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFocus(opt.value)}
                    className={cn(
                      "flex items-center gap-4 rounded-xl border p-4 text-left transition",
                      focus === opt.value ? "border-orange-400 bg-orange-400/10" : "border-white/15 hover:border-white/30"
                    )}
                  >
                    <opt.icon className="h-6 w-6 shrink-0 text-orange-300" />
                    <div>
                      <p className="font-semibold">{opt.label}</p>
                      <p className="text-sm text-white/70">{opt.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <Button
                disabled={!focus}
                onClick={() => setStep(2)}
                className="mt-6 w-full bg-gradient-to-r from-orange-400 to-red-500 btn-glow hover:opacity-90"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="mb-1 text-2xl font-bold">Choose your difficulty</h1>
              <p className="mb-6 text-sm text-white/70">You can change this anytime in Settings.</p>
              <div className="flex flex-col gap-3">
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDifficulty(opt.value)}
                    className={cn(
                      "flex items-center gap-4 rounded-xl border p-4 text-left transition",
                      difficulty === opt.value ? "border-orange-400 bg-orange-400/10" : "border-white/15 hover:border-white/30"
                    )}
                  >
                    <opt.icon className="h-6 w-6 shrink-0 text-orange-300" />
                    <div>
                      <p className="font-semibold">{opt.label}</p>
                      <p className="text-sm text-white/70">{opt.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white">
                  Back
                </Button>
                <Button
                  disabled={!difficulty || updateProfile.isPending}
                  onClick={finish}
                  className="flex-1 bg-gradient-to-r from-orange-400 to-red-500 btn-glow hover:opacity-90"
                >
                  {updateProfile.isPending ? "Saving..." : "Start playing"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
