"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCreateCustomer } from "@/hooks/use-customers";

export function AddCustomerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const createCustomer = useCreateCustomer();

  const reset = () => {
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = "Name is required";
    if (phone.trim().length < 7) nextErrors.phone = "Enter a valid phone number";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    createCustomer.mutate(
      { name, phone, email: email || undefined, notes: notes || undefined },
      { onSuccess: handleClose }
    );
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title="New Customer"
      footer={
        <>
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="flex-1" loading={createCustomer.isPending} onClick={handleSubmit}>
            Save Customer
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <p className="text-[13px] font-semibold text-ink">Name</p>
          <Input
            placeholder="e.g. ABC Traders"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-[13px] font-semibold text-ink">Phone</p>
          <Input
            placeholder="+91 00000 00000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-[13px] font-semibold text-ink">Email (optional)</p>
          <Input
            type="email"
            placeholder="name@business.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-[13px] font-semibold text-ink">Notes (optional)</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="e.g. usually orders on credit, settles monthly"
            className="w-full resize-none rounded-[var(--radius-sm)] border border-border bg-input p-3 text-[14px] text-ink outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20"
          />
        </div>
      </div>
    </Drawer>
  );
}
