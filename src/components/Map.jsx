import { useState, useRef } from 'react'

import Box from './Box'
import Ground from './Ground'
import Pathfinding from 'pathfinding'
import Player from './Player'
import GridHelper from './GridHelper'

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

  const grid = new Pathfinding.Grid(map.size[0]*map.gridSize, map.size[1]*map.gridSize)

  const finder = new Pathfinding.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true,
  })

  const findPath = (start, end) => {
    const gridClone = grid.clone()
    const path = finder.findPath(start[0], start[1], end[0], end[1], gridClone)
    return path
  }

  const updateGrid = (x1,x2,y1,y2) => {
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
    updateGrid(x1,x2,y1,y2)
  })
  
  console.log(findPath([0,0],[4,2]))

  return (
    <>
      <directionalLight intensity={.5} position={[0, 5, 0]} />
      <pointLight intensity={10} position={[5,5,5]} />
      <pointLight intensity={10} position={[20,5,20]} />

      <Player position={[4,0,2]} />
            
      {/* <Ground size={map.size} position={[0, 0, 0]} gridSize={map.gridSize} /> */}
      <GridHelper grid={grid} gridSize={map.gridSize} />

      { boxes.map( (box, index) => (
        <Box 
          key={index}
          position={[
            (box.pos[0]*map.gridSize),
            box.pos[1],
            (box.pos[2]*map.gridSize),
          ]}
          scale={box.size}
          color={box.color}
        />
      ))}
    </>
  )
}

export default Map