import { ArrowLeft, Save, Store } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { sellerService } from "../../services/sellerService";

function SellerForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    const loadSeller = async () => {
      try {
        const seller = await sellerService.getById(id);

        if (!seller) {
          setError("Seller tidak ditemukan.");
          return;
        }

        setForm({
          name: seller.name,
          email: seller.email,
          password: "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSeller();
  }, [id, isEdit]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      if (!form.name.trim()) {
        throw new Error("Nama seller wajib diisi.");
      }

      if (!form.email.trim()) {
        throw new Error("Email wajib diisi.");
      }

      if (!isEdit && !form.password) {
        throw new Error(
          "Password wajib diisi."
        );
      }

      if (isEdit) {
        await sellerService.update(id, form);
      } else {
        await sellerService.create(form);
      }

      navigate("/admin/sellers");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 text-center text-sm text-slate-500">
        Memuat seller...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/admin/sellers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-green-600"
        >
          <ArrowLeft size={17} />
          Kembali
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <Store size={24} />
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-900">
            {isEdit
              ? "Edit Seller"
              : "Tambah Seller"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {isEdit
              ? "Perbarui informasi akun seller."
              : "Buat akun seller baru untuk kantin."}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Nama Seller
              </label>

              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Contoh: Kantin Bu Sari"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-green-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Email
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                placeholder="seller@kantin.sch.id"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-green-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                {isEdit
                  ? "Password Baru"
                  : "Password"}
              </label>

              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                placeholder={
                  isEdit
                    ? "Kosongkan jika tidak diubah"
                    : "Masukkan password"
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-green-500 focus:bg-white"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
            >
              <Save size={18} />
              {saving
                ? "Menyimpan..."
                : isEdit
                ? "Simpan Perubahan"
                : "Buat Seller"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default SellerForm;
