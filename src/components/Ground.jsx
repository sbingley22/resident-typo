import * as THREE from "three"
import { useTexture } from "@react-three/drei"
import ground from "../assets/ground-concrete.png"

const Ground = ({ position, scale }) => {
  const texture = useTexture(ground)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  
  return (
    <group
      position={position}
    >
      <mesh 
        receiveShadow 
        rotation-x={ -Math.PI / 2}
      >
        <planeGeometry args={[scale, scale]} />
        <meshStandardMaterial 
          map={texture}
          map-repeat={[5,5]}
        />
      </mesh>
    </group>
  )
}

export default Ground