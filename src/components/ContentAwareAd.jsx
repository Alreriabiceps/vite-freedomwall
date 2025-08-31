import { useState, useEffect } from "react";
import AdSense from "./AdSense";

const ContentAwareAd = ({
  adSlot,
  adFormat = "auto",
  className = "",
  style = {},
  minContentLength = 0,
  content = "",
  requireContent = true,
  delay = 500,
  minPosts = 0,
  posts = [],
  position = "inline",
  fallbackContent = null,
}) => {
  const [shouldShowAd, setShouldShowAd] = useState(false);
  const [hasEnoughContent, setHasEnoughContent] = useState(false);

  useEffect(() => {
    // Check if we have enough posts
    if (minPosts > 0 && posts.length < minPosts) {
      setShouldShowAd(false);
      return;
    }

    // Check if we have enough content
    if (requireContent && content) {
      const contentLength = content.length;
      setHasEnoughContent(contentLength >= minContentLength);
      setShouldShowAd(contentLength >= minContentLength);
    } else {
      setShouldShowAd(true);
    }
  }, [requireContent, content, minContentLength, minPosts, posts.length]);

  // Don't show ad if requirements aren't met
  if (!shouldShowAd) {
    return fallbackContent || null;
  }

  // Show ad with content validation
  return (
    <div className={`content-aware-ad ${className}`} style={style}>
      <AdSense
        adSlot={adSlot}
        adFormat={adFormat}
        className="w-full"
        style={style}
        requireContent={requireContent}
        content={content}
        minContentLength={minContentLength}
        delay={delay}
      />

      {/* Content validation indicator (only in development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
          <strong>Ad Validation:</strong> Content length: {content?.length || 0}
          /{minContentLength} chars
          {minPosts > 0 && ` | Posts: ${posts.length}/${minPosts}`}
        </div>
      )}
    </div>
  );
};

export default ContentAwareAd;

