import { Outlet } from "react-router-dom";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(124,58,237,0.2)_0%,rgba(37,99,235,0.16)_34%,rgba(2,6,23,0.98)_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.22),rgba(2,6,23,0.96))]" />
      </div>

      <div className="relative flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />
          <PageContainer>
            <Outlet />
          </PageContainer>
          <Footer />
        </div>
      </div>
    </div>
  );
}
