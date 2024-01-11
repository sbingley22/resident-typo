
const Box = ({position, size, color, rotation, geo}) => {  
  const meshPosition = [
    size[0]/2,
    size[1]/2,
    size[2]/2,
  ]
  if (rotation == 1 || rotation == 3) {
    meshPosition[0] = size[2]/2
    meshPosition[2] = size[0]/2
  }
  const meshRotation = [0,rotation*Math.PI/2,0]
  
  return (
    <group
      position={position}
    >
      <mesh 
        geometry={geo}
        receiveShadow 
        castShadow
        position={meshPosition}
        rotation={meshRotation}
      >
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

Box.defaultProps = {
  position: [0,0,0],
  size: [1,1,1],
  color: "white",
}

export default Box