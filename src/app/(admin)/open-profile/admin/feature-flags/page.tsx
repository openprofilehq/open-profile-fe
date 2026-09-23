import AdminLayout from "@/components/admin/AdminLayout";
import FeatureFlags from "@/components/admin/FeatureFlags";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Feature Flags",
};

export default function FeatureFlagsPage() {
  return (
    <AdminLayout>
      <FeatureFlags />
    </AdminLayout>
  );
}
