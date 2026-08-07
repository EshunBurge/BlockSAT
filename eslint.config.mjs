import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated Prisma client (vendored, not hand-written app code):
    "lib/generated/**",
    // One-off data-generation / verification scripts, run via tsx outside
    // the Next.js build — not part of the shipped app:
    "scripts/**",
    "prisma/seed.ts",
  ]),
]);

export default eslintConfig;
