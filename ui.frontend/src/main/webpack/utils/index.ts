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
    return decodedString;
  }

export function removeHtmlTags(input) {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
}
