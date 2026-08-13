import { Link } from "react-router-dom";

function CategoryCard({ category }) {
  return (
    <Link
      to="/products"
      className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-3xl transition group-hover:bg-green-100">
        {category.icon}
      </div>

      <h3 className="mt-4 font-bold text-slate-900">
        {category.name}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {category.description}
      </p>
    </Link>
  );
}

export default CategoryCard;
