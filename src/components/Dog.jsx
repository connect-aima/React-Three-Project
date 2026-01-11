import React from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { OrbitControls,useGLTF, useTexture } from '@react-three/drei';
import { color, normalMap } from 'three/tsl';
const Dog = () => {
   const model = useGLTF('/models/dog.drc.glb');
   useThree(({camera,gl,scene})=>{
    console.log(camera.position);
    camera.position.z=0.55 ;
    gl.toneMapping=THREE.ReinhardToneMapping;
    gl.outputColorSpace=THREE.SRGBColorSpace;
   })

  const [
     normalMap, 
     sampleMatCap 
    ] = (useTexture([
    '/dog_normals.jpg',
    '/matcap/mat-2.png'
   ])).map(texture=>{
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
   })
   
   model.scene.traverse((child)=>{
      if(child.name.includes("DOG")){
        child.material = new THREE.MeshMatcapMaterial(
          {
            normalMap:texture.normalMap,
            matcap:texture.sampleMatCap
          }
        )
      }
    });

  return (
  <>
   <primitive object={model.scene} position={[0.25, -0.55, 0]} rotation={[0, Math.PI/3.9, 0]} />
   <directionalLight position={[0, 5, 5]} color={0xFFFFFF} intensity={10} />
   {/* <OrbitControls/>     */}
  </>
   
  )
}

export default Dog
