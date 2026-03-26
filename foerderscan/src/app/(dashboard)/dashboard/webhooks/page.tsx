"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Webhook,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Copy,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const ALL_EVENTS = [
  { id: "projekt.created", label: "Projekt erstellt" },
  { id: "projekt.updated", label: "Projekt aktualisiert" },
  { id: "projekt.deleted", label: "Projekt gelöscht" },
  { id: "foerderung.created", label: "Förderung erstellt" },
  { id: "foerderung.updated", label: "Förderung aktualisiert" },
  { id: "subscription.changed", label: "Abo geändert" },
];

interface Delivery {
  id: string;
  event: string;
  success: boolean;
  statusCode: number | null;
  createdAt: string;
}

interface Endpoint {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
  secret?: string;
  deliveries: Delivery[];
}

export default function WebhooksPage() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newEvents, setNewEvents] = useState<string[]>([]);
  const [createError, setCreateError] = useState("");
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/webhooks");
    if (res.ok) setEndpoints(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function create() {
    setCreating(true);
    setCreateError("");
    const res = await fetch("/api/webhooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: newUrl, events: newEvents }),
    });
    const data = await res.json();
    if (!res.ok) {
      setCreateError(data.error ?? "Fehler beim Erstellen");
      setCreating(false);
      return;
    }
    setNewSecret(data.secret);
    setNewUrl("");
    setNewEvents([]);
    setShowCreate(false);
    setCreating(false);
    load();
  }

  async function toggleActive(ep: Endpoint) {
    await fetch(`/api/webhooks/${ep.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !ep.isActive }),
    });
    load();
  }

  async function deleteEndpoint(id: string) {
    if (!confirm("Webhook-Endpoint wirklich löschen?")) return;
    await fetch(`/api/webhooks/${id}`, { method: "DELETE" });
    load();
  }

  function copySecret() {
    if (!newSecret) return;
    navigator.clipboard.writeText(newSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Webhooks</h1>
          <p className="text-sm text-slate-500 mt-1">
            Empfangen Sie Echtzeit-Benachrichtigungen bei Ereignissen in Ihrem Account.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 text-sm font-semibold bg-[#1B4F72] text-white px-4 py-2.5 rounded-lg hover:bg-[#154360] transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Endpoint hinzufügen
        </button>
      </div>

      {/* New secret banner */}
      {newSecret && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-900 mb-1">
                Webhook-Secret – nur jetzt sichtbar!
              </p>
              <p className="text-xs text-amber-700 mb-3">
                Speichern Sie dieses Secret sofort. Es wird nicht erneut angezeigt.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-white border border-amber-200 rounded px-3 py-2 font-mono text-amber-900 truncate">
                  {newSecret}
                </code>
                <button
                  onClick={copySecret}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors cursor-pointer shrink-0"
                >
                  {copiedSecret ? <Check size={13} /> : <Copy size={13} />}
                  {copiedSecret ? "Kopiert" : "Kopieren"}
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => setNewSecret(null)}
            className="mt-3 text-xs text-amber-600 hover:underline cursor-pointer"
          >
            Ich habe das Secret gespeichert
          </button>
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h2 className="font-semibold text-slate-800">Neuer Webhook-Endpoint</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Endpoint-URL
            </label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.com/webhook"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Events abonnieren
            </label>
            <div className="grid sm:grid-cols-2 gap-2">
              {ALL_EVENTS.map((ev) => (
                <label
                  key={ev.id}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={newEvents.includes(ev.id)}
                    onChange={(e) =>
                      setNewEvents(
                        e.target.checked
                          ? [...newEvents, ev.id]
                          : newEvents.filter((x) => x !== ev.id)
                      )
                    }
                    className="w-4 h-4 text-[#1B4F72] rounded border-slate-300 cursor-pointer"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">
                    {ev.label}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{ev.id}</span>
                </label>
              ))}
            </div>
          </div>

          {createError && (
            <p className="text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle size={14} />
              {createError}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={create}
              disabled={creating || !newUrl || newEvents.length === 0}
              className="px-5 py-2.5 text-sm font-semibold bg-[#1B4F72] text-white rounded-lg hover:bg-[#154360] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {creating ? "Erstelle..." : "Endpoint erstellen"}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Endpoints list */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
          Lade...
        </div>
      ) : endpoints.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Webhook size={32} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Keine Endpoints konfiguriert</p>
          <p className="text-slate-400 text-xs mt-1">
            Fügen Sie einen Endpoint hinzu, um Echtzeit-Events zu empfangen.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {endpoints.map((ep) => (
            <div key={ep.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                        ep.isActive ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                    <span className="text-sm font-mono text-slate-800 truncate">{ep.url}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ep.events.map((ev) => (
                      <span
                        key={ev}
                        className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono"
                      >
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setExpandedId(expandedId === ep.id ? null : ep.id)}
                    className="text-slate-400 hover:text-slate-700 p-1.5 rounded cursor-pointer"
                    title="Deliveries anzeigen"
                  >
                    {expandedId === ep.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button
                    onClick={() => toggleActive(ep)}
                    className="text-slate-400 hover:text-slate-700 p-1.5 rounded cursor-pointer"
                    title={ep.isActive ? "Deaktivieren" : "Aktivieren"}
                  >
                    {ep.isActive ? (
                      <ToggleRight size={20} className="text-emerald-500" />
                    ) : (
                      <ToggleLeft size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => deleteEndpoint(ep.id)}
                    className="text-slate-300 hover:text-red-500 p-1.5 rounded transition-colors cursor-pointer"
                    title="Löschen"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {expandedId === ep.id && (
                <div className="border-t border-slate-100 px-6 py-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Letzte Deliveries
                  </p>
                  {ep.deliveries.length === 0 ? (
                    <p className="text-sm text-slate-400">Noch keine Deliveries</p>
                  ) : (
                    <div className="space-y-2">
                      {ep.deliveries.map((d) => (
                        <div
                          key={d.id}
                          className="flex items-center gap-3 text-xs"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              d.success ? "bg-emerald-500" : "bg-red-400"
                            }`}
                          />
                          <span className="font-mono text-slate-600">{d.event}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded font-mono ${
                              d.success
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {d.statusCode ?? "–"}
                          </span>
                          <span className="text-slate-400 ml-auto">
                            {new Date(d.createdAt).toLocaleString("de-DE")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Docs */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Payload-Signierung</h3>
        <p className="text-xs text-slate-600 mb-3">
          Jede Anfrage enthält den Header{" "}
          <code className="bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono">
            X-FoerderScan-Signature: sha256=...
          </code>
          . Validieren Sie die Signatur mit Ihrem Secret:
        </p>
        <pre className="text-xs bg-white border border-slate-200 rounded-lg p-4 overflow-x-auto text-slate-700">
{`const crypto = require('crypto');

function verify(payload, secret, signature) {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}`}
        </pre>
      </div>
    </div>
  );
}
