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
    size: [8,8],
    gridSize: 1
  }

  const boxes = [
    {
      color: "yellow",
      pos: [2, 0, 1],
      size: [1,1,4],
    },
    {
      color: "pink",
      pos: [5, 0, 7],
      size: [2,1,1],
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

  const staticGrid = new Pathfinding.Grid(map.size[0]*map.gridSize, map.size[1]*map.gridSize)

  const finder = new Pathfinding.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true,
  })

  const updateGrid = (x1,x2,y1,y2, grid) => {
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
        Math.round(pos.x),
        Math.round(pos.x + map.gridSize),
        Math.round(pos.z),
        Math.round(pos.z + map.gridSize),
      ])
    })
    return dynamic
  }

  const grid = useRef(staticGrid)
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
      grid.current = staticGrid.clone()
      const dynObjs = getDynamicObjects(enemiesRef.current)
      dynObjs.forEach( obj => {
        updateGrid(obj[0],obj[1],obj[2],obj[3], grid.current)
      })
      //console.log(grid.current)
    }
    updateDynamicGrid()
  })

  return (
    <>
      <directionalLight intensity={.5} position={[0, 5, 0]} />
      <pointLight intensity={10} position={[5,5,5]} />
      <pointLight intensity={10} position={[20,5,20]} />

      <Player position={[4,0,2]} />

      { enemies.map( (enemy) => (
        <Enemy
          key={enemy.id}
          position={enemy.pos}
          grid={grid.current}
        />
      ))}
            
      {/* <Ground size={map.size} position={[0, 0, 0]} gridSize={map.gridSize} /> */}
      <GridHelper grid={grid.current} gridSize={map.gridSize} />

      { boxes.map( (box, index) => (
        <Box 
          key={index}
          position={[
            (box.pos[0]*map.gridSize),
            box.pos[1],
            (box.pos[2]*map.gridSize),
          ]}
          size={box.size}
          color={box.color}
        />
      ))}
    </>
  )
}

export default Map