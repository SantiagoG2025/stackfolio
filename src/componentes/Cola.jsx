
import React, { useMemo } from 'react';
import * as THREE from 'three';

// ================================================
// COLA ADORABLE DE HOLOCAT
// ================================================

export default function Cola({
  colorNeon = '#00f3ff',
  colaRef,
}) {
  const datos = useMemo(() => {
    // Curva orgánica, similar a la cola de un gatito.
    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.08, 0.04, -0.015),
      new THREE.Vector3(-0.18, 0.14, -0.025),
      new THREE.Vector3(-0.22, 0.30, 0),
      new THREE.Vector3(-0.18, 0.46, 0.025),
      new THREE.Vector3(-0.08, 0.55, 0.045),
      new THREE.Vector3(0.035, 0.53, 0.055),
      new THREE.Vector3(0.09, 0.44, 0.06),
    ]);

    // Cola continua con grosor variable.
    const puntos = curva.getPoints(80);
    const vertices = [];
    const indices = [];
    const normales = [];
    const uvs = [];

    const lados = 16;
    const segmentos = 80;

    for (let i = 0; i <= segmentos; i++) {
      const t = i / segmentos;
      const punto = curva.getPoint(t);
      const tangente = curva.getTangent(t).normalize();

      const radio = THREE.MathUtils.lerp(0.075, 0.034, t);

      const eje = new THREE.Vector3(0, 0, 1);
      const binormal = new THREE.Vector3()
        .crossVectors(tangente, eje)
        .normalize();

      const normal = new THREE.Vector3()
        .crossVectors(binormal, tangente)
        .normalize();

      for (let j = 0; j <= lados; j++) {
        const angulo = (j / lados) * Math.PI * 2;

        const desplazamiento = normal.clone()
          .multiplyScalar(Math.cos(angulo) * radio)
          .add(
            binormal.clone().multiplyScalar(Math.sin(angulo) * radio)
          );

        const vertice = punto.clone().add(desplazamiento);

        vertices.push(vertice.x, vertice.y, vertice.z);
        normales.push(
          desplazamiento.x / radio,
          desplazamiento.y / radio,
          desplazamiento.z / radio
        );
        uvs.push(j / lados, t);
      }
    }

    for (let i = 0; i < segmentos; i++) {
      for (let j = 0; j < lados; j++) {
        const a = i * (lados + 1) + j;
        const b = a + lados + 1;

        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }

    const geometria = new THREE.BufferGeometry();
    geometria.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geometria.setAttribute(
      'normal',
      new THREE.Float32BufferAttribute(normales, 3)
    );
    geometria.setAttribute(
      'uv',
      new THREE.Float32BufferAttribute(uvs, 2)
    );
    geometria.setIndex(indices);

    // Anillos decorativos pequeños.
    const anillos = [0.25, 0.48, 0.72].map((t) => {
      const posicion = curva.getPoint(t);
      const tangente = curva.getTangent(t).normalize();

      const quaternion = new THREE.Quaternion()
        .setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          tangente
        );

      return {
        posicion,
        quaternion,
        radio: THREE.MathUtils.lerp(0.065, 0.045, t),
      };
    });

    return {
      geometria,
      anillos,
      punta: curva.getPoint(1),
    };
  }, []);

  const metal = {
    color: '#789bb9',
    metalness: 0.55,
    roughness: 0.3,
    clearcoat: 1,
  };

  return (
    <group
      ref={colaRef}
      position={[-0.28, 0.08, -0.20]}
      rotation={[0, 0, 0]}
    >

      {/* ==========================================
          BASE REDONDITA
      ========================================== */}

      <mesh scale={[1.15, 1.15, 1]}>
        <sphereGeometry args={[0.075, 32, 32]} />
        <meshPhysicalMaterial
          color="#294968"
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      {/* Aro luminoso de la base */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.065, 0.007, 10, 32]} />
        <meshBasicMaterial color={colorNeon} />
      </mesh>

      {/* ==========================================
          COLA CONTINUA Y SUAVE
      ========================================== */}

      <mesh geometry={datos.geometria}>
        <meshPhysicalMaterial
          {...metal}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Línea luminosa suave en la cola */}
      <mesh
        position={[-0.13, 0.20, 0.045]}
        rotation={[0, 0, -0.65]}
      >
        <capsuleGeometry args={[0.008, 0.16, 6, 12]} />
        <meshBasicMaterial
          color={colorNeon}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* ==========================================
          ANILLOS DECORATIVOS INTEGRADOS
      ========================================== */}

      {datos.anillos.map((anillo, i) => (
        <group
          key={i}
          position={anillo.posicion}
          quaternion={anillo.quaternion}
        >
          <mesh>
            <torusGeometry
              args={[anillo.radio, 0.005, 10, 32]}
            />
            <meshBasicMaterial color={colorNeon} />
          </mesh>
        </group>
      ))}

      {/* ==========================================
          PUNTA REDONDITA Y LUMINOSA
      ========================================== */}

      <group position={datos.punta}>
        {/* Punta acolchada */}
        <mesh scale={[0.052, 0.052, 0.052]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial
            color="#294968"
            metalness={0.45}
            roughness={0.25}
          />
        </mesh>

        {/* Núcleo luminoso */}
        <mesh position={[0.015, 0.01, 0.035]}>
          <sphereGeometry args={[0.022, 24, 24]} />
          <meshStandardMaterial
            color={colorNeon}
            emissive={colorNeon}
            emissiveIntensity={2.5}
          />
        </mesh>

        {/* Brillito */}
        <mesh position={[0.005, 0.03, 0.055]}>
          <sphereGeometry args={[0.008, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* ==========================================
          ILUMINACIÓN
      ========================================== */}

      <pointLight
        position={[-0.12, 0.25, 0.1]}
        color={colorNeon}
        intensity={0.45}
        distance={0.9}
      />

    </group>
  );
}
