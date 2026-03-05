import js from "@eslint/js";
import nextConfig from "eslint-config-next";
import prettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

const config = [
  // Global ignore patterns
  {
    ignores: ["out/", ".next/", "content/", "node_modules/", "public/"],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended (no type-aware)
  ...tseslint.configs.recommended,

  // Next.js / React / React Hooks / JSX a11y (includes import plugin)
  ...nextConfig,

  // Prettier (must be last — disables conflicting style rules)
  prettier,

  // Project-wide settings (no import plugin rules here)
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Import ordering — scoped to files where the import plugin is registered
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/no-unresolved": "off", // TypeScript handles this
    },
  },
];

export default config;
