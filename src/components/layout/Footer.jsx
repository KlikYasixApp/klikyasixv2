import { Store } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white">
            <Store size={18} />
          </div>

          <div>
            <p className="font-bold text-slate-900">Kantin School</p>
            <p className="text-xs text-slate-500">
              Pesan makanan dengan mudah.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          © 2026 Kantin School. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;
