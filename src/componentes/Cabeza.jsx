
import React, { useMemo } from 'react';
import * as THREE from 'three';

// =====================================================
// OREJAS: triangulares, redondeadas y con interior rosa
// =====================================================

function Oreja({ referencia, lado, colorNeon }) {
  const formaExterior = useMemo(() => {
    const shape = new THREE.Shape();

    shape.moveTo(-0.17, 0);
    shape.quadraticCurveTo(-0.20, 0.20, -0.07, 0.43);
    shape.quadraticCurveTo(0, 0.53, 0.07, 0.43);
    shape.quadraticCurveTo(0.20, 0.20, 0.17, 0);
    shape.quadraticCurveTo(0, -0.07, -0.17, 0);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.075,
      bevelEnabled: true,
      bevelSegments: 5,
      bevelSize: 0.025,
      bevelThickness: 0.025,
      curveSegments: 24,
    });
  }, []);

  const formaInterior = useMemo(() => {
    const shape = new THREE.Shape();

    shape.moveTo(-0.105, 0.07);
    shape.quadraticCurveTo(-0.12, 0.20, -0.035, 0.36);
    shape.quadraticCurveTo(0, 0.405, 0.035, 0.36);
    shape.quadraticCurveTo(0.12, 0.20, 0.105, 0.07);
    shape.quadraticCurveTo(0, 0.015, -0.105, 0.07);

    return new THREE.ShapeGeometry(shape, 24);
  }, []);

  return (
    <group
      ref={referencia}
      position={[lado * 0.37, 0.34, -0.015]}
      rotation={[
        lado === -1 ? 0.04 : -0.04,
        lado * 0.10,
        lado * -0.12,
      ]}
      scale={[0.92, 0.92, 1]}
    >
      {/* Carcasa exterior */}
      <mesh geometry={formaExterior}>
        <meshPhysicalMaterial
          color="#294968"
          metalness={0.65}
          roughness={0.3}
          clearcoat={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Interior de la oreja */}
      <mesh geometry={formaInterior} position={[0, 0, 0.052]}>
        <meshStandardMaterial
          color="#ff8fc8"
          emissive="#e84c9c"
          emissiveIntensity={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Pequeño brillo interior */}
      <mesh position={[0, 0.23, 0.06]}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Borde luminoso */}
      <mesh position={[0, 0.02, 0.075]}>
        <torusGeometry args={[0.105, 0.006, 8, 32]} />
        <meshBasicMaterial color={colorNeon} />
      </mesh>

      {/* Indicador en la punta */}
      <mesh position={[0, 0.43, 0.055]}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshBasicMaterial color={colorNeon} />
      </mesh>
    </group>
  );
}

// =====================================================
// OJOS: grandes, brillantes y expresivos
// =====================================================

function Ojo({ referencia, x, colorNeon, feliz, enojado }) {
  return (
    <group
      ref={referencia}
      position={[x, 0.035, 0.475]}
    >
      {/* Cuenca ocular */}
      <mesh scale={[1.12, 1.16, 0.65]}>
        <sphereGeometry args={[0.125, 40, 40]} />
        <meshStandardMaterial
          color="#061323"
          metalness={0.75}
          roughness={0.18}
        />
      </mesh>

      {/* Iris luminoso */}
      <mesh position={[0, 0, 0.035]} scale={[0.88, 1.02, 0.48]}>
        <sphereGeometry args={[0.105, 40, 40]} />
        <meshStandardMaterial
          color={colorNeon}
          emissive={colorNeon}
          emissiveIntensity={enojado ? 1.8 : 2.4}
          metalness={0.15}
          roughness={0.12}
        />
      </mesh>

      {/* Pupila vertical */}
      <mesh
        position={[0, feliz ? -0.005 : 0, 0.087]}
        scale={[0.40, feliz ? 0.65 : 0.82, 0.35]}
      >
        <sphereGeometry args={[0.075, 32, 32]} />
        <meshBasicMaterial color="#020817" />
      </mesh>

      {/* Brillo principal */}
      <mesh position={[-0.035, 0.045, 0.116]}>
        <sphereGeometry args={[0.025, 20, 20]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Brillo secundario */}
      <mesh position={[0.035, -0.035, 0.112]}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshBasicMaterial color="#d9faff" />
      </mesh>

      {/* Pequeño reflejo inferior */}
      <mesh position={[0, -0.065, 0.095]}>
        <sphereGeometry args={[0.008, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Borde luminoso */}
      <mesh position={[0, 0, 0.018]}>
        <torusGeometry args={[0.115, 0.005, 8, 40]} />
        <meshBasicMaterial color={colorNeon} />
      </mesh>
    </group>
  );
}

// =====================================================
// BIGOTES CURVOS
// =====================================================

function Bigote({ lado, altura, colorNeon }) {
  const geometria = useMemo(() => {
    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(lado * 0.08, 0.015, 0.015),
      new THREE.Vector3(lado * 0.17, altura, 0.01),
    ]);

    return new THREE.TubeGeometry(curva, 20, 0.0035, 6, false);
  }, [lado, altura]);

  return (
    <mesh geometry={geometria}>
      <meshBasicMaterial color={colorNeon} />
    </mesh>
  );
}

// =====================================================
// CABEZA PRINCIPAL
// =====================================================

