import React from 'react';

export const getHighlightedSuggestion = (input, suggestion) => {
  if (!input) {
    return <span>{suggestion}</span>;
  }

  const matchIndex = suggestion.toLowerCase().indexOf(input.toLowerCase());
  if (matchIndex === -1) {
    return <span>{suggestion}</span>;
  }

  const matchedText = suggestion.substring(0, matchIndex + input.length);
  const remainingText = suggestion.substring(matchIndex + input.length);
  return (
    <>
      <b>{matchedText}</b>
      {remainingText}
    </>
  );
};
