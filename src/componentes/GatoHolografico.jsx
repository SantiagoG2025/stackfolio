
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Float,
  Sparkles,
  Environment,
  ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';

import Cabeza from './Cabeza';
import Cuerpo from './Cuerpo';
import Patas from './Patas';
import Cola from './Cola';

import './GatoHolografico.css';

// ==========================================
// PALETA DE COLORES POR ESTADO
// ==========================================

const COLORES = {
  tranquilo: {
    neon: '#00eaff',
    ojoIzq: '#00eaff',
    ojoDer: '#00c8ff',
    luz: '#168bff'
  },

  enojado: {
    neon: '#ff4268',
    ojoIzq: '#ff1744',
    ojoDer: '#ff4268',
    luz: '#ff3158'
  },

  feliz: {
    neon: '#00ffad',
    ojoIzq: '#00ffad',
    ojoDer: '#00e676',
    luz: '#00d995'
  },

  celebrando: {
    neon: '#bd83ff',
    ojoIzq: '#d68cff',
    ojoDer: '#00eaff',
    luz: '#9b5cff'
  }
};


// ==========================================
// MODELO PRINCIPAL DE HOLOCAT
// ==========================================

function GatoRobot({ estadoGato, mousePos }) {

  const grupoRef = useRef();
  const cabezaRef = useRef();
  const cuerpoRef = useRef();
  const colaRef = useRef();

  const orejaIzqRef = useRef();
  const orejaDerRef = useRef();

  const ojoIzqRef = useRef();
  const ojoDerRef = useRef();

  const pataIzqRef = useRef();

  const estadoValido = COLORES[estadoGato]
    ? estadoGato
    : 'tranquilo';

  const colores = COLORES[estadoValido];

  const enojado = estadoValido === 'enojado';
  const feliz = estadoValido === 'feliz';
  const celebrando = estadoValido === 'celebrando';


  // ========================================
  // ANIMACIONES PROCEDURALES
  // ========================================

  useFrame((state, delta) => {

    const tiempo = state.clock.elapsedTime;
    const velocidad = Math.min(delta, 0.05);


    // --------------------------------------
    // 1. MOVIMIENTO GENERAL
    // --------------------------------------

    if (grupoRef.current) {

      let rebote = 0;

      if (celebrando) {
        rebote = Math.abs(Math.sin(tiempo * 5)) * 0.12;
      } else if (feliz) {
        rebote = Math.abs(Math.sin(tiempo * 2.5)) * 0.035;
      }

      const posicionObjetivo = -0.30 + rebote;

      grupoRef.current.position.y = THREE.MathUtils.damp(
        grupoRef.current.position.y,
        posicionObjetivo,
        5,
        velocidad
      );

      // Pequeña inclinación corporal natural
      const inclinacionCuerpo = enojado
        ? -0.025
        : Math.sin(tiempo * 1.5) * 0.012;

      grupoRef.current.rotation.z = THREE.MathUtils.damp(
        grupoRef.current.rotation.z,
        inclinacionCuerpo,
        3,
        velocidad
      );
    }


    // --------------------------------------
    // 2. RESPIRACIÓN DEL CUERPO
    // --------------------------------------

    if (cuerpoRef.current) {

      const frecuencia = enojado ? 4 : 1.8;

      const respiracion =
        1 + Math.sin(tiempo * frecuencia) * 0.012;

      cuerpoRef.current.scale.x = respiracion;
      cuerpoRef.current.scale.z = respiracion;
    }


    // --------------------------------------
    // 3. MOVIMIENTO DE LA CABEZA
    // --------------------------------------

    if (cabezaRef.current) {

      const mouseX = THREE.MathUtils.clamp(
        mousePos.current.x,
        -1,
        1
      );

      const mouseY = THREE.MathUtils.clamp(
        mousePos.current.y,
        -1,
        1
      );

      // Movimiento suave hacia el cursor
      const movimientoIdle = Math.sin(tiempo * 0.8) * 0.025;

      const giroHorizontal = mouseX * 0.42 + movimientoIdle;

      const inclinacionExtra = enojado
        ? -0.12
        : feliz || celebrando
        ? 0.06
        : 0;

      const giroVertical = -mouseY * 0.28 + inclinacionExtra;

      cabezaRef.current.rotation.y = THREE.MathUtils.damp(
        cabezaRef.current.rotation.y,
        giroHorizontal,
        4,
        velocidad
      );

      cabezaRef.current.rotation.x = THREE.MathUtils.damp(
        cabezaRef.current.rotation.x,
        giroVertical,
        4,
        velocidad
      );
    }


    // --------------------------------------
    // 4. MOVIMIENTO DE LA COLA
    // --------------------------------------

    if (colaRef.current) {

      let movimientoCola;

      if (enojado) {
        movimientoCola = Math.sin(tiempo * 7) * 0.35;
      } else if (celebrando) {
        movimientoCola = Math.sin(tiempo * 6) * 0.55;
      } else if (feliz) {
        movimientoCola = Math.sin(tiempo * 4) * 0.32;
      } else {
        movimientoCola = Math.sin(tiempo * 2.5) * 0.20;
      }

      colaRef.current.rotation.z = THREE.MathUtils.damp(
        colaRef.current.rotation.z,
        movimientoCola,
        4,
        velocidad
      );
    }


    // --------------------------------------
    // 5. MOVIMIENTO DE LAS OREJAS
    // --------------------------------------

    if (orejaIzqRef.current) {

      const movimiento = enojado
        ? -0.25
        : Math.sin(tiempo * 2) * 0.045;

      orejaIzqRef.current.rotation.z = THREE.MathUtils.damp(
        orejaIzqRef.current.rotation.z,
        movimiento,
        5,
        velocidad
      );
    }

    if (orejaDerRef.current) {

      const movimiento = enojado
        ? 0.25
        : Math.sin(tiempo * 2 + 0.5) * 0.045;

      orejaDerRef.current.rotation.z = THREE.MathUtils.damp(
        orejaDerRef.current.rotation.z,
        movimiento,
        5,
        velocidad
      );
    }


    // --------------------------------------
    // 6. EXPRESIÓN DE LOS OJOS
    // --------------------------------------

    const escalaOjos = enojado
      ? 0.72
      : feliz || celebrando
      ? 0.86
      : 1;

    if (ojoIzqRef.current) {
      ojoIzqRef.current.scale.y = THREE.MathUtils.damp(
        ojoIzqRef.current.scale.y,
        escalaOjos,
        8,
        velocidad
      );
    }

    if (ojoDerRef.current) {
      ojoDerRef.current.scale.y = THREE.MathUtils.damp(
        ojoDerRef.current.scale.y,
        escalaOjos,
        8,
        velocidad
      );
    }


    // --------------------------------------
    // 7. MOVIMIENTO DE LA PATA
    // --------------------------------------

    if (pataIzqRef.current) {

      const movimientoPata = celebrando
        ? Math.sin(tiempo * 7) * 0.22 - 0.15
        : 0;

      pataIzqRef.current.rotation.x = THREE.MathUtils.damp(
        pataIzqRef.current.rotation.x,
        movimientoPata,
        5,
        velocidad
      );
    }

  });


  // ========================================
  // COMPOSICIÓN DEL GATO
  // ========================================

  return (
    <group
      ref={grupoRef}
      position={[0, -0.30, 0]}
      scale={0.76}
    >

      <Cuerpo
        colorNeon={colores.neon}
        cuerpoRef={cuerpoRef}
      />

      <Patas
        colorNeon={colores.neon}
        pataIzqRef={pataIzqRef}
      />

      <Cola
        colorNeon={colores.neon}
        colaRef={colaRef}
      />

      <Cabeza
        cabezaRef={cabezaRef}
        orejaIzqRef={orejaIzqRef}
        orejaDerRef={orejaDerRef}
        ojoIzqRef={ojoIzqRef}
        ojoDerRef={ojoDerRef}
        colorNeon={colores.neon}
        colorOjoIzq={colores.ojoIzq}
        colorOjoDer={colores.ojoDer}
        enojado={enojado}
        feliz={feliz || celebrando}
      />

    </group>
  );
}


