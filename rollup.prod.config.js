/* eslint-disable sort-keys, import/no-extraneous-dependencies */

import path from 'path';

import babel from '@rollup/plugin-babel';
import del from 'rollup-plugin-delete';
import staticImport from 'rollup-plugin-static-import';
import resolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import svgr from '@svgr/rollup';

const fullSrcPath = path.resolve('src');

const config = {
  input: 'src/index.js',
  output: [
    {
      dir: 'lib/cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'auto',
    },
    {
      dir: 'lib/esm',
      format: 'esm',
      sourcemap: true,
      exports: 'auto',
    },
  ],
  external: id => !id.startsWith('.') && !id.startsWith(fullSrcPath),
  preserveModules: true,
  plugins: [
    staticImport({
      include: [
        'src/**/*.bmp',
        'src/**/*.gif',
        'src/**/*.jpg',
        'src/**/*.jpeg',
        'src/**/*.png',
        'src/**/*.css',
        'src/**/*.scss',
        'src/**/*.sass',
        'src/**/*.less',
        'src/**/*.json',
      ],
    }),
    sourcemaps(),
    resolve({ jail: fullSrcPath }),
    babel({
      include: 'src/**/*.js',
      babelHelpers: 'runtime',
      skipPreflightCheck: true,
      sourceMaps: true,
    }),
    svgr({ include: 'src/**/*.svg' }),
    del({ targets: 'lib/' }),
  ],
};

export default config;
