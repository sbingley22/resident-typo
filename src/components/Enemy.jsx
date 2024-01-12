import { useFrame, useThree } from "@react-three/fiber"
import { useRef, useState } from "react"
import * as THREE from "three"
import Pathfinding from 'pathfinding'
import { Zombie } from "./models/Zombie"
import ShadowBlob from "./models/ShadowBlob"

const Enemy = ({ index, position, grid, gridSize }) => {
  const ref = useRef()
  const meshRef = useRef()
  const playerRef = useRef(null)
  const { scene } = useThree();

  const [animName, setAnimName] = useState("Idle")
  const savedPath = useRef(null)
  const pathFrames = useRef(Math.round(Math.random()*60))
  
  // Pathfinding
  const finder = new Pathfinding.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true,
  })

  const findPath = (start, end) => {
    const gridClone = grid.current.clone()
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
  const convertWorldToGrid = (coord) => {
    return [
      Math.round(coord[0]/gridSize), 
      Math.round(coord[1]/gridSize)
    ]
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

  const updateAnimation = (name) => {
    if (animName === name) return
    setAnimName(name)
  }

  // Having these variables outside useFrame helps garbage collection
  const targetPosition = new THREE.Vector3()
  const targetRotation = new THREE.Quaternion()
  const lerpedRotation = new THREE.Quaternion()
  const euler = new THREE.Euler(0,0,0)
  useFrame((state, delta) => {
    if (playerRef.current == null) playerRef.current = findSceneObject("player")
    //console.log(playerRef.current)

    const rotateTo = (direction) => {
      // Rotate to the correct direction
      const angle = Math.atan2(direction.x, direction.z);
    
      // Smooth rotation with slerp
      const currentRotation = meshRef.current.quaternion.clone();
      targetRotation.setFromEuler(euler.set(0, angle, 0));
      lerpedRotation.copy(currentRotation).slerp(targetRotation, 0.1);
    
      // Set the rotation of the body
      meshRef.current.quaternion.copy(lerpedRotation);
    }
    
    const pathfiner = (pos, playerPos) => {
      const path = findPath(
        [pos.x,
        pos.z], 
        [playerPos.x, 
        playerPos.z]
      )
      return path
    }
    const movement = () => {
      // get distance between this and target
      const pos = ref.current.position
      const playerPos = playerRef.current.position
      const dist = pos.distanceTo(playerPos)
      if (dist < 0.75) return false


      // Only do pathfinding once every n frames
      pathFrames.current += 1
      if (pathFrames.current > -1) {
        pathFrames.current = 0
        savedPath.current = pathfiner(pos, playerPos)
      }
      
      if (savedPath.current == null) return false
      if (savedPath.current.length < 2) return false

      // Pop off the path coord when it has been reached
      const posInGrid = convertWorldToGrid([pos.x,pos.z])
      if (posInGrid[0] == savedPath.current[0][0] && posInGrid[1] == savedPath.current[0][1]) {
        savedPath.current = savedPath.current.slice(1)
      }

      // Take a step towards the next path position
      const nextStep = convertGridToWorld(savedPath.current[0])
      const speed = 2 * delta
      targetPosition.set(nextStep[0], 0, nextStep[1])
      const direction = targetPosition.sub(pos)
      direction.normalize().multiplyScalar(speed)
      const newPosition = pos.add(direction)
      ref.current.position.copy(newPosition)

      rotateTo(direction)
      return true
    }
    const moving = movement()
    if (moving) {
      updateAnimation("Staggering")
    }
    else {
      updateAnimation("Idle")
    }

  })

  return (
    <group 
      ref={ref} 
      position={position}
      name="enemy"
    >
      <group
        ref={meshRef}
        position={[0.25,0,0.25]}
      >
        <Zombie 
          animName={animName}
        />
        <ShadowBlob offset={0.001 * index} />
      </group>
    </group>
  )
}

Enemy.defaultProps = {
  index: 0
}

export default Enemy