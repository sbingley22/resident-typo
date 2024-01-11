/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useSkinnedMeshClone } from './SkinnedMeshClone'

export function Zombie(props) {
  const group = useRef()

  // Custom hook useSkinnedMeshClone allows a skinnedMesh with primitives to be reused. Without out this only one mesh will be displayed
  const {scene, materials, animations, nodes} = useSkinnedMeshClone("/zombiegirl-1.glb")
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
          <skinnedMesh 
            name="Body" 
            geometry={nodes.Body.geometry} 
            material={materials.Skin} 
            skeleton={nodes.Body.skeleton} 
            castShadow
            receiveShadow
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/zombiegirl-1.glb')