import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ProgrammForm from "../ProgrammForm";

export default async function NeuesProgrammPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "SUPER_ADMIN" && user?.role !== "REDAKTEUR") redirect("/dashboard");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard/admin/programme" className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 mb-4 cursor-pointer">
          <ChevronLeft size={14} /> Zurück zur Übersicht
        </Link>
        <h1 className="text-xl font-extrabold text-slate-900">Neues Förderprogramm</h1>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <ProgrammForm />
      </div>
    </div>
  );
}
