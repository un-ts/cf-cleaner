import type { Element, Root } from 'hast'
import { remove } from 'unist-util-remove'
import { visit } from 'unist-util-visit'

const CLASSNAME_MAPPER = {
  'toc-macro': 'toc',
  'hide-toolbar': 'expandable',
  'confluence-information-macro': 'alert',
  code: 'code',
  panel: 'panel',
  panelHeader: 'panel-header',
  panelContent: 'panel-content',
  confluenceTd: 'border-td',
  confluenceTh: 'border-th',
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const rehypeConfluence = () => (root: Root) => {
  remove(
    root,
    node =>
      node.type === 'element' &&
      (['style', 'script'].includes(node.tagName) ||
        (node.properties?.className as string[] | undefined)?.some(className =>
          ['aui-icon', 'hide-border-bottom', 'hidden'].includes(className),
        )),
  )

  remove(root, node => {
    if (node.type === 'element' && node.tagName === 'p') {
      return node.children.every(item => {
        if (item.type === 'text') {
          return !item.value.trim()
        }

        return item.type === 'element' && item.tagName === 'br'
      })
    }
  })

  visit(
    root,
    node => node.type === 'element' && !!(node as Element).properties,
    _el => {
      const properties = (_el as Element).properties!
      for (const key of Object.keys(properties)) {
        switch (key) {
          case 'className': {
            const className = properties.className as string[]
            properties.className = className
              // eslint-disable-next-line array-callback-return
              .map(name => {
                if (name in CLASSNAME_MAPPER) {
                  return CLASSNAME_MAPPER[name as keyof typeof CLASSNAME_MAPPER]
                }

                if (name.startsWith('confluence-information-macro-')) {
                  return name.replace('confluence-information-macro-', 'alert-')
                }
              })
              .filter(Boolean) as string[]
            if (properties.className.length === 0) {
              delete properties.className
            }
            if (properties.style) {
              delete properties.style
            }
            break
          }
          case 'dataSyntaxhighlighterParams': {
            const params = properties[key] as string
            const matched = /brush:\s*([^;]+);/.exec(params)
            const lang = matched?.[1]
            if (lang) {
              properties.className = ['language-' + lang]
            }
            delete properties[key]
            break
          }
          default: {
            if (key.startsWith('data')) {
              delete properties[key]
            }
          }
        }
      }
    },
  )
}
