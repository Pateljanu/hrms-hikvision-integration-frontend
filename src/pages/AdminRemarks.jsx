import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchPendingRemarks,
  acceptRemark,
  rejectRemark,
} from "../features/remarks/remarkThunks";

import { fetchEmployees } from "../features/employees/employeesThunks";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";

export default function AdminRemarks() {
  const dispatch = useDispatch();

  const pending = useSelector((state) => state.remarks?.pending || []);

  const employees = useSelector((state) => {
    return (
      state.employees?.employees ||
      state.employees?.list ||
      state.employees?.data ||
      state.employees?.all ||
      state.employees?.allEmployees ||
      state.employees?.employeeList ||
      []
    );
  });

  const [actionModal, setActionModal] = useState({
    open: false,
    mode: null,
    remark: null,
  });

  const [adminMsg, setAdminMsg] = useState("");

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchPendingRemarks());
  }, [dispatch]);

  const employeeMap = useMemo(() => {
    const map = {};
    employees?.forEach((emp) => {
      map[String(emp.employee_code)] =
        emp.full_name || emp.name || emp.employee_name;
    });
    return map;
  }, [employees]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const openAccept = (remark) => {
    setActionModal({ open: true, mode: "accept", remark });
  };

  const openReject = (remark) => {
    setActionModal({ open: true, mode: "reject", remark });
  };

  const handleSubmit = async () => {
    try {
      if (actionModal.mode === "accept") {
        await dispatch(
          acceptRemark({
            remarkId: actionModal.remark.id,
            admin_response: adminMsg,
          })
        ).unwrap();

        toast.success("Remark approved — attendance updated!");
      } else {
        await dispatch(
          rejectRemark({
            remarkId: actionModal.remark.id,
            admin_response: adminMsg,
          })
        ).unwrap();

        toast.error("Remark rejected.");
      }

      dispatch(fetchPendingRemarks());
      setActionModal({ open: false, mode: null, remark: null });
      setAdminMsg("");
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Pending Attendance Corrections</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Requests</CardTitle>
        </CardHeader>

        <CardContent>
          {pending.length === 0 ? (
            <p>No pending requests found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="p-2">Emp Code</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Correction</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {pending.map((r) => {
                  const name = employeeMap[String(r.employee_code)];

                  return (
                    <tr key={r.id} className="border-b">
                      <td className="p-2">{r.employee_code}</td>

                      <td className="p-2">{name || "Unknown"}</td>

                      <td className="p-2">{formatDate(r.attendance_date)}</td>

                      <td className="p-2">
                        <div className="text-xs space-y-1">
                          <p>
                            <b>Remark:</b> {r.remark_text}
                          </p>

                          <p>
                            <b>Old In:</b> {r.old_clock_in || "-"}
                          </p>
                          <p>
                            <b>Old Out:</b> {r.old_clock_out || "-"}
                          </p>

                          <p>
                            <b>New In:</b> {r.new_clock_in || "-"}
                          </p>
                          <p>
                            <b>New Out:</b> {r.new_clock_out || "-"}
                          </p>
                        </div>
                      </td>

                      <td className="p-2 space-x-2">
                        <Button
                          size="sm"
                          className="bg-green-600 text-white"
                          onClick={() => openAccept(r)}
                        >
                          Accept
                        </Button>

                        <Button
                          size="sm"
                          className="bg-red-600 text-white"
                          onClick={() => openReject(r)}
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog
        open={actionModal.open}
        onOpenChange={() =>
          setActionModal({ open: false, mode: null, remark: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionModal.mode === "accept"
                ? "Approve Correction"
                : "Reject Correction"}
            </DialogTitle>
          </DialogHeader>

          {actionModal.remark && (
            <div className="space-y-2 text-sm mb-3">
              <p>
                <b>Date:</b> {formatDate(actionModal.remark.attendance_date)}
              </p>

              <p>
                <b>Old Clock-In:</b> {actionModal.remark.old_clock_in || "-"}
              </p>
              <p>
                <b>Old Clock-Out:</b> {actionModal.remark.old_clock_out || "-"}
              </p>

              <p>
                <b>New Clock-In:</b> {actionModal.remark.new_clock_in || "-"}
              </p>
              <p>
                <b>New Clock-Out:</b>{" "}
                {actionModal.remark.new_clock_out || "-"}
              </p>

              <p className="mt-2">
                <b>Remark:</b> {actionModal.remark.remark_text}
              </p>
            </div>
          )}

          <label className="text-sm font-medium">Admin Message</label>
          <Textarea
            placeholder="Enter a message..."
            value={adminMsg}
            onChange={(e) => setAdminMsg(e.target.value)}
          />

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() =>
                setActionModal({ open: false, mode: null, remark: null })
              }
            >
              Cancel
            </Button>

            <Button onClick={handleSubmit}>
              {actionModal.mode === "accept" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
