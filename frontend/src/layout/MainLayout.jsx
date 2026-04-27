import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT AREA */}
      <div className="md:ml-64 flex flex-col min-h-screen">

        {/* HEADER */}
        <Header />

        {/* MAIN CONTENT */}
        <main className="flex-1 px-4 md:px-6 py-4 md:py-6 pb-24 md:pb-6">

          {/* 🔥 CONTENT CONTAINER (IMPORTANT) */}
          <div className="max-w-6xl mx-auto">

            {/* 🔥 CARD WRAPPER */}
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 min-h-[calc(100vh-160px)]">

              {children}

            </div>

          </div>
        </main>

        {/* MOBILE NAV */}
        <BottomNav />

      </div>
    </div>
  );
}