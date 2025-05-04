
import { QRCodeOptions, QRDataType } from "@/types/qrTypes";

export const formatQRData = (options: QRCodeOptions): string => {
  const { data, dataType } = options;
  
  if (!data) return '';
  
  switch (dataType) {
    case 'url':
      return data.startsWith('http') ? data : `https://${data}`;
    
    case 'email':
      return data.startsWith('mailto:') ? data : `mailto:${data}`;
    
    case 'phone':
      return data.startsWith('tel:') ? data : `tel:${data}`;
    
    case 'wifi':
      // Simple WIFI format, can be expanded to include password, security type, etc.
      return `WIFI:S:${data};;`;
    
    case 'vcard':
      // Simple vCard format for now
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${data}\nEND:VCARD`;
    
    case 'text':
    default:
      return data;
  }
};

export const validateQRData = (data: string, dataType: QRDataType): boolean => {
  if (!data) return false;
  
  switch (dataType) {
    case 'url':
      // Basic URL validation
      try {
        new URL(data.startsWith('http') ? data : `https://${data}`);
        return true;
      } catch (e) {
        return false;
      }
    
    case 'email':
      // Basic email validation
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data);
    
    case 'phone':
      // Basic phone validation - allows for various formats
      return /^[+]?[\d\s-()]{5,20}$/.test(data);
    
    case 'wifi':
      // At least need an SSID
      return data.trim().length > 0;
    
    case 'vcard':
      // At least need a name
      return data.trim().length > 0;
    
    case 'text':
    default:
      return data.trim().length > 0;
  }
};

export const downloadQRCode = (dataUrl: string, format = 'png'): void => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `qrcode-${Date.now()}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
