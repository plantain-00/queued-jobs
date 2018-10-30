import { uglify } from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'dist/browser/browser.js',
  name: 'QueuedJobs',
  plugins: [resolve({ browser: true }), uglify()],
  output: {
    file: 'dist/queued-jobs.min.js',
    format: 'umd'
  }
}
