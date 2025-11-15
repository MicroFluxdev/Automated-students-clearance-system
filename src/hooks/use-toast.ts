import { useCallback } from "react";
import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: "destructive" | "default";
}

export const useToast = () => {
  const toast = useCallback(({ title, description, variant }: ToastOptions) => {
    if (variant === "destructive") {
      sonnerToast.error(title, {
        description,
      });
    } else {
      sonnerToast.success(title, {
        description,
      });
    }
  }, []);

  return { toast };
};
