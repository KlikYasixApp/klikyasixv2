import {
  Edit3,
  MoreVertical,
  Plus,
  Search,
  Store,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { sellerService } from "../../services/sellerService";

function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSellers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await sellerService.getAll();

      setSellers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const handleToggle = async (id) => {
    try {
      await sellerService.toggleActive(id);
      await loadSellers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Yakin ingin menghapus seller ini?"
    );

    if (!confirmed) return;

    try {
      await sellerService.remove(id);
      await loadSellers();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      seller.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-green-600">
              ADMIN
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-900">
              Seller Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Kelola akun seller kantin.
            </p>
          </div>

          <Link
            to="/admin/sellers/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700"
          >
            <Plus size={18} />
            Tambah Seller
          </Link>
        </div>

        {/* SEARCH */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Cari nama atau email seller..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white"
            />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {/* TABLE */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Memuat seller...
            </div>
          ) : filteredSellers.length === 0 ? (
            <div className="p-10 text-center">
              <Store
                size={32}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 font-bold text-slate-700">
                Belum ada seller
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Tambahkan seller baru untuk mulai.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Seller
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Email
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredSellers.map((seller) => (
                    <tr
                      key={seller.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 font-bold text-green-600">
                            {seller.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-bold text-slate-900">
                              {seller.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              {seller.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {seller.email}
                      </td>

                      <td className="px-6 py-5">
                        {seller.active !== false ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                            <UserCheck size={14} />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                            <UserX size={14} />
                            Nonaktif
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/sellers/${seller.id}/edit`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            title="Edit"
                          >
                            <Edit3 size={17} />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleToggle(seller.id)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-green-600"
                            title={
                              seller.active !== false
                                ? "Nonaktifkan"
                                : "Aktifkan"
                            }
                          >
                            {seller.active !== false ? (
                              <UserX size={17} />
                            ) : (
                              <UserCheck size={17} />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(seller.id)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            title="Hapus"
                          >
                            <Trash2 size={17} />
                          </button>

                          <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400"
                          >
                            <MoreVertical size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Sellers;
