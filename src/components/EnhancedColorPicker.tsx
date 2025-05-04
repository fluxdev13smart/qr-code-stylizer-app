
import { useState, useEffect, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface EnhancedColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const EnhancedColorPicker = ({ color, onChange, label }: EnhancedColorPickerProps) => {
  const [currentColor, setCurrentColor] = useState(color);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const hueWheelRef = useRef<HTMLDivElement>(null);
  const satLightCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setCurrentColor(color);
    
    // Convert hex to HSL
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }
    
    setHue(Math.round(h));
    setSaturation(Math.round(s * 100));
    setLightness(Math.round(l * 100));
  }, [color]);

  useEffect(() => {
    if (popoverOpen) {
      // Draw the saturation-lightness canvas
      drawSatLightCanvas();
    }
  }, [popoverOpen, hue]);

  const drawSatLightCanvas = () => {
    const canvas = satLightCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw saturation-lightness gradient
    for (let y = 0; y < height; y++) {
      const l = 1 - (y / height);
      
      for (let x = 0; x < width; x++) {
        const s = x / width;
        
        ctx.fillStyle = `hsl(${hue}, ${s * 100}%, ${l * 100}%)`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  };

  const handleHueClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hueWheelRef.current) return;
    
    const rect = hueWheelRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    // Calculate angle
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    
    setHue(Math.round(angle));
    updateColorFromHSL(Math.round(angle), saturation, lightness);
  };

  const handleSatLightClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!satLightCanvasRef.current) return;
    
    const rect = satLightCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const s = Math.max(0, Math.min(100, Math.round((x / rect.width) * 100)));
    const l = Math.max(0, Math.min(100, Math.round((1 - y / rect.height) * 100)));
    
    setSaturation(s);
    setLightness(l);
    updateColorFromHSL(hue, s, l);
  };

  const updateColorFromHSL = (h: number, s: number, l: number) => {
    // Convert HSL to hex
    const hslToRgb = (h: number, s: number, l: number) => {
      h /= 360;
      s /= 100;
      l /= 100;
      let r, g, b;
      
      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };
    
    const [r, g, b] = hslToRgb(h, s, l);
    const toHex = (c: number) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    
    const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    setCurrentColor(hexColor);
    onChange(hexColor);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentColor(value);
    
    // Only update if valid hex
    if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
      onChange(value);
    }
  };

  return (
    <div className="flex flex-col space-y-1.5">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      <div className="flex items-center space-x-2">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-9 h-9 p-0 relative overflow-hidden transition-all duration-200 hover:scale-105 animate-fade-in"
              style={{ backgroundColor: currentColor }}
              aria-label="Pick a color"
            >
              <span className="sr-only">Pick a color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              {/* Apple-style hue wheel */}
              <div 
                ref={hueWheelRef}
                className="relative w-52 h-52 mx-auto rounded-full shadow-md overflow-hidden cursor-pointer"
                style={{
                  background: `conic-gradient(
                    from 0deg,
                    hsl(0, 100%, 50%),
                    hsl(60, 100%, 50%),
                    hsl(120, 100%, 50%),
                    hsl(180, 100%, 50%),
                    hsl(240, 100%, 50%),
                    hsl(300, 100%, 50%),
                    hsl(360, 100%, 50%)
                  )`
                }}
                onClick={handleHueClick}
              >
                <div className="absolute inset-2 rounded-full bg-white/90"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="absolute"
                    style={{
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%',
                      border: '2px solid white',
                      boxShadow: '0 0 4px rgba(0,0,0,0.5)',
                      backgroundColor: `hsl(${hue}, 100%, 50%)`,
                      transform: `rotate(${hue}deg) translateX(98px)`,
                      transformOrigin: 'center center',
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Saturation-Lightness canvas */}
              <div className="relative w-52 h-52 mx-auto shadow-md overflow-hidden">
                <canvas 
                  ref={satLightCanvasRef}
                  width="200" 
                  height="200" 
                  className="w-full h-full cursor-pointer"
                  onClick={handleSatLightClick}
                />
                <div 
                  className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    backgroundColor: currentColor,
                    top: `${100 - lightness}%`,
                    left: `${saturation}%`
                  }}
                ></div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="hue-value">Hue</Label>
                  <Input
                    id="hue-value"
                    type="number"
                    min="0"
                    max="360"
                    value={hue}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setHue(value);
                      updateColorFromHSL(value, saturation, lightness);
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sat-value">Saturation</Label>
                  <Input
                    id="sat-value"
                    type="number"
                    min="0"
                    max="100"
                    value={saturation}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setSaturation(value);
                      updateColorFromHSL(hue, value, lightness);
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="light-value">Lightness</Label>
                  <Input
                    id="light-value"
                    type="number"
                    min="0"
                    max="100"
                    value={lightness}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setLightness(value);
                      updateColorFromHSL(hue, saturation, value);
                    }}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="hex-value">HEX</Label>
                <Input
                  id="hex-value"
                  type="text"
                  value={currentColor}
                  onChange={handleHexChange}
                  className="mt-1"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Input
          type="text"
          value={currentColor}
          onChange={handleHexChange}
          className="flex-1 h-9"
          placeholder="#RRGGBB"
        />
      </div>
    </div>
  );
};

export default EnhancedColorPicker;
