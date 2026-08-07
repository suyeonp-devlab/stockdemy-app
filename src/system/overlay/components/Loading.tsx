export default function Loading() {

  return (
    <div className="fixed inset-0 z-51 flex items-center justify-center bg-black/60">
      <div className="w-10 h-10 rounded-full border-4 border-gray-700 border-t-blue-400 animate-spin" />
    </div>
  );
}
