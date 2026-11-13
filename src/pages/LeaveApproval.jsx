

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import {
  fetchAllLeaves,
  updateLeaveStatus,
  fetchAllEmployeeBalances,
  fetchAllAllocations,
  addExtraLeave,
  fetchAllExtraLeave
} from "../features/leaves/leavesThunks";

import api from "../api/api";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";

export default function LeaveApproval() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const {
    allLeaves = [],
    loading,
    employeeBalances = [],
    loadingBalances,
    allocations = [],
    allExtraLeave = [],
  } = useSelector((state) => state.leaves);

  const { user } = useSelector((state) => state.auth);

  const [employees, setEmployees] = useState([]);
  const [employeeMap, setEmployeeMap] = useState({});
  const [selectedEmp, setSelectedEmp] = useState("all");

  // "monthly" | "extra"
  const [activeTab, setActiveTab] = useState("monthly");

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  /* ---------------------------------------- */
  /* MONTH MAP */
  /* ---------------------------------------- */
  const monthMap = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const reverseMonthMap = Object.fromEntries(
    Object.entries(monthMap).map(([m, i]) => [i, m])
  );

  /* ---------------------------------------- */
  /* GENERATE NEXT 12 MONTHS (BASE TABLE) */
  /* ---------------------------------------- */
  const generateMonthRows = () => {
    const rows = [];
    const start = new Date();

    for (let i = 0; i < 12; i++) {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const monthIndex = d.getMonth() + 1;

      rows.push({
        month: reverseMonthMap[monthIndex],
        year: d.getFullYear(),
        allotted: "",
        editable: false,
      });
    }
    return rows;
  };

  const [monthRows, setMonthRows] = useState(generateMonthRows());
  const [extraValue, setExtraValue] = useState("");

  /* ---------------------------------------- */
  /* UPDATE FIELD IN A ROW */
  /* ---------------------------------------- */
  const updateRow = (index, key, value) => {
    setMonthRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
  };

  /* ---------------------------------------- */
  /* RESET EDIT STATE WHEN TAB CHANGES        */
  /* ---------------------------------------- */
  useEffect(() => {
    setMonthRows((prev) => prev.map((row) => ({ ...row, editable: false })));
    setExtraValue("");
  }, [activeTab]);

  /* ---------------------------------------- */
  /* LOAD DATA */
  /* ---------------------------------------- */
  useEffect(() => {
    dispatch(fetchAllLeaves());
    dispatch(fetchAllEmployeeBalances());
    dispatch(fetchAllAllocations());
    dispatch(fetchAllExtraLeave());
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await api.post("/api/employees/all-employees");
      const map = {};
      res.data.forEach((e) => (map[e.employee_code] = e.full_name));
      setEmployeeMap(map);
      setEmployees(res.data);
    } catch (err) {
      toast.error("Failed to load employees");
    }
  };

  /* ---------------------------------------- */
  /* HANDLE EMPLOYEE QUERY PARAMETER */
  /* ---------------------------------------- */
  useEffect(() => {
    const empCode = searchParams.get("emp");
    if (empCode && employees.length > 0) {
      // Check if employee exists in list
      const employeeExists = employees.some(
        (e) => String(e.employee_code) === String(empCode)
      );
      if (employeeExists) {
        setSelectedEmp(empCode);
      }
    }
  }, [searchParams, employees]);

  /* ---------------------------------------- */
  /* FILTERED LEAVE REQUESTS */
  /* ---------------------------------------- */
  const filteredLeaves =
    selectedEmp === "all"
      ? allLeaves
      : allLeaves.filter((l) => l.employee_code == selectedEmp);

  /* =============================================================== */
  /*  SAVE LOGIC FOR BOTH TABS                                      */
  /* =============================================================== */

  const saveMergedLeave = async (mode, row, base, extra) => {
    const monthIndex = monthMap[row.month];

    try {
      if (mode === "monthly") {
        // Update base monthly assigned (for everyone)
        await api.post("/api/leave/admin/allocate", {
          year: row.year,
          month: monthIndex,
          paid: Number(base),
        });
      } else if (mode === "extra") {
        if (selectedEmp === "all") {
          toast.error("Please select an employee to set extra leave.");
          return;
        }

        await dispatch(
          addExtraLeave({
            employee_code: selectedEmp,
            year: row.year,
            month: monthIndex,
            extra: Number(extra),
          })
        );
      }

      toast.success("Leave updated!");
      dispatch(fetchAllAllocations());
      dispatch(fetchAllEmployeeBalances());
      dispatch(fetchAllExtraLeave());

      setMonthRows((prev) =>
        prev.map((x) => ({
          ...x,
          editable: false,
        }))
      );
      setExtraValue("");
    } catch (err) {
      toast.error("Failed to update leave");
    }
  };


  useEffect(() => {
    console.log("📌 Allocations API Result:", allocations);
  }, [allocations]);


  useEffect(() => {
    console.log("📌 Employee Balances API Result:", employeeBalances);
  }, [employeeBalances]);


  useEffect(() => {
    console.log("📌 Month Rows (UI Generated):", monthRows);
  }, [monthRows]);


  /* ===========================================================mer========== */
  /* UI START — FULL PAGE */
  /* ===================================================================== */
  return (
    <div className="p-6 space-y-10">
      {/* =============================================================== */}
      {/* MERGED EMPLOYEE TABLE WITH TABS                                */}
      {/* =============================================================== */}

      <Card className="border-2 border-blue-500">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-blue-600">
              Monthly Leave Setup (Base + Extra)
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Use <span className="font-semibold">Set Monthly</span> to define
              base leave for all employees, and{" "}
              <span className="font-semibold">Set Extra</span> to give
              additional leave to a specific employee.
            </p>
          </div>

          {/* SIMPLE TAB SWITCHER */}
          <div className="inline-flex items-center rounded-full border bg-muted p-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("monthly")}
              className={`px-3 py-1 rounded-full transition 
                ${activeTab === "monthly"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Set Monthly
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("extra")}
              className={`px-3 py-1 rounded-full transition 
                ${activeTab === "extra"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Set Extra
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* EMPLOYEE SELECT + HINT */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="w-full md:w-60">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Employee
              </label>
              <Select
                value={selectedEmp}
                onValueChange={setSelectedEmp}
                disabled={activeTab === "monthly"} // disabled in monthly mode
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem
                      key={emp.employee_code}
                      value={emp.employee_code}
                    >
                      {emp.full_name} ({emp.employee_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {activeTab === "monthly" && (
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Employee selection is disabled in{" "}
                  <span className="font-semibold">Set Monthly</span> mode.
                  Switch to <span className="font-semibold">Set Extra</span> to
                  choose an employee.
                </p>
              )}
            </div>

            {activeTab === "extra" && selectedEmp === "all" && (
              <p className="text-xs text-red-500">
                Select an employee to set extra leave.
              </p>
            )}
          </div>

          {/* TABLE */}
          <div className="border rounded-lg overflow-hidden">
            <Table className="table-fixed w-full">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="w-[120px]">Month</TableHead>
                  <TableHead className="w-[80px]">Year</TableHead>

                  {activeTab === "monthly" && (
                    <TableHead className="w-[160px] text-center">
                      Monthly_Assigned
                    </TableHead>
                  )}

                  {activeTab === "extra" && (
                    <TableHead className="w-[160px] text-center">
                      Extra
                    </TableHead>
                  )}

                  <TableHead className="w-[200px] text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {monthRows.map((row, idx) => {
                  const monthIndex = monthMap[row.month];

                  /* ---------------------------------------------------- */
                  /* MONTHLY ASSIGNED — Get from employee balances (any employee) */
                  /* All employees have the same monthly_assigned for a given month */
                  /* ---------------------------------------------------- */
                  const baseFromBalance = employeeBalances.find(
                    (b) =>
                      Number(b.year) === Number(row.year) &&
                      Number(b.month) === Number(monthIndex)
                  )?.monthly_assigned;

                  // Use balance value if available, otherwise get from allocations, default to 1
                  const baseFromStore = baseFromBalance !== undefined
                    ? baseFromBalance
                    : (allocations.find(
                      (a) => a.year === row.year && a.month === monthIndex
                    )?.paid || 1);

                  /* ---------------------------------------------------- */
                  /* EXTRA LEAVE — employee-specific from allExtraLeave */
                  /* ---------------------------------------------------- */
                  const extraFromStore =
                    allExtraLeave.find(
                      (b) =>
                        String(b.employee_code) === String(selectedEmp) &&
                        Number(b.year) === Number(row.year) &&
                        Number(b.month) === Number(monthIndex)
                    )?.extra_leave ?? 0;


                  const isEditing = row.editable;
                  const isCurrentMonth =
                    row.year === currentYear && monthIndex === currentMonth;

                  const canEditBase = activeTab === "monthly";
                  const canEditExtra = activeTab === "extra" && selectedEmp !== "all";

                  return (
                    <TableRow
                      key={idx}
                      className={
                        isEditing
                          ? "bg-blue-50"
                          : isCurrentMonth
                            ? "bg-gray-50"
                            : ""
                      }
                    >
                      <TableCell className="w-[120px]">{row.month}</TableCell>
                      <TableCell className="w-[80px]">{row.year}</TableCell>

                      {/* MONTHLY COLUMN */}
                      {activeTab === "monthly" && (
                        <TableCell className="w-[160px] text-center">
                          {isEditing && canEditBase ? (
                            <Input
                              type="number"
                              className="w-20 text-center mx-auto"
                              value={row.allotted}
                              onChange={(e) =>
                                updateRow(idx, "allotted", e.target.value)
                              }
                            />
                          ) : (
                            <span>{baseFromStore}</span>
                          )}
                        </TableCell>
                      )}

                      {/* EXTRA COLUMN */}
                      {activeTab === "extra" && (
                        <TableCell className="w-[160px] text-center">
                          {selectedEmp === "all" ? (
                            <span className="text-xs text-muted-foreground">
                              Select employee
                            </span>
                          ) : isEditing && canEditExtra ? (
                            <Input
                              type="number"
                              className="w-20 text-center mx-auto"
                              value={extraValue}
                              onChange={(e) => setExtraValue(e.target.value)}
                            />
                          ) : (
                            <span>{extraFromStore > 0 ? extraFromStore : "-"}</span>
                          )}
                        </TableCell>
                      )}


                      {/* ACTIONS */}
                      <TableCell className="w-[200px] text-center">
                        {activeTab === "monthly" ? (
                          // Monthly tab - Edit mode
                          isEditing ? (
                            <div className="flex justify-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setMonthRows((prev) =>
                                    prev.map((x) => ({
                                      ...x,
                                      editable: false,
                                    }))
                                  );
                                }}
                              >
                                Cancel
                              </Button>

                              <Button
                                size="sm"
                                className="bg-blue-600 text-white"
                                onClick={() => {
                                  const baseToSave = row.allotted || baseFromStore;
                                  saveMergedLeave(activeTab, row, baseToSave, 0);
                                }}
                              >
                                Save
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setMonthRows((prev) =>
                                  prev.map((r, i) =>
                                    i === idx
                                      ? {
                                        ...r,
                                        editable: true,
                                        allotted: baseFromStore,
                                      }
                                      : { ...r, editable: false }
                                  )
                                );
                              }}
                            >
                              Edit
                            </Button>
                          )
                        ) : (
                          // Extra tab - Add/Remove mode
                          isEditing ? (
                            <div className="flex justify-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setMonthRows((prev) =>
                                    prev.map((x) => ({
                                      ...x,
                                      editable: false,
                                    }))
                                  );
                                  setExtraValue("");
                                }}
                              >
                                Cancel
                              </Button>

                              <Button
                                size="sm"
                                className="bg-green-600 text-white"
                                onClick={() => {
                                  const extraToSave = Number(extraValue || 0);
                                  if (extraToSave === 0) {
                                    toast.error("Enter a value greater than 0");
                                    return;
                                  }
                                  saveMergedLeave(activeTab, row, baseFromStore, extraToSave);
                                }}
                              >
                                Add
                              </Button>

                              <Button
                                size="sm"
                                className="bg-red-600 text-white"
                                onClick={() => {
                                  const extraToSave = -Number(extraValue || 0);
                                  if (extraToSave === 0) {
                                    toast.error("Enter a value greater than 0");
                                    return;
                                  }
                                  saveMergedLeave(activeTab, row, baseFromStore, extraToSave);
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={selectedEmp === "all"}
                              onClick={() => {
                                setMonthRows((prev) =>
                                  prev.map((r, i) =>
                                    i === idx
                                      ? { ...r, editable: true }
                                      : { ...r, editable: false }
                                  )
                                );
                                setExtraValue("");
                              }}
                            >
                              Manage
                            </Button>
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>


            </Table>
          </div>
        </CardContent>
      </Card>

      {/* =============================================================== */}
      {/* EMPLOYEE BALANCE SUMMARY — UNCHANGED                           */}
      {/* =============================================================== */}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">
              Employee Leave Balance —{" "}
              {now.toLocaleString("default", { month: "long" })} {currentYear}
            </CardTitle>

            <div className="w-60">
              <Select value={selectedEmp} onValueChange={setSelectedEmp}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem
                      key={emp.employee_code}
                      value={emp.employee_code}
                    >
                      {emp.full_name} ({emp.employee_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loadingBalances ? (
            <p>Loading...</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Emp Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-center">Leave Balance </TableHead>
                    <TableHead className="text-center">Paid Used</TableHead>
                    <TableHead className="text-center">Unpaid Used</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {employeeBalances
                    .filter(
                      (b) =>
                        (selectedEmp === "all" ||
                          b.employee_code == selectedEmp) &&
                        b.year === currentYear &&
                        b.month === currentMonth
                    )
                    .map((b, index) => (
                      <TableRow key={index}>
                        <TableCell>{b.employee_code}</TableCell>
                        <TableCell>{b.full_name}</TableCell>
                        <TableCell className="text-center">
                          {b.remaining}
                        </TableCell>
                        <TableCell className="text-center">
                          {b.paid_used}
                        </TableCell>
                        <TableCell className="text-center">
                          {b.unpaid_used}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* =============================================================== */}
      {/* LEAVE APPROVAL TABLE — UNCHANGED                               */}
      {/* =============================================================== */}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {selectedEmp === "all"
              ? "All Leave Requests"
              : `Leaves of ${employeeMap[selectedEmp]}`}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : filteredLeaves.length === 0 ? (
            <p>No leave requests found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Emp Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredLeaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell>{leave.employee_code}</TableCell>
                      <TableCell>{employeeMap[leave.employee_code]}</TableCell>
                      <TableCell>
                        {new Date(leave.start_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(leave.end_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{leave.reason}</TableCell>

                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-white ${leave.status === "Approved"
                            ? "bg-green-500"
                            : leave.status === "Rejected"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                            }`}
                        >
                          {leave.status}
                        </span>
                      </TableCell>

                      <TableCell>
                        {leave.status === "Pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-500 text-white"
                              onClick={() =>
                                dispatch(
                                  updateLeaveStatus({
                                    id: leave.id,
                                    status: "Approved",
                                    approved_by: user?.full_name,
                                  })
                                )
                              }
                            >
                              Approve
                            </Button>

                            <Button
                              size="sm"
                              className="bg-red-500 text-white"
                              onClick={() =>
                                dispatch(
                                  updateLeaveStatus({
                                    id: leave.id,
                                    status: "Rejected",
                                    approved_by: user?.full_name,
                                  })
                                )
                              }
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}