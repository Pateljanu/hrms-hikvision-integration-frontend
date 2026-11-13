

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addHoliday, fetchHolidays } from "../features/holidays/holidayThunks";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";   // ✅ Sonner toast

export default function HolidayAdd() {
  const dispatch = useDispatch();

  const [holidayForm, setHolidayForm] = useState({
    holiday_date: "",
    title: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!holidayForm.holiday_date || !holidayForm.title) {
      toast.error("Please enter holiday date and title");
      return;
    }

    await dispatch(addHoliday(holidayForm));
    dispatch(fetchHolidays());

    toast.success(`Holiday "${holidayForm.title}" added successfully!`);

    setHolidayForm({
      holiday_date: "",
      title: "",
      description: "",
    });
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Add Holiday</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={holidayForm.holiday_date}
              onChange={(e) =>
                setHolidayForm({ ...holidayForm, holiday_date: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Title</Label>
            <Input
              value={holidayForm.title}
              onChange={(e) =>
                setHolidayForm({ ...holidayForm, title: e.target.value })
              }
            />
          </div>

          <div className="col-span-2">
            <Label>Description</Label>
            <Input
              value={holidayForm.description}
              onChange={(e) =>
                setHolidayForm({
                  ...holidayForm,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="col-span-2">
            <Button className="w-full">Add Holiday</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
