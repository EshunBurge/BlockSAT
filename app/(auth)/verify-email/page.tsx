"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useVerifyEmail } from "@/hooks/useAuth";
import { CheckCircle2, MailCheck, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center text-white/60">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const sent = searchParams.get("sent");
  const verify = useVerifyEmail();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (token) {
      verify.mutate(
        { token },
        {
          onSuccess: () => setStatus("success"),
          onError: () => setStatus("error"),
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token && sent) {
    return (
      <div className="text-center">
        <MailCheck className="mx-auto mb-4 h-12 w-12 text-orange-300" />
        <h1 className="mb-2 text-2xl font-bold">Verify your email</h1>
        <p className="text-sm text-white/70">
          We&apos;ve sent a verification link to your email address. Click it to activate your account, then come
          back and log in.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-400" />
        <h1 className="mb-2 text-2xl font-bold">Email verified!</h1>
        <p className="mb-6 text-sm text-white/70">Your account is ready. Let&apos;s set up your practice preferences.</p>
        <Button render={<Link href="/onboarding" />} className="w-full bg-gradient-to-r from-orange-400 to-red-500 btn-glow hover:opacity-90">
          Continue
        </Button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center">
        <XCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
        <h1 className="mb-2 text-2xl font-bold">Verification failed</h1>
        <p className="mb-6 text-sm text-white/70">This link is invalid or has expired. Try signing up again.</p>
        <Button render={<Link href="/signup" />} variant="outline" className="w-full border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white">
          Back to sign up
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center text-white/70">
      <p>Verifying your email...</p>
    </div>
  );
}
