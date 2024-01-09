export const unique = <T, >(array: T[]): T[] => Array.from(new Set(array));

export const  highlightMatches = (text, regex, flags = "g") => {
    const pattern = new RegExp(regex, flags);

    return text.replace(pattern, match => `<b>${match}</b>`);
};

