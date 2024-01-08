import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { useKeyboardControls } from "@react-three/drei"
import * as THREE from "three"
import Pathfinding from 'pathfinding'

const Player = ({ position, grid }) => {
  const ref = useRef()
  const [, getKeys] = useKeyboardControls()

  // Pathfinding
  const finder = new Pathfinding.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true,
  })
  const findPath = (start, end) => {
    const gridClone = grid.clone()
    const path = finder.findPath(start[0], start[1], end[0], end[1], gridClone)
    return path
  }

  useFrame((state, delta) => {
    const { forward, backward, left, right, jump, interact } = getKeys()

    const movement = () => {

    }
    
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
    <group 
      ref={ref} 
      position={position}
      name="player"
    >
      <mesh 
        receiveShadow 
        castShadow
        position={[0.25,0.5,0.25]}
      >
        <boxGeometry args={[0.5,1,0.5]} />
        <meshStandardMaterial color="purple" />
      </mesh>
    </group>
  )
}


export default Player