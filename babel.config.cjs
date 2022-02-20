'use strict';

module.exports = function babelConfig(api) {
  const isTest = api.env('test');

  if (!isTest) return {};

  return {
    only: [
      'packages/*/src',
      'packages/*/lib',
      '@todo-example/*/src',
      '@todo-example/*/lib',
    ],
    presets: [
      [require.resolve('pob-babel/preset.cjs')],
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
          development: false,
          useBuiltIns: true,
          useSpread: true,
        },
      ],
    ],
  };
};
