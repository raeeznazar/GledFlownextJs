"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "@/components/ui/Table";
import { SkeletonRow } from "@/components/ui/Skeleton";
import { AddStaffModal } from "@/components/features/staff/AddStaffModal";
import { PermissionsDrawer } from "@/components/features/staff/PermissionsDrawer";
import { useStaff, useUpdateStaffMember } from "@/hooks/use-staff";
import { formatDate } from "@/lib/utils";
import type { StaffMember } from "@/types";

const roleLabels: Record<StaffMember["role"], string> = {
  admin: "Admin",
  staff: "Staff",
  ceo: "CEO",
};

export default function StaffPage() {
  const { data: staff, isLoading } = useStaff();
  const updateStaff = useUpdateStaffMember();
  const [addOpen, setAddOpen] = useState(false);
  const [permissionsFor, setPermissionsFor] = useState<StaffMember | null>(null);

  return (
    <>
      <PageHeader
        title="Staff"
        description="Manage who can access Gled Flow and what each person can do."
        action={
          <Button leftIcon={<Plus className="size-4" />} onClick={() => setAddOpen(true)}>
            Add Staff
          </Button>
        }
      />

      <div className="bg-card rounded-[var(--radius-md)]">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell className="w-[240px]">Name</TableHeadCell>
              <TableHeadCell className="w-[140px]">Role</TableHeadCell>
              <TableHeadCell className="w-[120px]">Status</TableHeadCell>
              <TableHeadCell className="w-[160px]">Member Since</TableHeadCell>
              <TableHeadCell className="text-right">Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={5}>
                    <SkeletonRow cols={5} />
                  </td>
                </tr>
              ))
            ) : staff?.length ? (
              staff.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} size="sm" />
                      <span className="font-semibold">{s.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-ink">{roleLabels[s.role]}</TableCell>
                  <TableCell>
                    <Badge tone={s.status === "active" ? "success" : "neutral"}>
                      {s.status === "active" ? "Active" : "Suspended"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-ink-muted">{formatDate(s.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-3 text-body-sm font-semibold text-brand">
                      <button
                        onClick={() =>
                          updateStaff.mutate({
                            id: s.id,
                            input: { status: s.status === "active" ? "suspended" : "active" },
                          })
                        }
                      >
                        {s.status === "active" ? "Suspend" : "Reactivate"}
                      </button>
                      <span className="text-ink-faint">—</span>
                      <button onClick={() => setPermissionsFor(s)}>Permissions</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-ink-muted">
                  No staff members yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-body-sm text-ink-muted">
        Click &apos;Permissions&apos; on any row to open the permissions editor for that person.
      </p>

      <AddStaffModal open={addOpen} onClose={() => setAddOpen(false)} />
      <PermissionsDrawer member={permissionsFor} onClose={() => setPermissionsFor(null)} />
    </>
  );
}
