import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, ExternalLink, Pencil } from "lucide-react";
import AdminProgrammDeleteButton from "./AdminProgrammDeleteButton";

const STATUS_COLOR: Record<string, string> = {
  AKTIV: "text-green-600 bg-green-50",
  AUSLAUFEND: "text-amber-600 bg-amber-50",
  ANGEKUENDIGT: "text-blue-600 bg-blue-50",
  BEENDET: "text-slate-400 bg-slate-100",
};
const STATUS_LABEL: Record<string, string> = {
  AKTIV: "Aktiv",
  AUSLAUFEND: "Auslaufend",
  ANGEKUENDIGT: "Angekündigt",
  BEENDET: "Beendet",
};

export default async function AdminProgrammePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "SUPER_ADMIN" && user?.role !== "REDAKTEUR") redirect("/dashboard");

  const programme = await prisma.foerderProgramm.findMany({
    include: { boni: true },
    orderBy: [{ status: "asc" }, { foerdergeber: "asc" }, { name: "asc" }],
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Admin – Förderprogramme</h1>
          <p className="text-sm text-slate-500 mt-0.5">{programme.length} Programme gesamt</p>
        </div>
        <Link
          href="/dashboard/admin/programme/neu"
          className="flex items-center gap-2 bg-[#1B4F72] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#154360] transition-colors cursor-pointer"
        >
          <Plus size={15} /> Programm anlegen
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Programm</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden md:table-cell">Geber</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 hidden lg:table-cell">Basis–Max</th>
              <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Status</th>
              <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {programme.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900">{p.name}</div>
                  {p.kurzname && <div className="text-xs text-slate-400 font-mono">{p.kurzname}</div>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs font-bold text-slate-600">{p.foerdergeber}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-600">
                  {(Number(p.basisfördersatz) * 100).toFixed(0)} % – {(Number(p.maxFoerdersatz) * 100).toFixed(0)} %
                  {p.boni.length > 0 && (
                    <span className="ml-1 text-amber-600">+{p.boni.length} Boni</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[p.status] ?? "text-slate-500"}`}>
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {p.quellUrl && (
                      <a href={p.quellUrl} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <Link href={`/dashboard/admin/programme/${p.id}`}
                      className="p-1.5 text-slate-400 hover:text-[#1B4F72] transition-colors cursor-pointer">
                      <Pencil size={14} />
                    </Link>
                    <AdminProgrammDeleteButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
