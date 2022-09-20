import fs from 'node:fs'
import path from 'node:path'
import { URL } from 'node:url'

import { cleaner } from '../src/index.js'

describe('fixtures', () => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname)

  const fixturesDir = path.join(__dirname, 'fixtures')
  const fixtures = fs.readdirSync(fixturesDir)
  for (const fixture of fixtures) {
    if (fixture.endsWith('.output.html') || fixture.endsWith('.min.html')) {
      continue
    }

    const fixtureFile = path.resolve(fixturesDir, fixture)

    it(`${fixture} should work as expected`, async () => {
      const input = await fs.promises.readFile(fixtureFile, 'utf8')
      const output = await cleaner(input)
      expect(output).toMatchSnapshot()
    })

    it(`${fixture} stream should work as expected`, () => {
      const input = fs.createReadStream(fixtureFile)
      const output = cleaner(input)
      expect(output).toBeTruthy()
      output.pipe(
        fs.createWriteStream(fixtureFile.replace(/\.html$/, '.output.html')),
      )
    })

    it(`${fixture} stream minify should work as expected`, () => {
      const input = fs.createReadStream(fixtureFile)
      const output = cleaner(input, true)
      expect(output).toBeTruthy()
      output.pipe(
        fs.createWriteStream(fixtureFile.replace(/\.html$/, '.min.html')),
      )
    })
  }
})
