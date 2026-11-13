import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployees,
  saveEmployee,
  deleteEmployee,
  sendPasswordLink,
} from "../features/employees/employeesThunks";

import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Employees() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list, loading, error } = useSelector((state) => state.employees);
  const { token, user } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    employee_code: "",
    full_name: "",
    email: "",
    role: "employee",
    status: "active",
  });

  // 🔥 FIX: load employees only AFTER token + user ready
  useEffect(() => {
    if (!token || !user) return; // wait for auth
    dispatch(fetchEmployees());
  }, [dispatch, token, user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.employee_code || !form.full_name) {
      toast.error("Employee code and name are required!");
      return;
    }

    await dispatch(saveEmployee(form));
    toast.success(editing ? "Employee updated!" : "Employee added!");

    setForm({
      employee_code: "",
      full_name: "",
      email: "",
      role: "employee",
      status: "active",
    });

    setEditing(null);
    setOpen(false);
  };

  const handleEdit = (emp) => {
    setEditing(emp);
    setForm(emp);
    setOpen(true);
  };

  const handleDelete = async (code) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      await dispatch(deleteEmployee(code));
      toast.success("Employee deleted!");
    }
  };

  const handleSendPasswordLink = async (employee_code) => {
    await dispatch(sendPasswordLink(employee_code));
    toast.success("Password setup email sent!");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>+ Add Employee</Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Employee" : "Add Employee"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-3">

              <div className="space-y-1">
                <Label>Employee Code</Label>
                <Input
                  name="employee_code"
                  value={form.employee_code}
                  onChange={handleChange}
                  disabled={editing}
                />
              </div>

              <div className="space-y-1">
                <Label>Full Name</Label>
                <Input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm({ ...form, role: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            <DialogFooter className="mt-4">
              <Button onClick={handleSubmit}>
                {editing ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading && <p>Loading employees...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && list.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((emp) => (
            <Card key={emp.employee_code} className="shadow-md border border-gray-200">
              <CardHeader className="flex flex-col items-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  className="w-20 h-20 rounded-full mb-3 border"
                />
                <CardTitle className="text-lg">{emp.full_name}</CardTitle>
                <p className="text-sm text-gray-500">{emp.role}</p>
              </CardHeader>

              <CardContent className="space-y-2 text-center">
                <p><strong>Employee Code:</strong> {emp.employee_code}</p>
                <p><strong>Email:</strong> {emp.email}</p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`${emp.status === "active" ? "text-green-600" : "text-red-500"}`}>
                    {emp.status}
                  </span>
                </p>

                <div className="flex justify-center gap-2 mt-4 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/attendance?emp=${emp.employee_code}`)}
                  >
                    Attendance
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/leaves?emp=${emp.employee_code}`)}
                  >
                    Leaves
                  </Button>

                  <Button size="sm" variant="outline" onClick={() => handleEdit(emp)}>
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSendPasswordLink(emp.employee_code)}
                  >
                    Send Password Link
                  </Button>

                  <Button size="sm" variant="destructive" onClick={() => handleDelete(emp.employee_code)}>
                    Delete
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !loading && <p>No employees found.</p>
      )}
    </div>
  );
}
