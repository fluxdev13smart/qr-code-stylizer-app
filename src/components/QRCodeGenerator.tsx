
import { useState, useEffect } from "react";
import DataTypeSelector from "./DataTypeSelector";
import QRCodePreview from "./QRCodePreview";
import CustomizationPanel from "./CustomizationPanel";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { QRCodeOptions, DEFAULT_QR_OPTIONS, QRDataType } from "@/types/qrTypes";
import { validateQRData } from "@/lib/qrHelpers";

const QRCodeGenerator = () => {
  const [options, setOptions] = useState<QRCodeOptions>({
    ...DEFAULT_QR_OPTIONS,
    data: 'pixelsnap.vercel.app',
  });
  
  const [isValid, setIsValid] = useState(true);
  
  useEffect(() => {
    const valid = validateQRData(options.data, options.dataType);
    setIsValid(valid);
    
    if (!valid && options.data) {
      toast.warning("Please enter valid data for the selected type");
    }
  }, [options.data, options.dataType]);
  
  const handleDataTypeChange = (dataType: QRDataType) => {
    setOptions((prev) => ({ ...prev, dataType, data: '' }));
  };
  
  const handleDataChange = (data: string) => {
    setOptions((prev) => ({ ...prev, data }));
  };
  
  const handleOptionsChange = (newOptions: Partial<QRCodeOptions>) => {
    // Special handling for overlay type changes to ensure proper setup
    if (newOptions.overlayType && newOptions.overlayType !== options.overlayType) {
      // Clear logo when switching to text or emoji
      if (newOptions.overlayType === 'text' || newOptions.overlayType === 'emoji') {
        newOptions.logoImage = null;
      }
      
      // Ensure high error correction when using overlays
      if (options.errorCorrectionLevel !== 'H') {
        newOptions.errorCorrectionLevel = 'H';
        toast.info("Error correction level set to High for best overlay compatibility");
      }
    }
    
    setOptions((prev) => ({ ...prev, ...newOptions }));
  };

  // Listen for the custom event to switch to vcard tab
  useEffect(() => {
    const switchToVcardHandler = () => {
      setOptions((prev) => ({ ...prev, dataType: 'vcard' }));
    };
    
    document.addEventListener('switchToVcard', switchToVcardHandler);
    
    return () => {
      document.removeEventListener('switchToVcard', switchToVcardHandler);
    };
  }, []);
  
  return (
    <div className="w-full space-y-8 animate-fade-in">
      <Card className="glass-card backdrop-blur-md bg-white/40 border-white/20 shadow-lg animate-float">
        <CardContent className="p-6">
          <DataTypeSelector
            dataType={options.dataType}
            data={options.data}
            onDataTypeChange={handleDataTypeChange}
            onDataChange={handleDataChange}
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <QRCodePreview options={options} />
        <CustomizationPanel
          options={options}
          onOptionsChange={handleOptionsChange}
        />
      </div>
    </div>
  );
};

export default QRCodeGenerator;
