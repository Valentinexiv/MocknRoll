"use client";

import { useEffect, useState } from "react";

type PublishedDraft = {
  id: string;
  title: string;
  authorName?: string | null;
  description?: string | null;
  publishedAt?: string | null;
};

export default function PublishedListPage() {
  const [drafts, setDrafts] = useState<PublishedDraft[] | null>(null);

  useEffect(() => {
    fetch("/api/mock-drafts")
      .then((r) => r.json())
      .then((data: PublishedDraft[]) => setDrafts(data));
  }, []);

  if (!drafts) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Published Drafts</h1>
      <ul className="space-y-3">
        {drafts.map((d) => (
          <li key={d.id} className="rounded border p-3">
            <div className="font-medium">{d.title}</div>
            <div className="text-sm opacity-70">{d.authorName || "Anonymous"}</div>
            {d.publishedAt ? (
              <div className="text-xs opacity-60">{new Date(d.publishedAt).toLocaleString()}</div>
            ) : null}
            <a href={`/published/${d.id}`} className="mt-2 inline-block text-blue-600">View</a>
          </li>
        ))}
      </ul>
    </div>
  );
}


