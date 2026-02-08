'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);

    // Track mouse movement
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0d1410] to-[#0a0a0a] text-gray-200 flex flex-col items-center justify-center p-6 font-sans overflow-hidden">
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }} />
      </div>

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-[#00ff88] opacity-30 blur-[1px]"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      {/* Radial Gradient Following Mouse */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 255, 136, 0.08), transparent 40%)`
        }}
      />

      {/* Content Container with Glass Effect */}
      <div className="relative z-10 backdrop-blur-sm bg-black/20 rounded-3xl p-12 border border-[#00ff88]/10 shadow-2xl">
        
        {/* Logo with Pulse Animation */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative group">
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-[#00ff88] opacity-20 blur-xl animate-pulse" />
            
            {/* Rotating Border */}
            <div className="absolute inset-0 w-24 h-24 rounded-full animate-spin-slow">
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-[#00ff88] rounded-full -translate-x-1/2 shadow-[0_0_10px_#00ff88]" />
            </div>

            {/* Main Logo Circle */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#003300] via-[#004d00] to-[#003300] flex items-center justify-center shadow-[0_0_30px_rgba(0,255,136,0.3)] group-hover:shadow-[0_0_50px_rgba(0,255,136,0.5)] transition-all duration-500 group-hover:scale-110">
              <span className="text-[#00ff88] font-extrabold text-xl tracking-tight animate-pulse-subtle">
                SNAP UI
              </span>
            </div>
          </div>

          {/* Title with Gradient Animation */}
          <h1 className="mt-8 text-5xl font-bold bg-gradient-to-r from-[#00ff88] via-[#00ffaa] to-[#00ff88] bg-clip-text text-transparent tracking-wide animate-gradient bg-[length:200%_auto]">
            Welcome to SnapUI
          </h1>
          
          {/* Subtitle with Fade In */}
          <p className="text-base text-gray-400 mt-3 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            AI-powered UI & Code Generation
          </p>

          {/* Decorative Line */}
          <div className="mt-4 h-px w-32 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent animate-pulse" />
        </div>

        {/* Action Buttons with Hover Effects */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 items-center">
          <Link
            href="/signin"
            className="group relative px-8 py-3.5 rounded-xl border-2 border-[#00ff88]/50 bg-transparent text-[#00ff88] font-semibold overflow-hidden transition-all duration-300 hover:border-[#00ff88] hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] animate-fade-in-up opacity-0"
            style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
          >
            <span className="relative z-10">Sign In</span>
            <div className="absolute inset-0 bg-[#00ff88] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="absolute inset-0 flex items-center justify-center text-black font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Sign In
            </span>
          </Link>

          <Link
            href="/signup"
            className="group relative px-8 py-3.5 rounded-xl bg-[#00ff88] text-black font-semibold shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:shadow-[0_0_35px_rgba(0,255,136,0.6)] transition-all duration-300 hover:scale-105 animate-fade-in-up opacity-0"
            style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
          >
            <span className="relative z-10">Sign Up</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88] via-[#00ffaa] to-[#00ff88] bg-[length:200%_auto] animate-gradient rounded-xl" />
            <span className="relative z-10">Sign Up</span>
          </Link>
        </div>

        {/* Dashboard Button */}
        <div className="mt-6 flex justify-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          <Link
            href="/dashboard"
            className="group relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#f6ff00] via-[#ffff33] to-[#f6ff00] bg-[length:200%_auto] text-black font-semibold shadow-[0_0_20px_rgba(246,255,0,0.4)] hover:shadow-[0_0_35px_rgba(246,255,0,0.6)] transition-all duration-300 hover:scale-105 animate-gradient overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Go to Dashboard
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="mt-12 flex flex-wrap gap-3 justify-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
          {['Fast Generation', 'AI-Powered', 'Modern Design', 'Easy to Use'].map((feature, index) => (
            <div
              key={feature}
              className="px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-sm font-medium hover:bg-[#00ff88]/20 hover:border-[#00ff88]/50 transition-all duration-300 cursor-default hover:scale-105"
              style={{ animationDelay: `${0.8 + index * 0.1}s` }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-12 text-xs text-gray-500 animate-fade-in opacity-0" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
        v1.0 • Build 2025
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-15px) translateX(5px);
          }
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}