// src/components/ProductDisplay.js
import { Canvas } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const ProductDisplay = ({ avatarUrl, clothingUrl }) => {
  const avatarRef = useRef()
  const clothingRef = useRef()

  useEffect(() => {
    const loader = new GLTFLoader()

    loader.load(avatarUrl, (gltf) => {
      avatarRef.current = gltf.scene
    })

    loader.load(clothingUrl, (gltf) => {
      clothingRef.current = gltf.scene
    })
  }, [avatarUrl, clothingUrl])

  return (
    <Canvas>
      <ambientLight />
      <spotLight position={[10, 10, 10]} />
      <primitive object={avatarRef.current} />
      <primitive object={clothingRef.current} />
    </Canvas>
  )
}

export default ProductDisplay
