import React, { createContext, useContext, useState, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AlertDialogOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  content?: React.ReactNode;
};

type AlertDialogContextType = {
  openAlert: (options: AlertDialogOptions) => void;
  closeAlert: () => void;
};

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(
  undefined,
);

export function AlertDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AlertDialogOptions | null>(null);

  const openAlert = useCallback((alertOptions: AlertDialogOptions) => {
    setOptions(alertOptions);
    setIsOpen(true);
  }, []);

  const closeAlert = useCallback(() => {
    setIsOpen(false);
    setOptions(null);
  }, []);

  return (
    <AlertDialogContext.Provider value={{ openAlert, closeAlert }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#ffa500] uppercase">
              {options?.title || "Confirm Action"}
            </AlertDialogTitle>
            {options?.description && (
              <AlertDialogDescription>
                {options.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          {options?.content && <div className="mt-2">{options.content}</div>}
          <AlertDialogCancel onClick={closeAlert}>
            {options?.cancelText || "Cancel"}
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
}

export function useAlertDialog() {
  const context = useContext(AlertDialogContext);
  if (context === undefined) {
    throw new Error("useAlertDialog must be used within AlertDialogProvider");
  }
  return context; // Provides both `openAlert` and `closeDialog`
}
