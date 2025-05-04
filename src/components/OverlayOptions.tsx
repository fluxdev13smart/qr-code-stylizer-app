
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import EnhancedColorPicker from "./EnhancedColorPicker";
import LogoUploader from "./LogoUploader";
import EmojiPicker from "./EmojiPicker";
import { QRCodeOptions, QRFontFamily, QRFontWeight, QROverlayType } from "@/types/qrTypes";

interface OverlayOptionsProps {
  options: QRCodeOptions;
  onOptionsChange: (options: Partial<QRCodeOptions>) => void;
}

const OverlayOptions = ({ options, onOptionsChange }: OverlayOptionsProps) => {
  const handleOverlayTypeChange = (value: QROverlayType) => {
    onOptionsChange({ overlayType: value });
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

  const handleOverlayTextChange = (text: string) => {
    onOptionsChange({ overlayText: text });
  };

  const handleOverlayFontFamilyChange = (fontFamily: QRFontFamily) => {
    onOptionsChange({ overlayFontFamily: fontFamily });
  };

  const handleOverlayFontSizeChange = (value: number[]) => {
    onOptionsChange({ overlayFontSize: value[0] });
  };

  const handleOverlayFontWeightChange = (weight: QRFontWeight) => {
    onOptionsChange({ overlayFontWeight: weight });
  };

  const handleOverlayFontColorChange = (color: string) => {
    onOptionsChange({ overlayFontColor: color });
  };

  const handleEmojiChange = (emoji: string) => {
    onOptionsChange({ overlayEmoji: emoji });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Overlay Type</Label>
        <RadioGroup
          value={options.overlayType}
          onValueChange={(value) => handleOverlayTypeChange(value as QROverlayType)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="logo" id="overlay-logo" />
            <Label htmlFor="overlay-logo">Logo/Image</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="text" id="overlay-text" />
            <Label htmlFor="overlay-text">Text</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="emoji" id="overlay-emoji" />
            <Label htmlFor="overlay-emoji">Emoji</Label>
          </div>
        </RadioGroup>
      </div>

      <Tabs value={options.overlayType} onValueChange={(value) => handleOverlayTypeChange(value as QROverlayType)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="emoji">Emoji</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logo" className="space-y-4 animate-fade-in">
          <LogoUploader
            logo={options.logoImage}
            setLogo={handleLogoChange}
            logoSize={options.logoWidth}
            setLogoSize={handleLogoSizeChange}
            logoOpacity={options.logoOpacity}
            setLogoOpacity={handleLogoOpacityChange}
          />
        </TabsContent>
        
        <TabsContent value="text" className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Label>Text Content</Label>
            <Input
              value={options.overlayText}
              onChange={(e) => handleOverlayTextChange(e.target.value)}
              placeholder="Enter text for overlay"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select 
              value={options.overlayFontFamily} 
              onValueChange={(value) => handleOverlayFontFamilyChange(value as QRFontFamily)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
                <SelectItem value="Impact">Impact</SelectItem>
                <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Font Size: {options.overlayFontSize}px</Label>
            <Slider
              value={[options.overlayFontSize]}
              min={10}
              max={60}
              step={1}
              onValueChange={handleOverlayFontSizeChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Font Weight</Label>
            <Select 
              value={options.overlayFontWeight} 
              onValueChange={(value) => handleOverlayFontWeightChange(value as QRFontWeight)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="300">Light</SelectItem>
                <SelectItem value="400">Regular</SelectItem>
                <SelectItem value="500">Medium</SelectItem>
                <SelectItem value="600">Semi-Bold</SelectItem>
                <SelectItem value="700">Bold</SelectItem>
                <SelectItem value="800">Extra-Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Font Color</Label>
            <EnhancedColorPicker
              color={options.overlayFontColor}
              onChange={handleOverlayFontColorChange}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="emoji" className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Label>Select Emoji</Label>
            <EmojiPicker 
              selectedEmoji={options.overlayEmoji} 
              onEmojiSelect={handleEmojiChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Emoji Size: {options.overlayFontSize}px</Label>
            <Slider
              value={[options.overlayFontSize]}
              min={20}
              max={80}
              step={1}
              onValueChange={handleOverlayFontSizeChange}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OverlayOptions;
