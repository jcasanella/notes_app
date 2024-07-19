import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import nodePlugin from 'eslint-plugin-node';
import hbsPlugin from 'eslint-plugin-hbs';

const config = [
    // Ignoring files and directories
    {
        ignores: ['node_modules/', 'dist/', 'coverage/', '*.config.mjs'],
    },
    // Configuration for general JavaScript and TypeScript files
    {
        files: ['*.mjs', '*.js', '*.jsx', '*.ts', '*.tsx'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            globals: {
                __dirname: 'readonly',
                require: 'readonly',
                module: 'readonly',
                process: 'readonly',
                console: 'readonly',
                exports: 'readonly',
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            prettier: prettierPlugin,
            node: nodePlugin,
            hbs: hbsPlugin,
        },
        rules: {
            'no-unused-vars': ['error', { args: 'none', vars: 'all', varsIgnorePattern: '^_' }],
            'prettier/prettier': ['error', { endOfLine: 'auto' }],
            ...prettierConfig.rules,
        },
    },
    // Configuration for Handlebars files
    {
        files: ['*.hbs'],
        processor: 'hbs/processor',
    },
];

export default config;
