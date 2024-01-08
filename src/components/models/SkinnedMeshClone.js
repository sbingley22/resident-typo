import { useMemo } from 'react';
import { useGraph } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';

export function useSkinnedMeshClone(path) {
  const {scene, materials, animations} = useGLTF(path);
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const {nodes} = useGraph(clonedScene);

  return {scene: clonedScene, materials, animations, nodes};
}

// This custom hook allows three js skinnedMesh GLBs to be reused.
// Ie if you had a rigged enemy character you would only be able to
// display one on screen thanks to the primitive element.
// With this we can clone as many of the same model as we want.