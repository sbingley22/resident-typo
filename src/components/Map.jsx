import { useState, useRef, useEffect } from 'react'
import { useFrame, useThree } from "@react-three/fiber"

import Box from './Box'
import Ground from './Ground'
import Pathfinding from 'pathfinding'
import Player from './Player'
import Enemy from './Enemy'
import GridHelper from './GridHelper'
import { FileCabinet } from './models/File-cabinet'

const Map = ({map}) => {
  const [loading, setLoading] = useState(true)
  const [playerPos, setPlayerPos] = useState([0,0,0])
  const [enemies, setEnemies] = useState([])
  const boxes = useRef([])
  const fileCabinets = useRef([])
  const [pointLights, setPointLights] = useState([])
  
  const staticGrid = useRef(new Pathfinding.Grid(map.size[0], map.size[1]))

  useEffect(() => {
    const tempEnemies = []
    const tempPointLights = []
    map.items.forEach( item => {
      if (item.name == "cube"){
        boxes.current.push({
          type: "solid",
          pos: [
            item.pos[1]*map.gridSize, 
            0, 
            item.pos[0]*map.gridSize,
          ],
          rotation: item.rotation,
          size: [1, 1, 1]
        })
      } else if (item.name == "enemy"){
        tempEnemies.push({
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
        setPlayerPos([
          item.pos[1]*map.gridSize,
          0,
          item.pos[0]*map.gridSize
        ])
      } else if (item.name == "pointLight"){
        tempPointLights.push({
          pos: [
            item.pos[1]*map.gridSize,
            5,
            item.pos[0]*map.gridSize
            ],
        })
      } else if (item.name == "wall"){
        boxes.current.push({
          type: "wall",
          pos: [
            item.pos[1]*map.gridSize, 
            0, 
            item.pos[0]*map.gridSize,
          ],
          rotation: item.rotation,
          size: [2, 1.75, 1]
        })
      } else if (item.name == "wall2"){
        boxes.current.push({
          type: "wall2",
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
    setEnemies(tempEnemies)
    setPointLights(tempPointLights)
    
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

    setLoading(false)

  },[])  

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

  const [grid, setGrid] = useState(staticGrid.current)
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
      setGrid(gridClone)
    }
    updateDynamicGrid()
  })

  if (loading) return (
    <>
    </>
  )
  console.log(pointLights)
  return (
    <>
      <ambientLight intensity={0.1} />
      { pointLights.map( (light, index) => (
        <pointLight key={index} intensity={50} position={light.pos} />
      ))}

      <Player 
        position={playerPos}
        grid={staticGrid.current}
        gridSize={map.gridSize}
      />

      { enemies.map( (enemy) => (
        <Enemy
          key={enemy.id}
          position={enemy.pos}
          grid={grid}
          gridSize={map.gridSize}
        />
      ))}
            
      <Ground position={[12, 0, 12]} scale={60} />
      {/* <GridHelper grid={grid} gridSize={map.gridSize}/> */}

      { boxes.current.map( (box, index) => (
        <Box 
          key={index}
          position={box.pos}
          rotation={box.rotation}
          size={box.size}
          color={box.color}
          type={box.type}
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

    </>
  )
}

export default Map