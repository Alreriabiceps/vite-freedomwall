import { useEffect } from 'react';

const AdSense = ({ 
  adSlot, 
  adFormat = 'auto', 
  style = {}, 
  className = '',
  responsive = true 
}) => {
  useEffect(() => {
    // Push the ad to Google AdSense
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // Don't render ads in development mode
  if (process.env.NODE_ENV === 'development') {
    return (
      <div 
        className={`bg-gray-200 border-2 border-dashed border-gray-400 p-4 text-center text-gray-600 ${className}`}
        style={style}
      >
        <p className="text-sm font-medium">Ad Space</p>
        <p className="text-xs">AdSense Ad - {adSlot}</p>
        <p className="text-xs">(Only visible in production)</p>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8557976210413267"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default AdSense;
