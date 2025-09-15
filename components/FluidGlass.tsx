/* eslint-disable react/no-unknown-property */
// Temporarily disabled due to TypeScript compatibility issues with latest @react-three/drei
// TODO: Fix TypeScript compatibility or replace with simpler 3D component

// import * as THREE from 'three';
// import { useRef, useState, useEffect, memo } from 'react';
// import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
// import {
//   useFBO,
//   useGLTF,
//   useScroll,
//   Image,
//   Scroll,
//   Preload,
//   ScrollControls,
//   MeshTransmissionMaterial,
//   Text
// } from '@react-three/drei';
// import { easing } from 'maath';

interface FluidGlassProps {
  mode?: 'lens' | 'bar' | 'cube';
  lensProps?: any;
  barProps?: any;
  cubeProps?: any;
  children?: React.ReactNode;
  enableScroll?: boolean;
  backgroundColor?: number;
  pages?: number;
}

// Temporary placeholder component while 3D component is being fixed
export default function FluidGlass({ 
  children,
  backgroundColor = 0x5227ff,
}: FluidGlassProps) {
  return (
    <div 
      className="w-full h-full flex items-center justify-center"
      style={{ backgroundColor: `#${backgroundColor.toString(16).padStart(6, '0')}` }}
    >
      {children || (
        <div className="text-white text-center p-8">
          <h2 className="text-4xl font-bold mb-4">React Bits</h2>
          <p className="text-lg opacity-80">3D Component Loading...</p>
        </div>
      )}
    </div>
  );
}
