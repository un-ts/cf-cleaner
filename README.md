# cf-cleaner

[![GitHub Actions](https://github.com/rx-ts/cf-cleaner/workflows/CI/badge.svg)](https://github.com/rx-ts/cf-cleaner/actions/workflows/ci.yml)
[![Codecov](https://img.shields.io/codecov/c/github/rx-ts/cf-cleaner.svg)](https://codecov.io/gh/rx-ts/cf-cleaner)
[![Codacy Grade](https://img.shields.io/codacy/grade/cd5444616bd74d239bead24def4b9e72)](https://www.codacy.com/gh/rx-ts/cf-cleaner)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Frx-ts%2Fcf-cleaner%2Fmain%2Fpackage.json)](https://github.com/plantain-00/type-coverage)
[![npm](https://img.shields.io/npm/v/cf-cleaner.svg)](https://www.npmjs.com/package/cf-cleaner)
[![GitHub Release](https://img.shields.io/github/release/rx-ts/cf-cleaner)](https://github.com/rx-ts/cf-cleaner/releases)

[![David Peer](https://img.shields.io/david/peer/rx-ts/cf-cleaner.svg)](https://david-dm.org/rx-ts/cf-cleaner?type=peer)
[![David](https://img.shields.io/david/rx-ts/cf-cleaner.svg)](https://david-dm.org/rx-ts/cf-cleaner)
[![David Dev](https://img.shields.io/david/dev/rx-ts/cf-cleaner.svg)](https://david-dm.org/rx-ts/cf-cleaner?type=dev)

[![Conventional Commits](https://img.shields.io/badge/conventional%20commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![changesets](https://img.shields.io/badge/maintained%20with-changesets-176de3.svg)](https://github.com/atlassian/changesets)

Transform from confluence flavored HTML to Markdown with enhanced features.

## TOC <!-- omit in toc -->

- [Usage](#usage)
  - [Install](#install)
  - [CLI](#cli)
  - [API](#api)
- [Changelog](#changelog)
- [License](#license)

## Usage

### Install

```sh
# npm
npm i -g cf-cleaner

# pnpm
pnpm i -g cf-cleaner

# yarn
yarn global add cf-cleaner
```

### CLI

```plain
Usage: cfc [options] [input]

Arguments:
  input                   Input HTML codes

Options:
  -V, --version           output the version number
  -i, --input <path>      Input HTML file
  -o, --output <path>     Output HTML file
  -m, --minify [boolean]  Whether to minify HTML output
  -h, --help              display help for command
```

### API

```js
import fs from 'fs'
import { cleaner } from 'cf-cleaner'

// string
const output = cleaner(html, minify, encoding)

// stream
cleaner(fs.createReadStream(htmlFile), minify).pipe(
  fs.createWriteStream(outputFile),
)
```

## Changelog

Detailed changes for each release are documented in [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT][] © [JounQin][]@[1stG.me][]

[1stg.me]: https://www.1stg.me
[jounqin]: https://GitHub.com/JounQin
[mit]: http://opensource.org/licenses/MIT
