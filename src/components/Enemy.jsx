import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"
import Pathfinding from 'pathfinding'

const Enemy = ({ position, grid }) => {
  const ref = useRef()
  const playerRef = useRef(null)
  const { scene } = useThree();
  
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

  const findSceneObject = (name) => {
    let object = undefined
    scene.children.forEach(child => {
      if (child.name == name) {
        object = child
      }
    })
    return object
  }

  useFrame((state, delta) => {
    if (playerRef.current == null) playerRef.current = findSceneObject("player")
    //console.log(playerRef.current)
    
    const movement = () => {
      const pos = ref.current.position
      const playerPos = playerRef.current.position
      const dist = pos.distanceTo(playerPos)
      if (dist < 0.5) return

      const path = findPath(
        [Math.round(pos.x),
        Math.round(pos.z)], 
        [Math.round(playerPos.x), 
        Math.round(playerPos.z)]
      )

      if (path.length < 3) return
      console.log(grid)
      //console.log(path[0], path[1])
      const speed = 0.01
      const targetPosition = new THREE.Vector3(path[1][0], 0, path[1][1])
      const direction = targetPosition.sub(pos)
      direction.normalize().multiplyScalar(speed)
      const newPosition = pos.add(direction)
      ref.current.position.copy(newPosition)
    }
    movement()

  })

  return (
    <group 
      ref={ref} 
      position={position}
      name="enemy"
    >
      <mesh 
        receiveShadow 
        castShadow
        position={[0.5,0.5,0.5]}
      >
        <boxGeometry args={[0.5,1,0.5]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  )
}

export default Enemy