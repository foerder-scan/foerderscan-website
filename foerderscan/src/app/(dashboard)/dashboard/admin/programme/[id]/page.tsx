import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ProgrammForm from "../ProgrammForm";

export default async function EditProgrammPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "SUPER_ADMIN" && user?.role !== "REDAKTEUR") redirect("/dashboard");

  const { id } = await params;
  const programm = await prisma.foerderProgramm.findUnique({ where: { id } });
  if (!programm) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard/admin/programme" className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 mb-4 cursor-pointer">
          <ChevronLeft size={14} /> Zurück zur Übersicht
        </Link>
        <h1 className="text-xl font-extrabold text-slate-900">Programm bearbeiten</h1>
        <p className="text-sm text-slate-400 mt-0.5">{programm.name}</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <ProgrammForm initial={{
          id: programm.id,
          name: programm.name,
          kurzname: programm.kurzname,
          foerdergeber: programm.foerdergeber,
          foerdersegment: programm.foerdersegment,
          foerderart: programm.foerderart,
          basisfördersatz: Number(programm.basisfördersatz),
          maxFoerdersatz: Number(programm.maxFoerdersatz),
          maxFoerderfaehigeKosten: programm.maxFoerderfaehigeKosten,
          status: programm.status,
          beschreibung: programm.beschreibung,
          quellUrl: programm.quellUrl,
        }} />
      </div>
    </div>
  );
}
