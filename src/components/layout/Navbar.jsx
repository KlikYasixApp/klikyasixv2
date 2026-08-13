import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, Store } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
function Navbar() {
  const [open, setOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const navItems = [
    { name: "Beranda", path: "/" },
    { name: "Menu", path: "/products" },
    { name: "Pesanan", path: "/orders" },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      {" "}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {" "}
        {/* LOGO */}{" "}
        <Link to="/" className="flex items-center gap-2.5">
          {" "}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm">
            {" "}
            <Store size={20} />{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-lg font-bold leading-none text-slate-900">
              {" "}
              Kantin{" "}
            </p>{" "}
            <p className="text-xs font-medium text-green-600"> School </p>{" "}
          </div>{" "}
        </Link>{" "}
        {/* DESKTOP NAV */}{" "}
        <nav className="hidden items-center gap-8 md:flex">
          {" "}
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "text-sm font-medium transition",
                  isActive
                    ? "text-green-600"
                    : "text-slate-600 hover:text-green-600",
                ].join(" ")
              }
            >
              {" "}
              {item.name}{" "}
            </NavLink>
          ))}{" "}
        </nav>{" "}
        {/* ACTIONS */}{" "}
        <div className="flex items-center gap-2">
          {" "}
          {/* SEARCH */}{" "}
          <Link
            to="/products"
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-green-600 sm:flex"
            aria-label="Cari produk"
          >
            {" "}
            <Search size={20} />{" "}
          </Link>{" "}
          {/* CART */}{" "}
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-green-600"
            aria-label="Keranjang"
          >
            {" "}
            <ShoppingCart size={21} />{" "}
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {" "}
                {cartCount > 99 ? "99+" : cartCount}{" "}
              </span>
            )}{" "}
          </Link>{" "}
          {/* MOBILE MENU */}{" "}
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 md:hidden"
            aria-label={open ? "Tutup menu" : "Buka menu"}
          >
            {" "}
            {open ? <X size={21} /> : <Menu size={21} />}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* MOBILE NAV */}{" "}
      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          {" "}
          <nav className="flex flex-col gap-2">
            {" "}
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    "rounded-xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "text-slate-700 hover:bg-slate-50",
                  ].join(" ")
                }
              >
                {" "}
                {item.name}{" "}
              </NavLink>
            ))}{" "}
            <NavLink
              to="/cart"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                [
                  "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "text-slate-700 hover:bg-slate-50",
                ].join(" ")
              }
            >
              {" "}
              <span>Keranjang</span>{" "}
              {cartCount > 0 && (
                <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs font-bold text-white">
                  {" "}
                  {cartCount}{" "}
                </span>
              )}{" "}
            </NavLink>{" "}
          </nav>{" "}
        </div>
      )}{" "}
    </header>
  );
}
export default Navbar;
