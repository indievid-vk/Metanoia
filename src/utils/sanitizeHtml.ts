const ALLOWED_TAGS = new Set([
  'A', 'B', 'BR', 'DIV', 'EM', 'H2', 'H3', 'H4', 'HR', 'I',
  'LI', 'OL', 'P', 'SMALL', 'SPAN', 'STRONG', 'SUB', 'SUP',
  'TABLE', 'TBODY', 'TD', 'TH', 'THEAD', 'TR', 'U', 'UL', 'BLOCKQUOTE'
]);

const ALLOWED_ATTRS = new Set(['class', 'href', 'title', 'target', 'rel']);

function isSafeHref(rawHref: string): boolean {
  const trimmed = rawHref.trim().toLowerCase();
  if (!trimmed) return false;
  if (trimmed.startsWith('#') || trimmed.startsWith('/') || trimmed.startsWith('./')) {
    return true;
  }
  try {
    const parsed = new URL(trimmed, 'https://example.invalid');
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Sanitizes HTML strings using the browser DOMParser against an explicit tag/attribute allowlist.
 * Strips script/iframe/style/svg tags, inline event handlers, and unsafe URI schemes.
 */
export function sanitizeHtml(dirtyHtml: string | null | undefined): string {
  if (!dirtyHtml) return '';

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return dirtyHtml
      .replace(/<(script|style|iframe|object|embed|svg)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(dirtyHtml, 'text/html');

  const sanitizeNode = (node: Node) => {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        const tagName = el.tagName.toUpperCase();

        // Completely drop executable/embedded elements along with their content
        if (
          tagName === 'SCRIPT' ||
          tagName === 'STYLE' ||
          tagName === 'IFRAME' ||
          tagName === 'OBJECT' ||
          tagName === 'EMBED' ||
          tagName === 'SVG' ||
          tagName === 'NOSCRIPT'
        ) {
          el.remove();
          continue;
        }

        // Unwrap disallowed non-executable tags while keeping their safe text/children
        if (!ALLOWED_TAGS.has(tagName)) {
          sanitizeNode(el);
          const frag = doc.createDocumentFragment();
          while (el.firstChild) {
            frag.appendChild(el.firstChild);
          }
          el.parentNode?.replaceChild(frag, el);
          continue;
        }

        // Strip disallowed attributes and unsafe links
        for (const attr of Array.from(el.attributes)) {
          const name = attr.name.toLowerCase();
          if (!ALLOWED_ATTRS.has(name) || name.startsWith('on')) {
            el.removeAttribute(attr.name);
            continue;
          }
          if (name === 'href') {
            if (!isSafeHref(attr.value)) {
              el.removeAttribute('href');
            } else if (attr.value.trim().toLowerCase().startsWith('http')) {
              el.setAttribute('target', '_blank');
              el.setAttribute('rel', 'noopener noreferrer');
            }
          }
        }

        sanitizeNode(el);
      } else if (child.nodeType === Node.COMMENT_NODE) {
        child.remove();
      }
    }
  };

  sanitizeNode(doc.body);
  return doc.body.innerHTML;
}
