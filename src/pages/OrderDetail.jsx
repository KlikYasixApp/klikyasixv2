import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  Package,
  User,
  XCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import { formatPrice } from "../data/products";
import { orderService } from "../services/orderService";

const statusSteps = [
  {
    key: "pending",
    label: "Pesanan Diterima",
    description: "Pesanan sudah masuk ke sistem kantin.",
    icon: Clock3,
  },
  {
    key: "processing",
    label: "Sedang Disiapkan",
    description: "Pesanan sedang disiapkan oleh kantin.",
    icon: Package,
  },
  {
    key: "ready",
    label: "Siap Diambil",
    description: "Pesanan sudah siap untuk diambil.",
    icon: CheckCircle2,
  },
  {
    key: "completed",
    label: "Selesai",
    description: "Pesanan telah selesai.",
    icon: Check,
  },
];

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

const getStatusIndex = (status) => {
  const index = statusSteps.findIndex((step) => step.key === status);

  return index === -1 ? 0 : index;
};

function OrderDetail() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrder = useCallback(async () => {
    if (!id) return;

    try {
      const data = await orderService.getById(id);

      if (!data) {
        throw new Error("Pesanan tidak ditemukan.");
      }

      setOrder(data);
      setError("");
    } catch (err) {
      console.error("Gagal mengambil order:", err);

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
        const data = await orderService.getById(id);

        if (!data) {
          throw new Error("Pesanan tidak ditemukan.");
        }

        if (!cancelled) {
          setOrder(data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Gagal mengambil order:", err);

          setError(err.message || "Gagal mengambil pesanan.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrder();

    const interval = setInterval(() => {
      if (!cancelled) {
        loadOrder();
      }
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [id, loadOrder]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 text-green-600">
              <Package size={36} />
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Memuat pesanan...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500">
              <Package size={36} />
            </div>

            <h1 className="mt-6 text-2xl font-black text-slate-900">
              Pesanan tidak ditemukan
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              {error || "Pesanan mungkin sudah tidak tersedia."}
            </p>

            <Link
              to="/orders"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white transition hover:bg-green-700"
            >
              <ArrowLeft size={18} />
              Kembali ke Pesanan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStatusIndex = getStatusIndex(order.status);

  const currentStatus = statusConfig[order.status] || statusConfig.pending;

  const isCancelled = order.status === "cancelled";

  const customer = order.customer || {};

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-green-600"
          >
            <ArrowLeft size={17} />
            Kembali ke Pesanan
          </Link>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">
                NOMOR PESANAN
              </p>

              <h1 className="mt-1 text-2xl font-black text-slate-900">
                {order.id}
              </h1>

              {order.createdAt && (
                <p className="mt-2 text-xs text-slate-400">
                  {new Intl.DateTimeFormat("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(order.createdAt))}
                </p>
              )}
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-slate-400">Total</p>

              <p className="text-xl font-black text-green-600">
                {formatPrice(order.total)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {/* STATUS */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-green-600">
                STATUS PESANAN
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                {currentStatus.label}
              </h2>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${currentStatus.className}`}
            >
              {currentStatus.label}
            </span>
          </div>

          {/* CANCELLED */}
          {isCancelled ? (
            <div className="mt-8 flex gap-4 rounded-2xl bg-red-50 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <XCircle size={21} />
              </div>

              <div>
                <p className="font-bold text-red-800">Pesanan Dibatalkan</p>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  Pesanan ini telah dibatalkan oleh pihak kantin.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;

                const completed = index <= currentStatusIndex;

                const current = index === currentStatusIndex;

                return (
                  <div key={step.key} className="relative flex gap-4">
                    {/* LINE */}
                    {index < statusSteps.length - 1 && (
                      <div
                        className={[
                          "absolute left-5 top-10 h-[calc(100%-8px)] w-px",
                          index < currentStatusIndex
                            ? "bg-green-500"
                            : "bg-slate-200",
                        ].join(" ")}
                      />
                    )}

                    {/* ICON */}
                    <div
                      className={[
                        "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                        completed
                          ? "bg-green-600 text-white"
                          : "bg-slate-100 text-slate-400",
                      ].join(" ")}
                    >
                      <Icon size={18} />
                    </div>

                    {/* CONTENT */}
                    <div
                      className={[
                        "pb-8",
                        index === statusSteps.length - 1 ? "pb-0" : "",
                      ].join(" ")}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className={[
                            "font-bold",
                            completed ? "text-slate-900" : "text-slate-400",
                          ].join(" ")}
                        >
                          {step.label}
                        </p>

                        {current && (
                          <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700">
                            SEKARANG
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-500">
              Status diperbarui otomatis.
            </p>
          </div>
        </section>

        {/* CUSTOMER */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <User size={20} />
            </div>

            <div>
              <h2 className="font-black text-slate-900">Informasi Pemesan</h2>

              <p className="text-xs text-slate-500">Data pengambilan pesanan</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Nama</p>

              <p className="mt-1 font-bold text-slate-900">
                {customer.name || order.buyerName || "Buyer"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Kelas</p>

              <p className="mt-1 font-bold text-slate-900">
                {customer.className || order.className || "-"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Waktu Pengambilan</p>

              <p className="mt-1 font-bold text-slate-900">
                {order.pickupTime || "-"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">Catatan</p>

              <p className="mt-1 font-bold text-slate-900">
                {order.note || "Tidak ada catatan"}
              </p>
            </div>
          </div>
        </section>

        {/* ITEMS */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <h2 className="font-black text-slate-900">Detail Pesanan</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {Array.isArray(order.items) &&
              order.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-5 sm:p-6">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      <Package size={22} />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">{item.name}</p>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>

                  <p className="font-bold text-slate-900">
                    {formatPrice(
                      Number(item.price || 0) * Number(item.quantity || 0),
                    )}
                  </p>
                </div>
              ))}
          </div>

          <div className="border-t border-slate-100 bg-slate-50 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Total</span>

              <span className="text-xl font-black text-green-600">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default OrderDetail;
