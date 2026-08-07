import Link from "next/link";
import { LogoWordmark } from "@/components/shared/Logo";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="border-b px-6 py-4">
        <Link href="/">
          <LogoWordmark className="text-xl text-foreground" />
        </Link>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">{children}</main>
    </div>
  );
}
