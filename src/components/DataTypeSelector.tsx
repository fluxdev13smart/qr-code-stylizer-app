import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRDataType, DataTypeOption, DATA_TYPE_OPTIONS } from "@/types/qrTypes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parsePhoneWithCountryCode } from "@/lib/qrHelpers";
import { Wifi, Shield, Search } from "lucide-react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Country code data structure
interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

// Comprehensive list of country codes
const countryCodes: CountryCode[] = [
  { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
  { code: "+355", country: "Albania", flag: "🇦🇱" },
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+376", country: "Andorra", flag: "🇦🇩" },
  { code: "+244", country: "Angola", flag: "🇦🇴" },
  { code: "+1-268", country: "Antigua and Barbuda", flag: "🇦🇬" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+374", country: "Armenia", flag: "🇦🇲" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+994", country: "Azerbaijan", flag: "🇦🇿" },
  { code: "+1-242", country: "Bahamas", flag: "🇧🇸" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+1-246", country: "Barbados", flag: "🇧🇧" },
  { code: "+375", country: "Belarus", flag: "🇧🇾" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+501", country: "Belize", flag: "🇧🇿" },
  { code: "+229", country: "Benin", flag: "🇧🇯" },
  { code: "+975", country: "Bhutan", flag: "🇧🇹" },
  { code: "+591", country: "Bolivia", flag: "🇧🇴" },
  { code: "+387", country: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "+267", country: "Botswana", flag: "🇧🇼" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+673", country: "Brunei", flag: "🇧🇳" },
  { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
  { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
  { code: "+257", country: "Burundi", flag: "🇧🇮" },
  { code: "+855", country: "Cambodia", flag: "🇰🇭" },
  { code: "+237", country: "Cameroon", flag: "🇨🇲" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+238", country: "Cape Verde", flag: "🇨🇻" },
  { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
  { code: "+235", country: "Chad", flag: "🇹🇩" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+269", country: "Comoros", flag: "🇰🇲" },
  { code: "+242", country: "Congo (Republic)", flag: "🇨🇬" },
  { code: "+243", country: "Congo (DRC)", flag: "🇨🇩" },
  { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
  { code: "+385", country: "Croatia", flag: "🇭🇷" },
  { code: "+53", country: "Cuba", flag: "🇨🇺" },
  { code: "+357", country: "Cyprus", flag: "🇨🇾" },
  { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+253", country: "Djibouti", flag: "🇩🇯" },
  { code: "+1-767", country: "Dominica", flag: "🇩🇲" },
  { code: "+1-809", country: "Dominican Republic", flag: "🇩🇴" },
  { code: "+670", country: "East Timor", flag: "🇹🇱" },
  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+503", country: "El Salvador", flag: "🇸🇻" },
  { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "+291", country: "Eritrea", flag: "🇪🇷" },
  { code: "+372", country: "Estonia", flag: "🇪🇪" },
  { code: "+268", country: "Eswatini", flag: "🇸🇿" },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
  { code: "+679", country: "Fiji", flag: "🇫🇯" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+241", country: "Gabon", flag: "🇬🇦" },
  { code: "+220", country: "Gambia", flag: "🇬🇲" },
  { code: "+995", country: "Georgia", flag: "🇬🇪" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+1-473", country: "Grenada", flag: "🇬🇩" },
  { code: "+502", country: "Guatemala", flag: "🇬🇹" },
  { code: "+224", country: "Guinea", flag: "🇬🇳" },
  { code: "+245", country: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "+592", country: "Guyana", flag: "🇬🇾" },
  { code: "+509", country: "Haiti", flag: "🇭🇹" },
  { code: "+504", country: "Honduras", flag: "🇭🇳" },
  { code: "+36", country: "Hungary", flag: "🇭🇺" },
  { code: "+354", country: "Iceland", flag: "🇮🇸" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+98", country: "Iran", flag: "🇮🇷" },
  { code: "+964", country: "Iraq", flag: "🇮🇶" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+225", country: "Ivory Coast", flag: "🇨🇮" },
  { code: "+1-869", country: "Jamaica", flag: "🇯🇲" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+962", country: "Jordan", flag: "🇯🇴" },
  { code: "+7", country: "Kazakhstan", flag: "🇰🇿" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+686", country: "Kiribati", flag: "🇰🇮" },
  { code: "+850", country: "North Korea", flag: "🇰🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+383", country: "Kosovo", flag: "🇽🇰" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "+856", country: "Laos", flag: "🇱🇦" },
  { code: "+371", country: "Latvia", flag: "🇱🇻" },
  { code: "+961", country: "Lebanon", flag: "🇱🇧" },
  { code: "+266", country: "Lesotho", flag: "🇱🇸" },
  { code: "+231", country: "Liberia", flag: "🇱🇷" },
  { code: "+218", country: "Libya", flag: "🇱🇾" },
  { code: "+423", country: "Liechtenstein", flag: "🇱🇮" },
  { code: "+370", country: "Lithuania", flag: "🇱🇹" },
  { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
  { code: "+261", country: "Madagascar", flag: "🇲🇬" },
  { code: "+265", country: "Malawi", flag: "🇲🇼" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+960", country: "Maldives", flag: "🇲🇻" },
  { code: "+223", country: "Mali", flag: "🇲🇱" },
  { code: "+356", country: "Malta", flag: "🇲🇹" },
  { code: "+692", country: "Marshall Islands", flag: "🇲🇭" },
  { code: "+222", country: "Mauritania", flag: "🇲🇷" },
  { code: "+230", country: "Mauritius", flag: "🇲🇺" },
  { code: "+52", country: "Mexico", flag: "🇲��" },
  { code: "+691", country: "Micronesia", flag: "🇫🇲" },
  { code: "+373", country: "Moldova", flag: "🇲🇩" },
  { code: "+377", country: "Monaco", flag: "🇲🇨" },
  { code: "+976", country: "Mongolia", flag: "🇲🇳" },
  { code: "+382", country: "Montenegro", flag: "🇲🇪" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+258", country: "Mozambique", flag: "🇲🇿" },
  { code: "+95", country: "Myanmar", flag: "🇲🇲" },
  { code: "+264", country: "Namibia", flag: "🇳🇦" },
  { code: "+674", country: "Nauru", flag: "🇳🇷" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
  { code: "+227", country: "Niger", flag: "🇳🇪" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+389", country: "North Macedonia", flag: "🇲🇰" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+680", country: "Palau", flag: "🇵🇼" },
  { code: "+970", country: "Palestine", flag: "🇵🇸" },
  { code: "+507", country: "Panama", flag: "🇵🇦" },
  { code: "+675", country: "Papua New Guinea", flag: "🇵🇬" },
  { code: "+595", country: "Paraguay", flag: "🇵🇾" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+40", country: "Romania", flag: "🇷🇴" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+250", country: "Rwanda", flag: "🇷🇼" },
  { code: "+1-869", country: "Saint Kitts and Nevis", flag: "🇰🇳" },
  { code: "+1-758", country: "Saint Lucia", flag: "🇱🇨" },
  { code: "+1-784", country: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
  { code: "+685", country: "Samoa", flag: "🇼🇸" },
  { code: "+378", country: "San Marino", flag: "🇸🇲" },
  { code: "+239", country: "São Tomé and Príncipe", flag: "🇸🇹" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+221", country: "Senegal", flag: "🇸🇳" },
  { code: "+381", country: "Serbia", flag: "🇷🇸" },
  { code: "+248", country: "Seychelles", flag: "🇸🇨" },
  { code: "+232", country: "Sierra Leone", flag: "🇸🇱" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+421", country: "Slovakia", flag: "🇸🇰" },
  { code: "+386", country: "Slovenia", flag: "🇸🇮" },
  { code: "+677", country: "Solomon Islands", flag: "🇸🇧" },
  { code: "+252", country: "Somalia", flag: "🇸🇴" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+211", country: "South Sudan", flag: "🇸🇸" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+249", country: "Sudan", flag: "🇸🇩" },
  { code: "+597", country: "Suriname", flag: "🇸🇷" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+963", country: "Syria", flag: "🇸🇾" },
  { code: "+886", country: "Taiwan", flag: "🇹🇼" },
  { code: "+992", country: "Tajikistan", flag: "🇹🇯" },
  { code: "+255", country: "Tanzania", flag: "🇹🇿" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+228", country: "Togo", flag: "🇹🇬" },
  { code: "+676", country: "Tonga", flag: "🇹🇴" },
  { code: "+1-868", country: "Trinidad and Tobago", flag: "🇹🇹" },
  { code: "+216", country: "Tunisia", flag: "🇹🇳" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
  { code: "+688", country: "Tuvalu", flag: "🇹🇻" },
  { code: "+256", country: "Uganda", flag: "🇺🇬" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+598", country: "Uruguay", flag: "🇺🇾" },
  { code: "+998", country: "Uzbekistan", flag: "🇺🇿" },
  { code: "+678", country: "Vanuatu", flag: "🇻🇺" },
  { code: "+379", country: "Vatican City", flag: "🇻🇦" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+967", country: "Yemen", flag: "🇾🇪" },
  { code: "+260", country: "Zambia", flag: "🇿🇲" },
  { code: "+263", country: "Zimbabwe", flag: "🇿🇼" }
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
  
  // State for country code search
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCodes, setFilteredCodes] = useState(countryCodes);

  // Update filtered codes when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCodes(countryCodes);
      return;
    }
    
    const filtered = countryCodes.filter(country => 
      country.country.toLowerCase().includes(searchQuery.toLowerCase()) || 
      country.code.includes(searchQuery)
    );
    
    setFilteredCodes(filtered);
  }, [searchQuery]);

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
                open,
                setOpen,
                searchQuery,
                setSearchQuery,
                filteredCodes
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

interface ExtendedInputStateProps extends InputStateProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCodes: CountryCode[];
}

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
  state: ExtendedInputStateProps,
  handlers: InputUpdateProps
) => {
  const renderCountryCodeSelector = (
    value: string,
    onChange: (code: string) => void,
    id: string = "country-code"
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id}>Country Code</Label>
      <div className="relative">
        <div className="flex items-center">
          <Popover open={state.open} onOpenChange={state.setOpen}>
            <PopoverTrigger asChild>
              <div className="flex items-center w-full px-3 py-2 border rounded-md cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                <span className="mr-1">
                  {countryCodes.find(c => c.code === value)?.flag || "🌍"}
                </span>
                <span>{value}</span>
                <span className="ml-2 text-muted-foreground text-sm flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {countryCodes.find(c => c.code === value)?.country || ""}
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <Command>
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandInput 
                    placeholder="Search country..." 
                    value={state.searchQuery}
                    onValueChange={state.setSearchQuery}
                    className="h-9"
                  />
                </div>
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-auto">
                    {state.filteredCodes.map((country) => (
                      <CommandItem
                        key={country.code + country.country}
                        value={country.country + country.code}
                        onSelect={() => {
                          onChange(country.code);
                          state.setOpen(false);
                          state.setSearchQuery("");
                        }}
                        className="flex items-center"
                      >
                        <span className="mr-2 text-lg">{country.flag}</span>
                        <span>{country.country}</span>
                        <span className="ml-auto text-muted-foreground">{country.code}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );

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
          {renderCountryCodeSelector(state.phoneCountryCode, handlers.setPhoneCountryCode)}

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
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center px-3 py-2 border rounded-md cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="mr-1">
                      {countryCodes.find(c => c.code === state.contactCountryCode)?.flag || "🌍"}
                    </span>
                    <span className="text-sm truncate">{state.contactCountryCode}</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                  <Command>
                    <div className="flex items-center border-b px-3">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <CommandInput 
                        placeholder="Search country..." 
                        value={state.searchQuery}
                        onValueChange={state.setSearchQuery}
                        className="h-9"
                      />
                    </div>
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {state.filteredCodes.map((country) => (
                          <CommandItem
                            key={country.code + country.country}
                            value={country.country + country.code}
                            onSelect={() => {
                              handlers.setContactCountryCode(country.code);
                              state.setSearchQuery("");
                            }}
                            className="flex items-center"
                          >
                            <span className="mr-2 text-lg">{country.flag}</span>
                            <span>{country.country}</span>
                            <span className="ml-auto text-muted-foreground">{country.code}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
