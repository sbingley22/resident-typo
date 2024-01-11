import * as THREE from "three"
import { useTexture } from "@react-three/drei"
import ground from "../assets/ground-concrete.png"

const Ground = ({ geo, position, scale }) => {
  const texture = useTexture(ground)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  
  return (
    <group
      position={position}
      scale={scale}
    >
      <mesh 
        geometry={geo}
        receiveShadow 
        rotation-x={ -Math.PI / 2}
      >
        <meshStandardMaterial 
          map={texture}
          map-repeat={[5,5]}
        />
      </mesh>
    </group>
  )
}

export default Ground