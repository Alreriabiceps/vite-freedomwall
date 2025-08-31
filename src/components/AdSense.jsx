import { useEffect, useState } from "react";

const AdSense = ({
  adSlot,
  adFormat = "auto",
  style = {},
  className = "",
  responsive = true,
  minContentLength = 0,
  content = "",
  requireContent = false,
  delay = 0,
}) => {
  const [shouldShowAd, setShouldShowAd] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Content validation
    if (requireContent) {
      const hasEnoughContent = content && content.length >= minContentLength;
      if (!hasEnoughContent) {
        setShouldShowAd(false);
        return;
      }
    }

    // Delay ad loading to ensure content is rendered first
    const timer = setTimeout(() => {
      setShouldShowAd(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [requireContent, content, minContentLength, delay]);

  useEffect(() => {
    if (!shouldShowAd || adLoaded) return;

    // Push the ad to Google AdSense
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
        setAdLoaded(true);
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, [shouldShowAd, adLoaded]);

  // Don't render ads in development mode
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        className={`bg-gray-200 border-2 border-dashed border-gray-400 p-4 text-center text-gray-600 ${className}`}
        style={style}
      >
        <p className="text-sm font-medium">Ad Space</p>
        <p className="text-xs">AdSense Ad - {adSlot}</p>
        <p className="text-xs">(Only visible in production)</p>
        {requireContent && (
          <p className="text-xs text-blue-600">
            Content Required: {content?.length || 0}/{minContentLength} chars
          </p>
        )}
      </div>
    );
  }

  // Don't show ad if content requirements aren't met
  if (!shouldShowAd) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8557976210413267"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default AdSense;
