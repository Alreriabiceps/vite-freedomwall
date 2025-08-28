// Content moderation system for AdSense compliance

// Inappropriate words and phrases (expand this list)
const INAPPROPRIATE_WORDS = [
  // Profanity
  'fuck', 'shit', 'bitch', 'ass', 'damn', 'hell',
  // Hate speech indicators
  'hate', 'kill', 'die', 'suicide', 'murder',
  // Bullying indicators
  'stupid', 'idiot', 'dumb', 'ugly', 'fat',
  // Violence
  'fight', 'punch', 'hit', 'attack', 'hurt',
  // Drugs and alcohol
  'drugs', 'alcohol', 'weed', 'cocaine', 'heroin',
  // Sexual content
  'sex', 'porn', 'nude', 'naked', 'sexual'
];

// Content categories for better filtering
const CONTENT_CATEGORIES = {
  INAPPROPRIATE: 'inappropriate',
  QUESTIONABLE: 'questionable',
  SAFE: 'safe'
};

/**
 * Check if content contains inappropriate language
 * @param {string} content - The content to check
 * @returns {Object} - Result with category and warnings
 */
export const moderateContent = (content) => {
  if (!content || typeof content !== 'string') {
    return { category: CONTENT_CATEGORIES.SAFE, warnings: [], isAppropriate: true };
  }

  const lowerContent = content.toLowerCase();
  const warnings = [];
  let inappropriateCount = 0;

  // Check for inappropriate words
  INAPPROPRIATE_WORDS.forEach(word => {
    if (lowerContent.includes(word)) {
      warnings.push(`Content contains inappropriate language: "${word}"`);
      inappropriateCount++;
    }
  });

  // Check for excessive caps (shouting)
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (capsRatio > 0.7 && content.length > 10) {
    warnings.push('Content contains excessive capitalization (shouting)');
  }

  // Check for repetitive characters
  if (/(.)\1{4,}/.test(content)) {
    warnings.push('Content contains repetitive characters');
  }

  // Determine category
  let category = CONTENT_CATEGORIES.SAFE;
  if (inappropriateCount > 2) {
    category = CONTENT_CATEGORIES.INAPPROPRIATE;
  } else if (inappropriateCount > 0 || warnings.length > 0) {
    category = CONTENT_CATEGORIES.QUESTIONABLE;
  }

  return {
    category,
    warnings,
    isAppropriate: category === CONTENT_CATEGORIES.SAFE,
    inappropriateCount,
    totalWarnings: warnings.length
  };
};

/**
 * Get content rating for display
 * @param {string} content - The content to rate
 * @returns {string} - Content rating
 */
export const getContentRating = (content) => {
  const result = moderateContent(content);
  
  if (result.category === CONTENT_CATEGORIES.INAPPROPRIATE) {
    return '⚠️ Inappropriate';
  } else if (result.category === CONTENT_CATEGORIES.QUESTIONABLE) {
    return '⚠️ Questionable';
  }
  
  return '✅ Safe';
};

/**
 * Filter content before submission
 * @param {string} content - The content to filter
 * @returns {Object} - Filtered result
 */
export const filterContent = (content) => {
  const result = moderateContent(content);
  
  if (result.category === CONTENT_CATEGORIES.INAPPROPRIATE) {
    return {
      isAllowed: false,
      reason: 'Content contains inappropriate language and cannot be posted',
      warnings: result.warnings
    };
  }
  
  return {
    isAllowed: true,
    warnings: result.warnings,
    filteredContent: content
  };
};

export default {
  moderateContent,
  getContentRating,
  filterContent,
  CONTENT_CATEGORIES
};
