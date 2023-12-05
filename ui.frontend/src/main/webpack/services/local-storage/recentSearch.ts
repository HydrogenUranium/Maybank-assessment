import { localStorageKeys } from "../../constants/localStorage";

export const putRecentSearch = (newSearch: string): string[] => {
    const trimmedSearch = newSearch.trim();

    if (trimmedSearch) {
        const existingSearches = getRecentSearches();
        const updatedSearches = existingSearches.filter(search => search !== trimmedSearch);
        const updatedRecentSearches = [trimmedSearch, ...updatedSearches].slice(0, 3);
        localStorage.setItem(localStorageKeys.resentSearches, JSON.stringify(updatedRecentSearches));

        return updatedRecentSearches;
    }

    return getRecentSearches();
};

export const getRecentSearches = (): string[] => {
    return JSON.parse(localStorage.getItem(localStorageKeys.resentSearches)) || [];
};