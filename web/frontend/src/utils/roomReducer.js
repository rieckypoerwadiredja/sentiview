export const VALID_ROOMS = ["BestBuy", "General", "Sentiment"];

export function roomReducer(state, action) {
  switch (action.type) {
    case "SET_ROOM":
      if (VALID_ROOMS.includes(action.payload)) {
        return action.payload;
      } else {
        console.error("❌ Invalid room:", action.payload);
        return state;
      }
    default:
      return state;
  }
}
