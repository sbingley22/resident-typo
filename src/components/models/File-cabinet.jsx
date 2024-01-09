import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function FileCabinet({ position, rotation, size }) {
  const { nodes, materials } = useGLTF('/file-cabinet.glb')

  const meshRotation = [0,rotation*Math.PI/2,0]
  const meshPosition = [
    size[0]/2,
    size[1]/2,
    size[2]/2,
  ]
  if (rotation == 1 || rotation == 3) {
    meshPosition[0] = size[2]/2
    meshPosition[2] = size[0]/2
  }

  return (
    <group position={position} dispose={null}>
      <mesh 
        castShadow 
        receiveShadow 
        geometry={nodes.file_cabinet.geometry} 
        material={materials.file_cabinet} 
        position={meshPosition}
        rotation={meshRotation}
      />
    </group>
  )
}

useGLTF.preload('/file-cabinet.glb')
