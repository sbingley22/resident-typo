import { useState, useRef } from 'react'

import Box from './Box'
import Ground from './Ground'
import Pathfinding from 'pathfinding'
import Player from './Player'
import Enemy from './Enemy'
import GridHelper from './GridHelper'
import { useFrame, useThree } from "@react-three/fiber"

const Map = ({map}) => {

  const boxes = []

  map.items.forEach( item => {
    if (item.name == "wall"){
      boxes.push({
        type: "wall",
        pos: [
          item.pos[1]*map.gridSize, 
          0, 
          item.pos[0]*map.gridSize,
        ],
        rotation: item.rotation,
        size: [2, 1.75, 1]
      })
    }
  })

  const enemies = [
    // {
    //   id: "0",
    //   pos: [20,0,10]
    // },
    // {
    //   id: "1",
    //   pos: [16,0,8]
    // },
  ]

  const staticGrid = new Pathfinding.Grid(map.size[0], map.size[1])

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
  const setWalkableFromMap = () => {
    for (let x = 0; x < staticGrid.nodes[0].length; x++) {
      for (let y = 0; y < staticGrid.nodes.length; y++) {
        if (map.grid[y][x].id != null) {
          staticGrid.setWalkableAt(x, y, false)
        }
      }
    }
  }
  setWalkableFromMap()

  // boxes.forEach( (box) => {
  //   const x1 = box.pos[0]
  //   const x2 = box.pos[0] + box.size[0]
  //   const y1 = box.pos[2]
  //   const y2 = box.pos[2] + box.size[2]
  //   updateGrid(x1,x2,y1,y2, staticGrid)
  // })

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

  const [grid, setGrid] = useState(staticGrid)
  const enemiesRef = useRef(null)
  
  useFrame((state,delta) => {
    if (enemiesRef.current == null) enemiesRef.current = findSceneObjects("enemy")

    // update grid dynamically
    const updateDynamicGrid = () => {
      // reset dyn grid back to static
      const gridClone = staticGrid.clone()
      const dynObjs = getDynamicObjects(enemiesRef.current)
      dynObjs.forEach( obj => {
        updateGrid(obj[0],obj[1],obj[2],obj[3], gridClone)
      })
      setGrid(gridClone)
    }
    updateDynamicGrid()
  })

  return (
    <>
      <directionalLight intensity={.5} position={[0, 5, 0]} />
      <pointLight intensity={10} position={[5,5,5]} />
      <pointLight intensity={10} position={[20,5,20]} />

      <Player 
        position={[1,0,1]} 
        grid={staticGrid}
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
            
      <Ground position={[9, 0, 9]} scale={7} />
      <GridHelper grid={grid} gridSize={map.gridSize}/>

      { boxes.map( (box, index) => (
        <Box 
          key={index}
          position={box.pos}
          size={box.size}
          color={box.color}
          type={box.type}
        />
      ))}

    </>
  )
}

export default Map