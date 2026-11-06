import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStaffMember,
  deleteStaffMember,
  fetchStaff,
  fetchStaffMember,
  updateStaffMember,
} from "@/services/staff-service";
import { useToast } from "@/components/ui/toast";

export function useStaff() {
  return useQuery({ queryKey: ["staff"], queryFn: fetchStaff });
}

export function useStaffMember(id: string | undefined) {
  return useQuery({
    queryKey: ["staff", id],
    queryFn: () => fetchStaffMember(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateStaffMember() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: createStaffMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      show({ tone: "success", title: "Staff member invited" });
    },
    onError: (error: Error) => show({ tone: "danger", title: "Could not invite staff", description: error.message }),
  });
}

export function useUpdateStaffMember() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof updateStaffMember>[1] }) =>
      updateStaffMember(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      show({ tone: "success", title: "Permissions updated" });
    },
    onError: (error: Error) => show({ tone: "danger", title: "Update failed", description: error.message }),
  });
}

export function useDeleteStaffMember() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: deleteStaffMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      show({ tone: "info", title: "Staff member removed" });
    },
    onError: (error: Error) => show({ tone: "danger", title: "Remove failed", description: error.message }),
  });
}
