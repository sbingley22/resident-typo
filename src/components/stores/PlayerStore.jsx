import { create } from "zustand"

const usePlayerStore = create((set) => ({
  health: 100,
  ammo: 20,
  mode: "default",
  targets: [],
}))

export default usePlayerStore