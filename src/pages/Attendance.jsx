// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useSearchParams } from "react-router-dom";

// /* Thunks */
// import {
//   fetchAttendance,
//   fetchMyAttendance,
// } from "../features/attendance/attendanceThunks";
// import { fetchEmployees } from "../features/employees/employeesThunks";
// import { fetchAllLeaves } from "../features/leaves/leavesThunks";

// /* UI Components */
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar as CalendarIcon } from "lucide-react";

// /* shadcn chart helpers */
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// /* Recharts */
// import { PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

// /* ------------------------------------------------------------------ */
// /* CONSTANTS & HELPERS */
// /* ------------------------------------------------------------------ */

// const STATUS_COLOR_MAP = {
//   "Present-Full": "#16a34a",
//   "Short-Hours": "#f59e0b",
//   Leave: "#2563eb",
//   Absent: "#ef4444",
// };

// const STATUS_META = {
//   all: {
//     label: "All",
//     card: {
//       border: "border-slate-300",
//       hoverBorder: "hover:border-slate-400",
//       text: "text-slate-700",
//       bg: "bg-slate-50",
//       ring: "ring-slate-300/60",
//     },
//     badge: "bg-slate-500 text-white",
//   },
//   "Present-Full": {
//     label: "Present",
//     card: {
//       border: "border-green-500",
//       hoverBorder: "hover:border-green-400",
//       text: "text-green-700",
//       bg: "bg-green-50",
//       ring: "ring-green-300/60",
//     },
//     badge: "bg-green-500 text-white hover:bg-green-600",
//   },
//   "Short-Hours": {
//     label: "Short Hours",
//     card: {
//       border: "border-yellow-500",
//       hoverBorder: "hover:border-yellow-400",
//       text: "text-yellow-700",
//       bg: "bg-yellow-50",
//       ring: "ring-yellow-300/60",
//     },
//     badge: "bg-yellow-500 text-white hover:bg-yellow-600",
//   },
//   Leave: {
//     label: "Leave",
//     card: {
//       border: "border-blue-500",
//       hoverBorder: "hover:border-blue-400",
//       text: "text-blue-700",
//       bg: "bg-blue-50",
//       ring: "ring-blue-300/60",
//     },
//     badge: "bg-blue-500 text-white hover:bg-blue-600",
//   },
//   Absent: {
//     label: "Absent",
//     card: {
//       border: "border-red-500",
//       hoverBorder: "hover:border-red-400",
//       text: "text-red-700",
//       bg: "bg-red-50",
//       ring: "ring-red-300/60",
//     },
//     badge: "bg-red-500 text-white hover:bg-red-600",
//   },
// };

// function normalizeWorkedHours(worked) {
//   if (!worked) return { hours: "-", minutes: "-" };
//   if (typeof worked === "object") {
//     return {
//       hours: worked.hours ?? 0,
//       minutes: worked.minutes ?? 0,
//     };
//   }
//   if (typeof worked === "string" && worked.includes(":")) {
//     const [h, m] = worked.split(":");
//     return { hours: Number(h) || 0, minutes: Number(m) || 0 };
//   }
//   return { hours: 0, minutes: 0 };
// }

// function formatDate(date) {
//   return new Date(date).toLocaleDateString();
// }

// function getDayName(date) {
//   return new Date(date).toLocaleDateString("en-US", { weekday: "long" });
// }

// function toLocalISO(d) {
//   if (!d) return "";
//   const date = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
//   return date.toISOString().split("T")[0];
// }

// function isDateBetween(dateStr, startStr, endStr) {
//   if (!dateStr || !startStr || !endStr) return false;
//   const d = new Date(dateStr);
//   const s = new Date(startStr);
//   const e = new Date(endStr);
//   e.setHours(23, 59, 59, 999);
//   return d >= s && d <= e;
// }

// /* ------------------------------------------------------------------ */
// /* COMPONENT */
// /* ------------------------------------------------------------------ */

// export default function Attendance() {
//   const dispatch = useDispatch();
//   const [searchParams] = useSearchParams();
//   const empFromURL = searchParams.get("emp") || null;

//   /* ---------------------------- REDUX STATE ---------------------------- */
//   const {
//     list = [],
//     myList = [],
//     loadingList,
//     loadingMyList,
//     error,
//   } = useSelector((state) => state.attendance);

//   const { list: employees = [] } = useSelector((state) => state.employees);
//   const { user } = useSelector((state) => state.auth);
//   const { allLeaves = [] } = useSelector((state) => state.leaves);

//   /* ---------------------------- LOCAL STATE ---------------------------- */
//   const today = new Date();
//   const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

//   const [fromDate, setFromDate] = useState(toLocalISO(firstDay));
//   const [toDate, setToDate] = useState(toLocalISO(today));
//   const [selectedEmp, setSelectedEmp] = useState("all");
//   const [selectedStatus, setSelectedStatus] = useState("all");

//   const [range, setRange] = useState({
//     from: new Date(fromDate),
//     to: new Date(toDate),
//   });

//   /* ------------------------------ EFFECTS ------------------------------ */

//   // Initial fetch: employees & leaves
//   useEffect(() => {
//     if (user?.role === "admin") dispatch(fetchEmployees());
//     dispatch(fetchAllLeaves());
//   }, [dispatch, user]);

