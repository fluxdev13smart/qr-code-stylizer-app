
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
    data: 'https://lovable.dev',
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
    setOptions((prev) => ({ ...prev, ...newOptions }));
  };
  
  return (
    <div className="w-full space-y-8 animate-fade-in">
      <Card>
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
