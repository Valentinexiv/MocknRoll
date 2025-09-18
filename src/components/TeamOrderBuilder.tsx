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

export type Team = {
  id: number;
  name: string;
  abbreviation: string;
  city: string;
  logoUrl?: string | null;
};

type Props = {
  initialTeams: Team[]; // used as template for the first 32 picks
  allTeams?: Team[]; // optional full list to allow duplicates to be appended
  onSubmit: (orderedTeamIds: number[]) => Promise<void> | void;
  submitting?: boolean;
};

export function TeamOrderBuilder({ initialTeams, allTeams, onSubmit, submitting }: Props) {
  const pool = allTeams ?? initialTeams;
  const [order, setOrder] = useState<number[]>(initialTeams.map((t) => t.id));
  const [appendId, setAppendId] = useState<number | "">("");

  useEffect(() => {
    setOrder(initialTeams.map((t) => t.id));
  }, [initialTeams]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const items = useMemo(() => order.map((_, i) => i.toString()), [order]);
  const teamById = useMemo(() => {
    const m = new Map<number, Team>();
    for (const t of pool) m.set(t.id, t);
    return m;
  }, [pool]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.indexOf(String(active.id));
    const newIndex = items.indexOf(String(over.id));
    const newOrder = arrayMove(order, oldIndex, newIndex);
    setOrder(newOrder);
  }

  const handleSubmit = async () => {
    await onSubmit(order);
  };

  function removeAt(idx: number) {
    setOrder((prev) => prev.filter((_, i) => i !== idx));
  }

  function appendPick() {
    if (appendId === "") return;
    setOrder((prev) => [...prev, Number(appendId)]);
    setAppendId("");
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Set Draft Order</h2>
      <div className="mb-3 flex items-center gap-2">
        <select
          className="border rounded px-2 py-1 bg-white border-neutral-200"
          value={appendId}
          onChange={(e) => setAppendId(e.target.value === "" ? "" : Number(e.target.value))}
        >
          <option value="">Add a pick: choose team…</option>
          {pool.map((t) => (
            <option key={t.id} value={t.id}>{t.name} ({t.abbreviation})</option>
          ))}
        </select>
        <button onClick={appendPick} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Add</button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <ul className="divide-y rounded-md border bg-white border-neutral-200">
            {order.map((teamId, idx) => {
              const t = teamById.get(teamId);
              if (!t) return null;
              return (
                <li key={`${teamId}-${idx}`} className="flex items-center gap-3 px-3 py-2 select-none">
                  <SortableTeamItem id={idx.toString()} team={t} index={idx} />
                  <button
                    type="button"
                    className="ml-auto text-xs text-red-600 hover:underline"
                    onClick={() => removeAt(idx)}
                  >
                    remove
                  </button>
                </li>
              );
            })}
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


