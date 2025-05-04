
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRDataType, DataTypeOption, DATA_TYPE_OPTIONS } from "@/types/qrTypes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DataTypeSelectorProps {
  dataType: QRDataType;
  data: string;
  onDataTypeChange: (type: QRDataType) => void;
  onDataChange: (data: string) => void;
}

const DataTypeSelector = ({
  dataType,
  data,
  onDataTypeChange,
  onDataChange,
}: DataTypeSelectorProps) => {
  const handleDataTypeChange = (value: string) => {
    onDataTypeChange(value as QRDataType);
  };

  const selectedOption = DATA_TYPE_OPTIONS.find(option => option.id === dataType) || DATA_TYPE_OPTIONS[0];

  return (
    <div className="space-y-4">
      <Tabs defaultValue={dataType} value={dataType} onValueChange={handleDataTypeChange}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6">
          {DATA_TYPE_OPTIONS.map((option) => (
            <TabsTrigger key={option.id} value={option.id}>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {DATA_TYPE_OPTIONS.map((option) => (
          <TabsContent key={option.id} value={option.id} className="mt-4">
            {renderInputForType(option, data, onDataChange)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const renderInputForType = (
  option: DataTypeOption,
  data: string,
  onDataChange: (data: string) => void
) => {
  switch (option.id) {
    case 'text':
      return (
        <div className="space-y-2">
          <Label htmlFor="text-input">Enter Text</Label>
          <Textarea
            id="text-input"
            placeholder={option.placeholder}
            value={data}
            onChange={(e) => onDataChange(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
      );
    case 'url':
      return (
        <div className="space-y-2">
          <Label htmlFor="url-input">Website URL</Label>
          <Input
            id="url-input"
            placeholder="QRcodeSt.vercel.app"
            value={data}
            onChange={(e) => onDataChange(e.target.value)}
          />
        </div>
      );
    case 'vcard':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name-input">Full Name</Label>
            <Input
              id="name-input"
              placeholder="John Doe"
              value={data}
              onChange={(e) => onDataChange(e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500">
            Note: This is a simplified version. Full vCard support coming soon.
          </p>
        </div>
      );
    case 'wifi':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ssid-input">Network Name (SSID)</Label>
            <Input
              id="ssid-input"
              placeholder={option.placeholder}
              value={data}
              onChange={(e) => onDataChange(e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500">
            Note: Password protection coming soon.
          </p>
        </div>
      );
    default:
      return (
        <div className="space-y-2">
          <Label htmlFor={`${option.id}-input`}>{option.label}</Label>
          <Input
            id={`${option.id}-input`}
            placeholder={option.placeholder}
            value={data}
            onChange={(e) => onDataChange(e.target.value)}
          />
        </div>
      );
  }
};

export default DataTypeSelector;
