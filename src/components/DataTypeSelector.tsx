
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRDataType, DataTypeOption, DATA_TYPE_OPTIONS } from "@/types/qrTypes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parsePhoneWithCountryCode } from "@/lib/qrHelpers";
import { Shield, Wifi } from "lucide-react";

// Country code data structure
interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

// Common country codes
const countryCodes: CountryCode[] = [
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
];

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
  // Internal state for complex data types
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactCountryCode, setContactCountryCode] = useState("+1");

  // Initialize form data when data type changes
  useEffect(() => {
    if (dataType === "wifi") {
      try {
        const wifiData = JSON.parse(data || '{"ssid":"","password":""}');
        setWifiSSID(wifiData.ssid || "");
        setWifiPassword(wifiData.password || "");
      } catch (e) {
        setWifiSSID(data || "");
        setWifiPassword("");
      }
    } else if (dataType === "phone") {
      try {
        const phoneData = JSON.parse(data || '{"countryCode":"+1","number":""}');
        setPhoneCountryCode(phoneData.countryCode || "+1");
        setPhoneNumber(phoneData.number || "");
      } catch (e) {
        const { countryCode, number } = parsePhoneWithCountryCode(data);
        setPhoneCountryCode(countryCode || "+1");
        setPhoneNumber(number || "");
      }
    } else if (dataType === "vcard") {
      try {
        const vcardData = JSON.parse(data || '{"name":"","phone":"","countryCode":"+1"}');
        setContactName(vcardData.name || "");
        setContactPhone(vcardData.phone || "");
        setContactCountryCode(vcardData.countryCode || "+1");
      } catch (e) {
        setContactName(data || "");
        setContactPhone("");
        setContactCountryCode("+1");
      }
    }
  }, [dataType, data]);

  const handleDataTypeChange = (value: string) => {
    onDataTypeChange(value as QRDataType);
  };

  // Update parent component with complex data when fields change
  useEffect(() => {
    if (dataType === "wifi" && (wifiSSID || wifiPassword)) {
      const wifiData = { ssid: wifiSSID, password: wifiPassword };
      onDataChange(JSON.stringify(wifiData));
    } else if (dataType === "phone" && (phoneCountryCode || phoneNumber)) {
      const phoneData = { countryCode: phoneCountryCode, number: phoneNumber };
      onDataChange(JSON.stringify(phoneData));
    } else if (dataType === "vcard" && (contactName || contactPhone)) {
      const vcardData = {
        name: contactName,
        phone: contactPhone,
        countryCode: contactCountryCode,
      };
      onDataChange(JSON.stringify(vcardData));
    }
  }, [
    dataType,
    wifiSSID,
    wifiPassword,
    phoneCountryCode,
    phoneNumber,
    contactName,
    contactPhone,
    contactCountryCode,
  ]);

  const selectedOption =
    DATA_TYPE_OPTIONS.find((option) => option.id === dataType) ||
    DATA_TYPE_OPTIONS[0];

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue={dataType}
        value={dataType}
        onValueChange={handleDataTypeChange}
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-6">
          {DATA_TYPE_OPTIONS.map((option) => (
            <TabsTrigger key={option.id} value={option.id}>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {DATA_TYPE_OPTIONS.map((option) => (
          <TabsContent key={option.id} value={option.id} className="mt-4">
            {renderInputForType(
              option,
              {
                data,
                wifiSSID,
                wifiPassword,
                phoneCountryCode,
                phoneNumber,
                contactName,
                contactPhone,
                contactCountryCode,
              },
              {
                setWifiSSID,
                setWifiPassword,
                setPhoneCountryCode,
                setPhoneNumber,
                setContactName,
                setContactPhone,
                setContactCountryCode,
                onDataChange,
              }
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

interface InputStateProps {
  data: string;
  wifiSSID: string;
  wifiPassword: string;
  phoneCountryCode: string;
  phoneNumber: string;
  contactName: string;
  contactPhone: string;
  contactCountryCode: string;
}

interface InputUpdateProps {
  setWifiSSID: (ssid: string) => void;
  setWifiPassword: (password: string) => void;
  setPhoneCountryCode: (code: string) => void;
  setPhoneNumber: (number: string) => void;
  setContactName: (name: string) => void;
  setContactPhone: (phone: string) => void;
  setContactCountryCode: (code: string) => void;
  onDataChange: (data: string) => void;
}

const renderInputForType = (
  option: DataTypeOption,
  state: InputStateProps,
  handlers: InputUpdateProps
) => {
  switch (option.id) {
    case "text":
      return (
        <div className="space-y-2">
          <Label htmlFor="text-input">Enter Text</Label>
          <Textarea
            id="text-input"
            placeholder={option.placeholder}
            value={state.data}
            onChange={(e) => handlers.onDataChange(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
      );

    case "url":
      return (
        <div className="space-y-2">
          <Label htmlFor="url-input">Website URL</Label>
          <Input
            id="url-input"
            placeholder="QRcodeSt.vercel.app"
            value={state.data}
            onChange={(e) => handlers.onDataChange(e.target.value)}
          />
        </div>
      );

    case "phone":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country-code">Country Code</Label>
            <Select
              value={state.phoneCountryCode}
              onValueChange={handlers.setPhoneCountryCode}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select country code" />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center">
                      <span className="mr-2">{country.flag}</span>
                      <span>{country.country}</span>
                      <span className="ml-2 text-muted-foreground">
                        {country.code}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone-input">Phone Number</Label>
            <div className="flex items-center space-x-2">
              <div className="flex items-center px-3 py-2 border rounded-md bg-muted/30">
                <span className="mr-1">
                  {
                    countryCodes.find(
                      (c) => c.code === state.phoneCountryCode
                    )?.flag || "🌍"
                  }
                </span>
                <span>{state.phoneCountryCode}</span>
              </div>
              <Input
                id="phone-input"
                placeholder="123456789"
                value={state.phoneNumber}
                onChange={(e) => handlers.setPhoneNumber(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="mt-4 p-3 border border-muted rounded-md bg-muted/10">
            <p className="text-sm text-muted-foreground">
              Looking for more contact information? Try the{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const phoneData = {
                    countryCode: state.phoneCountryCode,
                    number: state.phoneNumber,
                  };
                  
                  // Pre-fill contact card with phone data
                  handlers.setContactCountryCode(state.phoneCountryCode);
                  handlers.setContactPhone(state.phoneNumber);
                  
                  // Switch to vcard tab
                  const vcardData = {
                    name: "",
                    phone: state.phoneNumber,
                    countryCode: state.phoneCountryCode,
                  };
                  handlers.onDataChange(JSON.stringify(vcardData));
                  
                  const event = new CustomEvent("switchToVcard");
                  document.dispatchEvent(event);
                }}
                className="text-primary underline"
              >
                Contact Card
              </a>{" "}
              option to include more details.
            </p>
          </div>
        </div>
      );

    case "vcard":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name-input">Full Name</Label>
            <Input
              id="name-input"
              placeholder="John Doe"
              value={state.contactName}
              onChange={(e) => handlers.setContactName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-phone">Phone Number</Label>
            <div className="grid grid-cols-4 gap-2">
              <Select
                value={state.contactCountryCode}
                onValueChange={handlers.setContactCountryCode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Code" />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="flex items-center">
                        <span className="mr-1">{country.flag}</span>
                        <span>{country.code}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="contact-phone"
                placeholder="123456789"
                value={state.contactPhone}
                onChange={(e) => handlers.setContactPhone(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
        </div>
      );

    case "wifi":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wifi size={18} className="text-muted-foreground" />
              <Label htmlFor="ssid-input">Network Name (SSID)</Label>
            </div>
            <Input
              id="ssid-input"
              placeholder={option.placeholder}
              value={state.wifiSSID}
              onChange={(e) => handlers.setWifiSSID(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-muted-foreground" />
              <Label htmlFor="password-input">Password</Label>
            </div>
            <Input
              id="password-input"
              type="password"
              placeholder="Enter WiFi password"
              value={state.wifiPassword}
              onChange={(e) => handlers.setWifiPassword(e.target.value)}
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <Label htmlFor={`${option.id}-input`}>{option.label}</Label>
          <Input
            id={`${option.id}-input`}
            placeholder={option.placeholder}
            value={state.data}
            onChange={(e) => handlers.onDataChange(e.target.value)}
          />
        </div>
      );
  }
};

export default DataTypeSelector;
