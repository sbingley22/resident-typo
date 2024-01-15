import { create } from "zustand"

const usePlayerStore = create((set) => ({
  health: 100,
  mode: "default",
  currentWeapon: "pistol",
  weapons: {
    "pistol" : {
      ammo: 20,
    },
    "desert eagle" : {
      ammo: 3,
    },
  },
  currentTarget: null,
  targets: [],
  actionFlag: "",
  actionValue: "",
  actionId: "",
}))

export default usePlayerStore