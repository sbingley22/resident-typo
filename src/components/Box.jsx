import * as THREE from "three"

const Box = ({position, scale, color}) => {
  const meshPosition = [
    scale[0]/2,
    scale[1]/2,
    scale[2]/2,
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
        <boxGeometry args={[scale[0],scale[1],scale[2]]} />
        <meshStandardMaterial color={color} transparent  opacity={0.5}/>
      </mesh>
    </group>
  )
}

export default Box