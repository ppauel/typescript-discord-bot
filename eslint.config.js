import { FlatCompat } from '@eslint/eslintrc';
import stylistic from '@stylistic/eslint-plugin';
import jsdoc from 'eslint-plugin-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ resolvePluginsRelativeTo: __dirname });

export default [
    ...compat.env({
        'es2021': true,
        'node': true
    }),
    ...compat.extends('plugin:@typescript-eslint/recommended'),
    jsdoc.configs['flat/recommended-typescript'],
    {
        files: [ 'src/**/*.ts', 'src/**/*.js', 'eslint.config.js' ],
        ignores: ['**/dist/*'],
        plugins: { '@stylistic': stylistic },
        rules: {
            '@stylistic/arrow-spacing': [
                'warn',
                { 'before': true, 'after': true }
            ],
            '@stylistic/array-bracket-spacing': [
                'error',
                'always',
                {
                    'arraysInArrays': false,
                    'objectsInArrays': false,
                    'singleValue': false
                }
            ],
            '@stylistic/brace-style': [ 'error', 'stroustrup' ],
            '@stylistic/block-spacing': ['error'],
            '@stylistic/comma-dangle': [ 'error', 'never' ],
            '@stylistic/comma-spacing': 'error',
            '@stylistic/dot-location': [ 'error', 'property' ],
            '@stylistic/indent': [ 'error', 4 ],
            '@stylistic/no-extra-semi': ['error'],
            '@stylistic/space-infix-ops': ['error'],
            '@stylistic/semi': [ 'error', 'always' ],
            '@stylistic/keyword-spacing': 'error',
            '@stylistic/key-spacing': [
                'error',
                {
                    'beforeColon': false,
                    'afterColon': true,
                    'mode': 'strict'
                }
            ],
            '@stylistic/linebreak-style': [
                'error',
                'windows'
            ],
            '@stylistic/max-len': [
                'error',
                {
                    'code': 160,
                    'ignoreStrings': true,
                    'ignoreComments': true,
                    'ignoreTemplateLiterals': true
                }
            ],
            '@stylistic/max-statements-per-line': [
                'error',
                { 'max': 2 }
            ],
            '@stylistic/padding-line-between-statements': [
                'error',
                {
                    'blankLine': 'always',
                    'prev': '*',
                    'next': 'function'
                },
                { 
                    'blankLine': 'always',
                    'prev': '*',
                    'next': 'export' 
                }
            ],
            '@stylistic/object-curly-newline': [
                'error',
                {
                    'ObjectExpression': { 'multiline': true, 'minProperties': 3 },
                    'ObjectPattern': { 'multiline': true, 'minProperties': 3 },
                    'ImportDeclaration': { 'multiline': true, 'minProperties': 3 },
                    'ExportDeclaration': { 'multiline': true }
                }
            ],
            '@stylistic/object-curly-spacing': [ 'error', 'always' ],
            '@stylistic/space-before-blocks': 'error',
            '@stylistic/space-before-function-paren': [
                'error',
                {
                    'anonymous': 'never',
                    'named': 'never',
                    'asyncArrow': 'always'
                }
            ],
            '@stylistic/spaced-comment': 'error',
            '@stylistic/space-in-parens': 'error',
            '@stylistic/space-infix-ops': 'error',
            '@stylistic/space-unary-ops': 'error',
            '@stylistic/switch-colon-spacing': [
                'error',
                { 'after': true, 'before': false }
            ],
            '@stylistic/quotes': [ 
                'error',
                'single',
                { 'allowTemplateLiterals': true }
            ],
            'curly': [ 'error', 'multi-line', 'consistent' ],
            'class-methods-use-this': 0,
            'handle-callback-err': 'off',
            'max-classes-per-file': 'off',
            'max-nested-callbacks': [
                'error',
                { 'max': 4 }
            ],
            'no-await-in-loop': 'off',
            'no-bitwise': 'off',
            'no-console': 'off',
            'no-continue': 'off',
            'no-tabs': 'off',
            'no-param-reassign': 0,
            'no-plusplus': 0,
            'no-prototype-builtins': 'off',
            'no-underscore-dangle': 'off',
            'no-multi-assign': 'off',
            'no-extend-native': 'off',
            'no-restricted-syntax': 'off',
            'no-unused-vars': 'off',
            'no-nested-ternary': 'off',
            'no-promise-executor-return': 'off',
            'prefer-const': 'error',
            'yoda': 'error'
        }
    }
];
