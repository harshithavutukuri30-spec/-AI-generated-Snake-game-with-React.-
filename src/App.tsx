/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Github, Twitter, ExternalLink } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 md:p-8 relative selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-20%)',
            maskImage: 'linear-gradient(to bottom, transparent, black, transparent)'
          }}
        />
        
        {/* Floating Orbs */}
        <motion.div 
          animate={{ 
            x: [0, 100, -50, 0], 
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-magenta-500/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 50, 0], 
            y: [0, 100, -50, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-400/50 blur-[150px] rounded-full opacity-20"
        />
      </div>

      <header className="absolute top-8 left-8 z-50 hidden md:block">
        <h1 className="text-sm font-mono uppercase tracking-[0.4em] text-white/30 hover:text-cyan-400 transition-colors cursor-default">
          System://Neon_Pulse_v1.0
        </h1>
      </header>

      <main className="w-full max-w-6xl z-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
        
        {/* Game Section */}
        <section className="flex flex-col items-center gap-6">
          <SnakeGame />
          <div className="flex gap-4">
             <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-white/40 uppercase tracking-widest">
               Latency: <span className="text-green-400">0.4ms</span>
             </div>
             <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-white/40 uppercase tracking-widest">
               Status: <span className="text-cyan-400 animate-pulse">Running</span>
             </div>
          </div>
        </section>

        {/* Media & Info Section */}
        <div className="flex flex-col gap-12 max-w-sm w-full">
          <div className="space-y-4">
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-block"
            >
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">Now Playing</span>
            </motion.div>
            <MusicPlayer />
          </div>

          <div className="space-y-6">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="grid grid-cols-2 gap-6">
              <div className="group cursor-default">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20 group-hover:text-magenta-500 transition-colors">Visualizer</h4>
                <div className="mt-2 h-12 flex items-end gap-1">
                  {[...Array(12)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="flex-1 bg-magenta-500/20 rounded-t-sm"
                      animate={{ height: [`${20 + Math.random() * 80}%`, `${10 + Math.random() * 90}%`] }}
                      transition={{ duration: 0.2 + i * 0.05, repeat: Infinity, repeatType: "reverse" }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col justify-between py-1">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">Controls</h4>
                <div className="flex gap-3 mt-auto">
                   {[Twitter, Github, ExternalLink].map((Icon, i) => (
                     <button key={i} className="text-white/40 hover:text-white transition-all hover:scale-110 active:scale-90">
                       <Icon size={18} />
                     </button>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-8 text-[10px] font-mono text-white/20 uppercase tracking-[0.5em] pointer-events-none">
        Protocol_Neon // 2026
      </footer>

      {/* Extreme Vignette */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
    </div>
  );
}
