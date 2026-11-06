"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useCreateStaffMember } from "@/hooks/use-staff";
import type { StaffRole } from "@/types";

const roleOptions: { value: StaffRole; label: string }[] = [
  { value: "staff", label: "Staff" },
  { value: "admin", label: "Admin" },
  { value: "ceo", label: "CEO" },
];

export function AddStaffModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<StaffRole>("staff");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const createStaff = useCreateStaffMember();

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setRole("staff");
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    createStaff.mutate(
      { name, email, phone: phone || undefined, role },
      { onSuccess: handleClose }
    );
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title="Add Staff"
      footer={
        <>
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="flex-1" loading={createStaff.isPending} onClick={handleSubmit}>
            Invite Staff
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-body-sm font-semibold text-ink" htmlFor="staff-name">
            Full name
          </label>
          <Input
            id="staff-name"
            placeholder="e.g. Rahul Varma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-body-sm font-semibold text-ink" htmlFor="staff-email">
            Email
          </label>
          <Input
            id="staff-email"
            type="email"
            placeholder="rahul@gledflow.app"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-body-sm font-semibold text-ink" htmlFor="staff-phone">
            Phone <span className="text-ink-faint">(optional)</span>
          </label>
          <Input
            id="staff-phone"
            placeholder="+91 98765-43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-body-sm font-semibold text-ink" htmlFor="staff-role">
            Role
          </label>
          <Select
            id="staff-role"
            value={role}
            onChange={(e) => setRole(e.target.value as StaffRole)}
            options={roleOptions}
          />
          <p className="text-caption text-ink-muted">
            Admin and CEO roles get full access by default; you can fine-tune this from
            Permissions afterward.
          </p>
        </div>
      </div>
    </Drawer>
  );
}
