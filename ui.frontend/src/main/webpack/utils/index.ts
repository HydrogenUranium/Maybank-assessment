import DOMPurify from 'dompurify';

export const unique = <T, >(array: T[]): T[] => Array.from(new Set(array));

export const  highlightMatches = (text, regex, flags = "g") => {
    const pattern = new RegExp(regex, flags);

    return text.replace(pattern, match => `<b>${match}</b>`);
};

export function getCommonPrefix(str1, str2, caseInsensitive = false) {
    const origin = str1;

    if (caseInsensitive) {
        str1 = str1.toLowerCase();
        str2 = str2.toLowerCase();
    }

    let i = 0;
    while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
        i++;
    }
    return origin.slice(0, i);
}

export function decodeHtmlEntities(text) {
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(text, 'text/html').body.textContent;
    return sanitizeHtml(decodedString);
  }

const defaultAllowedTags = [
    'b', 'strong', 'i', 'em', 'u', 's', 'mark', 'small', 'sub', 'sup',
    'br', 'span', 'blockquote', 'code', 'pre', 'del', 'ins',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
];

export function sanitizeHtml(html, allowedTags = defaultAllowedTags) {
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: allowedTags });
}
