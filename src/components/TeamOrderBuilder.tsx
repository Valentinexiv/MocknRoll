"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTeamItem } from "./SortableTeamItem";
import type { Team as TeamType } from "@/types/team";

export type Team = TeamType & {
  id: number;
  name: string;
  abbreviation: string;
  city: string;
  logoUrl?: string | null;
};

type Props = {
  initialTeams: Team[];
  onSubmit: (orderedTeamIds: number[]) => Promise<void> | void;
  submitting?: boolean;
};

export function TeamOrderBuilder({ initialTeams, onSubmit, submitting }: Props) {
  const [teams, setTeams] = useState<Team[]>(initialTeams);

  useEffect(() => {
    setTeams(initialTeams);
  }, [initialTeams]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const teamIds = useMemo(() => teams.map((t) => t.id.toString()), [teams]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = teamIds.indexOf(String(active.id));
    const newIndex = teamIds.indexOf(String(over.id));
    const newOrder = arrayMove(teams, oldIndex, newIndex);
    setTeams(newOrder);
  }

  const handleSubmit = async () => {
    const orderedIds = teams.map((t) => t.id);
    await onSubmit(orderedIds);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Set Draft Order</h2>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={teamIds} strategy={verticalListSortingStrategy}>
          <ul className="divide-y rounded-md border bg-white border-neutral-200">
            {teams.map((t, idx) => (
              <SortableTeamItem key={t.id} id={t.id.toString()} team={t} index={idx} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!!submitting}
          className="px-4 py-2 rounded bg-blue-600 disabled:opacity-60 text-white hover:bg-blue-700"
        >
          {submitting ? "Creating..." : "Create Draft"}
        </button>
      </div>
    </div>
  );
}


