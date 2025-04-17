import { useState, useEffect } from "react";
import ParticlesComponent, { initParticlesEngine } from "@tsparticles/react";
import type { ISourceOptions, Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const particleOptions: ISourceOptions = {
  fpsLimit: 60,
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
      },
    },
    color: {
      value: ["#ff5722", "#ff9800", "#ffc107", "#ffeb3b"],
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: { min: 0.1, max: 0.8 },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    size: {
      value: { min: 1, max: 8 },
      animation: {
        enable: true,
        speed: 5,
        sync: false,
      },
    },
    move: {
      enable: true,
      speed: 3,
      direction: "top",
      straight: true,
      outModes: "out",
      attract: {
        enable: false,
        rotate: {
          x: 600,
          y: 1200,
        },
      },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onHover: {
        enable: false,
      },
      onClick: {
        enable: false,
      },
      resize: { enable: true },
    },
  },
  detectRetina: true,
  background: {
    color: "transparent",
  },
};

export function Particles() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    console.log("Initializing particles engine...");
    initParticlesEngine(async (engine) => {
      console.log("Loading slim preset...");
      await loadSlim(engine);
      console.log("Slim preset loaded.");
    }).then(() => {
      console.log("Particles engine initialized.");
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container | undefined) => {
    console.log("Particles container loaded:", container);
  };

  if (!init) {
    console.log("Particles not initialized yet, returning null.");
    return null; // Don't render until initialized
  }

  console.log("Rendering Particles component.");
  return (
    <ParticlesComponent
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={particleOptions}
      className="absolute inset-0 z-0" // Position behind content
    />
  );
}
