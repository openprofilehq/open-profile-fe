import AdminLayout from "@/components/admin/AdminLayout";
import UserLookup from "@/components/admin/user-lookup/UserLookup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — User Lookup",
};

export default function UserLookupPage() {
  return (
    <AdminLayout>
      <UserLookup />
    </AdminLayout>
  );
}
