"use client";

import * as React from "react";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
  ToastProvider as RadixToastProvider,
} from "@/components/ui/toast";

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

interface ToastContextValue {
  toast: (props: ToastProps & { description?: string }) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<
    (ToastProps & { description?: string })[]
  >([]);

  const toast = React.useCallback(
    ({ description, ...props }: ToastProps & { description?: string }) => {
      const id = Math.random().toString(36).substring(7);
      const newToast = {
        ...props,
        description,
        id,
        open: true,
        onOpenChange: (open: boolean) => {
          props.onOpenChange?.(open);
          if (!open) {
            setToasts((prev) => prev.filter((t) => t.id !== id));
          }
        },
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  return (
    <RadixToastProvider>
      <ToastContext.Provider value={{ toast }}>
        {children}
        {toasts.map((toastProps) => (
          <Toast key={toastProps.id} {...toastProps}>
            {toastProps.title && <ToastTitle>{toastProps.title}</ToastTitle>}
            {toastProps.description && (
              <ToastDescription>{toastProps.description}</ToastDescription>
            )}
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastContext.Provider>
    </RadixToastProvider>
  );
}
