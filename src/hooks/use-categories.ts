import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategory, deleteCategory, fetchCategories } from "@/services/categories-service";
import { useToast } from "@/components/ui/toast";
import type { TransactionType } from "@/types";

export function useCategories(type?: TransactionType) {
  return useQuery({
    queryKey: ["categories", type],
    queryFn: () => fetchCategories(type),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      show({ tone: "success", title: "Category created" });
    },
    onError: (error: Error) => show({ tone: "danger", title: "Could not create category", description: error.message }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { show } = useToast();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      show({ tone: "info", title: "Category deleted" });
    },
    onError: (error: Error) => show({ tone: "danger", title: "Delete failed", description: error.message }),
  });
}
