import { useState, useRef } from 'react'

import Box from './Box'
import Ground from './Ground'
import Pathfinding from 'pathfinding'
import Player from './Player'
import Enemy from './Enemy'
import GridHelper from './GridHelper'
import { useFrame, useThree } from "@react-three/fiber"

const Map = () => {
  const map = {
    size: [48,48],
    gridSize: .5
  }

  const boxes = [
    {
      color: "yellow",
      pos: [1, 0, 1],
      size: [1,1,3],
    },
    {
      color: "yellow",
      pos: [3, 0, 3],
      size: [1,1,2],
    },
    {
      color: "pink",
      pos: [5, 0, 7],
      size: [2,1,1],
    },
    {
      color: "pink",
      pos: [7, 0, 0],
      size: [1,1,8],
    },
    {
      color: "grey",
      pos: [2, 0, 0],
      size: [4,1,1],
    },
  ]

  const enemies = [
    {
      id: "0",
      pos: [0,0,0]
    },
    {
      id: "1",
      pos: [1,0,2]
    },
  ]

  const staticGrid = new Pathfinding.Grid(map.size[0], map.size[1])

  const finder = new Pathfinding.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true,
  })

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

  boxes.forEach( (box) => {
    const x1 = box.pos[0]
    const x2 = box.pos[0] + box.size[0]
    const y1 = box.pos[2]
    const y2 = box.pos[2] + box.size[2]
    updateGrid(x1,x2,y1,y2, staticGrid)
  })

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

  const findPath = (start, end) => {
    const gridClone = grid.clone()
    const path = finder.findPath(start[0], start[1], end[0], end[1], gridClone)
    return path
  }
  //console.log(findPath([0,0],[4,2]))
  
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
      //console.log(gridClone)
    }
    updateDynamicGrid()
  })

  return (
    <>
      <directionalLight intensity={.5} position={[0, 5, 0]} />
      <pointLight intensity={10} position={[5,5,5]} />
      <pointLight intensity={10} position={[20,5,20]} />

      <Player 
        position={[4,0,2]} 
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
      <GridHelper grid={grid} gridSize={map.gridSize} transparency={0.5} />

      { boxes.map( (box, index) => (
        <Box 
          key={index}
          position={[
            box.pos[0],
            box.pos[1],
            box.pos[2],
          ]}
          size={box.size}
          color={box.color}
        />
      ))}

    </>
  )
}

export default Map