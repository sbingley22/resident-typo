import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { useKeyboardControls } from "@react-three/drei"
import * as THREE from "three"

const Player = (props) => {
  const ref = useRef()
  const [, getKeys] = useKeyboardControls()

  useFrame((state, delta) => {
    const { forward, backward, left, right, jump, interact } = getKeys()
    
    const updateCamera = () => {
      const camPos = new THREE.Vector3(
        ref.current.position.x,
        ref.current.position.y +3,
        ref.current.position.z -3,
      )
      state.camera.position.set(camPos.x, camPos.y, camPos.z)
      state.camera.lookAt(ref.current.position)
    }
    updateCamera()

    if (interact) {
      console.log(ref.current)
    }

  })
  return (
    <group ref={ref} position={props.position}>
      <mesh 
        receiveShadow 
        castShadow
        position={[0,0.5,0]}
      >
        <boxGeometry args={[0.5,1,0.5]} />
        <meshStandardMaterial color="purple" />
      </mesh>
    </group>
  )
}

export default Player