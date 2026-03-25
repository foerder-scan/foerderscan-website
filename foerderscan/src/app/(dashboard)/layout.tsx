import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BottomTabBar from "@/components/dashboard/BottomTabBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 pb-24 lg:p-8 lg:pb-8">
          {children}
        </main>
      </div>
      <BottomTabBar />
    </div>
  );
}
