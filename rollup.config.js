import { uglify } from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'dist/browser/browser.js',
  plugins: [resolve({ browser: true }), uglify()],
  output: {
    name: 'QueuedJobs',
    file: 'dist/queued-jobs.min.js',
    format: 'umd'
  }
}
