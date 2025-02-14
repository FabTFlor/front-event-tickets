import React, { useEffect } from "react";
import "./Hero.css";

const Hero = () => {
  useEffect(() => {
    const container = document.querySelector(".particle-container");
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${5 + Math.random() * 5}s`;
      container.appendChild(particle);

      setTimeout(() => particle.remove(), 6000);
    };

    const interval = setInterval(createParticle, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Vive Experiencias Únicas</h1>
        <div className="particle-container"></div>
      </div>
    </section>
  );
};

export default Hero;
