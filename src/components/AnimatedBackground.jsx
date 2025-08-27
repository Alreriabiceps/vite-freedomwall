const AnimatedBackground = () => {
  return (
    <div
      className="fixed inset-0 w-full h-full -z-10"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
      }}
    />
  );
};

export default AnimatedBackground;
