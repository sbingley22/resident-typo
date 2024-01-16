import { useFrame, useThree } from "@react-three/fiber"
import { useRef, useState } from "react"
import { useKeyboardControls } from "@react-three/drei"
import * as THREE from "three"
import usePlayerStore from "./stores/PlayerStore"
import { Jill } from "./models/Jill"
import ShadowBlob from "./models/ShadowBlob"
import words from "../assets/words.json"

const Player = ({ position, grid, gridSize, options }) => {
  const ref = useRef()
  const meshRef = useRef()
  const enemiesRef = useRef(null)
  const [, getKeys] = useKeyboardControls()
  const [animName, setAnimName] = useState("Idle")
  const animTimer = useRef(null)
  
  // Having these variables outside useFrame helps garbage collection
  const playerPos = new THREE.Vector3()
  const playerTarget = new THREE.Vector3()
  const enemyPos = new THREE.Vector3()
  const directionMoving = new THREE.Vector3()
  const directionEnemy = new THREE.Vector3()
  const target = new THREE.Vector3()
  const direction = new THREE.Vector3()
  const camPos = new THREE.Vector3()
  const targetRotation = new THREE.Quaternion()
  const lerpedRotation = new THREE.Quaternion()
  const euler = new THREE.Euler(0,0,0)

  const modekeyHeld = useRef(false)
  const inventoryKeyHeld = useRef(false)

  const playerStore = usePlayerStore()
  const setPlayerStore = (attribute, value) => {
    usePlayerStore.setState( state => {
      const newState = {...state}
      newState[attribute] = value
      return newState
    })
  }

  const { scene, camera } = useThree();
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
    if (x >= grid.current.nodes[0].length) return false
    if (z >= grid.current.nodes.length) return false
    if (x < 0) return false
    if (z < 0) return false

    if (grid.current.nodes[z][x].walkable) return true
    return false
  }
  const enemyCollision = (wx, wz, width) => {
    if (!enemiesRef.current) return true

    playerPos.copy(ref.current.position)
    playerPos.x += width
    playerPos.z += width

    playerTarget.x = wx + width
    playerTarget.y = playerPos.y
    playerTarget.z = wz + width
    let canMove = true

    enemiesRef.current.forEach(enemy => {
      enemyPos.copy(enemy.position)
      enemyPos.x += width
      enemyPos.z += width
      const distance = playerTarget.distanceTo(enemyPos)
      if (distance < width * 2) {
        // now test direction
        // if player is moving away then we shouldn't prevent him from moving
        directionMoving.subVectors(playerPos, playerTarget).normalize()
        directionEnemy.subVectors(playerPos, enemyPos).normalize()
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

  const updateAnimation = (name) => {
    if (animName === name) return
    if (animName === "Pistol Fire" && name !== "Pistol Fire") return
    if (animName === "Take Damage" && name !== "Take Damage") return
    setAnimName(name)
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

  const movement = (delta, forward, backward, left, right) => {
    if (animName === "Take Damage") return false

    let dx = 0
    let dz = 0
    if (left) dx = -1
    if (right) dx = 1
    if (forward) dz = -1
    if (backward) dz = 1

    if (dx == 0 && dz == 0) return false

    if (dx != 0 && dz != 0) {
      dx = dx * 0.74
      dz = dz * 0.74
    }
    const speed = 4 * delta
    dx *= speed
    dz *= speed

    target.set(
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
    direction.set(dx,0,dz)
    rotateTo(direction)
    return true
  }

  const takeDamage = (amount) => {
    amount = 1 // TESTING ONLY
    updateAnimation("Take Damage")
    animTimer.current = 0.2
    const newHealth = playerStore.health - amount
    //console.log(playerStore)

    if (newHealth <= 0) {
      console.log("Game Over")
      window.location.reload()
    }
    else {
      setPlayerStore("health", newHealth)
    }
  }

  const checkFlags = () => {
    const actionFlag = playerStore.actionFlag
    // firing at enemy
    if (actionFlag === "enemyDmg") {
      const enemy = enemiesRef.current.find(enemy => (enemy.gameid === playerStore.actionId))
      enemy.actionFlag = "takeDmg"
      enemy.actionValue = playerStore.actionValue

      setPlayerStore("actionFlag", "")
      updateAnimation("Pistol Fire")
      animTimer.current = 0.3
    } else if (actionFlag === "Shot Missed") {
      setPlayerStore("actionFlag", "")
      updateAnimation("Pistol Fire")
      animTimer.current = 0.3
    } else if (actionFlag === "Take Damage") {
      setPlayerStore("actionFlag", "")
      takeDamage(playerStore.actionValue)
      animTimer.current = 0.6
    }
  }

  const getWord = () => {
    let word = null

    const randomIndex = Math.floor(Math.random() * words[options.wordsList].length)
    word = words[options.wordsList][randomIndex]

    return word
  }

  useFrame((state, delta) => {
    if (enemiesRef.current == null) enemiesRef.current = findSceneObjects("enemy")

    const { forward, backward, left, right, typeMode, interact, inventory } = getKeys()

    // Clear one shot animations
    if (animTimer.current) {
      animTimer.current -= delta
      if (animTimer.current < 0) {
        animTimer.current = null
        if (animName === "Pistol Fire") setAnimName("Pistol Aim")
        else setAnimName("Idle")
      }
    }

    // Inventory key pressed
    if (inventory) {
      if (inventoryKeyHeld.current == false) {
        if (playerStore.currentWeapon === "pistol") {
          setPlayerStore("currentWeapon", "desert eagle")
        } else {
          setPlayerStore("currentWeapon", "pistol")
        }
        inventoryKeyHeld.current = true
      }
    }
    else {
      inventoryKeyHeld.current = false
    }

    // Typemode key pressed
    if (typeMode) {
      if (modekeyHeld.current == false) {
        if (playerStore.mode === "typing") {
          setPlayerStore("mode", "default")
          //console.log("setting mode to default")
        } else {
          setPlayerStore("mode", "typing")
          //console.log("setting mode to typing")
        }
        modekeyHeld.current = true
      }
    }
    else {
      modekeyHeld.current = false
    }
    
    // Player in type mode
    if (playerStore.mode === "typing") {
      // Get list of viable targets
      if (enemiesRef.current) {
        const targets = []

        enemiesRef.current.forEach( enemy => {
          const screenPosition = enemy.position.clone();
          const distance = ref.current.position.distanceTo(screenPosition)
          if (distance > 7) return

          screenPosition.project(camera);
          
          const screenX = ( (screenPosition.x + 1 ) / 2 ) * 100
          const screenY = ( (screenPosition.y + 1 ) / 2 ) * 100
          //console.log(screenX, screenY)

          if (screenX < 10 || screenX > 90 ) return
          if (screenY < 10 || screenY > 90 ) return

          // Do not change word if target already exists
          let word = null
          const targetExists = playerStore.targets.find(target => target.gameid === enemy.gameid)
          if (targetExists) word = targetExists.name 
          else word = getWord()

          targets.push({
            id: enemy.id,
            gameid: enemy.gameid,
            name: word,
            pos: [screenX, screenY],
          })
        })

        // rotate to current target
        if (playerStore.currentTarget) {
          const target = enemiesRef.current.find(target => target.gameid === playerStore.currentTarget)
          if (target) {
            const dx = target.position.x - ref.current.position.x
            const dz = target.position.z - ref.current.position.z
            direction.set(dx,0,dz)
            rotateTo(direction)
          }
          updateAnimation("Pistol Aim")
        }
        else {
          updateAnimation("Pistol Ready")
        }

        // update player state targets
        setPlayerStore("targets", targets)
      }

      checkFlags()

      return
    }

    checkFlags()

    const moving = movement(delta, forward, backward, left, right)
    if (moving) updateAnimation("Jogging")
    else updateAnimation("Idle")

    const updateCamera = () => {
      camPos.set(
        ref.current.position.x,
        ref.current.position.y +5,
        ref.current.position.z +5,
      )
      state.camera.position.set(camPos.x, camPos.y, camPos.z)
      state.camera.lookAt(ref.current.position)
    }
    updateCamera()

    if (interact) {
      console.log(ref.current)
    }

  })

  //console.log("Player rerender")
  return (
    <group 
      ref={ref} 
      position={position}
      name="player"
    >
      <group
        ref={meshRef}
        position={[0.25,0,0.25]}
      >
        <Jill 
          animName={animName}
        />
        <ShadowBlob />
      </group>
    </group>
  )
}


export default Player