// ==========================================
// COMPONENTE EXTERIOR
// ==========================================

export default function GatoHolografico({
  estadoGato = 'tranquilo'
}) {

  const estadoValido = COLORES[estadoGato]
    ? estadoGato
    : 'tranquilo';

  const colores = COLORES[estadoValido];

  const claseEstado = `estado-${estadoValido}`;

  const mousePos = useRef({
    x: 0,
    y: 0
  });


  // ========================================
  // SEGUIMIENTO DEL CURSOR
  // ========================================

  const handleMouseMove = (e) => {

    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;

    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    mousePos.current = {
      x: THREE.MathUtils.clamp(x, -1, 1),
      y: THREE.MathUtils.clamp(y, -1, 1)
    };
  };


  const handleMouseLeave = () => {

    mousePos.current = {
      x: 0,
      y: 0
    };
  };


  // ========================================
  // ESCENA 3D
  // ========================================

  return (

    <div
      className={`holo-container ${claseEstado}`}
      onPointerMove={handleMouseMove}
      onPointerLeave={handleMouseLeave}
    >

      <Canvas
        camera={{
          position: [0, 0.12, 3.2],
          fov: 40,
          near: 0.1,
          far: 100
        }}

        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15
        }}

        dpr={[1, 1.75]}
      >

        {/* ILUMINACIÓN AMBIENTAL */}

        <ambientLight intensity={0.65} />

        {/* LUZ FRONTAL */}

        <directionalLight
          position={[3, 5, 5]}
          intensity={2.2}
          color="#eafaff"
        />

        {/* LUZ LATERAL AZUL */}

        <directionalLight
          position={[-4, 2, -3]}
          intensity={1.7}
          color={colores.neon}
        />

        {/* LUZ SUPERIOR */}

        <pointLight
          position={[0, 2.5, 1]}
          intensity={1.1}
          distance={4}
          color="#8bbcff"
        />

        {/* LUZ INFERIOR */}

        <pointLight
          position={[0, -1, 0.8]}
          intensity={1.1}
          distance={3}
          color={colores.luz}
        />

        <Environment preset="city" />


        {/* MODELO HOLOCAT */}

        <Float
          speed={1.3}
          rotationIntensity={0.018}
          floatIntensity={0.045}
        >

          <GatoRobot
            estadoGato={estadoValido}
            mousePos={mousePos}
          />

        </Float>


        {/* ==================================
            BASE HOLOGRÁFICA
        ================================== */}

        <group
          position={[0, -0.84, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >

          {/* ANILLO EXTERIOR */}

          <mesh>
            <ringGeometry args={[0.52, 0.535, 96]} />

            <meshBasicMaterial
              color={colores.neon}
              transparent
              opacity={0.48}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* ANILLO INTERIOR */}

          <mesh>
            <ringGeometry args={[0.36, 0.37, 96]} />

            <meshBasicMaterial
              color={colores.neon}
              transparent
              opacity={0.24}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* CENTRO DE PROYECCIÓN */}

          <mesh position={[0, 0, -0.002]}>
            <circleGeometry args={[0.29, 64]} />

            <meshBasicMaterial
              color={colores.neon}
              transparent
              opacity={0.035}
              side={THREE.DoubleSide}
            />
          </mesh>

        </group>


        {/* ==================================
            PARTÍCULAS HOLOGRÁFICAS
        ================================== */}

        <Sparkles
          count={45}
          scale={[2.3, 2.3, 1.5]}
          size={2}
          speed={0.35}
          opacity={0.65}
          color={colores.neon}
        />


        {/* ==================================
            SOMBRA DE CONTACTO
        ================================== */}

        <ContactShadows
          position={[0, -0.85, 0]}
          opacity={0.42}
          scale={2.8}
          blur={2.5}
          far={1.5}
          resolution={256}
          color="#00101d"
        />

      </Canvas>

    </div>
  );
}

