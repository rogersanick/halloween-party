import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, useGLTF, View } from '@react-three/drei'
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier'

import ScrollIndicator from './components/ScrollIndicator'
const schedule = [
  {
    time: '4:00 PM',
    title: 'Doors Open',
    detail: 'THIS IS HALLOWEEEN, THIS IS HALLOWEEN.',
  },
  {
    time: '8:00 PM',
    title: 'Costume Contest Winner Announcement',
    detail: 'We will announce the winner of the costume contest.',
  },
  { time: '10:00 PM', title: 'Bedtime', detail: 'Time to say goodbye and head home.' },
]

function Pumpkin({ scale }: { scale: number }) {
  const { scene } = useGLTF('/jackolantern.glb')

  // Traverse scene objects and set materials
  scene.traverse((child) => {
    if (child.type === 'Mesh' && (child as any).material) {
      const mesh = child as any
      if (child.name.toLowerCase().includes('pumpkin')) {
        mesh.material.color.set('#ff6600') // Orange color for pumpkin
      } else if (child.name.toLowerCase().includes('vine')) {
        mesh.material.color.set('#228b22') // Green color for vine
      }
    }
  })

  return (
    <primitive object={scene.clone()} scale={scale} castShadow receiveShadow />
  )
}

function LandingViewScene() {
  // Create array of pumpkins with random positions and sizes
  const pumpkins = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    position: [
      (Math.random() - 0.5) * 10, // Random x between -5 and 5
      Math.random() * 8 + 8, // Random y between 8 and 16 (higher drop)
      (Math.random() - 0.5) * 10, // Random z between -5 and 5
    ] as [number, number, number],
    scale: Math.random() * 1 + 0.2, // Random scale between 0.2 and 0.8
    spawnTime: Math.random() * 5000, // Stagger spawn times
  }))

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[4, 6, 5]} intensity={1.15} castShadow />
      <Physics gravity={[0, -3, 0]}>
        {pumpkins.map((pumpkin) => (
          <RigidBody
            key={pumpkin.id}
            colliders="ball"
            restitution={0.7}
            friction={0.3}
            position={pumpkin.position}
            userData={{ spawnTime: Date.now() + pumpkin.spawnTime }}
          >
            <Pumpkin scale={pumpkin.scale} />
          </RigidBody>
        ))}

        {/* Invisible walls to contain pumpkins */}
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[0.1, 10, 8]} position={[-6, 5, 0]} />
          <CuboidCollider args={[0.1, 10, 8]} position={[6, 5, 0]} />
          <CuboidCollider args={[8, 10, 0.1]} position={[0, 5, -6]} />
          <CuboidCollider args={[8, 10, 0.1]} position={[0, 5, 6]} />
        </RigidBody>

        {/* Ground with cleanup trigger */}
        <RigidBody type="fixed" colliders={false} position={[0, -2, 0]}>
          <CuboidCollider args={[8, 0.25, 8]} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[9, 64]} />
            <meshStandardMaterial color="#0f172a" roughness={1} transparent opacity={0} />
          </mesh>
        </RigidBody>

        {/* Cleanup zone below ground */}
        <RigidBody type="fixed" colliders={false} position={[0, -8, 0]}>
          <CuboidCollider args={[10, 1, 10]} sensor />
        </RigidBody>
      </Physics>
    </>
  )
}

function RsvpViewScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={0.9} />
      <Float
        speed={1.2}
        floatIntensity={0.6}
        rotationIntensity={0.3}
        position={[0, 0.5, -8]}
        rotation={[-Math.PI / 24, Math.PI / 8, 0]}
      >
        <Pumpkin scale={4.5} />
      </Float>
    </>
  )
}

