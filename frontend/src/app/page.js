export default function Home() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to SnapUI</h1>
      <a
        href="/dashboard"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Go to Dashboard
      </a>
    </div>
  );
}
