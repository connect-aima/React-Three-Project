import React, { use, useEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { OrbitControls,useGLTF, useTexture ,useAnimations} from '@react-three/drei';
import { color, normalMap } from 'three/tsl';
const Dog = () => {
   const model = useGLTF('/models/dog.drc.glb');
   useThree(({camera,gl,scene})=>{
    console.log(camera.position);
    camera.position.z=0.55 ;
    gl.toneMapping=THREE.ReinhardToneMapping;
    gl.outputColorSpace=THREE.SRGBColorSpace;
   })

   const {actions} = useAnimations(model.animations, model.scene);
  useEffect(()=>{
    actions['Take 001'].play();
  },[actions])
//destructing textures of dog material
  const [normalMap, sampleMatCap] = (useTexture(['/dog_normals.jpg','/matcap/mat-2.png']))
  .map(texture=>{
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
   })
  //destructing textures of branch material
  const [branchMap,branchNormalMap]=(useTexture(['/branches_diffuse.jpeg','/branches_normals.jpeg']))
  .map(texture=>{
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
   })
   // Dog Material
  const dogMaterial = new THREE.MeshMatcapMaterial(
    {
      normalMap:normalMap,
      matcap:sampleMatCap
    }
  );

  //brach materail
  const branchMaterial = new THREE.MeshMatcapMaterial(
    {
      map:branchMap,
      normalMap:branchNormalMap
    }
  );

  model.scene.traverse((child) => {
  if (!child.isMesh) return;

  if (child.name.toLowerCase().includes("dog")) {
    child.material = dogMaterial;
  }

  if (child.name.toLowerCase().includes("branch")) {
    child.material = branchMaterial;
  }
});


  return (
  <>
   <primitive object={model.scene} position={[0.25, -0.55, 0]} rotation={[0, Math.PI/3.9, 0]} />
   <directionalLight position={[0, 5, 5]} color={0xFFFFFF} intensity={10} />
  </>
   
  )
}

export default Dog
