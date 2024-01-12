import usePlayerStore from "./stores/PlayerStore"

const HUD = () => {
  const health = usePlayerStore((state) => state.health)
  const ammo = usePlayerStore((state) => state.ammo)

  return (
    <div className="HUD">
      <div className="top-left">
        <h6>Health: {health}</h6>
      </div>
      <div className="top-right">
        <h6>Ammo: {ammo}</h6>
      </div>
    </div>   
  )
}

export default HUD