//   // 🔥 FIX APPLIED — NEVER overwrite toDate when range.to is undefined
//   useEffect(() => {
//     if (range?.from) setFromDate(toLocalISO(range.from));
//     if (range?.to) setToDate(toLocalISO(range.to));
//   }, [range]);

//   useEffect(() => {
//     if (empFromURL) setSelectedEmp(empFromURL);
//   }, [empFromURL]);

//   useEffect(() => {
//     runFetch();
//   }, [user]);

//   /* ----------------------------- CALLBACKS ----------------------------- */

//   const runFetch = useCallback(() => {
//     if (!fromDate || !toDate) return;

//     const selected = empFromURL || selectedEmp;

//     if (user?.role === "admin") {
//       dispatch(
//         fetchAttendance({
//           from: fromDate,
//           to: toDate,
//           employeeCode: selected !== "all" ? selected : undefined,
//         })
//       );
//     } else {
//       dispatch(fetchMyAttendance({ from: fromDate, to: toDate }));
//     }
//   }, [dispatch, user, fromDate, toDate, empFromURL, selectedEmp]);

//   const handleStatusClick = (key) => {
//     setSelectedStatus((prev) => (prev === key ? "all" : key));
//   };

//   const setThisMonthToToday = () => {
//     const now = new Date();
//     const start = new Date(now.getFullYear(), now.getMonth(), 1);
//     setRange({ from: start, to: now });
//   };

//   const clearRange = () => {
//     setRange({ from: undefined, to: undefined });
//   };

//   const statusToBadgeClass = (status) =>
//     STATUS_META[status]?.badge || STATUS_META["all"].badge;

//   /* ------------------------------- MEMOS ------------------------------- */

//   const employeeMap = useMemo(() => {
//     const map = {};
//     employees.forEach((e) => {
//       map[e.employee_code] = e.full_name;
//     });
//     return map;
//   }, [employees]);

//   const isAdmin = user?.role === "admin";
//   const sourceData = isAdmin ? list : myList;
//   const employeeFilter = empFromURL || selectedEmp;

//   const empFiltered = useMemo(() => {
//     if (!isAdmin || employeeFilter === "all") return sourceData;
//     return sourceData.filter(
//       (d) => String(d.employee_code) === String(employeeFilter)
//     );
//   }, [sourceData, isAdmin, employeeFilter]);

//   const mergedRecords = useMemo(() => {
//     if (!empFiltered?.length) return [];
//     return empFiltered.map((a) => {
//       const hasLeave = allLeaves.some((l) => {
//         return (
//           String(l.employee_code) === String(a.employee_code) &&
//           l.status === "Approved" &&
//           isDateBetween(a.attendance_date, l.start_date, l.end_date)
//         );
//       });

//       return {
//         ...a,
//         status: hasLeave ? "Leave" : a.status,
//         worked_hours: hasLeave ? null : a.worked_hours,
//         clock_in: hasLeave ? null : a.clock_in,
//         clock_out: hasLeave ? null : a.clock_out,
//       };
//     });
//   }, [empFiltered, allLeaves]);

//   const recordsForDisplay = useMemo(() => {
//     if (selectedStatus === "all") return mergedRecords;
//     return mergedRecords.filter((r) => r.status === selectedStatus);
//   }, [mergedRecords, selectedStatus]);

//   const presentCount = useMemo(
//     () => mergedRecords.filter((a) => a.status === "Present-Full").length,
//     [mergedRecords]
//   );
//   const shortCount = useMemo(
//     () => mergedRecords.filter((a) => a.status === "Short-Hours").length,
//     [mergedRecords]
//   );
//   const leaveCount = useMemo(
//     () => mergedRecords.filter((a) => a.status === "Leave").length,
//     [mergedRecords]
//   );
//   const absentCount = useMemo(
//     () => mergedRecords.filter((a) => a.status === "Absent").length,
//     [mergedRecords]
//   );

//   const summaryItems = [
//     { key: "all", label: STATUS_META["all"].label, count: mergedRecords.length },
//     {
//       key: "Present-Full",
//       label: STATUS_META["Present-Full"].label,
//       count: presentCount,
//     },
//     {
//       key: "Short-Hours",
//       label: STATUS_META["Short-Hours"].label,
//       count: shortCount,
//     },
//     {
//       key: "Leave",
//       label: STATUS_META["Leave"].label,
//       count: leaveCount,
//     },
//     {
//       key: "Absent",
//       label: STATUS_META["Absent"].label,
//       count: absentCount,
//     },
//   ];

//   const baseTitle = isAdmin
//     ? employeeFilter === "all"
//       ? "All Employees Attendance"
//       : `Attendance of ${employeeMap[employeeFilter] || ""}`
//     : "My Attendance";

//   const statusSuffix =
//     selectedStatus !== "all" ? ` — ${STATUS_META[selectedStatus].label}` : "";

//   const title = `${baseTitle}${statusSuffix}`;

