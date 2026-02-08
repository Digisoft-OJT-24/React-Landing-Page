import { atomWithStorage } from "jotai/utils";

export const selectedMenuItemAtom = atomWithStorage<string | null>("selectedMenuItem", null);
export const selectedSecondaryItemAtom = atomWithStorage<string | null>("selectedSecondaryItem", null);