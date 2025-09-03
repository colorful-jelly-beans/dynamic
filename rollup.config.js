import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';

const isDev = process.env.NODE_ENV === 'development';

export default {
  input: 'main.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'esm',
    sourcemap: true
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    isDev && serve({ contentBase: 'dist', port: 3000, historyApiFallback: true, }),
    isDev && livereload('dist'),
  ]
};
