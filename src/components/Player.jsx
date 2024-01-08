import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react"
import { useKeyboardControls } from "@react-three/drei"
import * as THREE from "three"
import Pathfinding from 'pathfinding'

const Player = ({ position, grid, gridSize }) => {
  const ref = useRef()
  const enemiesRef = useRef(null)
  const [, getKeys] = useKeyboardControls()

  const { scene } = useThree();
  const findSceneObjects = (name) => {
    const objects = [];  
    scene.traverse((child) => {
      if (child.name === name) {
        objects.push(child);
      }
    });
    return objects;
  }

  const isWalkable = (wx, wz) => {
    const x = Math.round(wx/gridSize)
    const z = Math.round(wz/gridSize)
    if (x >= grid.nodes[0].length) return false
    if (z >= grid.nodes.length) return false
    if (x < 0) return false
    if (z < 0) return false

    if (grid.nodes[z][x].walkable) return true
    return false
  }
  const enemyCollision = (wx, wz, width) => {
    const playerPos = new THREE.Vector3().copy(ref.current.position)
    playerPos.x += width
    playerPos.z += width
    const playerTarget = new THREE.Vector3()
    playerTarget.x = wx + width
    playerTarget.y = playerPos.y
    playerTarget.z = wz + width
    let canMove = true

    enemiesRef.current.forEach(enemy => {
      const enemyPos = new THREE.Vector3().copy(enemy.position)
      enemyPos.x += width
      enemyPos.z += width
      const distance = playerTarget.distanceTo(enemyPos)
      if (distance < width * 2) {
        // now test direction
        // if player is moving away then we shouldn't prevent him from moving
        const directionMoving = new THREE.Vector3().subVectors(playerPos, playerTarget).normalize()
        const directionEnemy = new THREE.Vector3().subVectors(playerPos, enemyPos).normalize()
        console.log(directionMoving)
        const distance = directionMoving.distanceTo(directionEnemy)
        if (distance < 0.5) canMove = false
        return
      }
    })
    return canMove
  }
  const canMove = (x, z, width) => {
    if (!isWalkable(x+width, z+width)) return false
    if (!isWalkable(x+width, z-width)) return false
    if (!isWalkable(x-width, z+width)) return false
    if (!isWalkable(x-width, z-width)) return false
    if (!enemyCollision(x, z, width)) return false
    return true
  }

  useFrame((state, delta) => {
    if (enemiesRef.current == null) enemiesRef.current = findSceneObjects("enemy")

    const { forward, backward, left, right, jump, interact } = getKeys()

    const movement = () => {
      let dx = 0
      let dz = 0
      if (left) dx = 1
      if (right) dx = -1
      if (forward) dz = 1
      if (backward) dz = -1

      if (dx == 0 && dz == 0) return

      if (dx != 0 && dz != 0) {
        dx = dx * 0.74
        dz = dz * 0.74
      }
      const speed = 0.05
      dx *= speed
      dz *= speed

      const target = new THREE.Vector3(
        ref.current.position.x + dx,
        ref.current.position.y,
        ref.current.position.z + dz,
      )

      const width = 0.25
      const walkable = canMove(target.x, target.z, width)
      if (!walkable) {
        if (dx != 0 && dz != 0){
          // try sliding along the wall if possible
          if (canMove(target.x, ref.current.position.z, width)) {
            target.z = ref.current.position.z
          } else if (canMove(ref.current.position.x, target.z, width)) {
            target.x = ref.current.position.x
          } else {
            return false
          }
        } else {
          return false
        }
      }

      ref.current.position.copy(target)

    }
    movement()
    
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