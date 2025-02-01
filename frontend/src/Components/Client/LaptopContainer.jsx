import { useGLTF, useScroll, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import React from 'react'
import { useFrame } from '@react-three/fiber'

const LaptopContainer = () => {
let model = useGLTF("./model.glb")
let texture = useTexture('./red.jpg')
// [ THE BELOW CODE IS FOR VIDEO TEXTURE IN THE MAC BOOK SO.... TURN IT ON AFTER THE WHOLE PAGE IS READY
// const video = document.createElement('video');
// video.src = './Video.mp4'; // Path to your video file
// video.loop = true; 
// video.muted = true; // Needed for autoplay
// video.playsInline = true;
// video.autoplay = true;
// video.play(); // Start video playback

// const texture = new THREE.VideoTexture(video);
// texture.minFilter = THREE.LinearFilter;
// texture.magFilter = THREE.LinearFilter;
// texture.generateMipmaps = false;
// texture.format = THREE.RGBAFormat;
// ]

let meshes = {};
model.scene.traverse(e => {
        meshes[e.name] = e;
})

meshes.screen.rotation.x = THREE.MathUtils.degToRad(180)
meshes.matte.material.map = texture;
meshes.matte.material.emissiveIntensity = 0
meshes.matte.material.metalness = 0
meshes.matte.material.roughness = 1
let data = useScroll()
useFrame((state, delta)=>{
    meshes.screen.rotation.x = THREE.MathUtils.degToRad(180 - data.offset * 90)
})
  return (
    <group position={[0,-10,20]}>
        <primitive object={model.scene} />
    </group>
  )
}

export default LaptopContainer