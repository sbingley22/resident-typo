import * as THREE from "three"
import { useTexture } from "@react-three/drei"
import dirt from "../../assets/dirt.jpg"

const Wall2 = ({position, size, rotation, geo}) => {
  const texture = useTexture(dirt)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  
  const meshPosition = [
    size[0]/2,
    size[1]/2,
    size[2]/2,
  ]
  if (rotation == 1 || rotation == 3) {
    meshPosition[0] = size[2]/2
    meshPosition[2] = size[0]/2
  }
  const meshRotation = [0,rotation*Math.PI/2,0]
  
  return (
    <group
      position={position}
    >
      <mesh 
        geometry={geo}
        receiveShadow 
        castShadow
        position={meshPosition}
        rotation={meshRotation}
        scale={size}
      >
        <meshStandardMaterial 
          map={texture}
          map-repeat={[1,1]}
        />
      </mesh>
    </group>
  )
}

Wall2.defaultProps = {
  position: [0,0,0],
  size: [1,1,1],
}

export default Wall2