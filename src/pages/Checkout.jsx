import { ArrowLeft, CheckCircle2, Clock3, FileText, User } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { formatPrice } from "../data/products";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { orderService } from "../services/orderService";

function Checkout() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [form, setForm] = useState({
    name: "",
    className: "",
    pickupTime: "",
    note: "",
  });

  const [error, setError] = useState("");

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((total, item) => total + Number(item.quantity || 0), 0);
  }, [items]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      if (!form.name.trim()) {
        setError("Nama wajib diisi.");
        return;
      }

      if (!form.className.trim()) {
        setError("Kelas wajib diisi.");
        return;
      }

      if (!form.pickupTime) {
        setError("Waktu pengambilan wajib dipilih.");
        return;
      }

      if (!items.length) {
        setError("Keranjang kosong.");
        return;
      }

      const order = {
        id: `ORD-${Date.now()}`,
        createdAt: new Date().toISOString(),

        buyerId: user?.id || null,
        buyerName: form.name.trim(),

        customer: {
          name: form.name.trim(),
          className: form.className.trim(),
        },

        pickupTime: form.pickupTime,
        note: form.note.trim(),

        items: items.map((item) => ({
          id: item.id,
          sellerId: item.sellerId,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          image: item.image || "",
        })),

        totalItems,
        total: Number(subtotal),

        // HARUS pakai value internal ini
        status: "pending",
      };

      const createdOrder = await orderService.create(order);

      clearCart();

      navigate(`/orders?success=${createdOrder.id}`);
    } catch (err) {
      console.error("CREATE ORDER ERROR:", err);
      setError(err.message || "Gagal membuat pesanan.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
              <CheckCircle2 size={36} />
            </div>

            <h1 className="mt-6 text-2xl font-black text-slate-900">
              Keranjang kosong
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Tambahkan menu terlebih dahulu sebelum checkout.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white transition hover:bg-green-700"
            >
              Lihat Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-green-600"
          >
            <ArrowLeft size={17} />
            Kembali ke keranjang
          </Link>

          <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Lengkapi informasi untuk memproses pesananmu.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start"
        >
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <User size={20} />
                </div>

                <div>
                  <h2 className="font-black text-slate-900">
                    Informasi Pemesan
                  </h2>

                  <p className="text-xs text-slate-500">
                    Informasi untuk pengambilan pesanan.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Nama
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="className"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Kelas
                  </label>

                  <input
                    id="className"
                    name="className"
                    type="text"
                    value={form.className}
                    onChange={handleChange}
                    placeholder="Contoh: XI RPL 1"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Clock3 size={20} />
                </div>

                <div>
                  <h2 className="font-black text-slate-900">
                    Waktu Pengambilan
                  </h2>

                  <p className="text-xs text-slate-500">
                    Pilih perkiraan waktu mengambil pesanan.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="pickupTime"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Waktu
                </label>

                <select
                  id="pickupTime"
                  name="pickupTime"
                  value={form.pickupTime}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                >
                  <option value="">Pilih waktu pengambilan</option>

                  <option value="09:00 - 09:30">09:00 - 09:30</option>

                  <option value="09:30 - 10:00">09:30 - 10:00</option>

                  <option value="10:00 - 10:30">10:00 - 10:30</option>

                  <option value="10:30 - 11:00">10:30 - 11:00</option>

                  <option value="11:00 - 11:30">11:00 - 11:30</option>

                  <option value="11:30 - 12:00">11:30 - 12:00</option>

                  <option value="12:00 - 12:30">12:00 - 12:30</option>
                </select>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <FileText size={20} />
                </div>

                <div>
                  <h2 className="font-black text-slate-900">Catatan</h2>

                  <p className="text-xs text-slate-500">
                    Tambahkan catatan jika diperlukan.
                  </p>
                </div>
              </div>

              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                rows={4}
                placeholder="Contoh: Jangan terlalu pedas..."
                className="mt-6 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
              />
            </section>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-black text-slate-900">
                Ringkasan Pesanan
              </h2>

              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-xl bg-slate-100" />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-bold text-slate-900">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>

                    <p className="text-sm font-bold text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-5 h-px bg-slate-200" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Total item</span>

                <span className="font-semibold text-slate-900">
                  {totalItems}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-slate-900">Total</span>

                <span className="text-xl font-black text-green-600">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="mt-5 rounded-xl bg-green-50 p-4">
                <p className="text-xs leading-5 text-green-700">
                  Pembayaran dilakukan langsung sesuai ketentuan kantin. Tidak
                  ada payment gateway pada tahap ini.
                </p>
              </div>

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
              >
                <CheckCircle2 size={19} />
                Konfirmasi Pesanan
              </button>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}

export default Checkout;
