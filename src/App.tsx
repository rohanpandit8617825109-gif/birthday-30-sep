/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  Gift, 
  Flame, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Trophy, 
  Cake, 
  CheckCircle2,
  ChevronRight,
  PartyPopper,
  Music,
  Utensils,
  Copy,
  Check,
  Award,
  Heart
} from 'lucide-react';

// --- Sound Synthesizer using Web Audio API ---
class BirthdayAudio {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {
      // Audio restricted
    }
  }

  playBalloonPop() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      // Low pop thump
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);

      // Sizzle burst
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.06);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
      noise.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start();
    } catch {
      // Audio restricted
    }
  }

  playCutCake() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      // Slice swoosh + harmonic chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.19);
      setTimeout(() => this.playFanfare(), 150);
    } catch {
      // Audio restricted
    }
  }

  playChime() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [659.25, 880, 1046.5];
      notes.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.16, this.ctx!.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + i * 0.08);
        osc.stop(this.ctx!.currentTime + i * 0.08 + 0.4);
      });
    } catch {
      // Audio restricted
    }
  }

  playStarCatch(count: number) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
      const freq = notes[Math.min(count, notes.length - 1)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch {
      // Audio restricted
    }
  }

  playFanfare() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const melody = [
        { f: 523.25, t: 0, d: 0.18 },
        { f: 659.25, t: 0.15, d: 0.18 },
        { f: 783.99, t: 0.3, d: 0.22 },
        { f: 1046.5, t: 0.48, d: 0.45 },
      ];
      melody.forEach(note => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, this.ctx!.currentTime + note.t);
        gain.gain.setValueAtTime(0.18, this.ctx!.currentTime + note.t);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + note.t + note.d);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + note.t);
        osc.stop(this.ctx!.currentTime + note.t + note.d + 0.05);
      });
    } catch {
      // Audio restricted
    }
  }

  playBlowCandle() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.3);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.3);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      whiteNoise.start();

      setTimeout(() => this.playFanfare(), 250);
    } catch {
      // Audio restricted
    }
  }

  playHappyBirthdayTune() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const tune = [
        { f: 261.63, d: 0.22, t: 0 },
        { f: 261.63, d: 0.22, t: 0.28 },
        { f: 293.66, d: 0.4, t: 0.55 },
        { f: 261.63, d: 0.4, t: 1.0 },
        { f: 349.23, d: 0.4, t: 1.45 },
        { f: 329.63, d: 0.7, t: 1.9 },

        { f: 261.63, d: 0.22, t: 2.7 },
        { f: 261.63, d: 0.22, t: 2.98 },
        { f: 293.66, d: 0.4, t: 3.25 },
        { f: 261.63, d: 0.4, t: 3.7 },
        { f: 392.00, d: 0.4, t: 4.15 },
        { f: 349.23, d: 0.7, t: 4.6 },

        { f: 261.63, d: 0.22, t: 5.4 },
        { f: 261.63, d: 0.22, t: 5.68 },
        { f: 523.25, d: 0.4, t: 5.95 },
        { f: 440.00, d: 0.4, t: 6.4 },
        { f: 349.23, d: 0.4, t: 6.85 },
        { f: 329.63, d: 0.4, t: 7.3 },
        { f: 293.66, d: 0.6, t: 7.75 },

        { f: 466.16, d: 0.22, t: 8.5 },
        { f: 466.16, d: 0.22, t: 8.78 },
        { f: 440.00, d: 0.4, t: 9.05 },
        { f: 349.23, d: 0.4, t: 9.5 },
        { f: 392.00, d: 0.4, t: 9.95 },
        { f: 349.23, d: 0.85, t: 10.4 },
      ];
      tune.forEach(note => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, this.ctx!.currentTime + note.t);
        gain.gain.setValueAtTime(0.18, this.ctx!.currentTime + note.t);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + note.t + note.d);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + note.t);
        osc.stop(this.ctx!.currentTime + note.t + note.d + 0.05);
      });
    } catch {
      // Audio restricted
    }
  }
}

const audio = new BirthdayAudio();

// Balloons for Step 5
interface BalloonItem {
  id: number;
  emoji: string;
  color: string;
  badge: string;
  tag: string;
  message: string;
}

