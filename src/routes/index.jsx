import { createBrowserRouter } from "react-router-dom";

import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import OrderDetail from "../pages/OrderDetail";
import Login from "../pages/Login";

import Layout from "../components/layout/layout";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import AdminDashboard from "../pages/admin/Dashboard";

import SellerDashboard from "../pages/seller/Dashboard";
import Sellers from "../pages/admin/Sellers";
import SellerForm from "../pages/admin/SellerForm";
import SellerProducts from "../pages/seller/Products";
import SellerProductForm from "../pages/seller/ProductForm";
import SellerOrders from "../pages/seller/Orders";
import SellerOrderDetail from "../pages/seller/OrderDetail";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/:id",
        element: <ProductDetail />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/orders/:id",
        element: <OrderDetail />,
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/sellers",
        element: <Sellers />,
      },
      {
        path: "/admin/sellers/new",
        element: <SellerForm />,
      },
      {
        path: "/admin/sellers/:id/edit",
        element: <SellerForm />,
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={["seller"]} />,
    children: [
      {
        path: "/seller",
        element: <SellerDashboard />,
      },
      {
        path: "/seller/products",
        element: <SellerProducts />,
      },
      {
        path: "/seller/products/new",
        element: <SellerProductForm />,
      },
      {
        path: "/seller/products/:id/edit",
        element: <SellerProductForm />,
      },
      {
        path: "/seller/orders",
        element: <SellerOrders />,
      },
      {
        path: "/seller/orders/:id",
        element: <SellerOrderDetail />,
      },
    ],
  },
]);

export default router;
