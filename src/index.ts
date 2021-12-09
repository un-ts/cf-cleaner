import rehypeFormat from 'rehype-format'
import rehypeParse from 'rehype-parse'
import rehypePresetMinify from 'rehype-preset-minify'
import rehypeStringify from 'rehype-stringify'
import { unified } from 'unified'
import type { MinimalDuplex } from 'unified-stream'
import { stream } from 'unified-stream'

import { rehypeConfluence } from './rehype-confluence.js'

const getProcessor = (minify?: boolean | undefined) => {
  let processor = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeConfluence)

  processor = minify
    ? processor.use(rehypePresetMinify)
    : processor.use(rehypeFormat)

  return processor.use(rehypeStringify).freeze()
}

export function cleaner(
  input: string,
  encoding?: BufferEncoding | undefined,
): Promise<string>
export function cleaner(
  input: string,
  minify?: boolean | undefined,
  encoding?: BufferEncoding | undefined,
): Promise<string>
export function cleaner(
  input: NodeJS.ReadableStream,
  minify?: boolean | undefined,
): MinimalDuplex
export function cleaner(
  input: NodeJS.ReadableStream | string,
  minifyOrEncoding?: BufferEncoding | boolean | undefined,
  encoding?: BufferEncoding | undefined,
) {
  let minify: boolean | undefined

  if (typeof minifyOrEncoding === 'boolean') {
    minify = minifyOrEncoding
  } else {
    minify = undefined
    encoding = minifyOrEncoding
  }

  const processor = getProcessor(minify)

  if (typeof input === 'string') {
    return processor.process(input).then(vfile => vfile.toString(encoding))
  }

  return input.pipe(stream(processor()))
}
