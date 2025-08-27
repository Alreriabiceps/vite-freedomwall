// List of inappropriate words and phrases to filter out
const inappropriateWords = [
  // Common profanity
  "fuck",
  "shit",
  "bitch",
  "ass",
  "damn",
  "hell",
  "piss",
  "cock",
  "dick",
  "pussy",
  "cunt",
  "whore",
  "slut",
  "bastard",
  "motherfucker",
  "fucker",
  "faggot",

  // Hate speech and slurs
  "nigger",
  "nigga",
  "fag",
  "dyke",
  "kike",
  "spic",
  "chink",
  "gook",
  "wop",
  "kraut",
  "haji",

  // Violence and threats
  "kill",
  "murder",
  "suicide",
  "bomb",
  "terrorist",
  "shoot",
  "gun",
  "weapon",
  "attack",
  "fight",

  // Drugs and alcohol
  "drugs",
  "cocaine",
  "heroin",
  "marijuana",
  "weed",
  "alcohol",
  "drunk",
  "high",
  "stoned",

  // Sexual content
  "sex",
  "porn",
  "nude",
  "naked",
  "penis",
  "vagina",
  "sexual",
  "erotic",
  "sexy",
  "hot",

  // School-specific inappropriate content
  "cheat",
  "plagiarism",
  "skip class",
  "truant",
  "bully",
  "harass",
  "stalk",
  "threaten",

  // Tagalog soft words and mild expressions
  "puta",
  "putang",
  "putangina",
  "putang ina",
  "putang-ina",
  "gago",
  "gagu",
  "tangina",
  "tang ina",
  "tang-ina",
  "bobo",
  "bubu",
  "tanga",
  "tanga ka",
  "tanga ka ba",
  "ulol",
  "ulul",
  "baliw",
  "baliw ka",
  "baliw ka ba",
  "sira ulo",
  "sira-ulo",
  "siraulo",
  "sira ang ulo",
  "walang utak",
  "walang-utak",
  "walangutak",
  "kupal",
  "kupal ka",
  "kupal ka ba",
  "tarantado",
  "tarantada",
  "tarantado ka",
  "bwisit",
  "bwisit ka",
  "bwisit ka ba",
  "leche",
  "leche ka",
  "leche ka ba",
  "susmaryosep",
  "susmaryosep ka",
  "naku",
  "naku po",
  "naku po may",
  "hay naku",
  "hay naku po",
  "ay naku",
  "ay naku po",
  "sana all",
  "sana all na lang",
  "edi wow",
  "edi wow na lang",
  "charot",
  "charot lang",
  "charot lang po",
  "joke lang",
  "joke lang po",
  "biro lang",
  "biro lang po",
  "trip lang",
  "trip lang po",
];

// Function to check if text contains inappropriate content
export const containsInappropriateContent = (text) => {
  if (!text) return false;

  const lowerText = text.toLowerCase();

  // Check for exact matches
  for (const word of inappropriateWords) {
    if (lowerText.includes(word)) {
      return {
        isInappropriate: true,
        reason: `Contains inappropriate language: "${word}"`,
        word: word,
      };
    }
  }

  // Check for common variations (leetspeak, etc.)
  const variations = {
    fuck: ["f*ck", "f**k", "f***", "fck", "fuk"],
    shit: ["sh*t", "sh**", "sht", "s**t"],
    ass: ["a**", "a**s", "ass"],
    bitch: ["b*tch", "b**ch", "b***h", "btch"],
    damn: ["d*mn", "d**n", "dmn"],
    // Tagalog variations
    puta: ["p*ta", "p**a", "pt*", "pta"],
    gago: ["g*go", "g**o", "gag*", "gag"],
    tanga: ["t*nga", "t**ga", "tang*", "tang"],
    bobo: ["b*bo", "b**o", "bob*", "bob"],
  };

  for (const [original, vars] of Object.entries(variations)) {
    for (const variation of vars) {
      if (lowerText.includes(variation)) {
        return {
          isInappropriate: true,
          reason: `Contains inappropriate language: "${original}"`,
          word: original,
        };
      }
    }
  }

  // Check for excessive repetition (spam-like behavior)
  const words = text.split(/\s+/);
  const wordCount = {};

  for (const word of words) {
    if (word.length > 2) {
      wordCount[word.toLowerCase()] = (wordCount[word.toLowerCase()] || 0) + 1;
    }
  }

  for (const [word, count] of Object.entries(wordCount)) {
    if (count > 5) {
      return {
        isInappropriate: true,
        reason: `Excessive repetition of word: "${word}"`,
        word: word,
      };
    }
  }

  return { isInappropriate: false };
};

// Function to get a filtered version of text (replace with asterisks)
export const filterContent = (text) => {
  if (!text) return text;

  let filteredText = text;

  for (const word of inappropriateWords) {
    const regex = new RegExp(word, "gi");
    filteredText = filteredText.replace(regex, "*".repeat(word.length));
  }

  return filteredText;
};

// Function to validate post content before submission
export const validatePost = (name, message) => {
  const nameCheck = containsInappropriateContent(name);
  const messageCheck = containsInappropriateContent(message);

  if (nameCheck.isInappropriate) {
    return {
      isValid: false,
      error: `Name contains inappropriate content: ${nameCheck.reason}`,
      field: "name",
    };
  }

  if (messageCheck.isInappropriate) {
    return {
      isValid: false,
      error: `Message contains inappropriate content: ${messageCheck.reason}`,
      field: "message",
    };
  }

  return { isValid: true };
};
