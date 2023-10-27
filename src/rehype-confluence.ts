import type { Element, Root, ElementContent } from 'hast'
import { isElement } from 'hast-util-is-element'
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

export function containsJira(text: string) {
  return /\bjira\b/i.test(text)
}

export function isJiraElement(
  node: Element | ElementContent,
): boolean | undefined {
  if (node.type === 'text') {
    return containsJira(node.value)
  }
  if (node.type === 'element') {
    return node.children.some(isJiraElement)
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const rehypeConfluence = () => (root: Root) => {
  remove(root, node => {
    if (!isElement(node)) {
      return
    }
    const className = node.properties?.className as string[] | undefined
    return (
      ['style', 'script'].includes(node.tagName) ||
      isJiraElement(node) ||
      className?.some(className =>
        [
          'aui-icon',
          'hide-border-bottom',
          'hidden',
          'jira-tablesorter-header',
          'refresh-issues-bottom',
          'toc-empty-item',
        ].includes(className),
      )
    )
  })

  remove(root, node => {
    if (!isElement(node, 'p') && !isElement(node, 'tr')) {
      return
    }
    return node.children.every(item => {
      if (item.type === 'text') {
        return !item.value.trim()
      }
      return isElement(item, 'br')
    })
  })

  visit(
    root,
    node => isElement(node) && !!node.properties,
    el => {
      const properties = (el as Element).properties!
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
            break
          }
          case 'dataSyntaxhighlighterParams': {
            const params = properties[key] as string
            // eslint-disable-next-line regexp/no-super-linear-backtracking
            const matched = /brush:\s*([^;]+);/.exec(params)
            const lang = matched?.[1]
            if (lang) {
              properties.className = ['language-' + lang]
            }
            delete properties[key]
            break
          }
          case 'id': {
            const id = properties.id as string
            if (containsJira(id) || id.startsWith('refresh-module')) {
              delete properties.id
            }
            break
          }
          default: {
            if (
              key.startsWith('data') ||
              key.startsWith('confluence') ||
              key === 'style'
            ) {
              delete properties[key]
            }
          }
        }
      }
    },
  )
}
