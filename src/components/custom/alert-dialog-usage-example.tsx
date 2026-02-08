/**
 * Example usage of the AlertDialog in components that use AdminPageLayout
 * 
 * This file demonstrates how to use the alert dialog from any child component
 * within the AdminPageLayout. You can delete this file - it's just for reference.
 */

import { useAlertDialog } from "./alert-dialog-provider";
import { Button } from "@/components/ui/button";

// Example component showing how to use the alert dialog
export function ExampleComponent() {
  const { openAlert } = useAlertDialog();

  const handleDelete = () => {
    openAlert({
      title: "Delete Item",
      description: "Are you sure you want to delete this item? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        // Your delete logic here
        console.log("Item deleted");
        // await deleteItem();
      },
    });
  };

  const handleSave = () => {
    openAlert({
      title: "Save Changes",
      description: "Do you want to save your changes?",
      confirmText: "Save",
      cancelText: "Cancel",
      onConfirm: async () => {
        // Your save logic here
        console.log("Changes saved");
        // await saveChanges();
      },
    });
  };

  return (
    <div className="space-x-2">
      <Button onClick={handleDelete} variant="destructive">
        Delete Item
      </Button>
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}

/**
 * Usage in any component within AdminPageLayout:
 * 
 * 1. Import the hook:
 *    import { useAlertDialog } from "@/components/custom/alert-dialog-provider";
 * 
 * 2. Use it in your component:
 *    const { openAlert } = useAlertDialog();
 * 
 * 3. Call openAlert with your options:
 *    openAlert({
 *      title: "Confirm Action",
 *      description: "Optional description text",
 *      confirmText: "Confirm", // optional, defaults to "Confirm"
 *      cancelText: "Cancel",   // optional, defaults to "Cancel"
 *      variant: "default" | "destructive", // optional
 *      onConfirm: async () => {
 *        // Your confirmation logic
 *      },
 *      onCancel: () => {
 *        // Optional cancel logic
 *      },
 *    });
 */

