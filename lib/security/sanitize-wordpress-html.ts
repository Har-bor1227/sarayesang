import 'server-only'

import sanitizeHtml from 'sanitize-html'

const ALLOWED_IFRAME_HOSTS = new Set([
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'youtube-nocookie.com',
  'player.vimeo.com',
])

function getAllowedEmbedUrl(rawUrl: string | undefined): URL | null {
  if (!rawUrl || rawUrl.length > 2_048) {
    return null
  }

  try {
    const url = new URL(rawUrl)

    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      !ALLOWED_IFRAME_HOSTS.has(url.hostname.toLowerCase())
    ) {
      return null
    }

    const hostname = url.hostname.toLowerCase()
    const path = url.pathname
    const isYouTube =
      (hostname === 'www.youtube.com' || hostname === 'youtube.com') &&
      path.startsWith('/embed/')
    const isYouTubeNoCookie =
      (hostname === 'www.youtube-nocookie.com' || hostname === 'youtube-nocookie.com') &&
      path.startsWith('/embed/')
    const isVimeo = hostname === 'player.vimeo.com' && path.startsWith('/video/')

    return isYouTube || isYouTubeNoCookie || isVimeo ? url : null
  } catch {
    return null
  }
}

const SAFE_STYLE_VALUES = {
  '*': {
    'text-align': [/^(left|right|center|justify|start|end)$/i],
    'vertical-align': [/^(baseline|sub|super|top|text-top|middle|bottom|text-bottom)$/i],
    'font-weight': [/^(normal|bold|bolder|lighter|[1-9]00)$/i],
    'font-style': [/^(normal|italic|oblique)$/i],
    'text-decoration': [/^(none|underline|overline|line-through)(\s+(solid|dotted|dashed|wavy))?$/i],
    'font-size': [/^(\d+(\.\d+)?(px|em|rem|%|pt))$/i],
    color: [/^(#[0-9a-f]{3,8}|rgba?\([0-9.% ,/+-]+\)|[a-z]{3,20})$/i],
    'background-color': [/^(#[0-9a-f]{3,8}|rgba?\([0-9.% ,/+-]+\)|[a-z]{3,20})$/i],
    width: [/^(auto|fit-content|max-content|min-content|\d+(\.\d+)?(px|em|rem|%|vw|vh))$/i],
    'max-width': [/^(none|100%|\d+(\.\d+)?(px|em|rem|%|vw|vh))$/i],
    'min-width': [/^(auto|0|\d+(\.\d+)?(px|em|rem|%|vw|vh))$/i],
    height: [/^(auto|fit-content|max-content|min-content|\d+(\.\d+)?(px|em|rem|%|vw|vh))$/i],
    'max-height': [/^(none|\d+(\.\d+)?(px|em|rem|%|vw|vh))$/i],
    'min-height': [/^(auto|0|\d+(\.\d+)?(px|em|rem|%|vw|vh))$/i],
    margin: [/^(auto|0|\d+(\.\d+)?(px|em|rem|%|vw|vh))(\s+(auto|0|\d+(\.\d+)?(px|em|rem|%|vw|vh))){0,3}$/i],
    'margin-top': [/^(auto|0|\d+(\.\d+)?(px|em|rem|%|vw|vh))$/i],
    'margin-right': [/^(auto|0|\d+(\.\d+)?(px|em|rem|%|vw|vh))$/i],
    'margin-bottom': [/^(auto|0|\d+(\.\d+)?(px|em|rem|%|vw|vh))$/i],
    'margin-left': [/^(auto|0|\d+(\.\d+)?(px|em|rem|%|vw|vh))$/i],
    padding: [/^(0|\d+(\.\d+)?(px|em|rem|%|vw|vh))(\s+(0|\d+(\.\d+)?(px|em|rem|%|vw|vh))){0,3}$/i],
    'padding-top': [/^(0|\d+(\.\d+)?(px|em|rem|%|vw|vh))$/i],
    'padding-right': [/^(0|\d+(\.\d+)?(px|em|rem|%|vw|vh))$/i],
    'padding-bottom': [/^(0|\d+(\.\d+)?(px|em|rem|%|vw|vh))$/i],
    'padding-left': [/^(0|\d+(\.\d+)?(px|em|rem|%|vw|vh))$/i],
    display: [/^(block|inline|inline-block|flex|grid|table|table-cell|table-row|none)$/i],
    'border-collapse': [/^(collapse|separate)$/i],
    'list-style-type': [/^(none|disc|circle|square|decimal|decimal-leading-zero|lower-alpha|upper-alpha|lower-roman|upper-roman|persian|arabic-indic)$/i],
    'object-fit': [/^(contain|cover|fill|none|scale-down)$/i],
    'line-height': [/^(normal|\d+(\.\d+)?(px|em|rem|%))$/i],
  },
}

const SANITIZE_OPTIONS = {
  allowedTags: Array.from(
    new Set([
      ...sanitizeHtml.defaults.allowedTags,
      'img',
      'picture',
      'iframe',
      'video',
      'audio',
      'source',
      'track',
    ]),
  ),
  allowedAttributes: {
    '*': [
      'class',
      'id',
      'dir',
      'lang',
      'title',
      'role',
      'style',
      'aria-*',
      'data-*',
    ],
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'srcset', 'sizes', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
    iframe: [
      'src',
      'title',
      'width',
      'height',
      'loading',
      'allow',
      'allowfullscreen',
      'frameborder',
      'referrerpolicy',
      'sandbox',
    ],
    video: ['src', 'poster', 'controls', 'width', 'height', 'preload', 'muted', 'loop', 'playsinline'],
    audio: ['src', 'controls', 'preload', 'muted', 'loop'],
    source: ['src', 'srcset', 'type', 'media', 'sizes'],
    track: ['kind', 'src', 'srclang', 'label', 'default'],
    td: ['colspan', 'rowspan', 'headers'],
    th: ['colspan', 'rowspan', 'scope', 'headers'],
    ol: ['start', 'reversed', 'type'],
    li: ['value'],
  },
  allowedStyles: SAFE_STYLE_VALUES,
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesAppliedToAttributes: ['href', 'src', 'cite', 'action'],
  allowProtocolRelative: false,
  allowedIframeHostnames: Array.from(ALLOWED_IFRAME_HOSTS),
  transformTags: {
    a: (_tagName: string, attribs: Record<string, string>) => {
      const safeAttribs = { ...attribs }
      const target = safeAttribs.target?.toLowerCase()

      if (target === '_blank') {
        safeAttribs.rel = 'noopener noreferrer'
      } else if (target && target !== '_self') {
        delete safeAttribs.target
      }

      return { tagName: 'a', attribs: safeAttribs }
    },
    iframe: (_tagName: string, attribs: Record<string, string>) => {
      const safeUrl = getAllowedEmbedUrl(attribs.src)

      if (!safeUrl) {
        return { tagName: 'iframe', attribs: { src: '' } }
      }

      const safeAttribs: Record<string, string> = {
        src: safeUrl.toString(),
        loading: 'lazy',
        referrerpolicy: 'strict-origin-when-cross-origin',
        sandbox: 'allow-scripts allow-same-origin allow-presentation',
        allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share',
        allowfullscreen: 'allowfullscreen',
      }

      for (const attribute of ['title', 'width', 'height', 'class', 'id', 'frameborder']) {
        const value = attribs[attribute]
        if (value) {
          safeAttribs[attribute] = value
        }
      }

      return { tagName: 'iframe', attribs: safeAttribs }
    },
  },
  exclusiveFilter: (frame: { tag: string; attribs: Record<string, string> }) => {
    return frame.tag === 'iframe' && !getAllowedEmbedUrl(frame.attribs.src)
  },
}

/**
 * Sanitize WordPress HTML on the server before passing it to any component
 * that renders it through dangerouslySetInnerHTML.
 */
export function sanitizeWordPressHtml(html: string): string {
  if (!html) {
    return ''
  }

  return sanitizeHtml(html, SANITIZE_OPTIONS)
}
