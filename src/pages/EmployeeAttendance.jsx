import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMyAttendance } from "../features/attendance/attendanceThunks";
import { submitRemark as submitRemarkThunk } from "../features/remarks/remarkThunks";
import { fetchAllLeaves } from "../features/leaves/leavesThunks";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import api from "../api/api";

/* shadcn chart helpers */
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

/* Recharts */
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* Light blue area style (like shadcn example) */
const AREA_FILL = "rgba(96, 165, 250, 0.9)";
const AREA_STROKE = "rgba(59, 130, 246, 1)";

// ------------------------------
// DATE HELPERS
// ------------------------------
const IST_TZ = "Asia/Kolkata";

const IST_YMD_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: IST_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const IST_UI_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: IST_TZ,
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const IST_WEEKDAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: IST_TZ,
  weekday: "long",
});

function fixDateForApi(utcDateString) {
  if (!utcDateString) return "";
  const d =
    utcDateString instanceof Date ? utcDateString : new Date(utcDateString);
  if (Number.isNaN(d.getTime())) return "";
  return IST_YMD_FORMATTER.format(d);
}

function formatDateIST(utcDateString) {
  if (!utcDateString) return "";
  const d =
    utcDateString instanceof Date ? utcDateString : new Date(utcDateString);
  if (Number.isNaN(d.getTime())) return "";
  return IST_UI_FORMATTER.format(d);
}

function getDayNameIST(utcDateString) {
  if (!utcDateString) return "";
  const d =
    utcDateString instanceof Date ? utcDateString : new Date(utcDateString);
  if (Number.isNaN(d.getTime())) return "";
  return IST_WEEKDAY_FORMATTER.format(d);
}

function toLocalISO(d) {
  if (!d) return "";
  const date = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return date.toISOString().split("T")[0];
}

// ------------------------------
// STATUS META + COLORS
// ------------------------------
const STATUS_META = {
  all: {
    label: "All",
    badge: "bg-slate-500 text-white",
  },
  "Present-Full": {
    label: "Present",
    badge: "bg-emerald-500 text-white",
  },
  "Short-Hours": {
    label: "Short Hours",
    badge: "bg-amber-500 text-white",
  },
  Leave: {
    label: "Leave",
    badge: "bg-blue-500 text-white",
  },
  Absent: {
    label: "Absent",
    badge: "bg-red-500 text-white",
  },
};

const STATUS_COLORS = {
  "Present-Full": "#16a34a",
  "Short-Hours": "#f59e0b",
  Leave: "#2563eb",
  Absent: "#ef4444",
};

// ------------------------------
// WORKED HOURS HELPERS
// ------------------------------
function normalizeWorkedHours(worked) {
  if (!worked) return { hours: "-", minutes: "-" };

  if (typeof worked === "object") {
    return { hours: worked.hours ?? 0, minutes: worked.minutes ?? 0 };
  }

  if (typeof worked === "string" && worked.includes(":")) {
    const [h, m] = worked.split(":");
    return { hours: Number(h) || 0, minutes: Number(m) || 0 };
  }

  if (typeof worked === "number") {
    const hrs = Math.floor(worked);
    const mins = Math.round((worked - hrs) * 60);
    return { hours: hrs, minutes: mins };
  }

  return { hours: 0, minutes: 0 };
}

function workedToDecimal(worked) {
  const n = normalizeWorkedHours(worked);
  if (n.hours === "-" || n.minutes === "-") return 0;
  return Number(n.hours || 0) + Number(n.minutes || 0) / 60;
}

function diffClockInOutToDecimal(clockIn, clockOut) {
  if (!clockIn || !clockOut) return 0;
  const parseTime = (s) => {
    const parts = String(s).split(":").map((p) => Number(p));
    const d = new Date();
    d.setHours(parts[0] || 0, parts[1] || 0, parts[2] || 0, 0);
    return d;
  };

  const inD = parseTime(clockIn);
  const outD = parseTime(clockOut);
  if (outD <= inD) outD.setDate(outD.getDate() + 1);

  const diffMs = outD - inD;
  const hours = diffMs / (1000 * 60 * 60);
  return Number(hours.toFixed(2));
}

