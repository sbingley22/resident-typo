import { create } from "zustand"

const usePlayerStore = create((set) => ({
    health: 100,
    ammo: 20,
}))

export default usePlayerStore