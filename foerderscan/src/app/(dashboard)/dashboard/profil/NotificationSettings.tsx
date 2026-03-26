"use client";

import { useState } from "react";
import { Bell, Loader2, Check } from "lucide-react";

interface Props {
  initialEnabled: boolean;
}

export default function NotificationSettings({ initialEnabled }: Props) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = async (value: boolean) => {
    setSaving(true);
    setSaved(false);
    setEnabled(value);
    await fetch("/api/account/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailAlertsEnabled: value }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
          <Bell size={13} className="text-amber-500" />
        </div>
        <h2 className="text-sm font-bold text-slate-800">Benachrichtigungen</h2>
        {saving && <Loader2 size={12} className="animate-spin text-slate-400 ml-auto" />}
        {saved && <Check size={12} className="text-[#27AE60] ml-auto" />}
      </div>

      <div className="space-y-3">
        <label className="flex items-start justify-between gap-4 cursor-pointer">
          <div>
            <div className="text-sm font-semibold text-slate-800">E-Mail-Alerts bei Förderänderungen</div>
            <div className="text-xs text-slate-500 mt-0.5">
              Benachrichtigung wenn Förderprogramme in deinen Projekten auslaufen oder sich ändern.
            </div>
          </div>
          <button
            role="switch"
            aria-checked={enabled}
            onClick={() => toggle(!enabled)}
            className={`relative shrink-0 w-10 h-6 rounded-full transition-colors cursor-pointer ${
              enabled ? "bg-[#1B4F72]" : "bg-slate-200"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                enabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </label>
      </div>
    </div>
  );
}
