
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// =============================================
// PALETA HOLOCAT
// =============================================

const AZUL = '#173D78';
const AZUL_MEDIO = '#245BA5';
const AZUL_CLARO = '#438BD5';
const CYAN = '#65E8FF';
const VIOLETA = '#9C79FF';
const OSCURO = '#102746';
const ROSA = '#F49ACB';
const BLANCO_AZUL = '#B9F3FF';

// =============================================
// GEOMETRÍAS
// =============================================

function crearCabeza() {
  const forma = new THREE.Shape();

  forma.moveTo(-0.52, -0.25);
  forma.quadraticCurveTo(-0.68, 0.02, -0.48, 0.30);

  forma.lineTo(-0.43, 0.70);
  forma.quadraticCurveTo(-0.40, 0.77, -0.32, 0.69);

  forma.lineTo(-0.10, 0.47);
  forma.quadraticCurveTo(0, 0.43, 0.10, 0.47);

  forma.lineTo(0.32, 0.69);
  forma.quadraticCurveTo(0.40, 0.77, 0.43, 0.70);

  forma.lineTo(0.48, 0.30);
  forma.quadraticCurveTo(0.68, 0.02, 0.52, -0.25);
  forma.quadraticCurveTo(0.38, -0.55, 0, -0.56);
  forma.quadraticCurveTo(-0.38, -0.55, -0.52, -0.25);

  const geometria = new THREE.ExtrudeGeometry(forma, {
    depth: 0.22,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.055,
    bevelThickness: 0.055,
    curveSegments: 24,
  });

  geometria.translate(0, 0, -0.11);
  return geometria;
}

function crearCola() {
  const curva = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.22, 0.02, 0),
    new THREE.Vector3(0.48, 0.18, 0),
    new THREE.Vector3(0.60, 0.48, 0),
    new THREE.Vector3(0.53, 0.77, 0),
    new THREE.Vector3(0.30, 0.91, 0),
    new THREE.Vector3(0.12, 0.82, 0),
  ]);

  return new THREE.TubeGeometry(curva, 48, 0.075, 12, false);
}

function crearBigote(lado, altura) {
  const curva = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(lado * 0.10, altura * 0.4, 0),
    new THREE.Vector3(lado * 0.22, altura, 0),
  ]);

  return new THREE.TubeGeometry(curva, 16, 0.006, 6, false);
}

// =============================================
// OJOS MÁS AMIGABLES
// =============================================

