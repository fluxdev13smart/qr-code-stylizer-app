
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ColorPicker from "./ColorPicker";
import LogoUploader from "./LogoUploader";
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

  const handleLogoChange = (logo: string | null) => {
    onOptionsChange({ logoImage: logo });
  };

  const handleLogoSizeChange = (size: number) => {
    onOptionsChange({ logoWidth: size, logoHeight: size });
  };

  const handleLogoOpacityChange = (opacity: number) => {
    onOptionsChange({ logoOpacity: opacity });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Customize QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ColorPicker 
            color={options.foregroundColor}
            onChange={handleForegroundColorChange}
            label="Foreground Color"
          />
          <ColorPicker 
            color={options.backgroundColor}
            onChange={handleBackgroundColorChange}
            label="Background Color"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Size: {options.size}px</Label>
          <Slider
            value={[options.size]}
            min={100}
            max={500}
            step={10}
            onValueChange={handleSizeChange}
            className="py-2"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Dot Style</Label>
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
        
        <div className="space-y-2">
          <Label>Error Correction Level</Label>
          <Select value={options.errorCorrectionLevel} onValueChange={handleErrorCorrectionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select error correction level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Low (7%)</SelectItem>
              <SelectItem value="M">Medium (15%)</SelectItem>
              <SelectItem value="Q">Quartile (25%)</SelectItem>
              <SelectItem value="H">High (30%)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Higher levels allow more damage but increase QR code size
          </p>
        </div>
        
        <div className="space-y-2">
          <Label>Logo</Label>
          <LogoUploader
            logo={options.logoImage}
            setLogo={handleLogoChange}
            logoSize={options.logoWidth}
            setLogoSize={handleLogoSizeChange}
            logoOpacity={options.logoOpacity}
            setLogoOpacity={handleLogoOpacityChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomizationPanel;
