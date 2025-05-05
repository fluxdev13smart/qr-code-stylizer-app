
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EnhancedColorPicker from "./EnhancedColorPicker";
import OverlayOptions from "./OverlayOptions";
import { QRCodeOptions, QRDotType, QRErrorCorrectionLevel } from "@/types/qrTypes";

interface CustomizationPanelProps {
  options: QRCodeOptions;
  onOptionsChange: (options: Partial<QRCodeOptions>) => void;
}

const CustomizationPanel = ({ options, onOptionsChange }: CustomizationPanelProps) => {
  const handleForegroundColorChange = (color: string) => {
    onOptionsChange({ foregroundColor: color });
  };

  const handleBackgroundColorChange = (color: string) => {
    onOptionsChange({ backgroundColor: color });
  };

  const handleSizeChange = (value: number[]) => {
    onOptionsChange({ size: value[0] });
  };

  const handleDotTypeChange = (value: string) => {
    onOptionsChange({ dotType: value as QRDotType });
  };

  const handleErrorCorrectionChange = (value: string) => {
    onOptionsChange({ errorCorrectionLevel: value as QRErrorCorrectionLevel });
  };

  return (
    <Card className="w-full glass-card backdrop-blur-md bg-white/30 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-qr-purple/20 to-qr-dark-purple/20 rounded-t-lg">
        <CardTitle className="text-shadow text-qr-purple">Customize QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EnhancedColorPicker 
            color={options.foregroundColor}
            onChange={handleForegroundColorChange}
            label="Foreground Color"
          />
          <EnhancedColorPicker 
            color={options.backgroundColor}
            onChange={handleBackgroundColorChange}
            label="Background Color"
          />
        </div>
        
        <div className="space-y-2 bg-white/20 p-4 rounded-lg">
          <Label className="text-shadow">Size: {options.size}px</Label>
          <Slider
            value={[options.size]}
            min={100}
            max={500}
            step={10}
            onValueChange={handleSizeChange}
            className="py-2"
          />
        </div>
        
        <div className="space-y-2 bg-white/20 p-4 rounded-lg">
          <Label className="text-shadow">Dot Style</Label>
          <RadioGroup
            value={options.dotType}
            onValueChange={handleDotTypeChange}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="square" id="dot-square" />
              <Label htmlFor="dot-square">Square</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rounded" id="dot-rounded" />
              <Label htmlFor="dot-rounded">Rounded</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2 bg-white/20 p-4 rounded-lg">
          <Label className="text-shadow">Error Correction Level</Label>
          <Select value={options.errorCorrectionLevel} onValueChange={handleErrorCorrectionChange}>
            <SelectTrigger className="bg-white/50">
              <SelectValue placeholder="Select error correction level" />
            </SelectTrigger>
            <SelectContent className="bg-white/90">
              <SelectItem value="L">Low (7%)</SelectItem>
              <SelectItem value="M">Medium (15%)</SelectItem>
              <SelectItem value="Q">Quartile (25%)</SelectItem>
              <SelectItem value="H">High (30%)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-700 mt-1">
            Higher levels allow more damage but increase QR code size
          </p>
        </div>
        
        <div className="space-y-2 bg-white/20 p-4 rounded-lg animate-pulse-light">
          <Label className="text-shadow">Overlay Options</Label>
          <OverlayOptions
            options={options}
            onOptionsChange={onOptionsChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomizationPanel;