function Ojo({ x, ojoRef }) {
  return (
    <group ref={ojoRef} position={[x, 0.015, 0.19]}>

      {/* Forma exterior suave */}
      <mesh scale={[0.092, 0.076, 0.025]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial
          color="#18345B"
          roughness={0.3}
        />
      </mesh>

      {/* Iris celeste */}
      <mesh
        position={[0, 0, 0.023]}
        scale={[0.052, 0.059, 0.018]}
      >
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={0.65}
          roughness={0.22}
        />
      </mesh>

      {/* Pupila pequeña */}
      <mesh
        position={[0, 0, 0.039]}
        scale={[0.014, 0.038, 0.009]}
      >
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#07162D" />
      </mesh>

      {/* Reflejo principal */}
      <mesh position={[-0.021, 0.027, 0.048]}>
        <sphereGeometry args={[0.014, 16, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* Reflejo secundario */}
      <mesh position={[0.020, -0.023, 0.046]}>
        <sphereGeometry args={[0.006, 12, 12]} />
        <meshBasicMaterial color={BLANCO_AZUL} />
      </mesh>

    </group>
  );
}

// =============================================
// COMPONENTE PRINCIPAL DEL GATO
// =============================================

function Gato3D({ estadoGato }) {
  const cabezaRef = useRef();
  const cuerpoRef = useRef();
  const colaRef = useRef();
  const orejaIzqRef = useRef();
  const orejaDerRef = useRef();
  const ojoIzqRef = useRef();
  const ojoDerRef = useRef();
  const brazoIzqRef = useRef();
  const brazoDerRef = useRef();

  const cabezaGeometry = useMemo(() => crearCabeza(), []);
  const colaGeometry = useMemo(() => crearCola(), []);

  const bigotes = useMemo(() => ({
    izq1: crearBigote(-1, 0.07),
    izq2: crearBigote(-1, 0),
    der1: crearBigote(1, 0.07),
    der2: crearBigote(1, 0),
  }), []);

  const bocaIzq = useMemo(() => {
    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.035, -0.035, 0),
      new THREE.Vector3(-0.085, -0.025, 0),
    ]);

    return new THREE.TubeGeometry(curva, 12, 0.008, 8, false);
  }, []);

  const bocaDer = useMemo(() => {
    const curva = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.035, -0.035, 0),
      new THREE.Vector3(0.085, -0.025, 0),
    ]);

    return new THREE.TubeGeometry(curva, 12, 0.008, 8, false);
  }, []);

  // ===========================================
  // ANIMACIONES
  // ===========================================

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    const enojado = estadoGato === 'enojado';
    const celebrando = estadoGato === 'celebrando';

    // Respiración
    if (cuerpoRef.current) {
      cuerpoRef.current.position.y =
        0.48 + Math.sin(t * 2.1) * 0.018;

      cuerpoRef.current.scale.y =
        1 + Math.sin(t * 2.1) * 0.012;
    }

    // Cabeza
    if (cabezaRef.current) {
      cabezaRef.current.rotation.y = THREE.MathUtils.damp(
        cabezaRef.current.rotation.y,
        Math.sin(t * 0.75) * 0.09,
        4,
        delta
      );

      cabezaRef.current.rotation.z = THREE.MathUtils.damp(
        cabezaRef.current.rotation.z,
        enojado ? -0.10 : Math.sin(t * 1.1) * 0.025,
        5,
        delta
      );

      cabezaRef.current.rotation.x = celebrando
        ? Math.sin(t * 6) * 0.10
        : Math.sin(t * 0.8) * 0.018;
    }

    // Cola
    if (colaRef.current) {
      const movimiento = enojado
        ? Math.sin(t * 8) * 0.25
        : celebrando
          ? Math.sin(t * 7) * 0.35
          : Math.sin(t * 2) * 0.12;

      colaRef.current.rotation.z = THREE.MathUtils.damp(
        colaRef.current.rotation.z,
        movimiento,
        5,
        delta
      );
    }

    // Orejas
    if (orejaIzqRef.current) {
      orejaIzqRef.current.rotation.z =
        Math.sin(t * 2.4) * 0.035 + (enojado ? 0.15 : 0);
    }

    if (orejaDerRef.current) {
      orejaDerRef.current.rotation.z =
        -Math.sin(t * 2.4) * 0.035 - (enojado ? 0.15 : 0);
    }

    // Brazos
    if (brazoIzqRef.current) {
      brazoIzqRef.current.rotation.z = celebrando
        ? Math.sin(t * 7) * 0.35
        : 0;
    }

    if (brazoDerRef.current) {
      brazoDerRef.current.rotation.z = celebrando
        ? -Math.sin(t * 7) * 0.35
        : 0;
    }

    // Parpadeo: se escala el conjunto completo del ojo.
    const ciclo = t % 4.2;

    const parpadeo =
      ciclo > 3.92
        ? Math.max(
            0.12,
            Math.abs(Math.sin((ciclo - 3.92) * 70))
          )
        : 1;

    const alturaOjo = enojado ? 0.72 : parpadeo;

    [ojoIzqRef, ojoDerRef].forEach((ref) => {
      if (ref.current) {
        ref.current.scale.y = THREE.MathUtils.damp(
          ref.current.scale.y,
          alturaOjo,
          16,
          delta
        );
      }
    });
  });

  return (
    <group position={[0, -0.68, 0]}>

      {/* ===================================== */}
      {/* COLA */}
      {/* ===================================== */}

      <group ref={colaRef} position={[0.37, 0.43, -0.28]}>
        <mesh geometry={colaGeometry}>
          <meshStandardMaterial
            color={AZUL}
            metalness={0.3}
            roughness={0.35}
          />
        </mesh>

        <mesh position={[0.12, 0.82, 0]}>
          <sphereGeometry args={[0.075, 20, 20]} />
          <meshStandardMaterial
            color={CYAN}
            emissive={CYAN}
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>

      {/* ===================================== */}
      {/* CUERPO */}
      {/* ===================================== */}

      <group ref={cuerpoRef} position={[0, 0.48, 0]}>

        {/* Torso */}
        <mesh
          position={[0, 0.03, 0]}
          scale={[0.43, 0.62, 0.34]}
        >
          <capsuleGeometry args={[0.48, 0.35, 12, 24]} />
          <meshStandardMaterial
            color={AZUL}
            metalness={0.28}
            roughness={0.38}
          />
        </mesh>

        {/* Pecho */}
        <mesh
          position={[0, 0.05, 0.30]}
          scale={[0.24, 0.39, 0.065]}
        >
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial
            color={AZUL_CLARO}
            emissive={CYAN}
            emissiveIntensity={0.22}
            roughness={0.4}
          />
        </mesh>

        {/* Placa geométrica del pecho */}
        <mesh
          position={[0, 0.30, 0.355]}
          rotation={[0, 0, Math.PI]}
        >
          <coneGeometry args={[0.055, 0.11, 4]} />
          <meshStandardMaterial
            color={CYAN}
            emissive={CYAN}
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Piernas */}
        <mesh
          position={[-0.27, -0.40, 0.17]}
          rotation={[0.15, 0, -0.20]}
          scale={[0.23, 0.29, 0.27]}
        >
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial color={AZUL_MEDIO} />
        </mesh>

        <mesh
          position={[0.27, -0.40, 0.17]}
          rotation={[0.15, 0, 0.20]}
          scale={[0.23, 0.29, 0.27]}
        >
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial color={AZUL_MEDIO} />
        </mesh>

        {/* Detalles de patitas */}
        {[-0.27, 0.27].map((x) => (
          <group key={x} position={[x, -0.40, 0.415]}>
            {[-0.045, 0, 0.045].map((offset) => (
              <mesh
                key={offset}
                position={[offset, -0.10, 0]}
                scale={[0.009, 0.035, 0.008]}
              >
                <sphereGeometry args={[1, 12, 12]} />
                <meshBasicMaterial color={CYAN} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Brazo izquierdo */}
        <group ref={brazoIzqRef} position={[-0.34, 0.12, 0.18]}>
          <mesh
            rotation={[0, 0, -0.20]}
            position={[0, -0.19, 0]}
          >
            <capsuleGeometry args={[0.105, 0.30, 8, 16]} />
            <meshStandardMaterial color={AZUL_MEDIO} />
          </mesh>

          <mesh
            position={[0, -0.36, 0.035]}
            scale={[0.12, 0.10, 0.12]}
          >
            <sphereGeometry args={[1, 24, 20]} />
            <meshStandardMaterial color={AZUL_CLARO} />
          </mesh>
        </group>

        {/* Brazo derecho */}
        <group ref={brazoDerRef} position={[0.34, 0.12, 0.18]}>
          <mesh
            rotation={[0, 0, 0.20]}
            position={[0, -0.19, 0]}
          >
            <capsuleGeometry args={[0.105, 0.30, 8, 16]} />
            <meshStandardMaterial color={AZUL_MEDIO} />
          </mesh>

          <mesh
            position={[0, -0.36, 0.035]}
            scale={[0.12, 0.10, 0.12]}
          >
            <sphereGeometry args={[1, 24, 20]} />
            <meshStandardMaterial color={AZUL_CLARO} />
          </mesh>
        </group>

      </group>

      {/* ===================================== */}
      {/* CABEZA */}
      {/* ===================================== */}

      <group ref={cabezaRef} position={[0, 1.52, 0.12]}>

        <mesh geometry={cabezaGeometry}>
          <meshStandardMaterial
            color={AZUL}
            metalness={0.28}
            roughness={0.34}
          />
        </mesh>

        {/* Interior de orejas */}
        <group ref={orejaIzqRef} position={[-0.39, 0.48, 0.105]}>
          <mesh rotation={[0, 0, 0.10]}>
            <coneGeometry args={[0.095, 0.24, 3]} />
            <meshStandardMaterial
              color={VIOLETA}
              emissive={VIOLETA}
              emissiveIntensity={0.30}
            />
          </mesh>
        </group>

        <group ref={orejaDerRef} position={[0.39, 0.48, 0.105]}>
          <mesh rotation={[0, 0, -0.10]}>
            <coneGeometry args={[0.095, 0.24, 3]} />
            <meshStandardMaterial
              color={VIOLETA}
              emissive={VIOLETA}
              emissiveIntensity={0.30}
            />
          </mesh>
        </group>

        {/* Ojos */}
        <Ojo x={-0.22} ojoRef={ojoIzqRef} />
        <Ojo x={0.22} ojoRef={ojoDerRef} />

        {/* Mejillas suaves */}
        <mesh
          position={[-0.19, -0.20, 0.19]}
          scale={[0.13, 0.075, 0.035]}
        >
          <sphereGeometry args={[1, 24, 20]} />
          <meshStandardMaterial
            color={AZUL_CLARO}
            emissive={CYAN}
            emissiveIntensity={0.10}
          />
        </mesh>

        <mesh
          position={[0.19, -0.20, 0.19]}
          scale={[0.13, 0.075, 0.035]}
        >
          <sphereGeometry args={[1, 24, 20]} />
          <meshStandardMaterial
            color={AZUL_CLARO}
            emissive={CYAN}
            emissiveIntensity={0.10}
          />
        </mesh>

        {/* Hocico */}
        <mesh
          position={[-0.065, -0.25, 0.205]}
          scale={[0.095, 0.065, 0.045]}
        >
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color={AZUL_CLARO} />
        </mesh>

        <mesh
          position={[0.065, -0.25, 0.205]}
          scale={[0.095, 0.065, 0.045]}
        >
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color={AZUL_CLARO} />
        </mesh>

        {/* Nariz */}
        <mesh
          position={[0, -0.205, 0.255]}
          rotation={[0, 0, Math.PI]}
        >
          <coneGeometry args={[0.032, 0.040, 3]} />
          <meshStandardMaterial
            color={ROSA}
            emissive={ROSA}
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Sonrisa */}
        <group position={[0, -0.27, 0.255]}>
          <mesh geometry={bocaIzq}>
            <meshBasicMaterial color={OSCURO} />
          </mesh>

          <mesh geometry={bocaDer}>
            <meshBasicMaterial color={OSCURO} />
          </mesh>
        </group>

        {/* Bigotes discretos */}
        {[-1, 1].map((lado) => (
          <group
            key={lado}
            position={[lado * 0.37, -0.23, 0.19]}
          >
            <mesh
              geometry={bigotes.izq1}
              visible={lado === -1}
            >
              <meshBasicMaterial color={CYAN} transparent opacity={0.65} />
            </mesh>

            <mesh
              geometry={bigotes.der1}
              visible={lado === 1}
            >
              <meshBasicMaterial color={CYAN} transparent opacity={0.65} />
            </mesh>
          </group>
        ))}

        {/* Marca luminosa de frente */}
        <mesh
          position={[0, 0.31, 0.17]}
          scale={[0.025, 0.075, 0.012]}
        >
          <sphereGeometry args={[1, 20, 20]} />
          <meshBasicMaterial color={CYAN} />
        </mesh>

      </group>

      {/* ===================================== */}
      {/* LUCES */}
      {/* ===================================== */}

      <pointLight
        position={[0, 1.5, 2]}
        color={CYAN}
        intensity={0.8}
        distance={4}
      />

      <pointLight
        position={[-1.8, 1.5, -0.8]}
        color={VIOLETA}
        intensity={1}
        distance={4}
      />

    </group>
  );
}

// =============================================
// COMPONENTE PRINCIPAL
// =============================================

export default function GatoHolografico({
  estadoGato = 'tranquilo',
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '340px',
        position: 'relative',
        background: 'transparent',
      }}
    >
      <Canvas
        camera={{
          position: [0, 0.85, 6],
          fov: 38,
        }}
        gl={{
          alpha: true,
          antialias: true,
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.1} />

        <directionalLight
          position={[3, 4, 5]}
          intensity={1.8}
        />

        <directionalLight
          position={[-3, 2, -2]}
          color="#668aff"
          intensity={1}
        />

        <Gato3D estadoGato={estadoGato} />
      </Canvas>
    </div>
  );
}
