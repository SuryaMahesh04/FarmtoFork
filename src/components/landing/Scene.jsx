import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, MeshDistortMaterial } from '@react-three/drei';

function AnimatedSphere() {
    const sphereRef = useRef();

    useFrame(({ clock }) => {
        sphereRef.current.rotation.y = clock.getElapsedTime() * 0.2;
        sphereRef.current.rotation.z = clock.getElapsedTime() * 0.1;
    });

    return (
        <Sphere visible args={[1, 100, 200]} scale={2.5} ref={sphereRef}>
            <MeshDistortMaterial
                color="#9dc88d"
                attach="material"
                distort={0.4} // Strength, 0 disables distortion (default=1)
                speed={1.5} // Speed (default=1)
                roughness={0.2}
                metalness={0.8}
                wireframe={false}
                transparent={true}
                opacity={0.8}
            />
        </Sphere>
    );
}

function FloatingCube({ position, color, speed }) {
    const mesh = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        mesh.current.position.y = position[1] + Math.sin(time * speed) * 0.5;
        mesh.current.rotation.x = time * 0.5;
        mesh.current.rotation.y = time * 0.5;
    });

    return (
        <mesh position={position} ref={mesh}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={color} transparent opacity={0.7} />
        </mesh>
    )
}

const Scene = () => {
    return (
        <div className="absolute inset-0 z-0 h-screen w-full">
            <Canvas>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <group position={[0, 0, -2]}>
                    <AnimatedSphere />
                    <FloatingCube position={[-3, 2, 0]} color="#e07a5f" speed={1} />
                    <FloatingCube position={[3, -2, 0]} color="#b4d7e8" speed={1.2} />
                    <FloatingCube position={[-2, -3, 1]} color="#f5deb3" speed={0.8} />
                    <FloatingCube position={[3, 3, -1]} color="#5c9449" speed={1.5} />
                </group>

                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};

export default Scene;
