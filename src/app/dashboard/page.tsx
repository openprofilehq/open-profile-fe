import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="rounded-[12px] border border-[#EDEDED] bg-white p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-[#747474]">Dashboard content will go here.</p>
      </div>
    </DashboardLayout>
  );
}
