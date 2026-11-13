


// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import dayjs from "dayjs";
// import { useNavigate } from "react-router-dom";

// // Redux Thunks
// import { fetchEmployees } from "../features/employees/employeesThunks";
// import { fetchHolidays } from "../features/holidays/holidayThunks";
// import { fetchAllLeaves } from "../features/leaves/leavesThunks";
// import { fetchAttendance } from "../features/attendance/attendanceThunks";

// // ShadCN Components
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// // Recharts
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// export default function Dashboard() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Current month range
//   const monthStart = dayjs().startOf("month").format("YYYY-MM-DD");
//   const monthEnd = dayjs().endOf("month").format("YYYY-MM-DD");
//   const monthLabel = dayjs().format("MMMM YYYY");

//   const employees = useSelector((state) => state.employees.list) || [];
//   const holidays = useSelector((state) => state.holidays.list) || [];
//   const leaves = useSelector((state) => state.leaves.allLeaves) || [];
//   const attendance = useSelector((state) => state.attendance.list) || [];

//   useEffect(() => {
//     dispatch(fetchEmployees());
//     dispatch(fetchHolidays());
//     dispatch(fetchAllLeaves());
//     dispatch(fetchAttendance({ from: monthStart, to: monthEnd }));
//   }, [dispatch, monthStart, monthEnd]);

//   // -----------------------------
//   // BASIC NUMBERS
//   // -----------------------------
//   const totalEmployees = employees.length;

//   const presentDays = attendance.filter((a) =>
//     (a.status || "").toLowerCase().includes("present")
//   ).length;

//   const shortHoursDays = attendance.filter((a) =>
//     (a.status || "").toLowerCase().includes("short")
//   ).length;

//   const absentDays = attendance.filter((a) =>
//     (a.status || "").toLowerCase().includes("absent")
//   ).length;

//   const totalApprovedLeaves = leaves.filter(
//     (l) => (l.status || "").toLowerCase() === "approved"
//   ).length;

//   const totalHolidays = holidays.length;

//   // -----------------------------
//   // CHART DATA
//   // -----------------------------
//   const pieData = [
//     { name: "Present Days", value: presentDays },
//     { name: "Short Hours Days", value: shortHoursDays },
//     { name: "Absent Days", value: absentDays },
//   ];

//   const pieColors = ["#22c55e", "#f59e0b", "#ef4444"];

//   const barData = [
//     {
//       name: "This Month",
//       Employees: totalEmployees,
//       Leaves: totalApprovedLeaves,
//       Holidays: totalHolidays,
//     },
//   ];

//   const totalPieValue = useMemo(
//     () => pieData.reduce((sum, item) => sum + (item.value || 0), 0),
//     [pieData]
//   );

//   // -----------------------------
//   // RENDER
//   // -----------------------------
//   return (
//     <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-8">
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
//             Company Dashboard
//           </h1>
//           <p className="text-sm text-slate-500 mt-1">
//             Overview of attendance, leaves, holidays and employees for{" "}
//             <span className="font-semibold text-slate-700">{monthLabel}</span>.
//           </p>
//         </div>
//         <div className="text-xs md:text-sm text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
//           <span className="font-medium">Current period:</span>{" "}
//           {dayjs(monthStart).format("DD MMM")} –{" "}
//           {dayjs(monthEnd).format("DD MMM YYYY")}
//         </div>
//       </div>

//       {/* SUMMARY CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//         <StatCard
//           label="Total Employees"
//           value={totalEmployees}
//           accent="bg-blue-100 text-blue-700"
//         />
//         <StatCard
//           label="Present Days"
//           value={presentDays}
//           accent="bg-emerald-100 text-emerald-700"
//         />
//         <StatCard
//           label="Short Hours Days"
//           value={shortHoursDays}
//           accent="bg-amber-100 text-amber-700"
//         />
//         <StatCard
//           label="Absent Days"
//           value={absentDays}
//           accent="bg-red-100 text-red-700"
//         />
//         <StatCard
//           label="Approved Leaves"
//           value={totalApprovedLeaves}
//           accent="bg-indigo-100 text-indigo-700"
//         />
//       </div>

