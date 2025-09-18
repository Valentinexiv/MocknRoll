export default function Home() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Mock’n’Roll: Madden 26 Mock Drafts</h1>
      <div className="flex gap-3">
        <a href="/create-draft" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Create a Draft</a>
        <a href="/published" className="px-4 py-2 rounded border">View Published Drafts</a>
      </div>
    </div>
  );
}
