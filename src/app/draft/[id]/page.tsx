"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ProspectsPanel } from "./ProspectsPanel";
import { useParams, useRouter } from "next/navigation";

type Prospect = {
  id: number;
  rank: number;
  name: string;
  position: string;
  college?: string | null;
  collegeLogoUrl?: string | null;
  age?: number | null;
  height?: string | null;
  weight?: number | null;
  mnrGrade?: number | null;
};

type Pick = {
  id: number;
  pickNumber: number;
  team: { id: number; name: string; abbreviation: string; logoUrl?: string | null };
  prospect?: Prospect | null;
  commentary?: string | null;
};

type Draft = {
  id: string;
  title: string;
  picks: Pick[];
  isPublished: boolean;
};

export default function DraftPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [saving, setSaving] = useState(false);
  const [positionFilter, setPositionFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const draftId = params.id;

  useEffect(() => {
    fetch(`/api/mock-drafts/${draftId}`)
      .then((r) => r.json())
      .then((d: Draft) => setDraft(d));
    const params = new URLSearchParams();
    params.set('take', '200');
    params.set('sort', 'grade');
    if (positionFilter) params.set('position', positionFilter);
    if (search) params.set('q', search);
    fetch(`/api/prospects?${params.toString()}`)
      .then((r) => r.json())
      .then((p: Prospect[]) => setProspects(p));
  }, [draftId, positionFilter, search]);

  const availableProspects = useMemo(() => {
    const used = new Set((draft?.picks || []).map((p) => p.prospect?.id).filter(Boolean) as number[]);
    return prospects.filter((p) => !used.has(p.id));
  }, [prospects, draft]);

  async function assignProspect(pickNumber: number, prospectId: number) {
    if (!draft) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/mock-drafts/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ picks: [{ pickNumber, prospectId }] }),
      });
      const updated = await res.json();
      setDraft(updated);
    } finally {
      setSaving(false);
    }
  }

  async function updateCommentary(pickNumber: number, commentary: string) {
    if (!draft) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/mock-drafts/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ picks: [{ pickNumber, commentary }] }),
      });
      const updated = await res.json();
      setDraft(updated);
    } finally {
      setSaving(false);
    }
  }

  async function clearPick(pickNumber: number) {
    if (!draft) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/mock-drafts/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ picks: [{ pickNumber, prospectId: null }] }),
      });
      const updated = await res.json();
      setDraft(updated);
    } finally {
      setSaving(false);
    }
  }

  async function publishDraft() {
    if (!draft) return;
    const res = await fetch(`/api/mock-drafts/${draft.id}/publish`, { method: "POST" });
    const updated = await res.json();
    setDraft(updated);
    if (updated?.id) {
      router.push(`/published/${updated.id}?published=1`);
    }
  }

  async function resetDraft() {
    if (!draft) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/mock-drafts/${draft.id}/reset`, { method: 'POST' });
      const updated = await res.json();
      setDraft(updated);
    } finally {
      setSaving(false);
    }
  }

  if (!draft) return <div className="p-6">Loading draft…</div>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6">
      <div>
        <h1 className="text-2xl font-semibold mb-4">{draft.title}</h1>
        <ul className="space-y-5">
          {(draft.picks ?? []).map((p) => (
            <li key={p.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-neutral-200">
                <span className="text-sm w-8 tabular-nums opacity-70">{p.pickNumber}</span>
                {p.team.logoUrl ? (
                  <Image src={p.team.logoUrl} alt={`${p.team.name} logo`} width={24} height={24} />
                ) : null}
                <span className="font-medium">{p.team.name}</span>
                <span className="ml-auto text-xs uppercase opacity-70">{p.team.abbreviation}</span>
                {p.prospect ? (
                  <button
                    type="button"
                    title="Remove pick"
                    aria-label="Remove pick"
                    onClick={() => clearPick(p.pickNumber)}
                    className="ml-2 p-1 rounded hover:bg-neutral-100 text-neutral-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path fillRule="evenodd" d="M9 3a1 1 0 0 0-1 1v1H5.5a.75.75 0 0 0 0 1.5H6v12.25A2.25 2.25 0 0 0 8.25 21h7.5A2.25 2.25 0 0 0 18 18.75V6.5h.5a.75.75 0 0 0 0-1.5H16V4a1 1 0 0 0-1-1H9Zm6 3.5H9V4.5h6V6.5Zm-5.25 3a.75.75 0 0 1 .75.75v7a.75.75 0 0 1-1.5 0v-7a.75.75 0 0 1 .75-.75Zm4.5 0a.75.75 0 0 1 .75.75v7a.75.75 0 0 1-1.5 0v-7a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                  </button>
                ) : null}
              </div>
              <div className="p-4">
                {p.prospect ? (
                  <div className="rounded-xl ring-1 ring-black/5 bg-white overflow-hidden">
                    <div className="flex items-center gap-3 p-4 border-b border-neutral-200">
                      {p.prospect.collegeLogoUrl ? (
                        <Image src={p.prospect.collegeLogoUrl} alt={`${p.prospect.college || ''} logo`} width={40} height={40} />
                      ) : null}
                      <div className="flex-1">
                        <div className="text-lg font-semibold">{p.prospect.name}</div>
                        <div className="text-xs opacity-70">{p.prospect.college || ''}</div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="uppercase opacity-70">{p.prospect.position}</div>
                        <div className="text-xs">Rank #{p.prospect.rank}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-6 p-4 text-sm">
                      <div>
                        <div className="opacity-60 text-xs">Age</div>
                        <div>{p.prospect.age ?? '—'}</div>
                      </div>
                      <div>
                        <div className="opacity-60 text-xs">Height</div>
                        <div>{p.prospect.height ?? '—'}</div>
                      </div>
                      <div>
                        <div className="opacity-60 text-xs">Weight</div>
                        <div>{p.prospect.weight ?? '—'}</div>
                      </div>
                      <div>
                        <div className="opacity-60 text-xs">Grade</div>
                        <div>{p.prospect.mnrGrade?.toFixed(1) ?? '—'}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl ring-1 ring-black/5 p-4 text-sm opacity-70 bg-white">No selection yet. Use the prospects panel to draft a player.</div>
                )}
              </div>
              <div className="px-4 pb-4">
                <label className="block text-sm mb-1">Commentary</label>
                <textarea
                  className="w-full rounded-md ring-1 ring-black/10 px-3 py-2 bg-white"
                  placeholder="Why this pick?"
                  defaultValue={p.commentary ?? ''}
                  onBlur={(e) => updateCommentary(p.pickNumber, e.target.value)}
                  rows={2}
                />
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <button onClick={publishDraft} disabled={saving || draft.isPublished} className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-60">{draft.isPublished ? "Published" : saving ? "Publishing…" : "Publish"}</button>
          <button onClick={resetDraft} disabled={saving} className="px-4 py-2 rounded border">Reset Selections</button>
          <a href="/create-draft" className="px-4 py-2 rounded border">Reorder</a>
        </div>
      </div>
      <ProspectsPanel
        prospects={availableProspects.sort((a,b)=> (b.mnrGrade ?? 0) - (a.mnrGrade ?? 0) || a.rank - b.rank)}
        onDraft={(prospectId) => {
          const firstOpen = (draft.picks ?? []).find((p) => !p.prospect);
          if (firstOpen) assignProspect(firstOpen.pickNumber, prospectId);
        }}
        onFilterChange={(pos) => setPositionFilter(pos)}
        positionFilter={positionFilter}
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
}


