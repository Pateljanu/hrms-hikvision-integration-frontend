




// import { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import {
//   Menu,
//   Home,
//   Users,
//   CalendarDays,
//   Clock,
//   Settings,
//   MessagesSquare,
// } from "lucide-react";
// import { fetchPendingRemarks } from "@/features/remarks/remarkThunks";

// export default function Sidebar({ adminView }) {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);

//   // 🔥 Correct field from your slice
//   const { pending = [] } = useSelector((state) => state.remarks);

//   const location = useLocation();
//   const [open, setOpen] = useState(false);

//   // 🔥 Fetch pending remarks ONCE (for admin)
//   useEffect(() => {
//     if (user?.role === "admin") {
//       dispatch(fetchPendingRemarks());
//     }
//   }, [dispatch, user]);

//   const adminLinks = [
//     { to: "/dashboard", label: "Dashboard", icon: Home },
//     { to: "/employees", label: "Employees", icon: Users },
//     { to: "/attendance", label: "Attendance", icon: Clock },
//     { to: "/leaves", label: "Leaves", icon: CalendarDays },
//     { to: "/remark", label: "Remarks", icon: MessagesSquare },
//     { to: "/company-settings", label: "Settings", icon: Settings },
//   ];

//   const employeeLinks = [
//     { to: "/my-attendance", label: "My Attendance", icon: Clock },
//     { to: "/my-leaves", label: "My Leaves", icon: CalendarDays },
//   ];

//   const links =
//     user?.role === "admin"
//       ? adminView === "employee"
//         ? employeeLinks
//         : adminLinks
//       : employeeLinks;

//   // =============================
//   // Sidebar Links Component
//   // =============================
//   const SidebarLinks = () => (
//     <nav className="flex flex-col gap-2 mt-6">
//       {links.map(({ to, label, icon: Icon }) => {
//         const isActive = location.pathname === to;
//         const isRemark = to === "/remark";

//         return (
//           <Link
//             key={to}
//             to={to}
//             className={`relative flex items-center gap-3 px-4 py-2 rounded-md transition-all
//               ${
//                 isActive
//                   ? "bg-gray-800 text-white"
//                   : "text-gray-300 hover:bg-gray-800 hover:text-white"
//               }`}
//           >
//             <Icon size={18} />
//             <span>{label}</span>

//             {/* 🔥 WhatsApp-style unread badge */}
//             {isRemark && pending.length > 0 && (
//               <span className="absolute right-4 top-2 bg-red-600 text-white text-xs px-2 py-[2px] rounded-full">
//                 {pending.length}
//               </span>
//             )}
//           </Link>
//         );
//       })}
//     </nav>
//   );

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <aside className="hidden md:flex flex-col bg-gray-900 text-white w-64 min-h-screen p-4">
//         <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
//           ERP System
//         </h2>
//         <SidebarLinks />
//       </aside>

//       {/* Mobile Sidebar */}
//       <div className="md:hidden p-2">
//         <Sheet open={open} onOpenChange={setOpen}>
//           <SheetTrigger asChild>
//             <Button variant="outline" size="sm">
//               <Menu className="w-4 h-4" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="bg-gray-900 text-white w-64">
//             <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
//               ERP System
//             </h2>
//             <SidebarLinks />
//           </SheetContent>
//         </Sheet>
//       </div>
//     </>
//   );
// }



import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Home,
  Users,
  CalendarDays,
  Clock,
  Settings,
  MessagesSquare,
} from "lucide-react";
import { fetchPendingRemarks } from "@/features/remarks/remarkThunks";

export default function Sidebar({ adminView }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Correct field from slice
  const { pending = [] } = useSelector((state) => state.remarks);

  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Fetch pending remarks for admin
  useEffect(() => {
    if (user?.role === "admin") {
      dispatch(fetchPendingRemarks());
    }
  }, [dispatch, user]);

  const adminLinks = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/employees", label: "Employees", icon: Users },
    { to: "/attendance", label: "Attendance", icon: Clock },
    { to: "/leaves", label: "Leaves", icon: CalendarDays },
    { to: "/remark", label: "Notifications", icon: MessagesSquare },
    { to: "/company-settings", label: "Settings", icon: Settings },
  ];

  const employeeLinks = [
    { to: "/my-attendance", label: "My Attendance", icon: Clock },
    { to: "/my-leaves", label: "My Leaves", icon: CalendarDays },
  ];

  const links =
    user?.role === "admin"
      ? adminView === "employee"
        ? employeeLinks
        : adminLinks
      : employeeLinks;

  // Sidebar Links component
  const SidebarLinks = () => (
    <nav className="flex flex-col gap-2 mt-6">
      {links.map(({ to, label, icon: Icon }) => {
        const isActive = location.pathname === to;
        const isRemark = to === "/remark";

        return (
          <Link
            key={to}
            to={to}
            className={`relative flex items-center gap-3 px-4 py-2 rounded-md transition-all
              ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
          >
            <Icon size={18} />
            <span>{label}</span>

            {/* Notification badge */}
            {isRemark && pending.length > 0 && (
              <span className="absolute right-4 top-2 bg-red-600 text-white text-xs px-2 py-[2px] rounded-full">
                {pending.length}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex flex-col bg-gray-900 text-white w-64 h-screen p-4 fixed top-0 left-0 shadow-lg">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
          ERP System
        </h2>
        <SidebarLinks />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden p-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Menu className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-gray-900 text-white w-64">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
              ERP System
            </h2>
            <SidebarLinks />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
