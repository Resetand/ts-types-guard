import { defineConfig } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("eslint:recommended", "prettier"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        parser: tsParser,
    },

    rules: {
        "no-console": ["error", {
            allow: ["warn", "error"],
        }],

        "testing-library/no-container": "off",
        "testing-library/no-node-access": "off",
        "no-unused-vars": "off",
        "no-unused-expressions": "off",
        "no-redeclare": "off",
        "no-undef": "off",
    },
}, {
    files: ["**/*.test.ts"],

    languageOptions: {
        globals: {
            ...globals.jest,
        },
    },
}]);