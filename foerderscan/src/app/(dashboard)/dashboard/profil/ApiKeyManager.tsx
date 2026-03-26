"use client";

import { useState, useEffect } from "react";
import { Key, Plus, Trash2, Copy, Check, Loader2, Eye, EyeOff } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
}

export default function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newKeyFull, setNewKeyFull] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadKeys = async () => {
    setLoading(true);
    const res = await fetch("/api/api-keys");
    if (res.ok) setKeys(await res.json());
    setLoading(false);
  };

  useEffect(() => { loadKeys(); }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const res = await fetch("/api/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setNewKeyFull(data.fullKey);
      setNewName("");
      setShowForm(false);
      await loadKeys();
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await fetch(`/api/api-keys/${id}`, { method: "DELETE" });
    setKeys((prev) => prev.filter((k) => k.id !== id));
    setDeleting(null);
  };

  const copyKey = async () => {
    if (!newKeyFull) return;
    await navigator.clipboard.writeText(newKeyFull);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#EBF5FB] flex items-center justify-center">
            <Key size={13} className="text-[#1B4F72]" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">API-Keys</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#1B4F72] hover:text-[#154360] border border-[#1B4F72]/20 hover:border-[#1B4F72]/40 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <Plus size={11} /> Neuer Key
        </button>
      </div>

      {/* New key revealed */}
      {newKeyFull && (
        <div className="mb-5 p-4 bg-[#EAFAF1] border border-[#27AE60]/30 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Check size={13} className="text-[#27AE60]" />
            <span className="text-xs font-bold text-[#1E8449]">Key wurde erstellt – jetzt kopieren!</span>
          </div>
          <p className="text-[10px] text-[#27AE60] mb-3">Dieser Key wird nur einmal angezeigt. Bewahre ihn sicher auf.</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-white border border-[#27AE60]/20 rounded-lg px-3 py-2 font-mono text-slate-700 truncate">
              {newKeyFull}
            </code>
            <button
              onClick={copyKey}
              className="shrink-0 p-2 rounded-lg border border-[#27AE60]/30 bg-white text-[#27AE60] hover:bg-[#EAFAF1] transition-colors cursor-pointer"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>
          <button
            onClick={() => setNewKeyFull(null)}
            className="mt-2 text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Schließen
          </button>
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <div className="mb-5 flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Key-Name (z.B. Produktion)"
            className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
          />
          <button
            onClick={handleCreate}
            disabled={creating || !newName.trim()}
            className="flex items-center gap-1.5 text-xs font-semibold bg-[#1B4F72] hover:bg-[#154360] text-white px-3 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            {creating ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            Erstellen
          </button>
        </div>
      )}

      {/* Key list */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 size={18} className="animate-spin text-slate-400" />
        </div>
      ) : keys.length === 0 ? (
        <div className="py-6 text-center text-sm text-slate-400">
          Noch keine API-Keys erstellt.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {keys.map((k) => (
            <div key={k.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-800">{k.name}</div>
                <div className="flex items-center gap-3 mt-0.5">
                  <code className="text-[11px] font-mono text-slate-500">{k.keyPrefix}••••••••</code>
                  <span className="text-[10px] text-slate-400">
                    Erstellt {new Date(k.createdAt).toLocaleDateString("de-DE")}
                  </span>
                  {k.lastUsedAt && (
                    <span className="text-[10px] text-slate-400">
                      Zuletzt {new Date(k.lastUsedAt).toLocaleDateString("de-DE")}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(k.id)}
                disabled={deleting === k.id}
                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
                title="Key widerrufen"
              >
                {deleting === k.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-[10px] text-slate-400 leading-relaxed">
        API-Keys ermöglichen den Zugriff auf die FörderScan API. Verwende den Header{" "}
        <code className="bg-slate-100 px-1 rounded">X-API-Key: fs_live_...</code> bei deinen Anfragen.
      </p>
    </div>
  );
}
