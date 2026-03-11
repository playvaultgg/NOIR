"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

/**
 * Maison Noir Cinematic Camera Controls
 * Engineered for smooth, high-end 3D navigation.
 * Features:
 * - Zoom & Pan Constraints (Prevent clipping into the garment)
 * - Damping (Fluid movement)
 * - Rotation limits (Keep the focus on the product)
 */
export default function CameraControls() {
    return (
        <>
            {/* High-fidelity Cinematic Viewport (AW26 Calibration) */}
            <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={50} />

            <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={2.5}
                maxDistance={8}
                minPolarAngle={0} 
                maxPolarAngle={Math.PI / 2}
                autoRotate={false}
                dampingFactor={0.05}
                enableDamping={true}
                rotateSpeed={0.5}
                makeDefault
            />
        </>
    );
}
