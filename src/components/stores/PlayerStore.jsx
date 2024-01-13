import { create } from "zustand"

const usePlayerStore = create((set) => ({
  health: 100,
  ammo: 20,
  mode: "default",
  targets: [
    // {
    //   id: "1",
    //   enemyId: "",
    //   name: "tester",
    //   pos: [60, 50]
    // },
  ],
}))

export default usePlayerStore