// decimal hours (9.5) -> "9:30"
function decimalToTimeString(decimal) {
  const hrs = Math.floor(decimal);
  const mins = Math.round((decimal - hrs) * 60);
  const mm = mins.toString().padStart(2, "0");
  return `${hrs}:${mm}`;
}

// ------------------------------
// COMPONENT
// ------------------------------
export default function EmployeeAttendance() {
  const dispatch = useDispatch();

  const { myList = [] } = useSelector((s) => s.attendance || {});
  const { user } = useSelector((s) => s.auth || {});
  const { allLeaves = [] } = useSelector((s) => s.leaves || {});

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const [fromDate, setFromDate] = useState(toLocalISO(firstDay));
  const [toDate, setToDate] = useState(toLocalISO(today));
  const [range, setRange] = useState({ from: firstDay, to: today });

  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [remarkOpen, setRemarkOpen] = useState(false);
  const [remarkText, setRemarkText] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  const [newClockIn, setNewClockIn] = useState("");
  const [newClockOut, setNewClockOut] = useState("");
  const [showMyRemarks, setShowMyRemarks] = useState(false);
  const [remarksList, setRemarksList] = useState([]);
  const [loadingRemarks, setLoadingRemarks] = useState(false);

  useEffect(() => {
    if (range?.from) setFromDate(toLocalISO(range.from));
    if (range?.to) setToDate(toLocalISO(range.to));
  }, [range]);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyAttendance({ from: fromDate, to: toDate }));
      dispatch(fetchAllLeaves());
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const employeeCode = user?.employee_code;

  // myList but with Approved leave days marked as Leave
 const myListWithLeave = useMemo(() => {
  if (!allLeaves.length) return myList;

  return myList.map((a) => {
    const code = a.employee_code ?? employeeCode;
    if (!code) return a;

    // ✅ if employee actually worked, DO NOT mark leave
    const hasAttendance =
      !!a.clock_in || !!a.clock_out || !!a.worked_hours;

    if (hasAttendance) {
      return a; // Present / Short-Hours stays
    }

    const hasApprovedLeave = allLeaves.some((l) => {
      return (
        String(l.employee_code) === String(code) &&
        l.status === "Approved" &&
        a.attendance_date >= l.start_date &&
        a.attendance_date <= l.end_date
      );
    });

    if (!hasApprovedLeave) return a;

    return {
      ...a,
      status: "Leave",
      worked_hours: null,
      clock_in: null,
      clock_out: null,
    };
  });
}, [myList, allLeaves, employeeCode]);


  const summarySource = myListWithLeave || [];

  const summaryItems = [
    { key: "all", label: STATUS_META.all.label, count: summarySource.length },
    {
      key: "Present-Full",
      label: STATUS_META["Present-Full"].label,
      count: summarySource.filter((a) => a.status === "Present-Full").length,
    },
    {
      key: "Short-Hours",
      label: STATUS_META["Short-Hours"].label,
      count: summarySource.filter((a) => a.status === "Short-Hours").length,
    },
    {
      key: "Leave",
      label: STATUS_META.Leave.label,
      count: summarySource.filter((a) => a.status === "Leave").length,
    },
    {
      key: "Absent",
      label: STATUS_META.Absent.label,
      count: summarySource.filter((a) => a.status === "Absent").length,
    },
  ];

  const filteredData = useMemo(() => {
    if (selectedStatus === "all") return summarySource;
    return summarySource.filter((d) => d.status === selectedStatus);
  }, [summarySource, selectedStatus]);

  const openRemarkModal = (row) => {
    setSelectedRow(row);
    setNewClockIn("");
    setNewClockOut("");
    setRemarkText("");
    setRemarkOpen(true);
  };

  const submitRemark = async () => {
    if (!remarkText.trim()) return alert("Enter remark");
    if (!newClockIn && !newClockOut)
      return alert("Enter at least one new time");
    if (!selectedRow) return alert("Invalid entry");

    const attendanceDateForApi = fixDateForApi(selectedRow.attendance_date);

    try {
      const action = submitRemarkThunk({
        attendance_date: attendanceDateForApi,
        new_clock_in: newClockIn || null,
        new_clock_out: newClockOut || null,
        remark_text: remarkText,
      });
      const result = await dispatch(action);
      if (result && result.error) throw result.error;

      alert("Remark submitted");
      setRemarkOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  const loadMyRemarks = async () => {
    setLoadingRemarks(true);
    try {
      const res = await api.post("/api/remarks/my");
      setRemarksList(res.data || []);
    } finally {
      setLoadingRemarks(false);
    }
    setShowMyRemarks(true);
  };

  // CHART DATA
  const chartSeries = useMemo(() => {
    const map = {};

    filteredData.forEach((a) => {
      const dateObj = new Date(a.attendance_date || Date.now());
      const day = dateObj.getDay();
      if (day === 0 || day === 6) return;

      const dateKey = toLocalISO(dateObj);
      if (!map[dateKey]) map[dateKey] = { totalHours: 0, count: 0 };

      let hoursDecimal = 0;
      if (a.worked_hours) {
        hoursDecimal = workedToDecimal(a.worked_hours);
      } else if (a.clock_in && a.clock_out) {
        hoursDecimal = diffClockInOutToDecimal(a.clock_in, a.clock_out);
      }

      map[dateKey].totalHours += hoursDecimal;
      map[dateKey].count += 1;
    });

    const entries = Object.keys(map)
      .map((dateKey) => {
        const { totalHours, count } = map[dateKey];
        const avg = count > 0 ? totalHours / count : 0;
        return {
          date: dateKey,
          label: new Date(dateKey).toLocaleDateString(),
          avgHours: Number(avg.toFixed(2)),
        };
      })
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

    return entries;
  }, [filteredData]);

  const statusCounts = useMemo(() => {
    return [
      {
        name: "Present",
        key: "Present-Full",
        value: summarySource.filter((a) => a.status === "Present-Full").length,
      },
      {
        name: "Short",
        key: "Short-Hours",
        value: summarySource.filter((a) => a.status === "Short-Hours").length,
      },
      {
        name: "Leave",
        key: "Leave",
        value: summarySource.filter((a) => a.status === "Leave").length,
      },
      {
        name: "Absent",
        key: "Absent",
        value: summarySource.filter((a) => a.status === "Absent").length,
      },
    ].filter((s) => s.value > 0);
  }, [summarySource]);

  const totalDays = useMemo(
    () => statusCounts.reduce((sum, s) => sum + s.value, 0),
    [statusCounts]
  );

  /* -------- Paid / Unpaid leave totals for current employee ------ */
  const paidLeaveUsed = useMemo(() => {
    return allLeaves
      .filter((l) => {
        if (l.status !== "Approved") return false;

        // Filter by current employee
        if (String(l.employee_code) !== String(employeeCode)) return false;

        // Filter by date range - check if leave overlaps with selected range
        const leaveStart = new Date(l.start_date);
        const leaveEnd = new Date(l.end_date);
        const filterStart = new Date(fromDate);
        const filterEnd = new Date(toDate);
        filterEnd.setHours(23, 59, 59, 999);

        const overlaps = leaveStart <= filterEnd && leaveEnd >= filterStart;

        return overlaps;
      })
      .reduce((sum, l) => sum + (l.paid_days || 0), 0);
  }, [allLeaves, employeeCode, fromDate, toDate]);

  const unpaidLeaveUsed = useMemo(() => {
    return allLeaves
      .filter((l) => {
        if (l.status !== "Approved") return false;

        // Filter by current employee
        if (String(l.employee_code) !== String(employeeCode)) return false;

        // Filter by date range
        const leaveStart = new Date(l.start_date);
        const leaveEnd = new Date(l.end_date);
        const filterStart = new Date(fromDate);
        const filterEnd = new Date(toDate);
        filterEnd.setHours(23, 59, 59, 999);

        const overlaps = leaveStart <= filterEnd && leaveEnd >= filterStart;

        return overlaps;
      })
      .reduce((sum, l) => sum + (l.unpaid_days || 0), 0);
  }, [allLeaves, employeeCode, fromDate, toDate]);

  const onFilterClick = () => {
    dispatch(fetchMyAttendance({ from: fromDate, to: toDate }));
    setOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Attendance</h1>
          <p className="text-sm text-slate-500 mt-1">
            Check your daily working hours, status, and submit remarks.
          </p>
        </div>

        <Button
          size="sm"
          className="bg-black text-white hover:bg-black/90"
          onClick={loadMyRemarks}
        >
          My Remarks
        </Button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-[260px] justify-between"
            >
              {fromDate} — {toDate}
              <CalendarIcon className="w-4 h-4 opacity-60" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={range}
              onSelect={(v) => setRange(v)}
            />
          </PopoverContent>
        </Popover>

        <Button onClick={onFilterClick} disabled={!fromDate || !toDate}>
          Apply
        </Button>
      </div>

      {/* ATTENDANCE SUMMARY TILES */}
      <Card className="border border-slate-200 rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            Attendance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {/* Attendance status cards */}
            {summaryItems.map((s) => {
              const active = selectedStatus === s.key;

              const bgByKey = {
                all: "bg-slate-50",
                "Present-Full": "bg-emerald-50",
                "Short-Hours": "bg-amber-50",
                Leave: "bg-blue-50",
                Absent: "bg-red-50",
              }[s.key];

              const borderByKey = {
                all: "border-slate-200",
                "Present-Full": "border-emerald-200",
                "Short-Hours": "border-amber-200",
                Leave: "border-blue-200",
                Absent: "border-red-200",
              }[s.key];

              const labelColor = {
                all: "text-slate-600",
                "Present-Full": "text-emerald-700",
                "Short-Hours": "text-amber-700",
                Leave: "text-blue-700",
                Absent: "text-red-700",
              }[s.key];

              const numberColor = {
                all: "text-slate-900",
                "Present-Full": "text-emerald-900",
                "Short-Hours": "text-amber-900",
                Leave: "text-blue-900",
                Absent: "text-red-900",
              }[s.key];

              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() =>
                    setSelectedStatus((prev) =>
                      prev === s.key ? "all" : s.key
                    )
                  }
                  className={`w-full h-[112px] rounded-2xl px-5 py-4 text-left
                    flex flex-col justify-between
                    border ${borderByKey} ${bgByKey}
                    shadow-[0_1px_4px_rgba(15,23,42,0.05)]
                    transition-all duration-150
                    ${active
                      ? "ring-2 ring-offset-1 ring-slate-300 scale-[1.02]"
                      : "hover:shadow-md"
                    }`}
                >
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${labelColor}`}
                  >
                    {s.label}
                  </span>
                  <span
                    className={`text-3xl font-bold leading-none ${numberColor}`}
                  >
                    {s.count}
                  </span>
                </button>
              );
            })}

            {/* Paid Leave Used card */}
            <div className="w-full h-[112px] rounded-2xl px-5 py-4
              flex flex-col justify-between
              border border-blue-400 bg-blue-50
              shadow-[0_1px_4px_rgba(15,23,42,0.05)]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700">
                Paid Leave Used
              </span>
              <span className="text-3xl font-bold leading-none text-blue-900">
                {paidLeaveUsed}
              </span>
            </div>

            {/* Unpaid Leave Used card */}
            <div className="w-full h-[112px] rounded-2xl px-5 py-4
              flex flex-col justify-between
              border border-purple-400 bg-purple-50
              shadow-[0_1px_4px_rgba(15,23,42,0.05)]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-700">
                Unpaid Leave Used
              </span>
              <span className="text-3xl font-bold leading-none text-purple-900">
                {unpaidLeaveUsed}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PIE LEFT, AREA RIGHT */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Area chart (2 cols) */}
        <Card className="border border-slate-200 rounded-2xl shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Worked Hours (Average per weekday)
            </CardTitle>
            <p className="text-sm text-slate-500">
              Smooth area chart of your average worked hours per weekday. Weekends are excluded.
            </p>
          </CardHeader>
          <CardContent>
            {chartSeries.length === 0 ? (
              <p className="text-center text-sm text-slate-500 py-10">
                No worked hours data for the selected range.
              </p>
            ) : (
              <ChartContainer config={{}} className="h-[320px] w-full">
                <AreaChart data={chartSeries}>
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
                    tickFormatter={(v) => decimalToTimeString(v)}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => {
                          const v = Number(value || 0);
                          return `${decimalToTimeString(v)} hrs`;
                        }}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="avgHours"
                    stroke={AREA_STROKE}
                    strokeWidth={2}
                    fill={AREA_FILL}
                    dot={false}
                    activeDot={{ r: 3 }}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card className="border border-slate-200 rounded-2xl shadow-sm lg:col-span-1">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-semibold">
              Status Breakdown
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Share of days by status in the selected range.
            </p>
          </CardHeader>
          <CardContent className="flex items-center justify-center pt-2 pb-3">
            {statusCounts.length === 0 ? (
              <p className="text-sm text-slate-500">No data.</p>
            ) : (
              <div className="flex flex-col items-center w-full gap-2">
                <ChartContainer config={{}} className="h-[170px] w-[170px]">
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
                          fill={STATUS_COLORS[s.key] || "hsl(var(--primary))"}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>

                <p className="text-xs text-slate-500">
                  Total days:{" "}
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
                        style={{ backgroundColor: STATUS_COLORS[s.key] }}
                      />
                      {s.name} ({s.value})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* TABLE */}
      <Card className="border border-slate-200 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Detailed Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Worked Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((a) => {
                const wh = normalizeWorkedHours(a.worked_hours);
                return (
                  <TableRow
                    key={`${a.attendance_date}-${a.clock_in}-${a.clock_out}`}
                  >
                    <TableCell>{formatDateIST(a.attendance_date)}</TableCell>
                    <TableCell>{getDayNameIST(a.attendance_date)}</TableCell>
                    <TableCell>{a.clock_in || "-"}</TableCell>
                    <TableCell>{a.clock_out || "-"}</TableCell>
                    <TableCell>
                      {wh.hours === "-"
                        ? "-"
                        : `${wh.hours}h ${wh.minutes}m`}
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_META[a.status]?.badge || ""}>
                        {a.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openRemarkModal(a)}
                      >
                        Add Remark
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Remark Modal */}
      <Dialog open={remarkOpen} onOpenChange={setRemarkOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Edit Time & Submit Remark</DialogTitle>
          </DialogHeader>
          {selectedRow && (
            <>
              <p className="text-sm text-gray-600">
                Date: {formatDateIST(selectedRow.attendance_date)}
              </p>
              <div className="mt-2 text-xs">
                <p>Old Clock-In: {selectedRow.clock_in || "-"}</p>
                <p>Old Clock-Out: {selectedRow.clock_out || "-"}</p>
              </div>
              <label className="text-sm font-medium mt-3">
                New Clock-In (optional)
              </label>
              <input
                type="time"
                className="border rounded p-2 w-full"
                value={newClockIn}
                onChange={(e) => setNewClockIn(e.target.value)}
              />
              <label className="text-sm font-medium mt-3">
                New Clock-Out (optional)
              </label>
              <input
                type="time"
                className="border rounded p-2 w-full"
                value={newClockOut}
                onChange={(e) => setNewClockOut(e.target.value)}
              />
              <Textarea
                placeholder="Write your remark..."
                className="mt-3"
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
              />
            </>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setRemarkOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitRemark}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* My Remarks Modal */}
      <Dialog open={showMyRemarks} onOpenChange={setShowMyRemarks}>
        <DialogContent aria-describedby={undefined} className="max-w-lg">
          <DialogHeader>
            <DialogTitle>My Submitted Remarks</DialogTitle>
          </DialogHeader>
          {loadingRemarks ? (
            <p className="text-center">Loading...</p>
          ) : remarksList.length === 0 ? (
            <p>No remarks found.</p>
          ) : (
            <div className="space-y-3 max-h-[320px] overflow-y-auto">
              {remarksList.map((r) => (
                <div
                  key={`${r.id}-${r.attendance_date}`}
                  className="border p-3 rounded bg-gray-50"
                >
                  <div className="flex justify-between text-sm mb-1">
                    <p>Date: {formatDateIST(r.attendance_date)}</p>
                    <p
                      className={
                        r.status === "approved"
                          ? "text-green-600"
                          : r.status === "rejected"
                            ? "text-red-600"
                            : "text-amber-600"
                      }
                    >
                      {r.status}
                    </p>
                  </div>
                  <p className="text-sm">{r.remark_text}</p>
                  {r.admin_response && (
                    <p className="text-xs text-gray-600 mt-1">
                      Admin: {r.admin_response}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowMyRemarks(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}