//       {/* CHARTS ROW */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* PIE CHART */}
//         <Card className="rounded-2xl shadow-sm border border-slate-200">
//           <CardHeader className="pb-3">
//             <CardTitle className="text-lg font-semibold">
//               Attendance Breakdown (This Month)
//             </CardTitle>
//             <p className="text-xs text-slate-500">
//               Distribution of Present, Short Hours, and Absent days across the
//               company.
//             </p>
//           </CardHeader>
//           <CardContent className="pt-2">
//             {totalPieValue === 0 ? (
//               <div className="h-[260px] flex items-center justify-center text-sm text-slate-500">
//                 No attendance data available for this month.
//               </div>
//             ) : (
//               <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//                 <div className="w-full md:w-1/2 h-[260px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={pieData}
//                         cx="50%"
//                         cy="50%"
//                         outerRadius={90}
//                         dataKey="value"
//                         label
//                       >
//                         {pieData.map((_, i) => (
//                           <Cell key={i} fill={pieColors[i]} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//                 <div className="flex-1 space-y-2 text-xs text-slate-600">
//                   {pieData.map((item, i) => (
//                     <div
//                       key={item.name}
//                       className="flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-2">
//                         <span
//                           className="w-3 h-3 rounded-full"
//                           style={{ backgroundColor: pieColors[i] }}
//                         />
//                         <span>{item.name}</span>
//                       </div>
//                       <span className="font-semibold text-slate-800">
//                         {item.value}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* BAR CHART */}
//         <Card className="rounded-2xl shadow-sm border border-slate-200">
//           <CardHeader className="pb-3">
//             <CardTitle className="text-lg font-semibold">
//               Company Overview
//             </CardTitle>
//             <p className="text-xs text-slate-500">
//               High-level snapshot of employees, approved leaves and holidays for
//               this month.
//             </p>
//           </CardHeader>
//           <CardContent className="pt-4">
//             <div className="h-[260px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={barData}>
//                   <XAxis dataKey="name" />
//                   <YAxis allowDecimals={false} />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="Employees" fill="#60a5fa" radius={[4, 4, 0, 0]} />
//                   <Bar dataKey="Leaves" fill="#facc15" radius={[4, 4, 0, 0]} />
//                   <Bar dataKey="Holidays" fill="#f97373" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* EMPLOYEE GRID */}
//       <div className="space-y-3">
//         <div className="flex items-center justify-between">
//           <h2 className="text-xl font-semibold">Employees</h2>
//           <p className="text-xs text-slate-500">
//             Click on a card to view detailed attendance & leave analytics.
//           </p>
//         </div>

//         {employees.length === 0 ? (
//           <p className="text-sm text-slate-500">
//             No employees found. Please add employees to see them here.
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//             {employees.map((employee) => (
//               <Card
//                 key={employee.employee_code}
//                 className="p-5 rounded-2xl shadow-sm border border-slate-200 bg-white hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer"
//                 onClick={() => navigate(`/employee/${employee.employee_code}`)}
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-semibold text-slate-700">
//                     {employee.full_name?.charAt(0) || "E"}
//                   </div>
//                   <div className="min-w-0">
//                     <h3 className="text-sm font-semibold truncate">
//                       {employee.full_name}
//                     </h3>
//                     <p className="text-xs text-slate-500">
//                       Code: {employee.employee_code}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-4 space-y-1 text-xs text-slate-600">
//                   <p>
//                     <span className="font-medium text-slate-700">Role:</span>{" "}
//                     {employee.role || "Employee"}
//                   </p>
//                   {employee.department && (
//                     <p>
//                       <span className="font-medium text-slate-700">
//                         Department:
//                       </span>{" "}
//                       {employee.department}
//                     </p>
//                   )}
//                 </div>

//                 <div className="mt-4">
//                   <button
//                     type="button"
//                     className="text-xs font-medium text-blue-600 hover:text-blue-700"
//                   >
//                     View details →
//                   </button>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /**
//  * Small metric card
//  */
// function StatCard({ label, value, accent }) {
//   return (
//     <Card className="rounded-2xl shadow-sm border border-slate-200 bg-white px-4 py-3 flex flex-col justify-between">
//       <div className="flex items-center justify-between gap-2">
//         <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
//           {label}
//         </p>
//         <span
//           className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${accent}`}
//         >
//           This Month
//         </span>
//       </div>
//       <p className="mt-3 text-2xl font-bold text-slate-900 leading-none">
//         {value}
//       </p>
//     </Card>
//   );
// }





import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

