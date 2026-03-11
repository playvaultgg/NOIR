"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function Player() {
    const { camera } = useThree();
    const [keys, setKeys] = useState({ w: false, a: false, s: false, d: false });
    const speed = 0.1;

    useEffect(() => {
        const onKeyDown = (e) => {
            const key = e.key.toLowerCase();
            if (keys.hasOwnProperty(key)) setKeys((k) => ({ ...k, [key]: true }));
        };
        const onKeyUp = (e) => {
            const key = e.key.toLowerCase();
            if (keys.hasOwnProperty(key)) setKeys((k) => ({ ...k, [key]: false }));
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, []);

    useFrame(() => {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        const right = new THREE.Vector3().crossVectors(camera.up, direction).normalize();

        if (keys.w) camera.position.addScaledVector(direction, speed);
        if (keys.s) camera.position.addScaledVector(direction, -speed);
        if (keys.a) camera.position.addScaledVector(right, speed);
        if (keys.d) camera.position.addScaledVector(right, -speed);
        
        // Lock player height
        camera.position.y = 1.6;
    });

    return null;
}
