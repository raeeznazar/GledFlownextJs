"use client";

import { useEffect, useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Checkbox } from "@/components/ui/Checkbox";
import { useUpdateStaffMember } from "@/hooks/use-staff";
import type { Permission, StaffMember } from "@/types";

const GROUPS: { title: string; keys: string[] }[] = [
  { title: "Transactions", keys: ["transactions.view", "transactions.manage"] },
  { title: "Customers", keys: ["customers.manage"] },
  { title: "Categories", keys: ["categories.manage"] },
  { title: "Analytics & Reports", keys: ["analytics.view"] },
  { title: "Staff & Access", keys: ["staff.manage"] },
  { title: "Settings", keys: ["settings.manage"] },
];

export function PermissionsDrawer({
  member,
  onClose,
}: {
  member: StaffMember | null;
  onClose: () => void;
}) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const updateStaff = useUpdateStaffMember();

  useEffect(() => {
    if (member) setPermissions(member.permissions);
  }, [member]);

  const toggle = (key: string) => {
    setPermissions((prev) =>
      prev.map((p) => (p.key === key ? { ...p, allowed: !p.allowed } : p))
    );
  };

  const handleSave = () => {
    if (!member) return;
    updateStaff.mutate({ id: member.id, input: { permissions } }, { onSuccess: onClose });
  };

  return (
    <Drawer
      open={Boolean(member)}
      onClose={onClose}
      title={member ? `Permissions — ${member.name}` : "Permissions"}
      footer={
        <>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" loading={updateStaff.isPending} onClick={handleSave}>
            Save Permissions
          </Button>
        </>
      }
    >
      {member && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 border-b border-border pb-5">
            <Avatar name={member.name} />
            <div className="flex flex-col">
              <p className="text-body-sm font-bold text-ink">{member.name}</p>
              <p className="text-caption capitalize text-ink-muted">{member.role}</p>
            </div>
          </div>
          <p className="text-body-sm leading-relaxed text-ink-muted">
            Permissions control which menus and actions {member.name.split(" ")[0]} sees — a
            hidden item is not just disabled, it is absent from their app entirely.
          </p>
          {GROUPS.map((group) => (
            <div key={group.title} className="flex flex-col gap-3 border-b border-border pb-5">
              <p className="text-body-sm font-bold text-ink">{group.title}</p>
              <div className="flex flex-col gap-2.5">
                {permissions
                  .filter((p) => group.keys.includes(p.key))
                  .map((p) => (
                    <Checkbox
                      key={p.key}
                      checked={p.allowed}
                      onChange={() => toggle(p.key)}
                      label={p.label}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
}
