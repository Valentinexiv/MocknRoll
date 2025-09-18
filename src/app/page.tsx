import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <Image
          src={
            '/ChatGPT%20Image%20Sep%2017,%202025,%2010_42_57%20PM%20-%20Edited.png'
          }
          alt="Mock’n’Roll logo"
          width={420}
          height={420}
          priority
        />
        <div className="flex gap-3">
          <a
            href="/create-draft"
            className="px-5 py-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Create a Draft
          </a>
          <a href="/published" className="px-5 py-2.5 rounded-md border">
            View Published Drafts
          </a>
        </div>
      </div>
    </div>
  );
}
