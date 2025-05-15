export const Card = ({ title, children, className = "" }) => {
  return (
    <div
      className={`bg-white p-4 rounded-lg shadow border border-gray-200 ${className}`}
    >
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
      )}
      <div className="w-full">{children}</div>
    </div>
  );
};