//   const statusCounts = useMemo(() => {
//     if (!recordsForDisplay?.length) return [];
//     const counts = {
//       "Present-Full": 0,
//       "Short-Hours": 0,
//       Leave: 0,
//       Absent: 0,
//     };
//     recordsForDisplay.forEach((r) => {
//       if (counts[r.status] != null) counts[r.status] += 1;
//     });
//     return [
//       { name: "Present", key: "Present-Full", value: counts["Present-Full"] },
//       { name: "Short", key: "Short-Hours", value: counts["Short-Hours"] },
//       { name: "Leave", key: "Leave", value: counts["Leave"] },
//       { name: "Absent", key: "Absent", value: counts["Absent"] },
//     ].filter((s) => s.value > 0);
//   }, [recordsForDisplay]);

//   const totalDays = useMemo(
//     () => statusCounts.reduce((sum, s) => sum + s.value, 0),
//     [statusCounts]
//   );

//   const stackedBarSeries = useMemo(() => {
//     if (!recordsForDisplay?.length) return [];
//     const map = {};
//     recordsForDisplay.forEach((r) => {
//       const dateObj = new Date(r.attendance_date || Date.now());
//       const dateKey = toLocalISO(dateObj);
//       if (!map[dateKey]) {
//         map[dateKey] = {
//           date: dateKey,
//           label: new Date(dateKey).toLocaleDateString(),
//           present: 0,
//           short: 0,
//           leave: 0,
//           absent: 0,
//         };
//       }
//       if (r.status === "Present-Full") map[dateKey].present += 1;
//       else if (r.status === "Short-Hours") map[dateKey].short += 1;
//       else if (r.status === "Leave") map[dateKey].leave += 1;
//       else if (r.status === "Absent") map[dateKey].absent += 1;
//     });

//     return Object.values(map).sort(
//       (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
//     );
//   }, [recordsForDisplay]);

//   /* ------------------------------- RENDER ------------------------------- */

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Attendance</h1>

//       {/* FILTERS */}
//       <div className="flex flex-wrap items-end gap-4">
//         <div>
//           <label className="text-sm font-medium">Date range</label>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button variant="outline" className="w-[280px] justify-between">
//                 {range?.from
//                   ? `${toLocalISO(range.from)}${range?.to ? ` — ${toLocalISO(range.to)}` : ""}`
//                   : "Pick dates"}
//                 <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
//               </Button>
//             </PopoverTrigger>

//             <PopoverContent className="w-auto p-0" align="start">
//               <Calendar
//                 mode="range"
//                 numberOfMonths={2}
//                 pagedNavigation
//                 defaultMonth={range?.from}
//                 selected={range}
//                 onSelect={(r) => setRange(r)}
//                 showOutsideDays={false}
//               />
//               <div className="flex items-center gap-2 border-t p-2">
//                 <Button variant="ghost" size="sm" onClick={clearRange}>
//                   Clear
//                 </Button>
//                 <div className="ml-auto space-x-2">
//                   <Button variant="secondary" size="sm" onClick={setThisMonthToToday}>
//                     This month
//                   </Button>
//                   <Button
//                     size="sm"
//                     onClick={runFetch}
//                     disabled={!fromDate || !toDate}
//                   >
//                     Apply
//                   </Button>
//                 </div>
//               </div>
//             </PopoverContent>
//           </Popover>
//         </div>

//         {isAdmin && (
//           <div>
//             <label className="text-sm font-medium">Employee</label>
//             <Select
//               value={selectedEmp}
//               onValueChange={(v) => setSelectedEmp(v)}
//             >
//               <SelectTrigger className="w-[240px]">
//                 <SelectValue placeholder="Select employee" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Employees</SelectItem>
//                 {employees.map((emp) => (
//                   <SelectItem key={emp.employee_code} value={String(emp.employee_code)}>
//                     {emp.full_name} ({emp.employee_code})
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         )}

//         <Button onClick={runFetch} disabled={!fromDate || !toDate}>
//           Filter
//         </Button>
//       </div>

//       {/* ADMIN DASHBOARD ONLY */}
//       {isAdmin && (
//         <>
//           {/* SUMMARY CARDS */}
//           <Card className="border border-slate-200 rounded-2xl shadow-sm">
//             <CardHeader>
//               <CardTitle className="text-lg">Attendance Summary</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {loadingList ? (
//                 <p>Loading...</p>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
//                   {summaryItems.map((item) => {
//                     const meta = STATUS_META[item.key];
//                     const isActive = selectedStatus === item.key;

