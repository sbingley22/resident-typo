/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/file-cabinet.glb -s 
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/file-cabinet.glb')
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.file_cabinet.geometry} material={materials.file_cabinet} />
    </group>
  )
}

useGLTF.preload('/file-cabinet.glb')