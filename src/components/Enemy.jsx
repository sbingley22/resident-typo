import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"
import Pathfinding from 'pathfinding'

const Enemy = ({ position, grid, gridSize }) => {
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
    // Convert to grid size integers
    start[0] = Math.round(start[0]/gridSize)
    start[1] = Math.round(start[1]/gridSize)
    end[0] = Math.round(end[0]/gridSize)
    end[1] = Math.round(end[1]/gridSize)
    
    gridClone.setWalkableAt(start[0], start[1], true)
    const path = finder.findPath(start[0], start[1], end[0], end[1], gridClone)
    return path
  }

  const convertGridToWorld = (coord) => {
    return [coord[0]*gridSize, coord[1]*gridSize]
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
      if (dist < 0.75) return

      const path = findPath(
        [pos.x,
        pos.z], 
        [playerPos.x, 
        playerPos.z]
      )
      
      if (path.length < 2) return
      const nextStep = convertGridToWorld(path[1])
      const speed = 0.04
      const targetPosition = new THREE.Vector3(nextStep[0], 0, nextStep[1])
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
        position={[0.25,0.5,0.25]}
      >
        <boxGeometry args={[0.5,1,0.5]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  )
}

export default Enemy