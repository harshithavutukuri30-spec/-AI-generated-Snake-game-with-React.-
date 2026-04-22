import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Pulse',
    artist: 'AI Gen - Techno',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    title: 'Neon Dreams',
    artist: 'AI Gen - Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'AI Gen - Ambient',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=400&h=400&fit=crop'
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="w-full max-w-md bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_0_50px_rgba(255,0,255,0.1)] relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-magenta-500/20 blur-[100px] rounded-full group-hover:bg-magenta-500/30 transition-colors duration-700" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/20 blur-[100px] rounded-full group-hover:bg-cyan-500/30 transition-colors duration-700" />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex flex-col gap-6 relative z-10">
        {/* Track Info */}
        <div className="flex items-center gap-4">
          <motion.div 
            className="relative"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-20 h-20 rounded-full border-2 border-white/20 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Vinyl center hole */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full border border-white/20" />
            </div>
          </motion.div>
          
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-white tracking-tight leading-tight">{currentTrack.title}</h3>
            <p className="text-sm text-white/50 font-medium uppercase tracking-widest">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-magenta-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>
          <div className="flex justify-between items-center px-1">
             <Volume2 className="w-3 h-3 text-white/30" />
             <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="w-0.5 bg-cyan-400/50 rounded-full"
                    animate={{ height: isPlaying ? [4, 12, 6, 14, 4] : 4 }}
                    transition={{ duration: 0.5 + i * 0.1, repeat: Infinity }}
                  />
                ))}
             </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={handlePrev}
            className="text-white/60 hover:text-white transition-colors hover:scale-110 active:scale-95"
          >
            <SkipBack size={24} fill="currentColor" className="opacity-80" />
          </button>

          <button 
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 active:scale-90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>

          <button 
            onClick={handleNext}
            className="text-white/60 hover:text-white transition-colors hover:scale-110 active:scale-95"
          >
            <SkipForward size={24} fill="currentColor" className="opacity-80" />
          </button>
        </div>
      </div>
    </div>
  );
}
