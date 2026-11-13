// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMyLeaves, applyLeave } from "../features/leaves/leavesThunks";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { toast } from "sonner";

// export default function MyLeaves() {
//   const dispatch = useDispatch();

//   // -----------------------------
//   // FIX: Extract Correct Structure
//   // -----------------------------
//   const { myLeaves, loading, error } = useSelector((s) => s.leaves);

//   const leavesArray = Array.isArray(myLeaves?.leaves)
//     ? myLeaves.leaves
//     : [];

//   const summary = myLeaves?.balance_summary || {
//     total_available: 0,
//     used: 0,
//     remaining: 0,
//   };

//   const [form, setForm] = useState({
//     start_date: "",
//     end_date: "",
//     reason: "",
//   });

//   useEffect(() => {
//     dispatch(fetchMyLeaves());
//   }, [dispatch]);

//   const submit = () => {
//     if (!form.start_date || !form.end_date) {
//       toast.error("Select both dates");
//       return;
//     }

//     dispatch(applyLeave({ ...form }))
//       .unwrap()
//       .then(() => {
//         toast.success("Leave applied");
//         setForm({ start_date: "", end_date: "", reason: "" });
//         dispatch(fetchMyLeaves());
//       })
//       .catch(() => toast.error("Error applying leave"));
//   };

//   return (
//     <div className="p-6 space-y-10">

//       {/* ====================================================== */}
//       {/* LEAVE BALANCE SUMMARY */}
//       {/* ====================================================== */}
//       <Card>
//         <CardHeader>
//           <CardTitle>My Leave Balance</CardTitle>
//         </CardHeader>

//         <CardContent className="text-lg flex gap-10">
          
//           <div>Leave Balance: <b>{summary.remaining}</b></div>
//           <div>Used: <b>{summary.used}</b></div>
//         </CardContent>
//       </Card>

//       {/* ====================================================== */}
//       {/* APPLY FOR LEAVE */}
//       {/* ====================================================== */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Apply for Leave</CardTitle>
//         </CardHeader>

//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

//           <div>
//             <label>Start Date</label>
//             <Input
//               type="date"
//               value={form.start_date}
//               onChange={(e) => setForm({ ...form, start_date: e.target.value })}
//             />
//           </div>

//           <div>
//             <label>End Date</label>
//             <Input
//               type="date"
//               value={form.end_date}
//               onChange={(e) => setForm({ ...form, end_date: e.target.value })}
//             />
//           </div>

//           <div className="md:col-span-2">
//             <label>Reason</label>
//             <Input
//               placeholder="Enter reason"
//               value={form.reason}
//               onChange={(e) => setForm({ ...form, reason: e.target.value })}
//             />
//           </div>

//           <div className="md:col-span-2 flex justify-end">
//             <Button onClick={submit}>
//               Submit Leave
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* ====================================================== */}
//       {/* LEAVE HISTORY */}
//       {/* ====================================================== */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Leave History</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Start</TableHead>
//                 <TableHead>End</TableHead>
//                 <TableHead>Paid</TableHead>
//                 <TableHead>Unpaid</TableHead>
//                 <TableHead>Status</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {leavesArray.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={5}>No leaves yet.</TableCell>
//                 </TableRow>
//               ) : (
//                 leavesArray.map((l) => (
//                   <TableRow key={l.id}>
//                     <TableCell>
//                       {new Date(l.start_date).toLocaleDateString()}
//                     </TableCell>

//                     <TableCell>
//                       {new Date(l.end_date).toLocaleDateString()}
//                     </TableCell>

//                     <TableCell>{l.paid_days || 0}</TableCell>
//                     <TableCell>{l.unpaid_days || 0}</TableCell>

//                     <TableCell>
//                       <span
//                         className={`px-3 py-1 rounded-full text-white ${
//                           l.status === "Approved"
//                             ? "bg-green-500"
//                             : l.status === "Rejected"
//                             ? "bg-red-500"
//                             : "bg-yellow-500"
//                         }`}
//                       >
//                         {l.status}
//                       </span>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyLeaves, applyLeave } from "../features/leaves/leavesThunks";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { toast } from "sonner";

