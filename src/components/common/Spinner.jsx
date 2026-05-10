export default function Spinner({ size = "md" }) {
  const sizeMap = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeMap[size] || sizeMap.md} border-4 border-gray-200 border-t-primary rounded-full animate-spin`}
      />
    </div>
  );
}
