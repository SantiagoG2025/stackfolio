
import React from 'react';

// ================================================
// MATERIALES
// ================================================

const metalPrincipal = {
  color: '#789bb9',
  metalness: 0.58,
  roughness: 0.3,
  clearcoat: 1,
  clearcoatRoughness: 0.2,
};

const metalAzul = {
  color: '#294968',
  metalness: 0.65,
  roughness: 0.28,
};

const metalOscuro = {
  color: '#10243b',
  metalness: 0.7,
  roughness: 0.3,
};

function Neon({ colorNeon, intensidad = 1.8 }) {
  return (
    <meshStandardMaterial
      color={colorNeon}
      emissive={colorNeon}
      emissiveIntensity={intensidad}
      metalness={0.2}
      roughness={0.2}
    />
  );
}

// ================================================
// DEDOS REDONDITOS DE LAS PATAS
// ================================================

function Dedos({ colorNeon }) {
  return (
    <group>
      {[-1, 0, 1].map((lado) => (
        <group
          key={lado}
          position={[lado * 0.045, -0.005, 0.085]}
        >
          {/* Dedito */}
          <mesh
            scale={[0.36, 0.48, 0.65]}
          >
            <sphereGeometry args={[0.075, 24, 24]} />
            <meshPhysicalMaterial {...metalPrincipal} />
          </mesh>

          {/* Pequeño detalle luminoso */}
          <mesh position={[0, 0.027, 0.035]}>
            <sphereGeometry args={[0.008, 12, 12]} />
            <Neon colorNeon={colorNeon} intensidad={1.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ================================================
// ALMOHADILLAS DE LAS PATAS
// ================================================

function Almohadillas() {
  return (
    <group position={[0, -0.035, 0.045]}>
      {/* Almohadilla central */}
      <mesh scale={[0.48, 0.18, 0.42]}>
        <sphereGeometry args={[0.055, 24, 24]} />
        <meshStandardMaterial
          color="#e98bb9"
          metalness={0.15}
          roughness={0.45}
        />
      </mesh>

      {/* Tres pequeñas almohadillas */}
      {[-1, 0, 1].map((lado) => (
        <mesh
          key={lado}
          position={[lado * 0.045, 0.003, 0.07]}
          scale={[0.75, 0.25, 0.7]}
        >
          <sphereGeometry args={[0.025, 20, 20]} />
          <meshStandardMaterial
            color="#ffb1d3"
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

// ================================================
// PIE DEL GATITO
// ================================================

function Pie({ colorNeon, mostrarAlmohadillas = false }) {
  return (
    <group>
      {/* Pie redondeado */}
      <mesh
        position={[0, 0, 0.025]}
        scale={[0.115, 0.075, 0.14]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial {...metalPrincipal} />
      </mesh>

      {/* Parte superior del pie */}
      <mesh
        position={[0, 0.043, 0.015]}
        scale={[0.09, 0.035, 0.105]}
      >
        <sphereGeometry args={[1, 24, 24]} />
        <meshPhysicalMaterial {...metalAzul} />
      </mesh>

      {/* Dedos */}
      <Dedos colorNeon={colorNeon} />

      {/* Almohadillas inferiores */}
      {mostrarAlmohadillas && <Almohadillas />}

      {/* Brillito en la parte superior */}
      <mesh position={[-0.035, 0.065, 0.065]}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// ================================================
// PATA DELANTERA
// ================================================

function PataDelantera({
  colorNeon,
  referencia,
}) {
  return (
    <group ref={referencia}>

      {/* Hombro redondito */}
      <mesh position={[0, 0.015, 0]}>
        <sphereGeometry args={[0.105, 32, 32]} />
        <meshPhysicalMaterial {...metalAzul} />
      </mesh>

      {/* Articulación luminosa */}
      <mesh
        position={[0, 0.015, 0.075]}
        rotation={[0, 0, 0]}
      >
        <torusGeometry args={[0.063, 0.006, 10, 32]} />
        <Neon colorNeon={colorNeon} />
      </mesh>

      {/* Brazo corto y gordito */}
      <mesh
        position={[0, -0.115, 0.015]}
        scale={[0.105, 0.19, 0.11]}
      >
        <sphereGeometry args={[1, 40, 40]} />
        <meshPhysicalMaterial {...metalPrincipal} />
      </mesh>

      {/* Placa frontal suave */}
      <mesh
        position={[0, -0.12, 0.105]}
        scale={[0.072, 0.13, 0.018]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial {...metalAzul} />
      </mesh>

      {/* Línea LED vertical */}
      <mesh
        position={[0, -0.12, 0.126]}
        scale={[0.008, 0.065, 0.004]}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <Neon colorNeon={colorNeon} intensidad={1.6} />
      </mesh>

      {/* Muñeca */}
      <mesh position={[0, -0.245, 0.025]}>
        <sphereGeometry args={[0.065, 24, 24]} />
        <meshPhysicalMaterial {...metalOscuro} />
      </mesh>

      {/* Aro de la muñeca */}
      <mesh
        position={[0, -0.245, 0.075]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.045, 0.005, 8, 24]} />
        <Neon colorNeon={colorNeon} intensidad={1.5} />
      </mesh>

      {/* Pie delantero */}
      <group position={[0, -0.305, 0.055]}>
        <Pie colorNeon={colorNeon} />
      </group>
    </group>
  );
}

// ================================================
// PATITA TRASERA
// ================================================

function PataTrasera({ colorNeon, lado }) {
  return (
    <group position={[lado * 0.29, -0.13, -0.035]}>

      {/* Muslo grande y redondito */}
      <mesh
        position={[0, 0, 0]}
        scale={[0.18, 0.205, 0.205]}
      >
        <sphereGeometry args={[1, 40, 40]} />
        <meshPhysicalMaterial {...metalPrincipal} />
      </mesh>

      {/* Cubierta exterior del muslo */}
      <mesh
        position={[lado * 0.045, 0.005, 0.085]}
        scale={[0.11, 0.15, 0.13]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial {...metalAzul} />
      </mesh>

      {/* Pequeño aro lateral */}
      <mesh
        position={[lado * 0.155, 0, 0.015]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <torusGeometry args={[0.045, 0.006, 10, 32]} />
        <Neon colorNeon={colorNeon} intensidad={1.4} />
      </mesh>

      {/* Articulación inferior */}
      <mesh position={[0, -0.11, 0.10]}>
        <sphereGeometry args={[0.075, 28, 28]} />
        <meshStandardMaterial {...metalOscuro} />
      </mesh>

      {/* Pierna inferior */}
      <mesh
        position={[0, -0.15, 0.145]}
        rotation={[-0.35, 0, 0]}
        scale={[0.09, 0.15, 0.10]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial {...metalPrincipal} />
      </mesh>

      {/* Pie trasero adelantado */}
      <group position={[0, -0.235, 0.205]}>
        <Pie colorNeon={colorNeon} mostrarAlmohadillas />
      </group>

      {/* Luz decorativa del muslo */}
      <mesh position={[0, 0.055, 0.175]}>
        <sphereGeometry args={[0.016, 16, 16]} />
        <Neon colorNeon={colorNeon} intensidad={2} />
      </mesh>
    </group>
  );
}

// ================================================
// LAS CUATRO PATAS DE HOLOCAT
// ================================================

export default function Patas({
  colorNeon = '#00f3ff',
  pataIzqRef,
}) {
  return (
    <group position={[0, 0.28, 0]}>

      {/* TRASERAS: dos muslos y dos pies */}
      <PataTrasera
        colorNeon={colorNeon}
        lado={-1}
      />

      <PataTrasera
        colorNeon={colorNeon}
        lado={1}
      />

      {/* DELANTERAS: dos patas cortitas */}
      <group position={[-0.235, -0.025, 0.17]}>
        <PataDelantera
          colorNeon={colorNeon}
          referencia={pataIzqRef}
        />
      </group>

      <group position={[0.235, -0.025, 0.17]}>
        <PataDelantera
          colorNeon={colorNeon}
        />
      </group>

    </group>
  );
}
