export default function LoadingComponent() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"
          role="status"
        >
          <span className="sr-only">Loading</span>
        </div>
        <p className="mt-4 text-blue-500 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}