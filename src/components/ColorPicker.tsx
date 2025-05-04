
import { useState, useEffect, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const ColorPicker = ({ color, onChange, label }: ColorPickerProps) => {
  const [currentColor, setCurrentColor] = useState(color);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentColor(color);
  }, [color]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    onChange(newColor);
  };

  const presetColors = [
    '#000000', '#FFFFFF', '#8B5CF6', '#6E59A5', '#D6BCFA', 
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'
  ];

  return (
    <div className="flex flex-col space-y-1.5">
      {label && <span className="text-sm font-medium">{label}</span>}
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-9 h-9 p-0"
              style={{ backgroundColor: currentColor }}
              aria-label="Pick a color"
            >
              <span className="sr-only">Pick a color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="flex flex-col space-y-3">
              <div className="flex justify-center">
                <input
                  ref={inputRef}
                  type="color"
                  value={currentColor}
                  onChange={handleColorChange}
                  className="w-32 h-10"
                />
              </div>
              <div className="grid grid-cols-5 gap-1">
                {presetColors.map((presetColor) => (
                  <button
                    key={presetColor}
                    className={cn(
                      "w-8 h-8 rounded border border-gray-300",
                      currentColor === presetColor && "ring-2 ring-qr-purple"
                    )}
                    style={{ backgroundColor: presetColor }}
                    onClick={() => {
                      setCurrentColor(presetColor);
                      onChange(presetColor);
                    }}
                    aria-label={`Select color ${presetColor}`}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <input
          type="text"
          value={currentColor}
          onChange={(e) => {
            setCurrentColor(e.target.value);
            if (/^#([0-9A-F]{3}){1,2}$/i.test(e.target.value)) {
              onChange(e.target.value);
            }
          }}
          className="flex-1 h-9 px-3 rounded-md border"
          placeholder="#RRGGBB"
        />
      </div>
    </div>
  );
};

export default ColorPicker;
