import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "shared",
          include: ["packages/shared/src/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "api",
          include: ["apps/api/src/**/*.test.ts"],
          setupFiles: ["apps/api/src/test/setup-env.ts"],
          globalSetup: ["apps/api/src/test/global-setup.ts"],
        },
      },
    ],
  },
});
