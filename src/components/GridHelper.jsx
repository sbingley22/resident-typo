

const GridHelper = ({ grid, gridSize, transparency }) => {

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
          position={[n.x*gridSize,0.1,n.y*gridSize]}
        >
          <mesh
            receiveShadow
            rotation-x={-Math.PI / 2} 
            position={[gridSize/2, 0, gridSize/2]}
          >
            <planeGeometry args={[gridSize,gridSize]} />
            <meshStandardMaterial 
              color={n.walkable? "green" : "red"} 
              opacity={transparency}
              transparent
            />
          </mesh>
        </group>
      ))
    ))}    
  </>
  )
}

export default GridHelper