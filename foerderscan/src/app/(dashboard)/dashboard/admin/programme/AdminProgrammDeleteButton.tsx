"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminProgrammDeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`„${name}" wirklich löschen? Alle zugeordneten Projektförderungen werden ebenfalls entfernt.`)) return;
    setLoading(true);
    await fetch(`/api/admin/programme/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
    >
      <Trash2 size={14} />
    </button>
  );
}
