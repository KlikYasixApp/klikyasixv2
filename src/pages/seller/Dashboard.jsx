import { Package, FolderKanban, ShoppingBag } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { Link } from "react-router-dom";

function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <ShoppingBag className="text-green-600" size={32} />

          <p className="mt-6 text-sm font-bold text-green-600">
            SELLER DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Halo, {user?.name}
          </h1>

          <p className="mt-2 text-slate-500">
            Kelola produk dan pesanan kantin.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              to="/seller/products"
              className="block rounded-xl border border-slate-200 p-5 transition hover:border-green-300 hover:bg-green-50"
            >
              <Package className="text-green-600" />

              <h2 className="mt-3 font-bold">Produk</h2>

              <p className="mt-1 text-sm text-slate-500">
                Kelola menu dan stok produk
              </p>
            </Link>
            <Link
              to="/seller/orders"
              className="block rounded-xl border border-slate-200 p-5 transition hover:border-green-300 hover:bg-green-50"
            >
              <FolderKanban className="text-green-600" />

              <h2 className="mt-3 font-bold">Pesanan Masuk</h2>

              <p className="mt-1 text-sm text-slate-500">
                Kelola status pesanan masuk
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
