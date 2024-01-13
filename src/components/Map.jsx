import { useState, useRef, useEffect } from 'react'
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from 'three'

import Box from './Box'
import Ground from './Ground'
import Pathfinding from 'pathfinding'
import Player from './Player'
import Enemy from './Enemy'
import GridHelper from './GridHelper'
import { FileCabinet } from './models/File-cabinet'
import Wall from './models/Wall'
import Wall2 from './models/Wall2'
import WallBig from './models/WallBig'

const Map = ({ map, options }) => {
  const pointLights = []
  const spotLights = []
  const playerPos = [0,0,0]
  const enemySpawn = []
  const boxes = useRef([])
  const fileCabinets = useRef([])
  const walls = useRef([])
  const walls2 = useRef([])
  const wallsBig = useRef([])

  const threeBox = new THREE.BoxGeometry()
  const threePlane = new THREE.PlaneGeometry()
  
  const staticGrid = useRef(new Pathfinding.Grid(map.size[0], map.size[1]))

  const loadMap = () => {
    map.items.forEach( item => {
      if (item.name == "cube"){
        boxes.current.push({
          pos: [
            item.pos[1]*map.gridSize, 
            0, 
            item.pos[0]*map.gridSize,
          ],
          rotation: item.rotation,
          size: [1, 1, 1]
        })
      } else if (item.name == "enemy"){
        enemySpawn.push({
          id: item.id,
          pos:  [
            item.pos[1]*map.gridSize, 
            0, 
            item.pos[0]*map.gridSize,
          ],
        })
      }  else if (item.name == "fileCabinet"){
        fileCabinets.current.push({
          pos: [
            item.pos[1]*map.gridSize, 
            0, 
            item.pos[0]*map.gridSize,
          ],
          rotation: item.rotation,
          size: [0.5,0,0.5],
        })
      } else if (item.name == "player"){
        playerPos[0] = item.pos[1]*map.gridSize
        playerPos[1] = 0
        playerPos[2] = item.pos[0]*map.gridSize
      } else if (item.name == "pointLight"){
        pointLights.push({
          pos: [
            item.pos[1]*map.gridSize,
            4,
            item.pos[0]*map.gridSize
            ],
        })
      } else if (item.name == "spotLight"){
        spotLights.push({
          pos: [
            item.pos[1]*map.gridSize,
            4,
            item.pos[0]*map.gridSize
            ],
        })
      } else if (item.name == "wall"){
        walls.current.push({
          pos: [
            item.pos[1]*map.gridSize, 
            0, 
            item.pos[0]*map.gridSize,
          ],
          rotation: item.rotation,
          size: [2, 1.75, 1]
        })
      } else if (item.name == "wall2"){
        walls2.current.push({
          pos: [
            item.pos[1]*map.gridSize, 
            0, 
            item.pos[0]*map.gridSize,
          ],
          rotation: item.rotation,
          size: [1, 1, 0.5]
        })
      } else if (item.name == "wallBig"){
        wallsBig.current.push({
          pos: [
            item.pos[1]*map.gridSize, 
            0, 
            item.pos[0]*map.gridSize,
          ],
          rotation: item.rotation,
          size: [8, 1.75, 1]
        })
      }
    })
    
    const setWalkableFromMap = () => {
      for (let x = 0; x < staticGrid.current.nodes[0].length; x++) {
        for (let y = 0; y < staticGrid.current.nodes.length; y++) {
          const square = map.grid[y][x]
          if (square.id != null && square.walkable == false) {
            staticGrid.current.setWalkableAt(x, y, false)
          }
        }
      }
    }
    setWalkableFromMap()
  }
  loadMap()

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
  const getDynamicObjects = (objs) => {
    const dynamic = []

    if (!objs || objs.length == 0) return dynamic

    objs.forEach( o => {
      const pos = o.position
      
      if (pos.x < 0 || pos.z < 0) return

      dynamic.push([
        pos.x,
        pos.x + map.gridSize,
        pos.z,
        pos.z + map.gridSize,
      ])
    })
    return dynamic
  }
  const updateGrid = (x1,x2,y1,y2, grid) => {
    x1 = Math.round(x1/map.gridSize)
    x2 = Math.round(x2/map.gridSize)
    y1 = Math.round(y1/map.gridSize)
    y2 = Math.round(y2/map.gridSize)
    for (let x = x1; x < x2; x++) {
      for (let y = y1; y < y2; y++) {
        grid.setWalkableAt(x, y, false)
      }
    }
  }
  const spotlightRefs = useRef([]);
  const addSpotLights = () => {
    // If already added spot lights, don't add them again
    if (spotlightRefs.current.length != 0) return

    // Remove existing spotlights
    spotlightRefs.current.forEach((spotlight) => {
      scene.remove(spotlight, spotlight.target);
      spotlight.dispose();
    });

    // Add spotlights
    const spotlights = spotLights.map((light, index) => {
      const spotlight = new THREE.SpotLight('#fff');
      spotlight.position.set(light.pos[0], light.pos[1], light.pos[2]);
      spotlight.target.position.set(light.pos[0], 0, light.pos[2]);
      spotlight.intensity = 10
      spotlight.castShadow = options.shadows ? true : false
      spotlight.penumbra = 0.75
      scene.add(spotlight, spotlight.target);
      return spotlight;
    });
    spotlightRefs.current = spotlights;
  }
  addSpotLights()

  const grid = useRef(staticGrid.current)
  const enemiesRef = useRef(null)
  const spawnTimer = useRef(2)
  const spawnCount = useRef(3)

  const enemies = [0,1,2,3,4]
  
  useFrame((state,delta) => {
    if (enemiesRef.current == null) enemiesRef.current = findSceneObjects("enemy")

    spawnTimer.current -= delta
    if (spawnTimer.current < 0 && spawnCount.current > 0) {
      // spawn enemies
      spawnTimer.current = 5
      // find an unused enemy to spawn
      let foundSpare = false
      enemiesRef.current.forEach( enemy => {
        if (foundSpare) return
        if (enemy.health <= 0) {
          //reuse this enemy
          foundSpare = true
          const spawnIndex = 0
          enemy.position.set(
            enemySpawn[spawnIndex].pos[0],
            enemySpawn[spawnIndex].pos[1],
            enemySpawn[spawnIndex].pos[2],
          )
          enemy.health = 100
          return
        }
      })
      
      if (foundSpare) {
        spawnCount.current -= 1
        console.log(enemiesRef.current)
      }
    }

    // update grid dynamically
    const updateDynamicGrid = () => {
      // reset dyn grid back to static
      const gridClone = staticGrid.current.clone()
      const dynObjs = getDynamicObjects(enemiesRef.current)
      dynObjs.forEach( obj => {
        updateGrid(obj[0],obj[1],obj[2],obj[3], gridClone)
      })
      grid.current = gridClone
    }
    updateDynamicGrid()
  })
  
  //console.log("Map rerender")
  return (
    <>
      <ambientLight intensity={0.1} />
      { pointLights.map( (light, index) => (
        <pointLight key={index} intensity={50} position={light.pos} castShadow={options.shadows?true:false} />
      ))}
      {spotlightRefs.current.map((spotlight, index) => (
        <primitive key={index} object={spotlight} />
      ))}

      <Player 
        position={playerPos}
        grid={staticGrid}
        gridSize={map.gridSize}
      />

      { enemies.map( (enemy, index) => (
        <Enemy
          key={"enemy: " + index}
          index={index}
          position={[-999,-999,-999]}
          grid={grid}
          gridSize={map.gridSize}
        />
      ))}
            
      <Ground geo={threePlane} position={[12, 0, 12]} scale={60} />
      {/* <GridHelper grid={grid} gridSize={map.gridSize}/> */}

      { boxes.current.map( (box, index) => (
        <Box 
          key={index}
          geo={threeBox}
          position={box.pos}
          rotation={box.rotation}
          size={box.size}
          color={box.color}
        />
      ))}
      
      { fileCabinets.current.map( (cabinet, index) => (
        <FileCabinet 
          key={index}
          position={cabinet.pos}
          rotation={cabinet.rotation}
          size={cabinet.size}
        />
      ))}

      { walls.current.map( (wall, index) => (
        <Wall 
          key={index}
          geo={threeBox}
          position={wall.pos}
          rotation={wall.rotation}
          size={wall.size}
        />
      ))}

      { walls2.current.map( (wall2, index) => (
        <Wall2 
          key={index}
          geo={threeBox}
          position={wall2.pos}
          rotation={wall2.rotation}
          size={wall2.size}
        />
      ))}

      { wallsBig.current.map( (wall, index) => (
        <WallBig 
          key={index}
          geo={threeBox}
          position={wall.pos}
          rotation={wall.rotation}
          size={wall.size}
        />
      ))}

    </>
  )
}

export default Map