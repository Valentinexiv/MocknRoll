"use client";

import { useEffect, useState } from "react";
import { TeamOrderBuilder, Team } from "@/components/TeamOrderBuilder";
import { useRouter } from "next/navigation";
import { DEFAULT_DRAFT_ORDER } from "@/config/defaultDraftOrder";

export default function CreateDraftPage() {
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string>("My Mock Draft");
  const [authorName, setAuthorName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/teams")
      .then((r) => r.json())
      .then((data: Team[]) => {
        // sort teams by default draft order template when available
        const orderIndex: Record<string, number> = Object.create(null);
        DEFAULT_DRAFT_ORDER.forEach((abbr, idx) => {
          orderIndex[abbr] = idx;
        });
        const sorted = [...data].sort((a, b) => {
          const ai = orderIndex[a.abbreviation] ?? Number.MAX_SAFE_INTEGER;
          const bi = orderIndex[b.abbreviation] ?? Number.MAX_SAFE_INTEGER;
          return ai - bi;
        });
        setTeams(sorted);
      });
  }, []);

  async function handleSubmit(teamIds: number[]) {
    setLoading(true);
    try {
      const res = await fetch("/api/mock-drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || "My Mock Draft", authorName, description, teamOrder: teamIds }),
      });
      const draft = await res.json();
      if (!res.ok) throw new Error(draft?.error || "Failed to create draft");
      router.push(`/draft/${draft.id}`);
    } finally {
      setLoading(false);
    }
  }

  if (!teams) return <div className="p-6">Loading teams…</div>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
      <aside className="md:sticky md:top-6 h-fit bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-4">
        <h2 className="text-lg font-semibold mb-3">Draft Details</h2>
        <label className="block text-sm mb-1">Title</label>
        <input className="w-full rounded-md ring-1 ring-black/10 px-3 py-2 mb-3" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="My Mock Draft" />
        <label className="block text-sm mb-1">Author</label>
        <input className="w-full rounded-md ring-1 ring-black/10 px-3 py-2 mb-3" value={authorName} onChange={(e)=>setAuthorName(e.target.value)} placeholder="Your name" />
        <label className="block text-sm mb-1">Description</label>
        <textarea className="w-full rounded-md ring-1 ring-black/10 px-3 py-2" rows={4} value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Brief intro…" />
      </aside>
      <div>
        <TeamOrderBuilder initialTeams={teams} onSubmit={handleSubmit} submitting={loading} />
      </div>
    </div>
  );
}


