import Pathfinding from 'pathfinding'

const GridHelper = ({ grid, gridSize }) => {

  // grid.nodes.map( (node, y) => (
  //   node.map( ( n, x ) => (
  //     console.log(n)
  // ))))

  return ( 
  <>
    { grid.nodes.map( (node, y) => (
      node.map( ( n, x ) => (
        <group
          key={y+":"+x}
          position={[n.x,0,n.y]}
        >
          <mesh
            receiveShadow
            rotation-x={-Math.PI / 2} 
            position={[gridSize/2, 0, gridSize/2]}
          >
            <planeGeometry  />
            <meshStandardMaterial color={n.walkable? "green" : "red"} />
          </mesh>
        </group>
      ))
    ))}    
  </>
  )
}

export default GridHelper