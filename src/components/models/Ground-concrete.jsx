/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 public/ground-concrete.glb -s 
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/ground-concrete.glb')
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes['ground-concrete'].geometry} material={materials['ground-concrete']} />
    </group>
  )
}

useGLTF.preload('/ground-concrete.glb')