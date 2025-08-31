// Simple function to censor banned words with asterisks
export const filterBannedWords = (text, bannedWords) => {
  if (
    !text ||
    !bannedWords ||
    !Array.isArray(bannedWords) ||
    bannedWords.length === 0
  ) {
    return text;
  }

  let censoredText = text;

  // Replace each banned word with asterisks
  bannedWords.forEach((bannedWord) => {
    // Handle both string format ["bobo", "tanga"] and object format [{word: "bobo", isActive: true}]
    let word = bannedWord;
    let isActive = true;

    if (typeof bannedWord === "object" && bannedWord.word) {
      word = bannedWord.word;
      isActive = bannedWord.isActive !== false;
    }

    if (word && isActive) {
      const regex = new RegExp(word, "gi");
      censoredText = censoredText.replace(regex, "*".repeat(word.length));
    }
  });

  return censoredText;
};

// Check if text contains any banned words
export const containsBannedWords = (text, bannedWords) => {
  if (!text || !bannedWords || bannedWords.length === 0) {
    return false;
  }

  return bannedWords.some((bannedWord) => {
    // Handle both string format ["bobo", "tanga"] and object format [{word: "bobo", isActive: true}]
    let word = bannedWord;
    let isActive = true;

    if (typeof bannedWord === "object" && bannedWord.word) {
      word = bannedWord.word;
      isActive = bannedWord.isActive !== false;
    }

    return word && isActive && text.toLowerCase().includes(word.toLowerCase());
  });
};
