const tsFiles = `"src/**/*.ts" "spec/**/*.ts"`

export default {
  build: [
    'rimraf dist/',
    {
      back: [
        'tsc -p src/tsconfig.nodejs.json',
        'api-extractor run --local'
      ],
      front: [
        'tsc -p src/tsconfig.browser.json',
        'rollup --config rollup.config.js'
      ]
    }
  ],
  lint: {
    ts: `eslint --ext .js,.ts,.tsx ${tsFiles}`,
    export: `no-unused-export ${tsFiles}`,
    markdown: `markdownlint README.md`,
    typeCoverage: 'type-coverage -p src/tsconfig.nodejs.json --strict --ignore-catch',
    typeCoverageBrowser: 'type-coverage -p src/tsconfig.browser.json --strict --ignore-catch'
  },
  test: [
    'ava'
  ],
  fix: `eslint --ext .js,.ts,.tsx ${tsFiles} --fix`
}
