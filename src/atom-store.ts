import { atomWithStorage } from "jotai/utils";

export const selectedMenuItemAtom = atomWithStorage<string | null>(
  "selectedMenuItem",
  "products-management",
);
export const selectedSecondaryItemAtom = atomWithStorage<string | null>(
  "selectedSecondaryItem",
  null,
);
