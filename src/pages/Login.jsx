import { ArrowRight, LockKeyhole, Mail, Store } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = login(form.email, form.password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    const from = location.state?.from?.pathname;

    if (from) {
      navigate(from, { replace: true });
      return;
    }

    if (result.user.role === "admin") {
      navigate("/admin", { replace: true });
      return;
    }

    if (result.user.role === "seller") {
      navigate("/seller", { replace: true });
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-12">
        <div className="w-full">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-white">
                <Store size={23} />
              </div>

              <div className="text-left">
                <p className="text-xl font-black text-slate-900">
                  Kantin
                </p>
                <p className="text-xs font-semibold text-green-600">
                  School
                </p>
              </div>
            </Link>

            <h1 className="mt-8 text-2xl font-black text-slate-900">
              Selamat Datang
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Login untuk melanjutkan.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    placeholder="nama@email.com"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-green-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    placeholder="Masukkan password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-green-500 focus:bg-white"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 font-bold text-white transition hover:bg-green-700"
              >
                Login
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
              <p className="font-bold text-slate-700">
                Demo Account
              </p>

              <p className="mt-2">
                Admin: admin@kantin.local / admin123
              </p>

              <p>
                Seller: seller@kantin.local / seller123
              </p>

              <p>
                Buyer: buyer@kantin.local / buyer123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
