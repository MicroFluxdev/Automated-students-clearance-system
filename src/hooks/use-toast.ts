import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: "destructive" | "default";
}

export const useToast = () => {
  const toast = ({ title, description, variant }: ToastOptions) => {
    const message = description ? `${title}: ${description}` : title;

    if (variant === "destructive") {
      sonnerToast.error(title, {
        description,
      });
    } else {
      sonnerToast.success(title, {
        description,
      });
    }
  };

  return { toast };
};
