import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

            <Sidebar />

            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
                <Outlet />
            </main>

        </div>
    );
};