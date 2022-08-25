import { CHANGE } from "../constants/tabBar";

export const change = (selected: Number) => {
  return {
    type: CHANGE,
    selected: selected
  }
}