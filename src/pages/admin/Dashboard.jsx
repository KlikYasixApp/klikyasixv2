import { ShieldCheck } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { Link } from "react-router-dom";

function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <ShieldCheck className="text-green-600" size={32} />

          <p className="mt-6 text-sm font-bold text-green-600">
            ADMIN DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Halo, {user?.name}
          </h1>

          <Link
            to="/admin/sellers"
            className="mt-6 inline-flex rounded-xl bg-green-600 px-5 py-3 font-bold text-white"
          >
            Kelola Seller
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
