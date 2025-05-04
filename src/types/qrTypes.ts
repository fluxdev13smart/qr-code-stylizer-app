
export type QRDataType = 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard';

export type QRErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QRDotType = 'square' | 'rounded';

export type QROverlayType = 'logo' | 'text' | 'emoji';

export type QRFontFamily = 
  'Arial' | 
  'Helvetica' | 
  'Georgia' | 
  'Times New Roman' | 
  'Courier New' | 
  'Verdana' | 
  'Impact' | 
  'Comic Sans MS';

export type QRFontWeight = '300' | '400' | '500' | '600' | '700' | '800';

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
  // New overlay options
  overlayType: QROverlayType;
  overlayText: string;
  overlayEmoji: string;
  overlayFontFamily: QRFontFamily;
  overlayFontSize: number;
  overlayFontWeight: QRFontWeight;
  overlayFontColor: string;
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
  // Default overlay options
  overlayType: 'logo',
  overlayText: 'QR',
  overlayEmoji: '😀',
  overlayFontFamily: 'Arial',
  overlayFontSize: 32,
  overlayFontWeight: '700',
  overlayFontColor: '#000000',
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
