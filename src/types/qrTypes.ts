
export type QRDataType = 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard';

export type QRErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QRDotType = 'square' | 'rounded';

export type QRCodeOptions = {
  data: string;
  dataType: QRDataType;
  foregroundColor: string;
  backgroundColor: string;
  size: number;
  dotType: QRDotType;
  errorCorrectionLevel: QRErrorCorrectionLevel;
  logoImage: string | null;
  logoWidth: number;
  logoHeight: number;
  logoOpacity: number;
};

export const DEFAULT_QR_OPTIONS: QRCodeOptions = {
  data: '',
  dataType: 'url',
  foregroundColor: '#000000',
  backgroundColor: '#FFFFFF',
  size: 300,
  dotType: 'square',
  errorCorrectionLevel: 'M',
  logoImage: null,
  logoWidth: 75,
  logoHeight: 75,
  logoOpacity: 1,
};

export type DataTypeOption = {
  id: QRDataType;
  label: string;
  placeholder: string;
  prefix?: string;
};

export const DATA_TYPE_OPTIONS: DataTypeOption[] = [
  { id: 'url', label: 'Website URL', placeholder: 'https://example.com' },
  { id: 'text', label: 'Text', placeholder: 'Enter your text here' },
  { id: 'email', label: 'Email', placeholder: 'name@example.com', prefix: 'mailto:' },
  { id: 'phone', label: 'Phone', placeholder: '+1234567890', prefix: 'tel:' },
  { id: 'wifi', label: 'Wi-Fi', placeholder: 'SSID' },
  { id: 'vcard', label: 'Contact Card', placeholder: 'Contact information' },
];
