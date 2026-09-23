import { ReactNode } from "react";
import AdminNavbar from "./AdminNavbar";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="bg-admin-page-bg min-h-screen">
      <AdminNavbar />
      <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
    </div>
  );
}
