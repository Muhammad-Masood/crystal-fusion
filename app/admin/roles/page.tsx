"use server"
const dynamic = 'force-dynamic'

import AdminProtectedPage from "@/app/components/AdminAccess";
import AdminRoles from "@/app/components/AdminRoles";

export default async function page() {
  return (
    <>
      <AdminProtectedPage>
        <AdminRoles />
      </AdminProtectedPage>
    </>
  );
}
