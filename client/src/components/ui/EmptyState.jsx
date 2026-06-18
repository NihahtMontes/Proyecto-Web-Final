export default function EmptyState({
  message = "No hay datos",
  icon = "📭",
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500">
      <div className="text-5xl mb-3">
        {icon}
      </div>

      <p className="text-lg">
        {message}
      </p>
    </div>
  );
}