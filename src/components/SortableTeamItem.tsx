"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { Team } from "./TeamOrderBuilder";

export function SortableTeamItem({ id, team, index }: { id: string; team: Team; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as const;

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 px-3 py-2 select-none" {...attributes} {...listeners}>
      <span className="text-sm w-8 tabular-nums opacity-70">{index + 1}</span>
      {team.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={team.logoUrl} alt={`${team.name} logo`} className="h-6 w-6" />
      ) : null}
      <span className="font-medium">{team.name}</span>
      <span className="ml-auto text-xs uppercase opacity-70">{team.abbreviation}</span>
      <span className="cursor-grab ml-3 opacity-70">⋮⋮</span>
    </div>
  );
}


