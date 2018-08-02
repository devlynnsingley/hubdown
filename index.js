const remark = require('remark')
const slug = require('remark-slug')
const hljs = require('remark-highlight.js')
const html = require('remark-html')
const emoji = require('remark-gemoji-to-emoji')
const autolinkHeadings = require('remark-autolink-headings')
const inlineLinks = require('remark-inline-links')
const grayMatter = require('gray-matter')
const pify = require('pify')

const renderer = remark()
  .use(slug)
  .use(autolinkHeadings, {behaviour: 'wrap'})
  .use(inlineLinks)
  .use(emoji)
  .use(hljs)
  .use(html, {sanitize: true})

module.exports = async function hubdown (markdownString, opts = {}) {
  const defaults = {
    frontmatter: false
  }
  opts = Object.assign(defaults, opts)

  let data = {}
  let content = markdownString

  if (opts.frontmatter) {
    const parsed = grayMatter(markdownString)
    data = parsed.data
    content = parsed.content
  }

  const md = await pify(renderer.process)(content)
  return Object.assign(data, {content: md.contents})
}
