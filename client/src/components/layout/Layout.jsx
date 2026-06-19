import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 antialiased selection:bg-emerald-500 selection:text-black">
      <Navbar />

      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}