/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useSkinnedMeshClone } from './SkinnedMeshClone'

export function Jill(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/JillValentine-v1.0.glb')
  const { actions } = useAnimations(animations, group)

  // Change animation
  useEffect(() => {
      // Change Animation
      actions[props.animName].reset().fadeIn(0.5).play()

      // In clean-up fade it out
      return () => actions[props.animName].fadeOut(0.5)
  }, [props.animName, actions])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="rig">
          <primitive object={nodes.root} />
          <primitive object={nodes['MCH-torsoparent']} />
          <primitive object={nodes['MCH-hand_ikparentL']} />
          <primitive object={nodes['MCH-upper_arm_ik_targetparentL']} />
          <primitive object={nodes['MCH-hand_ikparentR']} />
          <primitive object={nodes['MCH-upper_arm_ik_targetparentR']} />
          <primitive object={nodes['MCH-foot_ikparentL']} />
          <primitive object={nodes['MCH-thigh_ik_targetparentL']} />
          <primitive object={nodes['MCH-foot_ikparentR']} />
          <primitive object={nodes['MCH-thigh_ik_targetparentR']} />
          <skinnedMesh name="Body" geometry={nodes.Body.geometry} material={materials.skin} skeleton={nodes.Body.skeleton} />
          <group name="Pistol">
            <skinnedMesh name="Cube" geometry={nodes.Cube.geometry} material={materials['Silver-Sandblasted']} skeleton={nodes.Cube.skeleton} />
            <skinnedMesh name="Cube_1" geometry={nodes.Cube_1.geometry} material={materials['Silver-Sandblasted.Darker']} skeleton={nodes.Cube_1.skeleton} />
            <skinnedMesh name="Cube_2" geometry={nodes.Cube_2.geometry} material={materials.Grip} skeleton={nodes.Cube_2.skeleton} />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/JillValentine-v1.0.glb')
