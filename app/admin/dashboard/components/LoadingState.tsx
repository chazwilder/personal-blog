export function LoadingState() {
  return (
    <div className="text-center py-8">
      <div className="animate-spin w-8 h-8 border-4 border-main border-t-transparent rounded-full mx-auto" />
      <p className="mt-2 text-gray-600">Loading posts...</p>
    </div>
  );
}