export default function Cabeza({
  colorNeon = '#00f3ff',
  enojado = false,
  feliz = false,
  cabezaRef,
  orejaIzqRef,
  orejaDerRef,
  ojoIzqRef,
  ojoDerRef,
}) {
  return (
    <group ref={cabezaRef} position={[0, 0.92, 0.04]}>

      {/* CRÁNEO REDONDEADO */}
      <mesh scale={[0.59, 0.51, 0.47]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#29435f"
          metalness={0.68}
          roughness={0.27}
          clearcoat={1}
          clearcoatRoughness={0.18}
        />
      </mesh>

      {/* FRENTE SUAVE */}
      <mesh position={[0, 0.27, 0.285]} scale={[0.25, 0.075, 0.09]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#172c44"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>

      {/* PEQUEÑO DETALLE LED */}
      <mesh position={[0, 0.31, 0.365]}>
        <sphereGeometry args={[0.022, 20, 20]} />
        <meshStandardMaterial
          color={colorNeon}
          emissive={colorNeon}
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* OREJAS */}
      <Oreja
        referencia={orejaIzqRef}
        lado={-1}
        colorNeon={colorNeon}
      />
      <Oreja
        referencia={orejaDerRef}
        lado={1}
        colorNeon={colorNeon}
      />

      {/* PLACA FACIAL OSCURA */}
      <mesh
        position={[0, -0.015, 0.365]}
        scale={[0.445, 0.285, 0.105]}
      >
        <sphereGeometry args={[1, 48, 40]} />
        <meshPhysicalMaterial
          color="#071626"
          metalness={0.75}
          roughness={0.22}
          clearcoat={1}
        />
      </mesh>

      {/* OJOS GRANDES */}
      <Ojo
        referencia={ojoIzqRef}
        x={-0.185}
        colorNeon={colorNeon}
        feliz={feliz}
        enojado={enojado}
      />
      <Ojo
        referencia={ojoDerRef}
        x={0.185}
        colorNeon={colorNeon}
        feliz={feliz}
        enojado={enojado}
      />

      {/* MEJILLAS REDONDITAS */}
      {[-1, 1].map((lado) => (
        <group key={lado} position={[lado * 0.37, -0.16, 0.36]}>

          <mesh scale={[0.18, 0.12, 0.085]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhysicalMaterial
              color="#385878"
              metalness={0.55}
              roughness={0.3}
            />
          </mesh>

          {/* Brillo rosado de las mejillas */}
          <mesh position={[lado * -0.025, 0.005, 0.075]}>
            <sphereGeometry args={[0.045, 24, 24]} />
            <meshBasicMaterial
              color="#ff83bd"
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Tres pequeños puntos decorativos */}
          {[-0.025, 0, 0.025].map((offset, i) => (
            <mesh
              key={i}
              position={[lado * offset, -0.025, 0.083]}
            >
              <sphereGeometry args={[0.006, 12, 12]} />
              <meshBasicMaterial color="#ffd7ed" />
            </mesh>
          ))}
        </group>
      ))}

      {/* HOCICO */}
      <mesh position={[0, -0.145, 0.465]} scale={[0.105, 0.065, 0.07]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color="#91a9c2"
          metalness={0.35}
          roughness={0.3}
        />
      </mesh>

      {/* NARIZ ROSADA */}
      <mesh
        position={[0, -0.12, 0.535]}
        rotation={[0, 0, Math.PI]}
        scale={[1, 0.8, 1]}
      >
        <coneGeometry args={[0.035, 0.035, 3]} />
        <meshStandardMaterial
          color="#ff83bd"
          emissive="#ff4b9c"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* BOQUITA: DOS CURVAS */}
      <group position={[0, -0.19, 0.51]}>
        <mesh position={[-0.018, -0.008, 0]} rotation={[0, 0, -0.45]}>
          <torusGeometry args={[0.025, 0.004, 8, 20, Math.PI]} />
          <meshBasicMaterial color="#d6eaff" />
        </mesh>

        <mesh
          position={[0.018, -0.008, 0]}
          rotation={[0, 0, 0.45]}
        >
          <torusGeometry args={[0.025, 0.004, 8, 20, Math.PI]} />
          <meshBasicMaterial color="#d6eaff" />
        </mesh>
      </group>

      {/* BIGOTES */}
      {[-1, 1].map((lado) => (
        <group
          key={lado}
          position={[lado * 0.43, -0.13, 0.40]}
        >
          <Bigote lado={lado} altura={0.045} colorNeon={colorNeon} />
          <Bigote lado={lado} altura={-0.035} colorNeon={colorNeon} />
        </group>
      ))}

      {/* AURICULARES LATERALES */}
      {[-1, 1].map((lado) => (
        <group
          key={lado}
          position={[lado * 0.535, -0.015, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <mesh>
            <cylinderGeometry args={[0.12, 0.13, 0.12, 40]} />
            <meshStandardMaterial
              color="#10243a"
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>

          <mesh position={[0, 0.065, 0]}>
            <torusGeometry args={[0.095, 0.009, 10, 32]} />
            <meshBasicMaterial color={colorNeon} />
          </mesh>

          <mesh position={[0, 0.07, 0]}>
            <sphereGeometry args={[0.055, 24, 24]} />
            <meshStandardMaterial
              color="#17466b"
              emissive={colorNeon}
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* ILUMINACIÓN LOCAL */}
      <pointLight
        position={[0, 0, 0.85]}
        color={colorNeon}
        intensity={0.55}
        distance={2}
      />
    </group>
  );
}
