import * as THREE from "three"
import { useTexture } from "@react-three/drei"
import shadowBlob from "../../assets/ShadowBlob.png"

const ShadowBlob = ({ offset }) => {
  const texture = useTexture(shadowBlob)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  
  return (
    <group
      position={[0,0.001 + offset,0]}
      scale={[0.75, 1, 0.75]}
    >
      <mesh 
        rotation-x={ -Math.PI / 2}
      >
        <planeGeometry />
        <meshStandardMaterial 
          map={texture}
          map-repeat={[1,1]}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}

ShadowBlob.defaultProps = {
  offset: 0.001
}

export default ShadowBlob