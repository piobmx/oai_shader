import { defaultFrag, fs, vs } from "../utils/fragments";

import { atom } from "jotai";

export const vertAtom = atom("");
// export const fragAtom = atom(defaultFrag);
export const fragAtom = atom(fs);
export const promptAtom = atom("create a fractal");
export const cleanPromptAtom = atom((get) =>
  get(promptAtom).slice(0, 1000).toLowerCase()
);
export const text3dAtom = atom("Hello");

export const loadingAtom = atom(false);
// export const shaderHasErrorAtom = atom(false);
// export const shaderErrorMsgAtom = atom("");
export const geometryAtom = atom("PlaneGeometry");
export const downloadAtom = atom("");
export const cameraAtom = atom(false);
export const pivotAxesAtom = atom(false);

export const errorAtom = atom({
  hasError: false,
  errorMsg: "",
});
