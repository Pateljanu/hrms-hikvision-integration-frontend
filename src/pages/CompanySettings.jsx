import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAllSettings,
  saveCompanySetting,
} from "../features/companySettings/companySettingsThunks";

import {
  fetchHolidays,
  deleteHoliday,
} from "../features/holidays/holidayThunks";

import HolidayAdd from "./HolidayAdd";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, X } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";

const initialFormData = {
  start_date: "",
  end_date: "",
  work_start: "",
  work_end: "",
  required_hours: "",
  weekend_days: ["Saturday", "Sunday"],

  is_default: false,
};

export default function CompanySettings() {
  const dispatch = useDispatch();

  const { allSettings = [], loading } = useSelector(
    (state) => state.companySettings
  );
  const { list: holidays = [] } = useSelector((state) => state.holidays);

  const [formData, setFormData] = useState(initialFormData);
  const [validationError, setValidationError] = useState(null);

  // Toggles
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showHolidayForm, setShowHolidayForm] = useState(false);

  useEffect(() => {
    dispatch(fetchAllSettings());
    dispatch(fetchHolidays());
  }, [dispatch]);

  // Auto calculate hours
  useEffect(() => {
    const { work_start, work_end } = formData;

    if (!work_start || !work_end) {
      setFormData((p) => ({ ...p, required_hours: "" }));
      return;
    }

    const s = new Date(`1970-01-01T${work_start}`);
    const e = new Date(`1970-01-01T${work_end}`);

    if (!isNaN(s) && !isNaN(e) && e > s) {
      const diffHours = (e - s) / (1000 * 60 * 60);
      setFormData((p) => ({
        ...p,
        required_hours: Number(diffHours.toFixed(2)),
      }));
    } else {
      setFormData((p) => ({ ...p, required_hours: "" }));
    }
  }, [formData.work_start, formData.work_end]);

  const validateForm = () => {
    if (!formData.work_start) return "Work start time required";
    if (!formData.work_end) return "Work end time required";
    if (!formData.required_hours) return "Required hours invalid";
    if (!formData.is_default && !formData.start_date)
      return "Start date required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validateForm();
    if (err) return setValidationError(err);

    const payload = {
      ...formData,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      required_hours: Number(formData.required_hours),
      weekend_days: formData.weekend_days,

    };

    try {
      await dispatch(saveCompanySetting(payload));
      await dispatch(fetchAllSettings());
      setShowCompanyForm(false);
      setFormData(initialFormData);
      setValidationError(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteHoliday = async (id) => {
    if (!window.confirm("Delete Holiday?")) return;
    await dispatch(deleteHoliday(id));
    dispatch(fetchHolidays());
  };

  const formatWeekendDays = (days) =>
    Array.isArray(days) ? days.join(", ") : String(days).replace(/[{}"]/g, "");

  return (
    <div className="p-6 max-w-7xl flex flex-col gap-9">

      {/* =========================== COMPANY WORKING HOURS =========================== */}
      <Card className="shadow-lg border rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Company Working Hours
            </CardTitle>

            <Button
              variant={showCompanyForm ? "ghost" : "default"}
              size="sm"
              onClick={() => setShowCompanyForm((v) => !v)}
            >
              {showCompanyForm ? (
                <>
                  <X size={16} className="mr-1" /> Close
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-1" /> Add Hours
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {showCompanyForm && (
            <div className="mb-6 rounded-md border p-4">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Start Date */}
                <div className="flex flex-col gap-1">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    disabled={formData.is_default}
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                  />
                </div>

                {/* End Date */}
                <div className="flex flex-col gap-1">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    disabled={formData.is_default}
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                  />
                </div>

                {/* Work Start */}
                <div className="flex flex-col gap-1">
                  <Label>Work Start</Label>
                  <Input
                    type="time"
                    value={formData.work_start}
                    onChange={(e) =>
                      setFormData({ ...formData, work_start: e.target.value })
                    }
                  />
                </div>

                {/* Work End */}
                <div className="flex flex-col gap-1">
                  <Label>Work End</Label>
                  <Input
                    type="time"
                    value={formData.work_end}
                    onChange={(e) =>
                      setFormData({ ...formData, work_end: e.target.value })
                    }
                  />
                </div>

                {/* Required Hours */}
                <div className="flex flex-col gap-1">
                  <Label>Required Hours</Label>
                  <Input readOnly value={formData.required_hours} />
                </div>

                {/* Weekend Days */}
                <div className="flex flex-col gap-1">
                  <Label>Weekend Days</Label>
                  <MultiSelect
                    options={[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ]}
                    selected={formData.weekend_days}
                    onChange={(selected) =>
                      setFormData({ ...formData, weekend_days: selected })
                    }
                    placeholder="Select weekend days..."
                  />
                </div>

                {/* Default Checkbox */}
                <div className="flex items-center gap-2 col-span-full mt-2">
                  <Checkbox
                    checked={formData.is_default}
                    onCheckedChange={(value) =>
                      setFormData({
                        ...formData,
                        is_default: Boolean(value),
                        start_date: "",
                        end_date: "",
                      })
                    }
                  />
                  <Label>Set as Default</Label>
                </div>

                {validationError && (
                  <p className="text-red-600 col-span-full">{validationError}</p>
                )}

                <div className="col-span-full flex items-center gap-2">
                  <Button type="submit" disabled={loading}>
                    Save Setting
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowCompanyForm(false);
                      setFormData(initialFormData);
                      setValidationError(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Settings List */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Work Start</TableHead>
                  <TableHead>Work End</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Weekends</TableHead>
                  <TableHead>Default</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {allSettings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No company settings found
                    </TableCell>
                  </TableRow>
                ) : (
                  allSettings.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.start_date || "-"}</TableCell>
                      <TableCell>{s.end_date || "-"}</TableCell>
                      <TableCell>{s.work_start}</TableCell>
                      <TableCell>{s.work_end}</TableCell>
                      <TableCell>
                        {s.required_hours?.hours}h {s.required_hours?.minutes}m
                      </TableCell>
                      <TableCell>{formatWeekendDays(s.weekend_days)}</TableCell>
                      <TableCell>{s.is_default ? "✅" : "❌"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* =========================== HOLIDAYS =========================== */}
      <Card className="shadow-lg border rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Holiday List
            </CardTitle>

            <Button
              variant={showHolidayForm ? "ghost" : "default"}
              size="sm"
              onClick={() => setShowHolidayForm((v) => !v)}
            >
              {showHolidayForm ? (
                <>
                  <X size={16} className="mr-1" /> Close
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-1" /> Add Holiday
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {showHolidayForm && (
            <div className="mb-6 rounded-md border-0 p-4">
              <HolidayAdd />
            </div>
          )}

          {/* Holiday List */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {holidays.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No holidays found
                    </TableCell>
                  </TableRow>
                ) : (
                  holidays.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell>
                        {h.holiday_date
                          ? new Date(h.holiday_date).toLocaleDateString(
                            "en-GB"
                          )
                          : "-"}
                      </TableCell>

                      <TableCell>{h.title}</TableCell>
                      <TableCell>{h.description || "-"}</TableCell>

                      <TableCell className="text-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteHoliday(h.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
