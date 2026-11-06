import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCustomer,
  deleteCustomer,
  fetchCustomer,
  fetchCustomers,
  updateCustomer,
  type CustomerQuery,
} from "@/services/customers-service";
import { useToast } from "@/components/ui/toast";

export function useCustomers(query: CustomerQuery) {
  return useQuery({
    queryKey: ["customers", query],
    queryFn: () => fetchCustomers(query),
    placeholderData: (prev) => prev,
  });
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => fetchCustomer(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      show({ tone: "success", title: "Customer added" });
    },
    onError: (error: Error) => show({ tone: "danger", title: "Could not add customer", description: error.message }),
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof updateCustomer>[1] }) =>
      updateCustomer(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      show({ tone: "success", title: "Customer updated" });
    },
    onError: (error: Error) => show({ tone: "danger", title: "Update failed", description: error.message }),
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      show({ tone: "info", title: "Customer deleted" });
    },
    onError: (error: Error) => show({ tone: "danger", title: "Delete failed", description: error.message }),
  });
}
