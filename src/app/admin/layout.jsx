import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata = {
    title: "System Control | NOIR Admin",
    description: "Commerce Engine Management Console",
};

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-noir-black flex">
            {/* Sidebar remains fixed */}
            <AdminSidebar />

            {/* Main content area scrolls */}
            <div className="flex-1 flex flex-col">
                <AdminHeader />
                <main className="flex-1 p-8 lg:p-12 bg-[#050505]">
                    {children}
                </main>
            </div>
        </div>
    );
}
