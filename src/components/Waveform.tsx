import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface WaveformProps {
  audioUrl: string;
  height?: number;
  barWidth?: number;
  barGap?: number;
  barCount?: number;
}

const Waveform = ({ 
  audioUrl, 
  height = 100, 
  barWidth = 3, 
  barGap = 2,
  barCount = 100 
}: WaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!ctx || !canvas) return;
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const totalWidth = barWidth + barGap;
      const barCountActual = Math.min(barCount, Math.floor(canvas.width / totalWidth));
      const step = Math.floor(bufferLength / barCountActual);

      for (let i = 0; i < barCountActual; i++) {
        const value = dataArray[i * step];
        const percent = value / 255;
        const barHeight = height * percent;
        
        const x = i * totalWidth;
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'hsl(var(--primary))');
        gradient.addColorStop(1, 'hsl(var(--accent))');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    audio.play().then(() => {
      draw();
    }).catch(() => {
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      audioContext.close();
    };
  }, [audioUrl, height, barWidth, barGap, barCount]);

  return (
    <Card className="p-4 bg-black overflow-hidden">
      <audio ref={audioRef} src={audioUrl} />
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={height}
        className="w-full"
      />
    </Card>
  );
};

export default Waveform;
