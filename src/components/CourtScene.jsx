import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { getPlayerColor } from '../utils/playerColors';

function CourtLine({ position, size }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#f4f7ef" />
    </mesh>
  );
}

function PlayerMarker({ color, position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
      </mesh>

      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.28, 32]} />
        <meshStandardMaterial color="black" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function Ball() {
  const ballRef = useRef();

  useFrame(({ clock }) => {
    if (!ballRef.current) return;

    ballRef.current.position.y = 0.28 + Math.sin(clock.elapsedTime * 4) * 0.04;
    ballRef.current.rotation.x += 0.04;
    ballRef.current.rotation.z += 0.03;
  });

  return (
    <mesh ref={ballRef} position={[0, 0.28, 0]}>
      <sphereGeometry args={[0.11, 32, 32]} />
      <meshStandardMaterial
        color="#d8ff1f"
        emissive="#8aa000"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function BallTrail() {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.5, 0.08, 3.1),
      new THREE.Vector3(0.8, 0.5, 1.5),
      new THREE.Vector3(0.1, 0.4, 0),
      new THREE.Vector3(-0.8, 0.3, -1.6),
    ]);
  }, []);

  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 32, 0.025, 8, false);
  }, [curve]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#f4ff00"
        emissive="#f4ff00"
        emissiveIntensity={0.45}
      />
    </mesh>
  );
}

function RefereeChair() {
  return (
    <group position={[3.65, 0, 0]}>
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[0.38, 0.18, 0.38]} />
        <meshStandardMaterial color="#d9e2ef" />
      </mesh>

      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <meshStandardMaterial color="#9aa6ba" />
      </mesh>

      <mesh position={[0.18, 0.22, 0.16]}>
        <boxGeometry args={[0.06, 0.45, 0.06]} />
        <meshStandardMaterial color="#9aa6ba" />
      </mesh>

      <mesh position={[-0.18, 0.22, 0.16]}>
        <boxGeometry args={[0.06, 0.45, 0.06]} />
        <meshStandardMaterial color="#9aa6ba" />
      </mesh>

      <mesh position={[0.18, 0.22, -0.16]}>
        <boxGeometry args={[0.06, 0.45, 0.06]} />
        <meshStandardMaterial color="#9aa6ba" />
      </mesh>

      <mesh position={[-0.18, 0.22, -0.16]}>
        <boxGeometry args={[0.06, 0.45, 0.06]} />
        <meshStandardMaterial color="#9aa6ba" />
      </mesh>
    </group>
  );
}

function Bench({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[0.8, 0.14, 0.22]} />
        <meshStandardMaterial color="#c9d3df" />
      </mesh>

      <mesh position={[0, 0.05, 0.08]}>
        <boxGeometry args={[0.65, 0.1, 0.06]} />
        <meshStandardMaterial color="#7e8ca3" />
      </mesh>
    </group>
  );
}

function BallKid({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshStandardMaterial color="#f2c94c" />
      </mesh>

      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.18, 16]} />
        <meshStandardMaterial color="#1d4ed8" />
      </mesh>
    </group>
  );
}

function Court3D({ match }) {
  const xPositions = {
    left: -1.7,
    center: 0,
    right: 1.7,
  };

  const playerAColor = getPlayerColor(match.playerA.flag);
  const playerBColor = getPlayerColor(match.playerB.flag);

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[0, 8, 6]} intensity={1.8} castShadow />
      <spotLight
        position={[0, 7, 2]}
        angle={0.45}
        penumbra={0.45}
        intensity={1.5}
      />

      <group rotation={[0, 0, 0]}>
        {/* outer scene floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <planeGeometry args={[9, 13]} />
          <meshStandardMaterial color="#162416" roughness={0.85} />
        </mesh>

        {/* court surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[6.2, 10.6]} />
          <meshStandardMaterial color="#347a25" roughness={0.8} />
        </mesh>

        {/* subtle inner court */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <planeGeometry args={[5.3, 9.6]} />
          <meshStandardMaterial color="#2d6f21" roughness={0.82} />
        </mesh>

        {/* court lines */}
        <CourtLine position={[0, 0.04, -5]} size={[6.2, 0.025, 0.045]} />
        <CourtLine position={[0, 0.04, 5]} size={[6.2, 0.025, 0.045]} />
        <CourtLine position={[-3.1, 0.04, 0]} size={[0.045, 0.025, 10]} />
        <CourtLine position={[3.1, 0.04, 0]} size={[0.045, 0.025, 10]} />

        <CourtLine position={[-2.35, 0.05, 0]} size={[0.035, 0.025, 10]} />
        <CourtLine position={[2.35, 0.05, 0]} size={[0.035, 0.025, 10]} />

        <CourtLine position={[0, 0.05, -1.8]} size={[4.7, 0.025, 0.04]} />
        <CourtLine position={[0, 0.05, 1.8]} size={[4.7, 0.025, 0.04]} />
        <CourtLine position={[0, 0.05, 0]} size={[0.035, 0.025, 3.6]} />

        {/* net */}
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[6.4, 0.38, 0.045]} />
          <meshStandardMaterial color="#dfe6ef" transparent opacity={0.55} />
        </mesh>

        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[6.5, 0.06, 0.07]} />
          <meshStandardMaterial color="#101827" />
        </mesh>

        {/* environment objects */}
        <RefereeChair />
        <Bench position={[-3.85, 0, 1.6]} />
        <Bench position={[3.75, 0, -1.6]} />

        <BallKid position={[-3.55, 0, -4.4]} />
        <BallKid position={[3.55, 0, -4.4]} />
        <BallKid position={[-3.55, 0, 4.4]} />
        <BallKid position={[3.55, 0, 4.4]} />

        <PlayerMarker
          color={playerBColor}
          position={[xPositions[match.tokenPositions.top], 0, -3.35]}
        />

        <PlayerMarker
          color={playerAColor}
          position={[xPositions[match.tokenPositions.bottom], 0, 3.35]}
        />

        <BallTrail />
        <Ball />
      </group>
    </>
  );
}

export default function CourtScene({ match }) {
  return (
    <div
      className={`court-scene-3d ${match.broadcastEvent
        .toLowerCase()
        .replaceAll(' ', '-')}`}
    >
      <Canvas
        shadows
        orthographic
        camera={{
          position: [0, 7.4, 7.6],
          zoom: 42,
          near: 0.1,
          far: 100,
        }}
      >
        <Court3D match={match} />
      </Canvas>

      {match.broadcastEvent && (
        <div className="event-badge court-event-badge">
          {match.broadcastEvent}
        </div>
      )}
    </div>
  );
}
