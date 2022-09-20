#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { URL } from 'node:url'

import { program } from 'commander'

import { cleaner } from './index.js'

export interface CfCleanerOptions {
  input?: string
  output?: string
  minify?: boolean
}

const __dirname = new URL('.', import.meta.url).pathname

const { input, output, minify } = program
  .version(
    (
      JSON.parse(
        fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'),
      ) as {
        version: string
      }
    ).version,
  )
  .argument('[input]', 'Input HTML codes')
  .option('-i, --input <path>', 'Input HTML file')
  .option('-o, --output <path>', 'Output HTML file')
  .option('-m, --minify [boolean]', 'Whether to minify HTML output')
  .parse(process.argv)
  .opts<CfCleanerOptions>()

let inputStream = input
  ? fs.createReadStream(input)
  : program.args.length > 0
  ? Readable.from(program.args)
  : null

if (process.stdin.isTTY || process.env.STDIN === '0') {
  if (!inputStream) {
    console.error('No input file or argument')
    program.help()
  }
} else if (!inputStream) {
  inputStream = process.stdin
}

cleaner(inputStream, minify).pipe(
  output ? fs.createWriteStream(output) : process.stdout,
)
