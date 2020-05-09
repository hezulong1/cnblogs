import buble from '@rollup/plugin-buble';
 
export default {
  input: 'test.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [buble()]
};