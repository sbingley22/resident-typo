import { Model } from "./models/Ground-concrete"

const Ground = ({ position, scale }) => {
  const meshPosition = [
    scale/2,
    0,
    scale/2,
  ]
  return (
    <group
      position={position}
    >
      <Model 
        receiveShadow
        position={meshPosition}
        scale={scale}
      />
    </group>
  )
}

export default Ground