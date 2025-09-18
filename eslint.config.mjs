// @ts-check
import next from 'eslint-config-next';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...next(),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'src/generated/**',
      '**/generated/**',
      '**/runtime/**'
    ],
  },
];
