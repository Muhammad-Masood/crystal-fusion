import AdminProtectedPage from "@/app/components/AdminAccess";
import AdminRoles from "@/app/components/AdminRoles";

export default function page() {
  return (
    <>
      <AdminProtectedPage>
        <AdminRoles />
      </AdminProtectedPage>
    </>
  );
}
