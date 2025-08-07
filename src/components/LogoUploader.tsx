
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface LogoUploaderProps {
  logo: string | null;
  setLogo: (logo: string | null) => void;
  logoSize: number;
  setLogoSize: (size: number) => void;
  logoOpacity: number;
  setLogoOpacity: (opacity: number) => void;
}

const LogoUploader = ({
  logo,
  setLogo,
  logoSize,
  setLogoSize,
  logoOpacity,
  setLogoOpacity,
}: LogoUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setLogo(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setLogo(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {!logo ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("logo-upload")?.click()}
          >
            <Upload className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your logo here or click to browse
            </p>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="relative">
            <div className="flex justify-center border rounded-lg p-4">
              <img
                src={logo}
                alt="Logo Preview"
                className="h-24 object-contain"
                style={{ opacity: logoOpacity }}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white shadow"
              onClick={removeLogo}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {logo && (
        <>
          <div className="space-y-2">
            <Label>Logo Size: {logoSize}px</Label>
            <Slider
              value={[logoSize]}
              min={25}
              max={150}
              step={1}
              onValueChange={(value) => setLogoSize(value[0])}
              className="py-2"
            />
          </div>

          <div className="space-y-2">
            <Label>Logo Opacity: {Math.round(logoOpacity * 100)}%</Label>
            <Slider
              value={[logoOpacity * 100]}
              min={10}
              max={100}
              step={1}
              onValueChange={(value) => setLogoOpacity(value[0] / 100)}
              className="py-2"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LogoUploader;
