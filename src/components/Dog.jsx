import React, { use, useEffect,useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { OrbitControls,useGLTF, useTexture ,useAnimations} from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
const Dog = () => {

  //rejistering scrolltrigger and useGSAP plugin
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(useGSAP);

  //loading gltf model
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
const dogModel=useRef(model);
useGSAP(()=>{
  const tl=gsap.timeline({
    scrollTrigger:{
      trigger:'#section-1',
      endTrigger:'#section-3',
      start:'top top',
      end:'bottom bottom',
      markers:true,
      scrub:true,
    }
  })

  tl
  .to(dogModel.current.scene.position,{
    z: "-=0.75",
    y: "+=0.1",
    })
  .to(dogModel.current.scene.rotation,{
    x: `+=${Math.PI/15}`,
  })
  .to(dogModel.current.scene.rotation,{
    y: `-=${Math.PI}`,
  },"third")
  .to(dogModel.current.scene.position,{
    x: "-=0.5",
    z: "+=0.6",
    y: "-=0.05",
  },"third")
  
},[])

  return (
  <>
   <primitive object={model.scene} position={[0.25, -0.55, 0]} rotation={[0, Math.PI/3.9, 0]} />
   <directionalLight position={[0, 5, 5]} color={0xFFFFFF} intensity={10} />
  </>
   
  )
}

export default Dog
