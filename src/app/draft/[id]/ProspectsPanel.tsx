"use client";

import Image from "next/image";

type Prospect = {
  id: number;
  rank: number;
  name: string;
  position: string;
  college?: string | null;
  collegeLogoUrl?: string | null;
  mnrGrade?: number | null;
};

export function ProspectsPanel({
  prospects,
  onDraft,
  onFilterChange,
  positionFilter,
  search,
  setSearch,
}: {
  prospects: Prospect[];
  onDraft: (prospectId: number) => void;
  onFilterChange: (position: string) => void;
  positionFilter: string;
  search: string;
  setSearch: (s: string) => void;
}) {
  const POSITION_ORDER: Array<{ label: string; value: string }> = [
    { label: 'All Positions', value: '' },
    { label: 'QB', value: 'QB' },
    { label: 'HB', value: 'HB' },
    { label: 'WR', value: 'WR' },
    { label: 'TE', value: 'TE' },
    { label: 'OT', value: 'OT' },
    { label: 'OG', value: 'OG' },
    { label: 'C', value: 'C' },
    { label: 'EDGE', value: 'EDGE' },
    { label: 'DT', value: 'DT' },
    { label: 'Sam', value: 'SAM' },
    { label: 'Mike', value: 'MIKE' },
    { label: 'Will', value: 'WILL' },
    { label: 'CB', value: 'CB' },
    { label: 'S', value: 'S' },
  ];

  return (
    <aside className="md:sticky md:top-6 h-fit">
      <div className="mb-3 flex gap-2">
        <select
          value={positionFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="rounded-md ring-1 ring-black/10 px-2 py-1 bg-white"
        >
          {POSITION_ORDER.map((opt) => (
            <option key={opt.label} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          className="rounded-md ring-1 ring-black/10 px-2 py-1 flex-1 bg-white"
          placeholder="Search All Players…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul className="max-h-[70vh] overflow-auto bg-white rounded-2xl shadow-sm ring-1 ring-black/5 divide-y">
        {prospects.map((ps) => (
          <li key={ps.id} className="px-4 py-3 flex items-center gap-3">
            {ps.collegeLogoUrl ? (
              <Image src={ps.collegeLogoUrl} alt={`${ps.college || ''} logo`} width={24} height={24} />
            ) : (
              <div className="h-6 w-6" />
            )}
            <div className="flex-1">
              <div className="text-sm font-medium">{ps.name}</div>
              <div className="text-xs opacity-70">{ps.position}{ps.college ? ` • ${ps.college}` : ''}</div>
            </div>
            <div className="text-xs w-14 text-right">{ps.mnrGrade?.toFixed(1) ?? ''}</div>
            <button className="ml-2 px-3 py-1 rounded-md bg-blue-600 text-white" onClick={() => onDraft(ps.id)}>Draft</button>
          </li>
        ))}
      </ul>
    </aside>
  );
}