//                     return (
//                       <Card
//                         key={item.key}
//                         role="button"
//                         tabIndex={0}
//                         aria-pressed={isActive}
//                         onClick={() => handleStatusClick(item.key)}
//                         className={[
//                           "cursor-pointer select-none border-2 transition",
//                           meta.card.bg,
//                           meta.card.text,
//                           meta.card.hoverBorder,
//                           isActive
//                             ? `ring-2 ${meta.card.ring} ${meta.card.border}`
//                             : "border-slate-200",
//                         ].join(" ")}
//                       >
//                         <CardContent className="p-4 text-center">
//                           <p className="uppercase text-xs font-semibold tracking-wide">
//                             {item.label}
//                           </p>
//                           <p className="text-3xl font-bold">{item.count}</p>
//                         </CardContent>
//                       </Card>
//                     );
//                   })}
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* PIE LEFT, STACKED BAR RIGHT */}
//           <div className="grid gap-6 lg:grid-cols-3">
//             {/* Pie on left */}
//             <Card className="border border-slate-200 rounded-2xl shadow-sm lg:col-span-1">
//               <CardHeader className="pb-1">
//                 <CardTitle className="text-sm font-semibold">Status Breakdown</CardTitle>
//                 <p className="text-xs text-slate-500 mt-1">
//                   Share of records by status in the selected range
//                   {selectedStatus !== "all" ? ` (${STATUS_META[selectedStatus].label})` : ""}.
//                 </p>
//               </CardHeader>
//               <CardContent className="flex items-center justify-center pt-2 pb-3">
//                 {statusCounts.length === 0 ? (
//                   <p className="text-sm text-slate-500">No data.</p>
//                 ) : (
//                   <div className="flex flex-col items-center w-full gap-2">
//                     <ChartContainer config={{}} className="h-[170px] w-[170px]">
//                       <PieChart>
//                         <Pie
//                           data={statusCounts}
//                           dataKey="value"
//                           nameKey="name"
//                           innerRadius={50}
//                           outerRadius={75}
//                           paddingAngle={3}
//                           stroke="#ffffff"
//                           strokeWidth={3}
//                         >
//                           {statusCounts.map((s) => (
//                             <Cell
//                               key={s.key}
//                               fill={STATUS_COLOR_MAP[s.key] || "hsl(var(--primary))"}
//                             />
//                           ))}
//                         </Pie>
//                       </PieChart>
//                     </ChartContainer>

//                     <p className="text-xs text-slate-500">
//                       Total:{" "}
//                       <span className="font-semibold text-slate-700">{totalDays}</span>
//                     </p>

//                     <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] mt-1">
//                       {statusCounts.map((s) => (
//                         <span key={s.key} className="inline-flex items-center gap-1 text-slate-600">
//                           <span
//                             className="w-2.5 h-2.5 rounded-full inline-block"
//                             style={{
//                               backgroundColor: STATUS_COLOR_MAP[s.key] || "hsl(var(--primary))",
//                             }}
//                           />
//                           {s.name} ({s.value})
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Stacked bar on right */}
//             <Card className="border border-slate-200 rounded-2xl shadow-sm lg:col-span-2">
//               <CardHeader>
//                 <CardTitle className="text-lg font-semibold">Daily Status Trend</CardTitle>
//                 <p className="text-sm text-slate-500">
//                   Per-day counts of Present, Short, Leave, and Absent.
//                 </p>
//               </CardHeader>
//               <CardContent>
//                 {stackedBarSeries.length === 0 ? (
//                   <p className="text-center text-sm text-slate-500 py-10">
//                     No attendance data for the selected range.
//                   </p>
//                 ) : (
//                   <ChartContainer config={{}} className="h-[320px] w-full">
//                     <BarChart data={stackedBarSeries} stackOffset="none" barSize={24}>
//                       <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
//                       <XAxis
//                         dataKey="label"
//                         tickLine={false}
//                         axisLine={false}
//                         tickMargin={8}
//                         style={{ fontSize: 11 }}
//                       />
//                       <YAxis
//                         tickLine={false}
//                         axisLine={false}
//                         tickMargin={8}
//                         style={{ fontSize: 11 }}
//                       />
//                       <ChartTooltip
//                         content={
//                           <ChartTooltipContent
//                             formatter={(value, name) => `${value} ${name}`}
//                             labelFormatter={(label) => `Date: ${label}`}
//                           />
//                         }
//                       />
//                       <Bar dataKey="present" stackId="a" name="Present" fill={STATUS_COLOR_MAP["Present-Full"]} />
//                       <Bar dataKey="short" stackId="a" name="Short" fill={STATUS_COLOR_MAP["Short-Hours"]} />
//                       <Bar dataKey="leave" stackId="a" name="Leave" fill={STATUS_COLOR_MAP["Leave"]} />
//                       <Bar dataKey="absent" stackId="a" name="Absent" fill={STATUS_COLOR_MAP["Absent"]} />
//                     </BarChart>
//                   </ChartContainer>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </>
//       )}

//       {/* TABLE */}
//       <Card>
//         <CardHeader>
//           <CardTitle>{title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {loadingList || loadingMyList ? (
//             <p>Loading...</p>
//           ) : error ? (
//             <p className="text-red-500">{error}</p>
//           ) : recordsForDisplay.length === 0 ? (
//             <p>No attendance found.</p>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   {isAdmin && <TableHead>Emp Code</TableHead>}
//                   {isAdmin && <TableHead>Full Name</TableHead>}
//                   <TableHead>Date</TableHead>
//                   <TableHead>Day</TableHead>
//                   <TableHead>Clock In</TableHead>
//                   <TableHead>Clock Out</TableHead>
//                   <TableHead>Worked Hours</TableHead>
//                   <TableHead>Status</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {recordsForDisplay.map((a) => {
//                   const wh = normalizeWorkedHours(a.worked_hours);

//                   return (
//                     <TableRow key={a.id}>
//                       {isAdmin && (
//                         <>
//                           <TableCell>{a.employee_code}</TableCell>
//                           <TableCell>{employeeMap[a.employee_code] || "-"}</TableCell>
//                         </>
//                       )}

