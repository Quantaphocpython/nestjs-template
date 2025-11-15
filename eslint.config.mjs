import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: [
            '**/*.d.ts',
            '**/node_modules/',
            '**/*.js',
            'prisma/generated/**',
            'prisma/generated/prisma/**',
        ],
    },
    ...compat.extends('plugin:@typescript-eslint/recommended', 'prettier'),
    {
        plugins: {
            '@typescript-eslint': typescriptEslint,
        },

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },

            ecmaVersion: 2021,
            sourceType: 'module',
        },

        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/camelcase': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },
];
