import * as THREE from "three"
import { useTexture } from "@react-three/drei"
import dirt from "../assets/dirt.jpg"
import wall from "../assets/wall.jpg"

const Box = ({position, size, color, type, rotation}) => {
  let texture = null  
  if (type == "wall") texture = useTexture(wall)
  else if (type == "wall2") texture = useTexture(dirt)
  if (texture != null ) texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  
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
      { type !== "invisible" && <mesh 
        receiveShadow 
        castShadow
        position={meshPosition}
        rotation={meshRotation}
      >
        <boxGeometry args={size} />
        { type == "solid" ? 
          <meshStandardMaterial 
            color={color} 
          />
          :
          <meshStandardMaterial 
            color={color} 
            map={texture}
            map-repeat={[1,1]}
          />
        }
      </mesh> }
    </group>
  )
}

Box.defaultProps = {
  position: [0,0,0],
  size: [1,1,1],
  color: "white",
  type: "solid",
}

export default Box