// Simple className helper
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getTodayWithoutTime() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateForApi(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function MyLeaves() {
  const dispatch = useDispatch();

  const { myLeaves, loading, error } = useSelector((s) => s.leaves);

  const leavesArray = Array.isArray(myLeaves?.leaves) ? myLeaves.leaves : [];

  const summary = myLeaves?.balance_summary || {
    total_available: 0,
    used: 0,
    remaining: 0,
  };

  const [form, setForm] = useState({
    startDate: null, // Date | null
    endDate: null, // Date | null
    reason: "",
  });

  useEffect(() => {
    dispatch(fetchMyLeaves());
  }, [dispatch]);

  const submit = () => {
    if (!form.startDate || !form.endDate) {
      toast.error("Select both start and end dates.");
      return;
    }

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const today = getTodayWithoutTime();

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Disallow past dates
    if (start < today || end < today) {
      toast.error("You cannot apply for leave in the past.");
      return;
    }

    // Allow same day (one‑day leave), but disallow start after end
    if (start > end) {
      toast.error("Start date cannot be after end date.");
      return;
    }

    // Prevent sending leave for a day/range that already has a (non‑rejected) leave
    const hasOverlap = leavesArray.some((l) => {
      // Ignore rejected leaves
      if (l.status === "Rejected") return false;
      if (!l.start_date || !l.end_date) return false;

      const s = new Date(l.start_date);
      const e = new Date(l.end_date);
      s.setHours(0, 0, 0, 0);
      e.setHours(0, 0, 0, 0);

      // Ranges overlap if: start <= existingEnd && end >= existingStart
      return start <= e && end >= s;
    });

    if (hasOverlap) {
      toast.error("You already have a leave that overlaps these dates.");
      return;
    }

    if (!form.reason.trim()) {
      toast.error("Please enter a reason for your leave.");
      return;
    }

    const payload = {
      start_date: formatDateForApi(start),
      end_date: formatDateForApi(end),
      reason: form.reason.trim(),
    };

    dispatch(applyLeave(payload))
      .unwrap()
      .then(() => {
        toast.success("Leave applied");
        setForm({ startDate: null, endDate: null, reason: "" });
        dispatch(fetchMyLeaves());
      })
      .catch(() => toast.error("Error applying leave"));
  };

  return (
    <div className="p-6 space-y-10">
      {/* ====================================================== */}
      {/* LEAVE BALANCE SUMMARY */}
      {/* ====================================================== */}
      <Card>
        <CardHeader>
          <CardTitle>My Leave Balance</CardTitle>
        </CardHeader>

        <CardContent className="text-lg flex gap-10">
          <div>
            Leave Balance: <b>{summary.remaining}</b>
          </div>
          <div>
            Used: <b>{summary.used}</b>
          </div>
        </CardContent>
      </Card>

      {/* ====================================================== */}
      {/* APPLY FOR LEAVE */}
      {/* ====================================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Apply for Leave</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date Picker */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !form.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.startDate ? (
                    format(form.startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.startDate || undefined}
                  onSelect={(date) =>
                    setForm((prev) => ({ ...prev, startDate: date || null }))
                  }
                  initialFocus
                  // Disable all dates before today
                  disabled={(date) => {
                    const today = getTodayWithoutTime();
                    const d = new Date(date);
                    d.setHours(0, 0, 0, 0);
                    return d < today;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date Picker */}
          <div className="space-y-1">
            <label className="text-sm font-medium">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !form.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.endDate ? (
                    format(form.endDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.endDate || undefined}
                  onSelect={(date) =>
                    setForm((prev) => ({ ...prev, endDate: date || null }))
                  }
                  initialFocus
                  // Disable all dates before today and
                  // all dates before selected start date (same day allowed)
                  disabled={(date) => {
                    const today = getTodayWithoutTime();
                    const d = new Date(date);
                    d.setHours(0, 0, 0, 0);

                    if (d < today) return true;

                    if (form.startDate) {
                      const start = new Date(form.startDate);
                      start.setHours(0, 0, 0, 0);
                      // End must be >= start (allow same day)
                      if (d < start) return true;
                    }

                    return false;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Reason */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-sm font-medium">Reason</label>
            <Input
              placeholder="Enter reason"
              value={form.reason}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, reason: e.target.value }))
              }
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-end">
            <Button onClick={submit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Leave"}
            </Button>
          </div>

          {error && (
            <div className="md:col-span-2 text-sm text-red-500">
              {typeof error === "string" ? error : "Something went wrong."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ====================================================== */}
      {/* LEAVE HISTORY */}
      {/* ====================================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Unpaid</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {leavesArray.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>No leaves yet.</TableCell>
                </TableRow>
              ) : (
                leavesArray.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>
                      {l.start_date
                        ? new Date(l.start_date).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell>
                      {l.end_date
                        ? new Date(l.end_date).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell>{l.paid_days || 0}</TableCell>
                    <TableCell>{l.unpaid_days || 0}</TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-white text-xs font-medium",
                          l.status === "Approved"
                            ? "bg-green-500"
                            : l.status === "Rejected"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        )}
                      >
                        {l.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}