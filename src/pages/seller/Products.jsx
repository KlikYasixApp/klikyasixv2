import { Edit3, Package, Plus, Search, Trash2, Power } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";
import { productService } from "../../services/productService";

function Products() {
  const user = useAuthStore((state) => state.user);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await productService.getAll(user.id);

      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadProducts();
    }
  }, [user?.id]);

  const handleToggle = async (id) => {
    try {
      await productService.toggleActive(id);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) {
      return;
    }

    try {
      await productService.remove(id);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase()),
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-green-600">SELLER</p>

            <h1 className="mt-1 text-3xl font-black text-slate-900">
              Produk Saya
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Kelola produk yang tersedia di kantin.
            </p>
          </div>

          <Link
            to="/seller/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700"
          >
            <Plus size={18} />
            Tambah Produk
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-green-500 focus:bg-white"
            />
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Memuat produk...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-10 text-center">
              <Package size={36} className="mx-auto text-slate-300" />

              <p className="mt-3 font-bold text-slate-700">Belum ada produk</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-200">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">
                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">
                      Produk
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">
                      Kategori
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">
                      Harga
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">
                      Stok
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Package size={20} className="text-slate-400" />
                            )}
                          </div>

                          <div>
                            <p className="font-bold text-slate-900">
                              {product.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              {product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {product.category}
                      </td>

                      <td className="px-6 py-5 text-sm font-bold text-slate-900">
                        {formatPrice(product.price)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={
                            product.stock <= 5
                              ? "font-bold text-red-600"
                              : "font-semibold text-slate-700"
                          }
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={
                            product.active !== false
                              ? "rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700"
                              : "rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600"
                          }
                        >
                          {product.active !== false ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/seller/products/${product.id}/edit`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Edit3 size={17} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleToggle(product.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-green-600"
                          >
                            <Power size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={17} />
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

export default Products;
