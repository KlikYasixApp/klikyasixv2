import { ArrowLeft, Package, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";
import { productService } from "../../services/productService";

const initialForm = {
  name: "",
  category: "Makanan",
  price: "",
  stock: "",
  image: "",
  description: "",
};

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    const loadProduct = async () => {
      try {
        const product = await productService.getById(id);

        if (!product) {
          throw new Error("Produk tidak ditemukan.");
        }

        if (product.sellerId !== user.id) {
          throw new Error("Anda tidak memiliki akses ke produk ini.");
        }

        setForm({
          name: product.name,
          category: product.category,
          price: product.price,
          stock: product.stock,
          image: product.image || "",
          description: product.description || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, isEdit, user.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (!form.name.trim()) {
        throw new Error("Nama produk wajib diisi.");
      }

      if (form.price === "" || Number(form.price) < 0) {
        throw new Error("Harga produk tidak valid.");
      }

      if (form.stock === "" || Number(form.stock) < 0) {
        throw new Error("Stok produk tidak valid.");
      }

      const data = {
        ...form,
        sellerId: user.id,
      };

      console.log("=== CREATE PRODUCT ===");
      console.log("USER:", user);
      console.log("DATA:", data);

      if (isEdit) {
        await productService.update(id, data);
      } else {
        const createdProduct = await productService.create(data);

        console.log("CREATED PRODUCT:", createdProduct);
      }

      navigate("/seller/products");

      if (isEdit) {
        await productService.update(id, data);
      } else {
        await productService.create(data);
      }

      navigate("/seller/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 text-center text-sm text-slate-500">
        Memuat produk...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/seller/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-green-600"
        >
          <ArrowLeft size={17} />
          Kembali
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <Package size={24} />
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-900">
            {isEdit ? "Edit Produk" : "Tambah Produk"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Masukkan informasi produk kantin.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Nama Produk
              </label>

              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Contoh: Nasi Goreng"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-green-500 focus:bg-white"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Kategori
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-green-500 focus:bg-white"
                >
                  <option>Makanan</option>
                  <option>Minuman</option>
                  <option>Snack</option>
                  <option>Buah</option>
                  <option>Lainnya</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Harga
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                  placeholder="12000"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-green-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Stok
              </label>

              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stock: e.target.value,
                  })
                }
                placeholder="20"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-green-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                URL Gambar
              </label>

              <input
                value={form.image}
                onChange={(e) =>
                  setForm({
                    ...form,
                    image: e.target.value,
                  })
                }
                placeholder="https://..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-green-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Deskripsi
              </label>

              <textarea
                rows="4"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Deskripsi produk..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 font-bold text-white hover:bg-green-700 disabled:opacity-50"
            >
              <Save size={18} />
              {saving
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Tambah Produk"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ProductForm;
