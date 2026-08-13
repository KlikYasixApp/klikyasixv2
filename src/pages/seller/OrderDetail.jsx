import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  PackageCheck,
  User,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { formatPrice } from "../../data/products";
import { orderService } from "../../services/orderService";

const statusConfig = {
  pending: {
    label: "Menunggu",
    className: "bg-yellow-50 text-yellow-700",
  },

  processing: {
    label: "Diproses",
    className: "bg-blue-50 text-blue-700",
  },

  ready: {
    label: "Siap Diambil",
    className: "bg-green-50 text-green-700",
  },

  completed: {
    label: "Selesai",
    className: "bg-slate-100 text-slate-700",
  },

  cancelled: {
    label: "Dibatalkan",
    className: "bg-red-50 text-red-700",
  },
};

const statusOptions = [
  {
    value: "pending",
    label: "Menunggu",
  },
  {
    value: "processing",
    label: "Diproses",
  },
  {
    value: "ready",
    label: "Siap Diambil",
  },
  {
    value: "completed",
    label: "Selesai",
  },
  {
    value: "cancelled",
    label: "Dibatalkan",
  },
];

const formatDate = (date) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

function OrderDetail() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadOrder = useCallback(async () => {
    if (!id) return;

    try {
      setError("");

      const data = await orderService.getById(id);

      if (!data) {
        throw new Error("Pesanan tidak ditemukan.");
      }

      setOrder(data);
    } catch (err) {
      setError(err.message || "Gagal mengambil pesanan.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    const fetchOrder = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError("");

        const data = await orderService.getById(id);

        if (!data) {
          throw new Error("Pesanan tidak ditemukan.");
        }

        if (!cancelled) {
          setOrder(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Gagal mengambil pesanan.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    if (!order) return;

    try {
      setSaving(true);
      setError("");

      const updatedOrder = await orderService.updateStatus(order.id, newStatus);

      setOrder(updatedOrder);
    } catch (err) {
      setError(err.message || "Gagal mengubah status pesanan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-slate-500">Memuat pesanan...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            to="/seller/orders"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-green-600"
          >
            <ArrowLeft size={17} />
            Kembali ke Pesanan
          </Link>

          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-600">
            {error}
          </div>
        </main>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const status = statusConfig[order.status] || statusConfig.pending;

  const itemCount = order.items.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/seller/orders"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-green-600"
        >
          <ArrowLeft size={17} />
          Kembali ke Pesanan
        </Link>

        <div className="mt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold text-green-600">DETAIL PESANAN</p>

              <h1 className="mt-1 text-3xl font-black text-slate-900">
                #{order.id}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Dibuat pada {formatDate(order.createdAt)}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${status.className}`}
            >
              {status.label}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* CUSTOMER */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <User size={20} />
                </div>

                <div>
                  <h2 className="font-black text-slate-900">Informasi Buyer</h2>

                  <p className="text-xs text-slate-500">Informasi pemesan.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-slate-400">NAMA</p>

                  <p className="mt-1 font-bold text-slate-900">
                    {order.buyerName || order.customer?.name || "Buyer"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400">KELAS</p>

                  <p className="mt-1 font-bold text-slate-900">
                    {order.className || order.customer?.className || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold text-slate-400">
                  WAKTU PENGAMBILAN
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {order.pickupTime || "-"}
                </p>
              </div>

              {order.note && (
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-400">
                    CATATAN
                  </p>

                  <p className="mt-1 text-sm text-slate-700">{order.note}</p>
                </div>
              )}
            </section>

            {/* ITEMS */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <PackageCheck size={20} />
                  </div>

                  <div>
                    <h2 className="font-black text-slate-900">Item Pesanan</h2>

                    <p className="text-xs text-slate-500">{itemCount} item</p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-5">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-300">
                        <PackageCheck size={22} />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900">{item.name}</p>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>

                    <p className="font-black text-slate-900">
                      {formatPrice(
                        Number(item.price || 0) * Number(item.quantity || 0),
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 bg-slate-50 p-6">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Total</span>

                  <span className="text-xl font-black text-green-600">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* STATUS */}
          <aside className="lg:sticky lg:top-24">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Clock3 size={20} />
                </div>

                <div>
                  <h2 className="font-black text-slate-900">Status Pesanan</h2>

                  <p className="text-xs text-slate-500">
                    Update status untuk buyer.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Status
                </label>

                <select
                  id="status"
                  value={order.status}
                  onChange={handleStatusChange}
                  disabled={saving}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-green-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {saving && (
                <div className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                  Menyimpan perubahan...
                </div>
              )}

              {!saving && (
                <div className="mt-5 flex gap-3 rounded-xl bg-green-50 p-4">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <p className="text-xs leading-5 text-green-700">
                    Status yang dipilih akan langsung tersimpan dan dapat
                    dilihat buyer.
                  </p>
                </div>
              )}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default OrderDetail;
