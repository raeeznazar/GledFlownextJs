import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTransaction,
  deleteTransaction,
  fetchTransaction,
  fetchTransactions,
  updateTransaction,
  type TransactionQuery,
} from "@/services/transactions-service";
import { useToast } from "@/components/ui/toast";

export function useTransactions(query: TransactionQuery) {
  return useQuery({
    queryKey: ["transactions", query],
    queryFn: () => fetchTransactions(query),
    placeholderData: (prev) => prev,
  });
}

export function useTransaction(id: string | undefined) {
  return useQuery({
    queryKey: ["transactions", id],
    queryFn: () => fetchTransaction(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      show({ tone: "success", title: "Transaction added" });
    },
    onError: (error: Error) => {
      show({ tone: "danger", title: "Could not add transaction", description: error.message });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof updateTransaction>[1] }) =>
      updateTransaction(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      show({ tone: "success", title: "Transaction updated" });
    },
    onError: (error: Error) => {
      show({ tone: "danger", title: "Update failed", description: error.message });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      show({ tone: "info", title: "Transaction deleted" });
    },
    onError: (error: Error) => {
      show({ tone: "danger", title: "Delete failed", description: error.message });
    },
  });
}