//                       <TableCell>{formatDate(a.attendance_date)}</TableCell>
//                       <TableCell>{getDayName(a.attendance_date)}</TableCell>
//                       <TableCell>{a.clock_in || "-"}</TableCell>
//                       <TableCell>{a.clock_out || "-"}</TableCell>

//                       <TableCell>
//                         {wh.hours === "-" ? "-" : `${wh.hours}h ${wh.minutes}m`}
//                       </TableCell>

//                       <TableCell>
//                         <Badge className={statusToBadgeClass(a.status)}>{a.status}</Badge>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

/* Thunks */
import {
  fetchAttendance,
  fetchMyAttendance,
} from "../features/attendance/attendanceThunks";
import { fetchEmployees } from "../features/employees/employeesThunks";
import { fetchAllLeaves } from "../features/leaves/leavesThunks";

/* UI Components */
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";

/* shadcn chart helpers */
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

/* Recharts */
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

/* ------------------------------------------------------------------ */
/* CONSTANTS & HELPERS */
/* ------------------------------------------------------------------ */

const STATUS_COLOR_MAP = {
  "Present-Full": "#16a34a",
  "Short-Hours": "#f59e0b",
  Leave: "#2563eb",
  Absent: "#ef4444",
};

const STATUS_META = {
  all: {
    label: "All",
    card: {
      border: "border-slate-300",
      hoverBorder: "hover:border-slate-400",
      text: "text-slate-700",
      bg: "bg-slate-50",
      ring: "ring-slate-300/60",
    },
    badge: "bg-slate-500 text-white",
  },
  "Present-Full": {
    label: "Present",
    card: {
      border: "border-green-500",
      hoverBorder: "hover:border-green-400",
      text: "text-green-700",
      bg: "bg-green-50",
      ring: "ring-green-300/60",
    },
    badge: "bg-green-500 text-white hover:bg-green-600",
  },
  "Short-Hours": {
    label: "Short Hours",
    card: {
      border: "border-yellow-500",
      hoverBorder: "hover:border-yellow-400",
      text: "text-yellow-700",
      bg: "bg-yellow-50",
      ring: "ring-yellow-300/60",
    },
    badge: "bg-yellow-500 text-white hover:bg-yellow-600",
  },
  Leave: {
    label: "Leave",
    card: {
      border: "border-blue-500",
      hoverBorder: "hover:border-blue-400",
      text: "text-blue-700",
      bg: "bg-blue-50",
      ring: "ring-blue-300/60",
    },
    badge: "bg-blue-500 text-white hover:bg-blue-600",
  },
  Absent: {
    label: "Absent",
    card: {
      border: "border-red-500",
      hoverBorder: "hover:border-red-400",
      text: "text-red-700",
      bg: "bg-red-50",
      ring: "ring-red-300/60",
    },
    badge: "bg-red-500 text-white hover:bg-red-600",
  },
};

