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

const Map = ({ map, options }) => {
  const pointLights = []
  const spotLights = []
  const playerPos = [0,0,0]
  const enemies = []
  const boxes = useRef([])
  const fileCabinets = useRef([])
  const walls = useRef([])
  const walls2 = useRef([])

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
        enemies.push({
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

    objs.forEach( o => {
      const pos = o.position
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
  
  useFrame((state,delta) => {
    if (enemiesRef.current == null || enemiesRef.current.length == 0) {
      enemiesRef.current = findSceneObjects("enemy")
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
          key={enemy.id}
          index={index}
          position={enemy.pos}
          grid={grid}
          gridSize={map.gridSize}
        />
      ))}
            
      <Ground geo={threePlane} position={[12, 0, 12]} scale={60} />
      {/* <GridHelper geo={threePlane} grid={grid} gridSize={map.gridSize}/> */}

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

    </>
  )
}

export default Map