// Redux Thunks
import { fetchEmployees } from "../features/employees/employeesThunks";
import { fetchHolidays } from "../features/holidays/holidayThunks";
import { fetchAllLeaves } from "../features/leaves/leavesThunks";
import { fetchAttendance } from "../features/attendance/attendanceThunks";

// ShadCN Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Icons
import {
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Mail,
  Phone,
  Building2,
  Briefcase,
  ChevronRight,
  UserCircle,
  CalendarCheck,
  CalendarX,
  Timer,
  Award,
  Eye,
  Edit,
  MoreVertical,
  Trash2,
  Grid3X3,
  List,
  MapPin,
  ExternalLink,
} from "lucide-react";

// Recharts
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Avatar colors based on name
const getAvatarColor = (name) => {
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-cyan-500",
    "bg-amber-500",
    "bg-indigo-500",
    "bg-rose-500",
    "bg-teal-500",
  ];
  if (!name) return colors[0];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Get initials from name
const getInitials = (name) => {
  if (!name) return "EM";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");

  // Current month range
  const monthStart = dayjs().startOf("month").format("YYYY-MM-DD");
  const monthEnd = dayjs().endOf("month").format("YYYY-MM-DD");
  const monthLabel = dayjs().format("MMMM YYYY");

  const employees = useSelector((state) => state.employees.list) || [];
  const holidays = useSelector((state) => state.holidays.list) || [];
  const leaves = useSelector((state) => state.leaves.allLeaves) || [];
  const attendance = useSelector((state) => state.attendance.list) || [];

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchHolidays());
    dispatch(fetchAllLeaves());
    dispatch(fetchAttendance({ from: monthStart, to: monthEnd }));
  }, [dispatch, monthStart, monthEnd]);

  // Calculate employee-specific stats
  const getEmployeeStats = (employeeCode) => {
    const empAttendance = attendance.filter(
      (a) => a.employee_code === employeeCode
    );
    const empLeaves = leaves.filter((l) => l.employee_code === employeeCode);

    return {
      presentDays: empAttendance.filter((a) =>
        (a.status || "").toLowerCase().includes("present")
      ).length,
      absentDays: empAttendance.filter((a) =>
        (a.status || "").toLowerCase().includes("absent")
      ).length,
      leaveDays: empLeaves.filter(
        (l) => (l.status || "").toLowerCase() === "approved"
      ).length,
      pendingLeaves: empLeaves.filter(
        (l) => (l.status || "").toLowerCase() === "pending"
      ).length,
    };
  };

  // Basic Numbers
  const totalEmployees = employees.length;
  const presentDays = attendance.filter((a) =>
    (a.status || "").toLowerCase().includes("present")
  ).length;
  const shortHoursDays = attendance.filter((a) =>
    (a.status || "").toLowerCase().includes("short")
  ).length;
  const absentDays = attendance.filter((a) =>
    (a.status || "").toLowerCase().includes("absent")
  ).length;
  const totalApprovedLeaves = leaves.filter(
    (l) => (l.status || "").toLowerCase() === "approved"
  ).length;
  const totalHolidays = holidays.length;

  // Chart Data
  const pieData = [
    { name: "Present Days", value: presentDays },
    { name: "Short Hours Days", value: shortHoursDays },
    { name: "Absent Days", value: absentDays },
  ];
  const pieColors = ["#22c55e", "#f59e0b", "#ef4444"];

  const barData = [
    {
      name: "This Month",
      Employees: totalEmployees,
      Leaves: totalApprovedLeaves,
      Holidays: totalHolidays,
    },
  ];

  const totalPieValue = useMemo(
    () => pieData.reduce((sum, item) => sum + (item.value || 0), 0),
    [pieData]
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-6 md:p-8 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Company Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Overview of attendance, leaves, holidays and employees for{" "}
              <span className="font-semibold text-foreground">{monthLabel}</span>
            </p>
          </div>
          <Badge variant="outline" className="w-fit flex items-center gap-2 px-3 py-1.5">
            <Calendar className="w-4 h-4" />
            {dayjs(monthStart).format("DD MMM")} – {dayjs(monthEnd).format("DD MMM YYYY")}
          </Badge>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Total Employees"
            value={totalEmployees}
            icon={Users}
            variant="default"
          />
          <StatCard
            label="Present Days"
            value={presentDays}
            icon={CalendarCheck}
            variant="success"
          />
          <StatCard
            label="Short Hours"
            value={shortHoursDays}
            icon={Timer}
            variant="warning"
          />
          <StatCard
            label="Absent Days"
            value={absentDays}
            icon={CalendarX}
            variant="destructive"
          />
          <StatCard
            label="Approved Leaves"
            value={totalApprovedLeaves}
            icon={Award}
            variant="secondary"
          />
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PIE CHART */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Attendance Breakdown</CardTitle>
                  <CardDescription>Monthly attendance distribution</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {totalPieValue === 0 ? (
                <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
                  No attendance data available
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-full md:w-1/2 h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          dataKey="value"
                          label
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={pieColors[i]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-3 w-full">
                    {pieData.map((item, i) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: pieColors[i] }}
                          />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* BAR CHART */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Company Overview</CardTitle>
                  <CardDescription>Monthly summary snapshot</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="Employees" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Leaves" fill="#eab308" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Holidays" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* EMPLOYEE SECTION */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Team Members
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage and view employee details
              </p>
            </div>


          </div>

          {employees.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Employees Found</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                  Start by adding your first employee to see them here.
                </p>
                <Button>Add Employee</Button>
              </CardContent>
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3  gap-4">
              {employees.map((employee) => (
                <EmployeeGridCard
                  key={employee.employee_code}
                  employee={employee}
                  stats={getEmployeeStats(employee.employee_code)}
                  onClick={() => navigate(`/employee/${employee.employee_code}`)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {employees.map((employee) => (
                <EmployeeListCard
                  key={employee.employee_code}
                  employee={employee}
                  stats={getEmployeeStats(employee.employee_code)}
                  onClick={() => navigate(`/employee/${employee.employee_code}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

/**
 * Stat Card Component
 */
function StatCard({ label, value, icon: Icon, variant = "default" }) {
  const variants = {
    default: "bg-primary/10 text-primary",
    success: "bg-emerald-500/10 text-emerald-600",
    warning: "bg-amber-500/10 text-amber-600",
    destructive: "bg-red-500/10 text-red-600",
    secondary: "bg-violet-500/10 text-violet-600",
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`p-2.5 rounded-lg ${variants[variant]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Employee Grid Card - ShadCN Style
 */
function EmployeeGridCard({ employee, stats, onClick }) {
  const avatarColor = getAvatarColor(employee.full_name);
  const initials = getInitials(employee.full_name);
  const status = employee.status || "active";

  const statusConfig = {
    active: { label: "Active", variant: "default" },
    inactive: { label: "Inactive", variant: "secondary" },
    onLeave: { label: "On Leave", variant: "warning" },
    probation: { label: "Probation", variant: "outline" },
  };

  const currentStatus = statusConfig[status] || statusConfig.active;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={employee.avatar} alt={employee.full_name} />
              <AvatarFallback className={`${avatarColor} text-white font-semibold`}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-base leading-none group-hover:text-primary transition-colors">
                {employee.full_name}
              </CardTitle>
              <CardDescription className="text-xs">
                {employee.employee_code}
              </CardDescription>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onClick}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-3" onClick={onClick}>
        <div className="space-y-3">
          {/* Status Badge */}
          <Badge variant={currentStatus.variant} className="text-xs">
            {currentStatus.label}
          </Badge>

          {/* Employee Info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="w-4 h-4" />
              <span className="truncate">
                {employee.role || employee.designation || "Employee"}
              </span>
            </div>

            {employee.department && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="w-4 h-4" />
                <span className="truncate">{employee.department}</span>
              </div>
            )}

            {employee.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="truncate text-xs">{employee.email}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950">
                  <p className="text-lg font-bold text-emerald-600">{stats.presentDays}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Present</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>Present Days This Month</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950">
                  <p className="text-lg font-bold text-red-600">{stats.absentDays}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Absent</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>Absent Days This Month</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950">
                  <p className="text-lg font-bold text-amber-600">{stats.leaveDays}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Leaves</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>Approved Leaves This Month</TooltipContent>
            </Tooltip>
          </div>

          {/* Pending Leaves Alert */}
          {stats.pendingLeaves > 0 && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Pending Requests
              </span>
              <Badge variant="warning" className="bg-amber-500 text-white">
                {stats.pendingLeaves}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0" onClick={onClick}>
      <Button
  variant="outline"
  size="sm"
  className="w-full flex items-center justify-between hover:bg-gray-50"
>
  <span>View Details</span>
  <ChevronRight className="w-4 h-4" />
</Button>


      </CardFooter>
    </Card>
  );
}

