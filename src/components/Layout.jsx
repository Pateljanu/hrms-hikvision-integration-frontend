// import React, { useState } from "react";
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";
// import { Outlet } from "react-router-dom";

// export default function Layout() {
//   const [adminView, setAdminView] = useState("admin");
//   // "admin" | "employee"

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar adminView={adminView} />

//       <div className="flex-1 flex flex-col">
//         <Navbar adminView={adminView} setAdminView={setAdminView} />
//         <main className="p-6">
//           <Outlet context={{ adminView }} />
//         </main>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [adminView, setAdminView] = useState("admin");

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ---- FIXED SIDEBAR ---- */}
      <Sidebar adminView={adminView} />

      {/* ---- MAIN CONTENT (SHIFTED RIGHT) ---- */}
      <div className="md:ml-64 flex flex-col min-h-screen">

        {/* TOP NAVBAR */}
        <Navbar adminView={adminView} setAdminView={setAdminView} />

        {/* PAGE CONTENT */}
        <main className="p-6 flex-1">
          <Outlet context={{ adminView }} />
        </main>
      </div>
    </div>
  );
}
