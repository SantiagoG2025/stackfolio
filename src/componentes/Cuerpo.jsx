
import React from 'react';

export default function Cuerpo({
  colorNeon = '#00f3ff',
  cuerpoRef,
}) {
  const metalPrincipal = {
    color: '#294968',
    metalness: 0.62,
    roughness: 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.2,
  };

  const metalOscuro = {
    color: '#10243b',
    metalness: 0.75,
    roughness: 0.25,
  };

  const metalClaro = {
    color: '#789bb9',
    metalness: 0.65,
    roughness: 0.3,
  };

  const neon = {
    color: colorNeon,
    emissive: colorNeon,
    emissiveIntensity: 2,
    metalness: 0.2,
    roughness: 0.2,
  };

  return (
    <group ref={cuerpoRef} position={[0, 0.28, 0]}>

      {/* ==========================================
          CUELLO CORTITO Y REDONDEADO
      ========================================== */}

      <mesh position={[0, 0.30, 0]}>
        <cylinderGeometry args={[0.15, 0.19, 0.20, 40]} />
        <meshPhysicalMaterial {...metalOscuro} />
      </mesh>

      {/* Articulación superior */}
      <mesh position={[0, 0.39, 0]}>
        <sphereGeometry args={[0.145, 32, 32]} />
        <meshPhysicalMaterial {...metalClaro} />
      </mesh>

      {/* Anillo luminoso del cuello */}
      <mesh
        position={[0, 0.31, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[0.155, 0.009, 12, 40]} />
        <meshBasicMaterial color={colorNeon} />
      </mesh>

      {/* ==========================================
          CUERPO PRINCIPAL: SILUETA GORDITA
      ========================================== */}

      <mesh
        position={[0, -0.035, 0]}
        scale={[0.44, 0.48, 0.36]}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial {...metalPrincipal} />
      </mesh>

      {/* Parte inferior de la pancita */}
      <mesh
        position={[0, -0.22, 0.10]}
        scale={[0.34, 0.25, 0.28]}
      >
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhysicalMaterial
          color="#385b7d"
          metalness={0.55}
          roughness={0.32}
          clearcoat={0.8}
        />
      </mesh>

      {/* Brillo suave de la pancita */}
      <mesh position={[0, -0.20, 0.345]} scale={[0.17, 0.10, 0.012]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#9beeff"
          transparent
          opacity={0.13}
        />
      </mesh>

      {/* ==========================================
          PECHO: PLACA REDONDEADA
      ========================================== */}

      <mesh
        position={[0, 0.10, 0.285]}
        scale={[0.29, 0.22, 0.085]}
      >
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhysicalMaterial {...metalOscuro} />
      </mesh>

      {/* Borde superior del pecho */}
      <mesh
        position={[0, 0.22, 0.315]}
        scale={[0.20, 0.055, 0.025]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial {...metalClaro} />
      </mesh>

      {/* ==========================================
          CORAZÓN HOLOGRÁFICO
      ========================================== */}

      {/* Base */}
      <mesh position={[0, 0.075, 0.365]}>
        <cylinderGeometry args={[0.095, 0.105, 0.025, 40]} />
        <meshStandardMaterial {...metalOscuro} />
      </mesh>

      {/* Anillo exterior */}
      <mesh
        position={[0, 0.075, 0.38]}
        rotation={[0, 0, 0]}
      >
        <torusGeometry args={[0.082, 0.009, 12, 48]} />
        <meshBasicMaterial color={colorNeon} />
      </mesh>

      {/* Núcleo redondo */}
      <mesh position={[0, 0.075, 0.38]}>
        <sphereGeometry args={[0.055, 32, 32]} />
        <meshStandardMaterial
          {...neon}
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Brillo central */}
      <mesh position={[-0.018, 0.095, 0.425]}>
        <sphereGeometry args={[0.014, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Luz del corazón */}
      <pointLight
        position={[0, 0.075, 0.52]}
        color={colorNeon}
        intensity={0.8}
        distance={0.8}
      />

      {/* ==========================================
          PANZA: PEQUEÑAS PLACAS SUAVES
      ========================================== */}

      {[-0.105, -0.19].map((y, i) => (
        <mesh
          key={i}
          position={[0, y, 0.335 - i * 0.015]}
          scale={[0.17 - i * 0.025, 0.035, 0.018]}
        >
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial
            color={i === 0 ? '#537b9e' : '#294968'}
            metalness={0.55}
            roughness={0.32}
          />
        </mesh>
      ))}

      {/* Pequeñas luces abdominales */}
      {[-1, 1].map((lado) => (
        <mesh
          key={lado}
          position={[lado * 0.12, -0.13, 0.35]}
          scale={[0.012, 0.025, 0.008]}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color={colorNeon} />
        </mesh>
      ))}

      {/* ==========================================
          HOMBROS REDONDITOS
      ========================================== */}

      {[-1, 1].map((lado) => (
        <group
          key={lado}
          position={[lado * 0.355, 0.16, 0]}
        >
          {/* Articulación */}
          <mesh>
            <sphereGeometry args={[0.115, 32, 32]} />
            <meshStandardMaterial {...metalOscuro} />
          </mesh>

          {/* Cubierta redondeada */}
          <mesh
            position={[0, 0.015, 0.035]}
            scale={[1.05, 0.9, 0.85]}
          >
            <sphereGeometry args={[0.105, 40, 40]} />
            <meshPhysicalMaterial {...metalPrincipal} />
          </mesh>

          {/* Detalle LED */}
          <mesh position={[0, 0.015, 0.125]}>
            <sphereGeometry args={[0.022, 20, 20]} />
            <meshStandardMaterial {...neon} />
          </mesh>

          {/* Aro decorativo */}
          <mesh position={[0, 0, 0.105]}>
            <torusGeometry args={[0.072, 0.005, 8, 32]} />
            <meshBasicMaterial color={colorNeon} />
          </mesh>
        </group>
      ))}

      {/* ==========================================
          LATERALES SUAVES DEL CUERPO
      ========================================== */}

      {[-1, 1].map((lado) => (
        <group
          key={lado}
          position={[lado * 0.37, -0.12, 0.02]}
        >
          <mesh scale={[0.09, 0.17, 0.13]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhysicalMaterial {...metalOscuro} />
          </mesh>

          {/* Línea luminosa lateral */}
          <mesh
            position={[lado * 0.025, 0, 0.105]}
            scale={[0.012, 0.055, 0.008]}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color={colorNeon} />
          </mesh>
        </group>
      ))}

      {/* ==========================================
          DETALLES DE LUZ DEL CUERPO
      ========================================== */}

      {/* Dos luces pequeñas en el pecho */}
      {[-0.19, 0.19].map((x) => (
        <mesh
          key={x}
          position={[x, 0.245, 0.265]}
        >
          <sphereGeometry args={[0.012, 16, 16]} />
          <meshBasicMaterial color={colorNeon} />
        </mesh>
      ))}

      {/* Brillo ambiental */}
      <pointLight
        position={[0, -0.05, 0.55]}
        color={colorNeon}
        intensity={0.35}
        distance={1.2}
      />

    </group>
  );
}