const balloonsList: BalloonItem[] = [
  {
    id: 1,
    emoji: '🎈',
    color: 'from-pink-500 to-rose-500',
    badge: '👑 Drama Queen',
    tag: 'Expressions Superstar',
    message: 'Har chhoti baat pe cinematic expression aur drama dena tumhara supreme talent hai! 😂❤️'
  },
  {
    id: 2,
    emoji: '🎈',
    color: 'from-purple-500 to-indigo-600',
    badge: '🧠 Super Intelligent',
    tag: 'Brain Power 100%',
    message: 'Hamesha smart decisions aur dreams ko hardwork se pura karne wali meri amazing sister! 🌟'
  },
  {
    id: 3,
    emoji: '🎈',
    color: 'from-amber-400 to-orange-500',
    badge: '🏡 Ghar Ki Shaan',
    tag: 'Sabki Favorite Sibling',
    message: 'Tumhare bina ghar bilkul boring lagta hai, tum ho toh har din celebration jaisa lagta hai! 💖'
  },
  {
    id: 4,
    emoji: '🎈',
    color: 'from-sky-400 to-blue-600',
    badge: '🚀 Rockstar Sister',
    tag: 'Full Confidence',
    message: 'Life mein jo bhi aim karo, use poore confidence aur pyari smile ke sath achieve karna! ✨'
  },
  {
    id: 5,
    emoji: '🎈',
    color: 'from-emerald-400 to-teal-600',
    badge: '🏆 Best Sister Forever',
    tag: 'Number 1 Behan',
    message: 'Chahe hum kitni bhi nok-jhok karein, duniya ki sabse loving aur best behan tum hi ho! 🌸'
  }
];

// Sibling Promise Vouchers for Step 6
interface VoucherItem {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  details: string;
  tag: string;
}

