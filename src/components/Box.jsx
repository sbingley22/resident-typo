import * as THREE from "three"

const Box = ({position, size, color}) => {
  const meshPosition = [
    size[0]/2,
    size[1]/2,
    size[2]/2,
  ]
  
  return (
    <group
      position={position}
    >
      <mesh 
        receiveShadow 
        castShadow
        position={meshPosition}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} transparent  opacity={0.5} />
      </mesh>
    </group>
  )
}

export default Box