function normalizeWorkedHours(worked) {
  if (!worked) return { hours: "-", minutes: "-" };
  if (typeof worked === "object") {
    return {
      hours: worked.hours ?? 0,
      minutes: worked.minutes ?? 0,
    };
  }
  if (typeof worked === "string" && worked.includes(":")) {
    const [h, m] = worked.split(":");
    return { hours: Number(h) || 0, minutes: Number(m) || 0 };
  }
  return { hours: 0, minutes: 0 };
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

function getDayName(date) {
  return new Date(date).toLocaleDateString("en-US", { weekday: "long" });
}

function toLocalISO(d) {
  if (!d) return "";
  const date = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return date.toISOString().split("T")[0];
}

function isDateBetween(dateStr, startStr, endStr) {
  if (!dateStr || !startStr || !endStr) return false;
  const d = new Date(dateStr);
  const s = new Date(startStr);
  const e = new Date(endStr);
  e.setHours(23, 59, 59, 999);
  return d >= s && d <= e;
}

/* ------------------------------------------------------------------ */
/* COMPONENT */
/* ------------------------------------------------------------------ */

export default function Attendance() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const empFromURL = searchParams.get("emp") || null;

  /* ---------------------------- REDUX STATE ---------------------------- */
  const {
    list = [],
    myList = [],
    loadingList,
    loadingMyList,
    error,
  } = useSelector((state) => state.attendance);

  const { list: employees = [] } = useSelector((state) => state.employees);
  const { user } = useSelector((state) => state.auth);
  const { allLeaves = [] } = useSelector((state) => state.leaves);

  /* ---------------------------- LOCAL STATE ---------------------------- */
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const [fromDate, setFromDate] = useState(toLocalISO(firstDay));
  const [toDate, setToDate] = useState(toLocalISO(today));
  const [selectedEmp, setSelectedEmp] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [range, setRange] = useState({
    from: new Date(fromDate),
    to: new Date(toDate),
  });

  /* ------------------------------ EFFECTS ------------------------------ */

  // Initial fetch: employees & leaves
  useEffect(() => {
    if (user?.role === "admin") dispatch(fetchEmployees());
    dispatch(fetchAllLeaves());
  }, [dispatch, user]);

  // Keep from/to in sync with range (without overriding when to is missing)
  useEffect(() => {
    if (range?.from) setFromDate(toLocalISO(range.from));
    if (range?.to) setToDate(toLocalISO(range.to));
  }, [range]);

  useEffect(() => {
    if (empFromURL) setSelectedEmp(empFromURL);
  }, [empFromURL]);

  useEffect(() => {
    runFetch();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ----------------------------- CALLBACKS ----------------------------- */

  const runFetch = useCallback(() => {
    if (!fromDate || !toDate) return;

    const selected = empFromURL || selectedEmp;

    if (user?.role === "admin") {
      dispatch(
        fetchAttendance({
          from: fromDate,
          to: toDate,
          employeeCode: selected !== "all" ? selected : undefined,
        })
      );
    } else {
      dispatch(fetchMyAttendance({ from: fromDate, to: toDate }));
    }
  }, [dispatch, user, fromDate, toDate, empFromURL, selectedEmp]);

  const handleStatusClick = (key) => {
    setSelectedStatus((prev) => (prev === key ? "all" : key));
  };

  const setThisMonthToToday = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    setRange({ from: start, to: now });
  };

  const clearRange = () => {
    setRange({ from: undefined, to: undefined });
  };

  const statusToBadgeClass = (status) =>
    STATUS_META[status]?.badge || STATUS_META["all"].badge;

  /* ------------------------------- MEMOS ------------------------------- */

  const employeeMap = useMemo(() => {
    const map = {};
    employees.forEach((e) => {
      map[e.employee_code] = e.full_name;
    });
    return map;
  }, [employees]);

  const isAdmin = user?.role === "admin";
  const sourceData = isAdmin ? list : myList;
  const employeeFilter = empFromURL || selectedEmp;

  const empFiltered = useMemo(() => {
    if (!isAdmin || employeeFilter === "all") return sourceData;
    return sourceData.filter(
      (d) => String(d.employee_code) === String(employeeFilter)
    );
  }, [sourceData, isAdmin, employeeFilter]);

 const mergedRecords = useMemo(() => {
  if (!empFiltered?.length) return [];

  return empFiltered.map((a) => {
    const hasClockIn = !!a.clock_in || !!a.clock_out || !!a.worked_hours;

    const hasApprovedLeave = allLeaves.some((l) => {
      return (
        String(l.employee_code) === String(a.employee_code) &&
        l.status === "Approved" &&
        isDateBetween(a.attendance_date, l.start_date, l.end_date)
      );
    });

    // ✅ Attendance overrides leave
    if (hasClockIn) {
      return {
        ...a,
        status: a.status, // Present / Short-Hours stays
      };
    }

    // ✅ Leave only if no attendance
    if (hasApprovedLeave) {
      return {
        ...a,
        status: "Leave",
        worked_hours: null,
        clock_in: null,
        clock_out: null,
      };
    }

    return a;
  });
}, [empFiltered, allLeaves]);


  const recordsForDisplay = useMemo(() => {
    if (selectedStatus === "all") return mergedRecords;
    return mergedRecords.filter((r) => r.status === selectedStatus);
  }, [mergedRecords, selectedStatus]);

  const presentCount = useMemo(
    () => mergedRecords.filter((a) => a.status === "Present-Full").length,
    [mergedRecords]
  );
  const shortCount = useMemo(
    () => mergedRecords.filter((a) => a.status === "Short-Hours").length,
    [mergedRecords]
  );
  const leaveCount = useMemo(
    () => mergedRecords.filter((a) => a.status === "Leave").length,
    [mergedRecords]
  );
  const absentCount = useMemo(
    () => mergedRecords.filter((a) => a.status === "Absent").length,
    [mergedRecords]
  );

  const summaryItems = [
    { key: "all", label: STATUS_META["all"].label, count: mergedRecords.length },
    {
      key: "Present-Full",
      label: STATUS_META["Present-Full"].label,
      count: presentCount,
    },
    {
      key: "Short-Hours",
      label: STATUS_META["Short-Hours"].label,
      count: shortCount,
    },
    {
      key: "Leave",
      label: STATUS_META["Leave"].label,
      count: leaveCount,
    },
    {
      key: "Absent",
      label: STATUS_META["Absent"].label,
      count: absentCount,
    },
  ];

  const baseTitle = isAdmin
    ? employeeFilter === "all"
      ? "All Employees Attendance"
      : `Attendance of ${employeeMap[employeeFilter] || ""}`
    : "My Attendance";

  const statusSuffix =
    selectedStatus !== "all" ? ` — ${STATUS_META[selectedStatus].label}` : "";

  const title = `${baseTitle}${statusSuffix}`;

  const statusCounts = useMemo(() => {
    if (!recordsForDisplay?.length) return [];
    const counts = {
      "Present-Full": 0,
      "Short-Hours": 0,
      Leave: 0,
      Absent: 0,
    };
    recordsForDisplay.forEach((r) => {
      if (counts[r.status] != null) counts[r.status] += 1;
    });
    return [
      { name: "Present", key: "Present-Full", value: counts["Present-Full"] },
      { name: "Short", key: "Short-Hours", value: counts["Short-Hours"] },
      { name: "Leave", key: "Leave", value: counts["Leave"] },
      { name: "Absent", key: "Absent", value: counts["Absent"] },
    ].filter((s) => s.value > 0);
  }, [recordsForDisplay]);

  const totalDays = useMemo(
    () => statusCounts.reduce((sum, s) => sum + s.value, 0),
    [statusCounts]
  );

  const stackedBarSeries = useMemo(() => {
    if (!recordsForDisplay?.length) return [];
    const map = {};
    recordsForDisplay.forEach((r) => {
      const dateObj = new Date(r.attendance_date || Date.now());
      const dateKey = toLocalISO(dateObj);
      if (!map[dateKey]) {
        map[dateKey] = {
          date: dateKey,
          label: new Date(dateKey).toLocaleDateString(),
          present: 0,
          short: 0,
          leave: 0,
          absent: 0,
        };
      }
      if (r.status === "Present-Full") map[dateKey].present += 1;
      else if (r.status === "Short-Hours") map[dateKey].short += 1;
      else if (r.status === "Leave") map[dateKey].leave += 1;
      else if (r.status === "Absent") map[dateKey].absent += 1;
    });

    return Object.values(map).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [recordsForDisplay]);

  /* -------- NEW: Paid / Unpaid leave totals (all or per employee) ------ */

  const paidLeaveUsed = useMemo(() => {
  return allLeaves
    .filter((l) => {
      if (l.status !== "Approved") return false;

      // 1️⃣ filter by employee
      if (isAdmin) {
        if (selectedEmp !== "all" && selectedEmp) {
          if (String(l.employee_code) !== String(selectedEmp)) return false;
        }
      }

      // 2️⃣ filter by date range
      const leaveStart = new Date(l.start_date);
      const leaveEnd = new Date(l.end_date);
      const filterStart = new Date(fromDate);
      const filterEnd = new Date(toDate);
      filterEnd.setHours(23, 59, 59, 999);

      // does this leave overlap with selected range?
      const overlaps =
        leaveStart <= filterEnd && leaveEnd >= filterStart;

      return overlaps;
    })
    .reduce((sum, l) => sum + (l.paid_days || 0), 0);
}, [allLeaves, selectedEmp, isAdmin, fromDate, toDate]);


 const unpaidLeaveUsed = useMemo(() => {
  return allLeaves
    .filter((l) => {
      if (l.status !== "Approved") return false;

      // 1️⃣ filter by employee
      if (isAdmin) {
        if (selectedEmp !== "all" && selectedEmp) {
          if (String(l.employee_code) !== String(selectedEmp)) return false;
        }
      }

      // 2️⃣ filter by date range
      const leaveStart = new Date(l.start_date);
      const leaveEnd = new Date(l.end_date);
      const filterStart = new Date(fromDate);
      const filterEnd = new Date(toDate);
      filterEnd.setHours(23, 59, 59, 999);

      const overlaps =
        leaveStart <= filterEnd && leaveEnd >= filterStart;

      return overlaps;
    })
    .reduce((sum, l) => sum + (l.unpaid_days || 0), 0);
}, [allLeaves, selectedEmp, isAdmin, fromDate, toDate]);


  /* ------------------------------- RENDER ------------------------------- */

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Attendance</h1>

      {/* FILTERS */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="text-sm font-medium">Date range</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-between">
                {range?.from
                  ? `${toLocalISO(range.from)}${
                      range?.to ? ` — ${toLocalISO(range.to)}` : ""
                    }`
                  : "Pick dates"}
                <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                numberOfMonths={2}
                pagedNavigation
                defaultMonth={range?.from}
                selected={range}
                onSelect={(r) => setRange(r)}
                showOutsideDays={false}
              />
              <div className="flex items-center gap-2 border-t p-2">
                <Button variant="ghost" size="sm" onClick={clearRange}>
                  Clear
                </Button>
                <div className="ml-auto space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={setThisMonthToToday}
                  >
                    This month
                  </Button>
                  <Button
                    size="sm"
                    onClick={runFetch}
                    disabled={!fromDate || !toDate}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {isAdmin && (
          <div>
            <label className="text-sm font-medium">Employee</label>
            <Select
              value={selectedEmp}
              onValueChange={(v) => setSelectedEmp(v)}
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map((emp) => (
                  <SelectItem
                    key={emp.employee_code}
                    value={String(emp.employee_code)}
                  >
                    {emp.full_name} ({emp.employee_code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button onClick={runFetch} disabled={!fromDate || !toDate}>
          Filter
        </Button>
      </div>

      {/* ADMIN DASHBOARD ONLY */}
      {isAdmin && (
        <>
          {/* SUMMARY CARDS */}
          <Card className="border border-slate-200 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingList ? (
                <p>Loading...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-4">
                  {/* Attendance status cards */}
                  {summaryItems.map((item) => {
                    const meta = STATUS_META[item.key];
                    const isActive = selectedStatus === item.key;

                    return (
                      <Card
                        key={item.key}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isActive}
                        onClick={() => handleStatusClick(item.key)}
                        className={[
                          "cursor-pointer select-none border-2 transition",
                          meta.card.bg,
                          meta.card.text,
                          meta.card.hoverBorder,
                          isActive
                            ? `ring-2 ${meta.card.ring} ${meta.card.border}`
                            : "border-slate-200",
                        ].join(" ")}
                      >
                        <CardContent className="p-4 text-center">
                          <p className="uppercase text-xs font-semibold tracking-wide">
                            {item.label}
                          </p>
                          <p className="text-3xl font-bold">{item.count}</p>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {/* Paid Leave Used card */}
                  <Card className="border-2 border-blue-400 bg-blue-50 text-blue-700">
                    <CardContent className="p-4 text-center">
                      <p className="uppercase text-xs font-semibold tracking-wide">
                        Paid Leave Used
                      </p>
                      <p className="text-3xl font-bold">{paidLeaveUsed}</p>
                    </CardContent>
                  </Card>

                  {/* Unpaid Leave Used card */}
                  <Card className="border-2 border-purple-400 bg-purple-50 text-purple-700">
                    <CardContent className="p-4 text-center">
                      <p className="uppercase text-xs font-semibold tracking-wide">
                        Unpaid Leave Used
                      </p>
                      <p className="text-3xl font-bold">{unpaidLeaveUsed}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          {/* PIE LEFT, STACKED BAR RIGHT */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Pie on left */}
            <Card className="border border-slate-200 rounded-2xl shadow-sm lg:col-span-1">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold">
                  Status Breakdown
                </CardTitle>
                <p className="text-xs text-slate-500 mt-1">
                  Share of records by status in the selected range
                  {selectedStatus !== "all"
                    ? ` (${STATUS_META[selectedStatus].label})`
                    : ""}
                  .
                </p>
              </CardHeader>
              <CardContent className="flex items-center justify-center pt-2 pb-3">
                {statusCounts.length === 0 ? (
                  <p className="text-sm text-slate-500">No data.</p>
                ) : (
                  <div className="flex flex-col items-center w-full gap-2">
                    <ChartContainer
                      config={{}}
                      className="h-[170px] w-[170px]"
                    >
                      <PieChart>
                        <Pie
                          data={statusCounts}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={3}
                          stroke="#ffffff"
                          strokeWidth={3}
                        >
                          {statusCounts.map((s) => (
                            <Cell
                              key={s.key}
                              fill={
                                STATUS_COLOR_MAP[s.key] || "hsl(var(--primary))"
                              }
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>

                    <p className="text-xs text-slate-500">
                      Total:{" "}
                      <span className="font-semibold text-slate-700">
                        {totalDays}
                      </span>
                    </p>

                    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] mt-1">
                      {statusCounts.map((s) => (
                        <span
                          key={s.key}
                          className="inline-flex items-center gap-1 text-slate-600"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{
                              backgroundColor:
                                STATUS_COLOR_MAP[s.key] ||
                                "hsl(var(--primary))",
                            }}
                          />
                          {s.name} ({s.value})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stacked bar on right */}
            <Card className="border border-slate-200 rounded-2xl shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Daily Status Trend
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Per-day counts of Present, Short, Leave, and Absent.
                </p>
              </CardHeader>
              <CardContent>
                {stackedBarSeries.length === 0 ? (
                  <p className="text-center text-sm text-slate-500 py-10">
                    No attendance data for the selected range.
                  </p>
                ) : (
                  <ChartContainer config={{}} className="h-[320px] w-full">
                    <BarChart data={stackedBarSeries} barSize={24}>
                      <CartesianGrid
                        vertical={false}
                        stroke="hsl(var(--border))"
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        style={{ fontSize: 11 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        style={{ fontSize: 11 }}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => `${value} ${name}`}
                            labelFormatter={(label) => `Date: ${label}`}
                          />
                        }
                      />
                      <Bar
                        dataKey="present"
                        stackId="a"
                        name="Present"
                        fill={STATUS_COLOR_MAP["Present-Full"]}
                      />
                      <Bar
                        dataKey="short"
                        stackId="a"
                        name="Short"
                        fill={STATUS_COLOR_MAP["Short-Hours"]}
                      />
                      <Bar
                        dataKey="leave"
                        stackId="a"
                        name="Leave"
                        fill={STATUS_COLOR_MAP["Leave"]}
                      />
                      <Bar
                        dataKey="absent"
                        stackId="a"
                        name="Absent"
                        fill={STATUS_COLOR_MAP["Absent"]}
                      />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingList || loadingMyList ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : recordsForDisplay.length === 0 ? (
            <p>No attendance found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {isAdmin && <TableHead>Emp Code</TableHead>}
                  {isAdmin && <TableHead>Full Name</TableHead>}
                  <TableHead>Date</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Worked Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recordsForDisplay.map((a) => {
                  const wh = normalizeWorkedHours(a.worked_hours);

                  return (
                    <TableRow key={a.id}>
                      {isAdmin && (
                        <>
                          <TableCell>{a.employee_code}</TableCell>
                          <TableCell>
                            {employeeMap[a.employee_code] || "-"}
                          </TableCell>
                        </>
                      )}

                      <TableCell>{formatDate(a.attendance_date)}</TableCell>
                      <TableCell>{getDayName(a.attendance_date)}</TableCell>
                      <TableCell>{a.clock_in || "-"}</TableCell>
                      <TableCell>{a.clock_out || "-"}</TableCell>

                      <TableCell>
                        {wh.hours === "-"
                          ? "-"
                          : `${wh.hours}h ${wh.minutes}m`}
                      </TableCell>

                      <TableCell>
                        <Badge className={statusToBadgeClass(a.status)}>
                          {a.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