const vouchersList: VoucherItem[] = [
  {
    id: 1,
    icon: '🍕',
    title: 'Unlimited Food & Pizza Treat',
    subtitle: 'Bhai Ki Taraf Se Party Pass',
    details: 'Aaj ya jab bhi tum bolo, tumhari favorite jagah ka dinner aur treat sponsor by bhai!',
    tag: 'Valid Forever'
  },
  {
    id: 2,
    icon: '🛍️',
    title: 'Special Shopping Sponsor Pass',
    subtitle: 'Shopping Day Treat',
    details: 'Ek full shopping spree jahan billing counter par bhai khada milega! 😉',
    tag: 'Sister Privilege'
  },
  {
    id: 3,
    icon: '🕊️',
    title: 'Zero Nok-Jhok & Peace Treaty',
    subtitle: '24 Hours No Argument Pass',
    details: 'Pure 24 ghante ke liye bhai se zero behas aur full VIP treatment guaranteed! 😂',
    tag: 'Special Guarantee'
  },
  {
    id: 4,
    icon: '🍨',
    title: 'Late-Night Ice Cream & Dessert Run',
    subtitle: 'Sweet Cravings Solution',
    details: 'Raat ko kabhi bhi ice cream ya dessert craving ho, bhai ready to order!',
    tag: 'Anytime Pass'
  },
  {
    id: 5,
    icon: '🛡️',
    title: '24x7 Brother Helpline For Life',
    subtitle: 'Lifetime Support & Protection',
    details: 'Life mein koi bhi advice, guidance ya help chahiye ho, bhai hamesha ek call away hai. ❤️',
    tag: 'Lifetime Bond'
  }
];

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [starCount, setStarCount] = useState<number>(0);
  const [starPos, setStarPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isGiftOpened, setIsGiftOpened] = useState<boolean>(false);
  const [isCandleBlown, setIsCandleBlown] = useState<boolean>(false);
  const [isCakeCut, setIsCakeCut] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [gameSuccess, setGameSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlayingTune, setIsPlayingTune] = useState<boolean>(false);

  // Step 5: Balloon Popping State
  const [poppedBalloons, setPoppedBalloons] = useState<{ [key: number]: boolean }>({});

  // Step 6: Claimed Vouchers State
  const [claimedVouchers, setClaimedVouchers] = useState<{ [key: number]: boolean }>({});

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameAreaRef = useRef<HTMLDivElement | null>(null);

  // Confetti Particle System
  const triggerConfetti = useCallback((intensity = 45) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f472b6', '#c084fc', '#fbbf24', '#38bdf8', '#fb7185', '#a78bfa', '#34d399'];
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      rotSpeed: number;
      shape: 'rect' | 'circle' | 'star';
      life: number;
    }> = [];

    for (let i = 0; i < intensity; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 180,
        y: canvas.height * 0.45 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 14 - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 9 + 5,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        shape: Math.random() > 0.4 ? 'rect' : Math.random() > 0.5 ? 'circle' : 'star',
        life: 1,
      });
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = 0;

      particles.forEach(p => {
        if (p.life <= 0) return;
        active++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.vx *= 0.985;
        p.rotation += p.rotSpeed;
        p.life -= 0.012;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            ctx.lineTo(Math.cos(((18 + s * 72) * Math.PI) / 180) * p.size * 0.7, -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.size * 0.7);
            ctx.lineTo(Math.cos(((54 + s * 72) * Math.PI) / 180) * p.size * 0.3, -Math.sin(((54 + s * 72) * Math.PI) / 180) * p.size * 0.3);
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });

      if (active > 0) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Window resize handler for canvas
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Step 2: Move Star logic
  const moveStar = useCallback(() => {
    const margin = 16;
    const x = Math.floor(Math.random() * (100 - margin * 2)) + margin;
    const y = Math.floor(Math.random() * (100 - margin * 2)) + margin;
    setStarPos({ x, y });
  }, []);

  const handleStarClick = () => {
    const nextCount = starCount + 1;
    setStarCount(nextCount);
    audio.playStarCatch(nextCount);
    triggerConfetti(25);

    if (nextCount >= 5) {
      setGameSuccess(true);
      audio.playFanfare();
      triggerConfetti(70);
      setTimeout(() => {
        setCurrentStep(3);
      }, 1600);
    } else {
      moveStar();
    }
  };

  const handleOpenGift = () => {
    if (isGiftOpened) return;
    setIsGiftOpened(true);
    audio.playFanfare();
    triggerConfetti(80);
  };

  const handleBlowCandle = () => {
    if (isCandleBlown) return;
    setIsCandleBlown(true);
    audio.playBlowCandle();
    triggerConfetti(75);
  };

  const handleCutCake = () => {
    if (isCakeCut) return;
    setIsCakeCut(true);
    audio.playCutCake();
    triggerConfetti(85);
  };

  const handlePopBalloon = (id: number) => {
    if (poppedBalloons[id]) return;
    audio.playBalloonPop();
    triggerConfetti(35);
    setPoppedBalloons(prev => {
      const updated = { ...prev, [id]: true };
      if (Object.keys(updated).length === balloonsList.length) {
        setTimeout(() => {
          audio.playFanfare();
          triggerConfetti(80);
        }, 300);
      }
      return updated;
    });
  };

  const handleClaimVoucher = (id: number) => {
    if (claimedVouchers[id]) return;
    audio.playChime();
    triggerConfetti(30);
    setClaimedVouchers(prev => ({ ...prev, [id]: true }));
  };

  const handlePlayTune = () => {
    if (isPlayingTune) return;
    setIsPlayingTune(true);
    audio.playHappyBirthdayTune();
    triggerConfetti(45);
    setTimeout(() => {
      setIsPlayingTune(false);
    }, 12000);
  };

  const handleReplay = () => {
    audio.playPop();
    setCurrentStep(1);
    setStarCount(0);
    setGameSuccess(false);
    setIsGiftOpened(false);
    setIsCandleBlown(false);
    setIsCakeCut(false);
    setPoppedBalloons({});
    setClaimedVouchers({});
    setStarPos({ x: 50, y: 50 });
  };

  const handleCopy = () => {
    const text = `Happy Birthday Kashish Gupta! 🎂✨ May your day be filled with endless smiles, success and love. Always be happy and achieve all your dreams! ~ With love, your brother 🌸`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    audio.playPop();
    setTimeout(() => setCopied(false), 2000);
  };

  const totalPopped = Object.keys(poppedBalloons).length;
  const totalClaimed = Object.keys(claimedVouchers).length;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 overflow-x-hidden">
      {/* Background Canvas for Confetti */}
      <canvas 
        ref={canvasRef} 
        className="pointer-events-none fixed inset-0 z-50 w-full h-full"
      />

      {/* Floating Background Decorative Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none">
        <div className="absolute -top-24 -left-24 w-80 h-80 sm:w-96 sm:h-96 bg-pink-300/35 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-purple-300/35 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 sm:w-96 sm:h-96 bg-amber-200/35 rounded-full blur-3xl" />

        <div className="absolute top-12 left-6 sm:left-16 text-3xl sm:text-4xl animate-float-slow opacity-80">🎈</div>
        <div className="absolute top-20 right-8 sm:right-20 text-2xl sm:text-3xl animate-float-reverse opacity-75">✨</div>
        <div className="absolute bottom-24 left-8 sm:left-24 text-3xl sm:text-4xl animate-float-reverse opacity-80">🎀</div>
        <div className="absolute bottom-16 right-10 sm:right-24 text-3xl sm:text-4xl animate-float-slow opacity-80">🎉</div>
        <div className="absolute top-1/2 left-4 text-xl sm:text-2xl animate-pulse-soft opacity-60">⭐</div>
        <div className="absolute top-2/3 right-6 text-xl sm:text-2xl animate-float-slow opacity-60">🍰</div>
      </div>

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-2xl flex items-center justify-between pt-2 pb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-purple-400 flex items-center justify-center text-white shadow-sm shadow-pink-300">
            <Cake className="w-4 h-4" />
          </div>
          <div>
            <span className="font-heading font-bold text-slate-800 tracking-tight text-base sm:text-lg">
              Kashish Gupta
            </span>
            <span className="text-xs text-pink-700/80 block font-medium">
              Birthday Surprise · Sister Edition 🎂
            </span>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            audio.enabled = next;
            if (next) audio.playPop();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white/90 border border-pink-200 text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-md transition-all cursor-pointer"
          aria-label="Toggle Sound"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-pink-600" />
              <span className="hidden sm:inline">Sound On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Muted</span>
            </>
          )}
        </button>
      </header>

      {/* Main Glassmorphism Card */}
      <main className="relative z-10 w-full max-w-2xl my-auto py-2">
        <div className="glass-card rounded-3xl p-6 sm:p-9 md:p-10 shadow-2xl relative overflow-hidden transition-all duration-500">
          
          {/* Step Progress Indicators (6 Steps) */}
          <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
            {[1, 2, 3, 4, 5, 6].map(step => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all duration-400 ${
                  currentStep === step
                    ? 'w-8 bg-gradient-to-r from-pink-500 to-purple-500 shadow-xs'
                    : currentStep > step
                    ? 'w-4 bg-pink-400'
                    : 'w-2 bg-pink-200'
                }`}
              />
            ))}
          </div>

          {/* ================= STEP 1: WELCOME SCREEN ================= */}
          {currentStep === 1 && (
            <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-100/90 border border-pink-200 text-pink-700 text-xs sm:text-sm font-semibold shadow-xs">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span>A Little Birthday Surprise ✨</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
                  Happy Birthday <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">Kashish!</span> 🎂
                </h1>
                <p className="text-base sm:text-lg text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                  Aaj ka din tumhare liye bahut special hai! Ek chhota sa surprise tumhara wait kar raha hai.
                </p>
              </div>

              {/* Decorative Birthday Gift Graphic */}
              <div className="relative py-4 flex justify-center items-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-pink-400 via-rose-300 to-purple-300 p-1 shadow-lg shadow-pink-300/50 flex items-center justify-center animate-bounce-gentle">
                  <div className="w-full h-full rounded-[22px] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-1">
                    <span className="text-4xl sm:text-5xl">🎁</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-pink-600">
                      For Kashish
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    audio.playPop();
                    setCurrentStep(2);
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-semibold text-base shadow-lg shadow-pink-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <span>Surprise Start Karo ✨</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: FUN CHALLENGE (CATCH 5 STARS) ================= */}
          {currentStep === 2 && (
            <div className="text-center space-y-5 animate-in fade-in duration-400">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100/90 border border-purple-200 text-purple-700 text-xs sm:text-sm font-semibold">
                <Trophy className="w-4 h-4 text-purple-500" />
                <span>Birthday Girl Challenge 🌟</span>
              </div>

              <div className="space-y-1.5">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-800">
                  Catch 5 Birthday Stars! ⭐
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Surprise unlock karne ke liye screen par chamakte hue stars ko tap karo!
                </p>
              </div>

              {/* Progress Count */}
              <div className="flex items-center justify-center gap-3">
                <span className="text-xs sm:text-sm font-semibold text-slate-700">Stars Caught:</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        starCount >= i
                          ? 'bg-amber-400 text-amber-950 scale-110 shadow-xs'
                          : 'bg-pink-100 text-pink-400'
                      }`}
                    >
                      {starCount >= i ? '★' : '☆'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Star Play Area */}
              <div
                ref={gameAreaRef}
                className="relative w-full h-56 sm:h-64 rounded-2xl bg-gradient-to-b from-purple-900/10 to-pink-500/10 border border-pink-200/80 overflow-hidden flex items-center justify-center select-none"
              >
                {!gameSuccess ? (
                  <button
                    onClick={handleStarClick}
                    style={{
                      left: `${starPos.x}%`,
                      top: `${starPos.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="absolute p-3 rounded-full bg-amber-400/90 hover:bg-amber-300 text-amber-950 text-2xl sm:text-3xl shadow-lg shadow-amber-300/60 active:scale-90 transition-all duration-200 cursor-pointer animate-pulse-soft"
                    aria-label="Catch the Star"
                  >
                    ⭐
                  </button>
                ) : (
                  <div className="space-y-2 animate-in zoom-in-90 duration-300">
                    <span className="text-4xl sm:text-5xl">🎉</span>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-purple-900">
                      Awesome Kashish! Challenge Complete!
                    </h3>
                    <p className="text-xs text-purple-700 font-medium">
                      Agla surprise unlock ho raha hai...
                    </p>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-500 italic">
                {gameSuccess ? 'Redirecting to your gift box...' : 'Tip: Star ko jaldi tap karo! 😄'}
              </p>
            </div>
          )}

          {/* ================= STEP 3: INTERACTIVE GIFT BOX ================= */}
          {currentStep === 3 && (
            <div className="text-center space-y-6 animate-in fade-in duration-400">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/90 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold">
                <Gift className="w-4 h-4 text-rose-500" />
                <span>Special Surprise Box 🎁</span>
              </div>

              <div className="space-y-1.5">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-800">
                  Ek Special Gift Kashish Ke Liye 🎀
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  {isGiftOpened
                    ? 'Gift khul gaya! Dekho andar kya hai...'
                    : 'Gift box par tap karke ise open karo!'}
                </p>
              </div>

              {/* Gift Box Container */}
              <div className="py-4 flex flex-col items-center justify-center">
                <div
                  onClick={handleOpenGift}
                  className={`group relative cursor-pointer select-none transition-transform duration-500 ${
                    isGiftOpened ? 'scale-105' : 'hover:scale-105 active:scale-95'
                  }`}
                >
                  {/* Gift Box Lid */}
                  <div
                    className={`w-36 sm:w-44 h-10 sm:h-12 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 rounded-t-xl mx-auto shadow-md relative z-20 flex items-center justify-center transition-all duration-700 ${
                      isGiftOpened ? '-translate-y-8 rotate-6 opacity-90' : ''
                    }`}
                  >
                    {/* Ribbon Bow */}
                    <div className="absolute -top-3 w-8 h-8 rounded-full bg-amber-400 border-2 border-white shadow-xs flex items-center justify-center text-xs">
                      🎀
                    </div>
                    <div className="w-5 h-full bg-amber-300/80 mx-auto" />
                  </div>

                  {/* Gift Box Body */}
                  <div className="w-32 sm:w-40 h-28 sm:h-32 bg-gradient-to-br from-rose-400 to-pink-600 rounded-b-2xl shadow-xl relative z-10 mx-auto flex items-center justify-center overflow-hidden">
                    <div className="w-5 h-full bg-amber-300/80 mx-auto" />
                    
                    {/* Unlocked Message Popout */}
                    {isGiftOpened && (
                      <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-3 text-center animate-in zoom-in-75 duration-500">
                        <span className="text-2xl animate-bounce">🎂</span>
                        <p className="font-heading font-bold text-pink-700 text-xs sm:text-sm mt-1">
                          You are Amazing!
                        </p>
                        <p className="text-[11px] text-slate-600 font-medium">
                          Best Sister Award 🏆
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {!isGiftOpened && (
                  <span className="text-xs font-semibold text-pink-600 mt-4 animate-pulse">
                    👉 Tap box to open! 👈
                  </span>
                )}
              </div>

              {isGiftOpened && (
                <div className="pt-2 animate-in fade-in duration-300">
                  <button
                    onClick={() => {
                      audio.playPop();
                      setCurrentStep(4);
                    }}
                    className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-pink-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                  >
                    <span>Birthday Cake Cut Karein 🎂 →</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 4: BIRTHDAY CAKE & CAKE CUTTING ================= */}
          {currentStep === 4 && (
            <div className="text-center space-y-6 animate-in fade-in duration-400">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-200 text-amber-800 text-xs sm:text-sm font-semibold">
                <Cake className="w-4 h-4 text-amber-600" />
                <span>Cake Cutting Ceremony 🎂✨</span>
              </div>

              <div className="space-y-1.5">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-800">
                  Make a Wish & Blow the Candle! 🕯️
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  {!isCandleBlown
                    ? 'Pehle candle par phoonk maaro aur wish maango...'
                    : !isCakeCut
                    ? 'Wish maangi gayi! Ab cake cut karo 🍰🔪'
                    : 'Pehla piece Birthday Girl Kashish ke liye! 🍰😋'}
                </p>
              </div>

              {/* Birthday Cake Illustration */}
              <div className="py-2 flex flex-col items-center justify-center select-none">
                <div className="relative flex flex-col items-center">
                  
                  {/* Candle & Flame */}
                  <div className="relative flex flex-col items-center z-20 -mb-1">
                    {/* Flame */}
                    {!isCandleBlown ? (
                      <div className="w-4 h-7 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 rounded-full animate-flicker shadow-lg shadow-amber-400/80" />
                    ) : (
                      /* Smoke puff */
                      <div className="text-slate-400 text-xs animate-bounce opacity-80">
                        💨
                      </div>
                    )}
                    {/* Candle stick */}
                    <div className="w-2.5 h-8 bg-gradient-to-b from-pink-300 via-white to-pink-300 rounded-t-sm border border-pink-400/40" />
                  </div>

                  {/* Cake Top Layer */}
                  <div className="w-36 sm:w-44 h-12 sm:h-14 bg-gradient-to-r from-pink-200 via-rose-100 to-pink-200 rounded-t-2xl border-t-4 border-pink-400 shadow-inner relative z-10 flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-bold text-pink-700 tracking-wider uppercase">
                      Kashish
                    </span>
                    <div className="absolute -bottom-1 w-full flex justify-around px-2 text-[10px]">
                      <span>🍓</span>
                      <span>🍒</span>
                      <span>🍓</span>
                    </div>
                  </div>

                  {/* Cake Bottom Layer */}
                  <div className="w-48 sm:w-56 h-16 sm:h-18 bg-gradient-to-r from-rose-300 via-pink-200 to-rose-300 rounded-b-2xl border-t-4 border-white shadow-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-around opacity-30 text-lg">
                      <span>✨</span>
                      <span>⭐</span>
                      <span>✨</span>
                    </div>
                    <span className="font-heading font-extrabold text-sm sm:text-base text-pink-800 z-10">
                      Happy Birthday
                    </span>
                  </div>

                  {/* Cake Base Plate */}
                  <div className="w-56 sm:w-64 h-3 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 rounded-full shadow-md -mt-1" />
                </div>

                {/* Sliced Cake Piece on Gold Plate (Appears when Cake is Cut) */}
                {isCakeCut && (
                  <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-pink-50 border border-amber-200 shadow-md flex items-center gap-3 animate-in zoom-in-95 duration-400">
                    <span className="text-4xl animate-bounce">🍰</span>
                    <div className="text-left">
                      <p className="font-heading font-bold text-slate-800 text-sm sm:text-base">
                        Pehla Piece Kashish Ke Liye! 🍰✨
                      </p>
                      <p className="text-xs text-pink-700 font-medium">
                        Delicious strawberry cream slice for the birthday girl! 😋
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Blow Candle OR Cut Cake OR Next Step */}
              <div className="pt-2 flex flex-col items-center gap-3">
                {!isCandleBlown ? (
                  <button
                    onClick={handleBlowCandle}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-semibold text-base shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                  >
                    <Flame className="w-4 h-4 text-yellow-200 animate-pulse" />
                    <span>Blow The Candle 🌬️</span>
                  </button>
                ) : !isCakeCut ? (
                  <button
                    onClick={handleCutCake}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-semibold text-base shadow-lg shadow-pink-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer animate-bounce-gentle"
                  >
                    <Utensils className="w-4 h-4 text-white" />
                    <span>Cut The Cake 🎂🔪</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      audio.playPop();
                      setCurrentStep(5);
                    }}
                    className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-pink-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                  >
                    <span>Birthday Balloons Pop Karo 🎈 →</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 5: BIRTHDAY BALLOON POPPING ================= */}
          {currentStep === 5 && (
            <div className="text-center space-y-6 animate-in fade-in duration-400">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100/90 border border-pink-200 text-pink-700 text-xs sm:text-sm font-semibold">
                <PartyPopper className="w-4 h-4 text-pink-500" />
                <span>Birthday Balloon Pop Game 🎈💥</span>
              </div>

              <div className="space-y-1.5">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-800">
                  Pop The Birthday Balloons! 🎈
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Kashish, har balloon ko tap karke pop karo aur dekho bhai ne tumhare liye kya secret compliment likha hai!
                </p>
                <div className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                  Balloons Popped: {totalPopped} / {balloonsList.length}
                </div>
              </div>

              {/* Grid of Interactive Balloons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-left pt-1">
                {balloonsList.map(b => {
                  const isPopped = poppedBalloons[b.id];
                  return (
                    <div
                      key={b.id}
                      onClick={() => handlePopBalloon(b.id)}
                      className={`relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
                        isPopped
                          ? 'bg-white/95 border-pink-200 shadow-sm scale-100'
                          : 'bg-gradient-to-br from-white/90 to-pink-50/70 border-pink-200/80 shadow-md hover:scale-[1.03] active:scale-95'
                      }`}
                    >
                      {!isPopped ? (
                        /* Unpopped Balloon */
                        <div className="flex flex-col items-center justify-center py-4 space-y-2 text-center">
                          <div className={`w-14 h-16 rounded-[50%] bg-gradient-to-t ${b.color} text-white flex items-center justify-center text-2xl shadow-md animate-bounce-gentle relative`}>
                            <span>🎈</span>
                            <div className="absolute -bottom-2 w-1.5 h-3 bg-slate-300 rounded-full" />
                          </div>
                          <span className="text-xs font-bold text-slate-700 mt-2">
                            Balloon #{b.id}
                          </span>
                          <span className="text-[11px] font-semibold text-pink-600 bg-pink-100/80 px-2.5 py-0.5 rounded-full">
                            Tap to Pop! 💥
                          </span>
                        </div>
                      ) : (
                        /* Popped Balloon Reveal Card */
                        <div className="space-y-1.5 animate-in zoom-in-90 duration-300">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full">
                              {b.badge}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              #{b.id}
                            </span>
                          </div>
                          <h4 className="font-heading font-bold text-slate-900 text-sm">
                            {b.tag}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {b.message}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Next Step / Complete button */}
              <div className="pt-2">
                {totalPopped === balloonsList.length ? (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>All 5 Balloons Popped! Awesome! 🎉</span>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          audio.playPop();
                          setCurrentStep(6);
                        }}
                        className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-purple-400/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                      >
                        <span>Bhai Ke Birthday Vouchers & Letter Dekho 💌 →</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Balloons ko tap karo to see all 5 surprises! (Ya direct aage badh sakti ho)
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 6: HEARTFELT LETTER & SIBLING VOUCHERS ================= */}
          {currentStep === 6 && (
            <div className="text-center space-y-7 animate-in fade-in duration-500">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100/90 border border-pink-200 text-pink-700 text-xs sm:text-sm font-semibold">
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                <span>From Your Brother 💌</span>
              </div>

              <div className="space-y-2">
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-800">
                  Happy Birthday, <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Kashish!</span> 🎂✨
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  A heartfelt birthday message and lifetime sibling vouchers from bhai
                </p>
              </div>

              {/* Heartfelt Hinglish Letter Card */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-white/95 border border-pink-200 shadow-md space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed text-left">
                <p>
                  <strong className="text-slate-900 font-bold font-heading text-lg">Dear Kashish,</strong>
                </p>
                <p>
                  Aaj tumhara birthday hai, aur main bas itna wish karta hoon ki tumhari life hamesha smiles, success aur khushiyon se bhari rahe. Tum jo bhi dream dekho, use poore confidence ke sath accomplish karo.
                </p>

                <p>
                  Chahe hum kitni bhi ladai karein, ek dusre ka mazaak udayein ya argument karein, family mein aur meri life mein tumhari jagah hamesha sabse special rahegi. 😄❤️
                </p>

                <p>
                  Always keep smiling, stay positive, and never change your joyful nature. May this year bring you great opportunities, good health and happiness!
                </p>

                <div className="pt-3 border-t border-pink-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="font-heading font-bold text-slate-900 text-sm sm:text-base">
                      Once again, Happy Birthday Kashish! 🎂🎉
                    </p>
                    <p className="text-xs text-pink-600 font-medium">
                      Have an extraordinary and blessed year ahead!
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-script text-2xl text-pink-700 block -rotate-2">
                      ~ With lots of love, Bhai 🌸
                    </span>
                  </div>
                </div>
              </div>

              {/* Synthesized Happy Birthday Song Player */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center text-lg shadow-sm">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-slate-900 text-sm sm:text-base">
                      Play Happy Birthday Song 🎵
                    </h4>
                    <p className="text-xs text-slate-600">
                      Bhai ki taraf se birthday melody suno!
                    </p>
                  </div>
                </div>

                <button
                  onClick={handlePlayTune}
                  disabled={isPlayingTune}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                    isPlayingTune
                      ? 'bg-purple-200 text-purple-800 animate-pulse'
                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm active:scale-95'
                  }`}
                >
                  <Music className="w-4 h-4" />
                  <span>{isPlayingTune ? 'Playing Melody 🎶...' : 'Play Tune 🎶'}</span>
                </button>
              </div>

              {/* Sibling Promise Vouchers Section */}
              <div className="space-y-3.5 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-slate-900 text-base sm:text-lg flex items-center gap-1.5">
                      <span>Bhai Ke Birthday Vouchers</span>
                      <span>🎟️🎁</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tap any voucher to claim your birthday privilege! (Claimed: {totalClaimed}/{vouchersList.length})
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vouchersList.map(v => {
                    const isClaimed = claimedVouchers[v.id];
                    return (
                      <div
                        key={v.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isClaimed
                            ? 'bg-emerald-50/90 border-emerald-300 shadow-sm'
                            : 'bg-white/90 border-pink-200 hover:border-pink-300 shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-3xl">{v.icon}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isClaimed ? 'bg-emerald-200 text-emerald-800' : 'bg-pink-100 text-pink-700'
                          }`}>
                            {isClaimed ? 'CLAIMED ✅' : v.tag}
                          </span>
                        </div>

                        <div className="mt-2 space-y-1">
                          <h4 className="font-heading font-bold text-slate-900 text-sm">
                            {v.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-snug">
                            {v.details}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-slate-400">
                            For: Kashish Gupta
                          </span>
                          <button
                            onClick={() => handleClaimVoucher(v.id)}
                            disabled={isClaimed}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                              isClaimed
                                ? 'bg-emerald-600 text-white cursor-default'
                                : 'bg-pink-500 hover:bg-pink-600 text-white cursor-pointer active:scale-95 shadow-xs'
                            }`}
                          >
                            {isClaimed ? 'Redeemed ✓' : 'Claim Now 🎁'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons: Replay, Copy & Celebrate */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleReplay}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500" />
                  <span>Replay The Surprise ✨</span>
                </button>

                <button
                  onClick={() => {
                    audio.playFanfare();
                    triggerConfetti(70);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 hover:bg-pink-100 font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <PartyPopper className="w-4 h-4 text-pink-600" />
                  <span>Celebrate More 🎉</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-900 font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied! ✨' : 'Copy Wish 📋'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-xl text-center py-4 mt-auto">
        <p className="text-xs text-slate-500 font-medium">
          Crafted with love for Kashish Gupta on her Birthday ✨
        </p>
      </footer>
    </div>
  );
}