function App() {
  const scrollContainerRef = useRef<HTMLDivElement>(null!)

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.4, 6], fov: 45 }}
        eventSource={scrollContainerRef}
        eventPrefix="client"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <View.Port />
      </Canvas>
      <div
        id="scroll-container"
        ref={scrollContainerRef}
        className="relative h-dvh snap-y snap-mandatory overflow-y-auto text-moonlight"
      >
        <ScrollIndicator />
        <section id="home" className="relative h-dvh snap-start overflow-hidden">
          <View
            index={1}
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <LandingViewScene />
            </Suspense>
          </View>
          <div className="flex h-full w-full px-8">
            <div className="pointer-events-none absolute inset-0 -z-20 opacity-60">
              <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-pumpkin blur-[120px]" />
              <div className="absolute right-12 top-1/4 h-64 w-64 rounded-full bg-poison/70 blur-[100px]" />
              <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-ember/60 blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-full max-w-4xl flex-col items-center justify-center gap-8 px-6 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em]">
                Oct 31 • 4pm — 10pm
              </span>
              <h1 className="font-spooky text-5xl max-w-lg tracking-wider text-amber-200 drop-shadow-[0_0_25px_rgba(249,115,22,0.45)] md:text-7xl">
                Besties, Babies, Boos, and Booze
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-white/80">
                Come one, come all to the spookiest party on Edgewood Lane 👻
              </p>
            </div>

            <div className="absolute bottom-4 ml-4 transform">
              <p className="text-xs text-white/50">
                <i>Sponsored by the FOA (Friends of Aaron Association)</i>
              </p>
              <p className="text-xs text-white/50">
                <i>
                  If you are not already part of this association, don't worry - you will be soon.
                  Just meet Aaron.
                </i>
              </p>
            </div>
          </div>
        </section>

        <section
          id="location"
          className="relative mx-auto flex h-dvh max-w-4xl snap-start flex-col justify-center px-6 py-12"
        >
          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
            <h2 className="font-spooky text-4xl text-amber-200">Location</h2>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2847.5233128266973!2d-73.20575698746742!3d44.46344497095466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cca7bb28d56ef3b%3A0x586fbfd8408f7e33!2s32%20Edgewood%20Ln%2C%20Burlington%2C%20VT%2005401!5e0!3m2!1sen!2sus!4v1760406547733!5m2!1sen!2sus"
              className='w-full h-full min-h-[450px]'
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
        <section id="rsvp" className="relative h-dvh snap-start overflow-hidden">
          <View
            index={2}
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <RsvpViewScene />
            </Suspense>
          </View>
          <div className="relative mx-auto flex h-full max-w-4xl flex-col justify-center px-6 py-12">
            <div className="relative overflow-hidden rounded-3xl border border-pumpkin/40 bg-gradient-to-br from-pumpkin via-ember to-pumpkin/70 p-10 text-midnight shadow-[0_15px_45px_rgba(249,115,22,0.45)]">
              <div className="absolute -right-12 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full border border-white/40 opacity-40" />
              <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full border border-white/40 opacity-30" />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl space-y-3">
                  <h2 className="font-spooky text-4xl text-midnight">RSVP for you & your boo</h2>
                  <p>
                    Give us a heads-up so we can get a head count for games, drinks, delicious overly sweet treasts and more. Also, feel free to show up last minute, the more the merrier.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="schedule" className="h-dvh snap-start">
          <div className="relative mx-auto flex h-full max-w-4xl flex-col justify-center px-6 py-12">
            <div className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur lg:grid-cols-[2fr_3fr]">
              <div className="space-y-6">
                <h2 className="font-spooky text-4xl text-amber-200">Evening Schedule</h2>
                <p className="text-sm text-white/70">
                  Structured enough for nap times, loose enough for late-night laughs. Follow along
                  or jump in wherever feels right.
                </p>
              </div>
              <ol className="space-y-4 border-l border-white/10 pl-6">
                {schedule.map((item) => (
                  <li key={item.title} className="relative pl-6">
                    <span className="absolute -left-[15px] top-1.5 h-3 w-3 rounded-full bg-pumpkin shadow-[0_0_10px_rgba(249,115,22,0.7)]" />
                    <div className="flex flex-col gap-1 rounded-2xl bg-black/30 p-4">
                      <span className="text-xs uppercase tracking-[0.3em] text-pumpkin">
                        {item.time}
                      </span>
                      <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-white/70">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <footer className="mt-auto border-t border-white/10 bg-black/40 py-10">
            <div className="mx-auto flex max-w-4xl flex-col gap-3 px-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
              <p>&copy; 2025 Babies, Boos, and Booze. See you on Edgewood Lane.</p>
              <div className="flex items-center gap-4">
                <a className="transition hover:text-pumpkin" href="#schedule">
                  Schedule
                </a>
                <span aria-hidden="true">•</span>
                <a className="transition hover:text-pumpkin" href="#rsvp">
                  RSVP
                </a>
                <span aria-hidden="true">•</span>
                <a
                  className="transition hover:text-pumpkin"
                  href="https://maps.app.goo.gl/?q=32+Edgewood+Ln+Burlington+VT+05041"
                >
                  Directions
                </a>
              </div>
            </div>
          </footer>
        </section>
      </div>
    </>
  )
}

useGLTF.preload('/jackolantern.glb')

export default App
