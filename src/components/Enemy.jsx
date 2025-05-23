import { useFrame, useThree } from "@react-three/fiber"
import { PositionalAudio } from "@react-three/drei"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import Pathfinding from 'pathfinding'
import { Zombie } from "./models/Zombie"
import { ZombieMan } from "./models/ZombieMan"
import ShadowBlob from "./models/ShadowBlob"
import usePlayerStore from "./stores/PlayerStore"

const Enemy = ({ index, position, grid, gridSize, options }) => {
  const ref = useRef()
  const meshRef = useRef()
  const playerRef = useRef(null)
  const { scene } = useThree();

  const animName = useRef("Idle")
  const animTimer = useRef(null)
  const attackTimer = useRef(null)
  const savedPath = useRef(null)
  const pathFrames = useRef(Math.round(Math.random()*60))
  const baseSpeed = options.difficulty == 0 ? 0.35 : 1
  
  const audioGrowlRef = useRef()
  const audioHurtRef = useRef()

  useEffect(()=>{
    if (audioGrowlRef.current){
      audioGrowlRef.current.play()
    }
  }, [])

  const playerStore = usePlayerStore()
  const setPlayerStore = (attribute, value) => {
    usePlayerStore.setState( state => {
      const newState = {...state}
      newState[attribute] = value
      return newState
    })
  }
  const hitPlayer = (flag, value, id) => {
    usePlayerStore.setState( state => {
      const newState = {...state}
      newState["actionFlag"] = flag
      newState["actionValue"] = value
      newState["actionId"] = id
      return newState
    })
  }
  
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

  const tryAttack = (delta) => {
    if (animName.current === "Attack Swipe") return
    if (animName.current === "Take Damage2") return

    // Start an attack
    if (attackTimer.current === null) {
      attackTimer.current = 0.3
      updateAnimation("Attack Swipe")
      animTimer.current = 0.8
    }
    else {
      // Update attack timer
      attackTimer.current -= delta
      if (attackTimer.current <= 0) {
        // Attack frame
        attackTimer.current = null
        hitPlayer("Take Damage", 20, null)
      }
    }
  }

  const movement = (delta) => {
    // Get distance between this and target
    const pos = ref.current.position
    const playerPos = playerRef.current.position
    const dist = pos.distanceTo(playerPos)
    if (dist < 0.75) {
      // Try attacking
      tryAttack(delta)
      return false
    }

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
    const speed = baseSpeed * delta
    targetPosition.set(nextStep[0], 0, nextStep[1])
    const direction = targetPosition.sub(pos)
    direction.normalize().multiplyScalar(speed)
    const newPosition = pos.add(direction)
    ref.current.position.copy(newPosition)

    rotateTo(direction)
    return true
  }

  const updateAnimation = (name) => {
    //console.log(animName.current, name)
    if (animName.current === name) return
    if (animName.current === "Take Damage2" && name !== "Take Damage2") return
    animName.current = name
  }

  const playSound = (audioRef) => {
    if (audioRef.current && !audioRef.current.isPlaying) {
      audioRef.current.play();
    }
  }

  // Having these variables outside useFrame helps garbage collection
  const targetPosition = new THREE.Vector3()
  const targetRotation = new THREE.Quaternion()
  const lerpedRotation = new THREE.Quaternion()
  const euler = new THREE.Euler(0,0,0)

  useFrame((state, delta) => {
    if (playerRef.current == null) playerRef.current = findSceneObject("player")
    //console.log(playerRef.current)

    // Load all enemies at start. Classify enemies below -988 y as inactive
    const status = ref.current.position.y < -998 ? "inactive" : "active"
    if (status === "inactive") return

    // Clear one shot animations
    if (animTimer.current) {
      animTimer.current -= delta
      if (animTimer.current < 0) {
        animTimer.current = null
        animName.current = "Idle"
      }
    }

    const actionFlag = ref.current.actionFlag
    const actionValue = ref.current.actionValue
    if (actionFlag === "takeDmg") {
      //console.log("Taking damaged: ", actionValue)
      ref.current.actionFlag = ""
      ref.current.health -= actionValue
      attackTimer.current = null
      playSound(audioHurtRef)
      
      if (ref.current.health <= 0) {
        // target killed
        ref.current.position.y = -999
        return
      } else {
        updateAnimation("Take Damage2")
        animTimer.current = 0.8
      }
    }

    if (animName.current == "Take Damage2") return
    if (animName.current == "Attack Swipe") return
    
    const moving = movement(delta)
    if (moving) {
      if (animTimer.current <= 0) updateAnimation("Staggering")
    }
    else {
      if (animTimer.current <= 0) updateAnimation("Idle")
    }

  })

  //console.log("Enemy rerender")
  return (
    <group 
      ref={ref} 
      position={position}
      name="enemy"
      health={0}
      gameid={"enemy: "+index}
      actionFlag=""
      actionValue=""
    >
      <group
        ref={meshRef}
        position={[0.25,0,0.25]}
      >
        { index % 2 == 0 ? 
          <ZombieMan 
          animName={animName}
          />
          :
          <Zombie 
          animName={animName}
          />
        }
        <ShadowBlob offset={0.001 * index} />

        <PositionalAudio 
          ref={audioGrowlRef} 
          url='/zombie-growl2.wav' 
          distance={5} 
          loop={true}
        />
        <PositionalAudio 
          ref={audioHurtRef} 
          url='/blood-splat.wav' 
          distance={25} 
          loop={false}
        />
      </group>
    </group>
  )
}

Enemy.defaultProps = {
  index: 0
}

export default Enemy