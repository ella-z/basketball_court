import { CHANGE } from "../constants/tabBar"

const INITIAL_STATE = {
  selected: 0
}

export default function tabBar(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CHANGE:
      return {
        ...state,
        selected: action.selected
      }
    default:
      return state
  }
}