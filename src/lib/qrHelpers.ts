
import { QRCodeOptions, QRDataType } from "@/types/qrTypes";

export const formatQRData = (options: QRCodeOptions): string => {
  const { data, dataType } = options;
  
  if (!data) return '';
  
  switch (dataType) {
    case 'url':
      return data.startsWith('http') ? data : `https://${data}`;
    
    case 'email':
      return data.startsWith('mailto:') ? data : `mailto:${data}`;
    
    case 'phone': {
      // Handle country code if present
      const phoneData = typeof data === 'string' ? data : JSON.stringify(data);
      let formattedPhone = '';
      
      try {
        // Check if data is JSON with country code and number
        const phoneObj = JSON.parse(phoneData);
        formattedPhone = phoneObj.countryCode + phoneObj.number;
      } catch (e) {
        // Fallback to simple string if not JSON
        formattedPhone = phoneData;
      }
      
      return formattedPhone.startsWith('tel:') ? formattedPhone : `tel:${formattedPhone}`;
    }
    
    case 'wifi': {
      // Parse wifi data for enhanced format with password
      const wifiData = typeof data === 'string' ? data : JSON.stringify(data);
      let ssid = '';
      let password = '';
      
      try {
        // Check if data is JSON with ssid and password
        const wifiObj = JSON.parse(wifiData);
        ssid = wifiObj.ssid || '';
        password = wifiObj.password || '';
      } catch (e) {
        // Fallback to simple string if not JSON
        ssid = wifiData;
      }
      
      // WIFI format: WIFI:S:<SSID>;T:<WPA|WEP|>;P:<password>;;
      return `WIFI:S:${ssid};T:WPA;P:${password};;`;
    }
    
    case 'vcard': {
      // Parse vCard data for enhanced format with phone
      const vcardData = typeof data === 'string' ? data : JSON.stringify(data);
      let name = '';
      let phone = '';
      let countryCode = '';
      
      try {
        // Check if data is JSON with name and phone
        const vcardObj = JSON.parse(vcardData);
        name = vcardObj.name || '';
        phone = vcardObj.phone || '';
        countryCode = vcardObj.countryCode || '';
      } catch (e) {
        // Fallback to simple string if not JSON
        name = vcardData;
      }
      
      // Format phone with country code if available
      const formattedPhone = countryCode && phone ? `${countryCode}${phone}` : phone;
      
      // Create vCard format
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\n${formattedPhone ? `TEL:${formattedPhone}\n` : ''}END:VCARD`;
    }
    
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
    
    case 'phone': {
      // Enhanced phone validation
      try {
        // Check if data is JSON with country code and number
        const phoneObj = JSON.parse(data);
        return /^[+]?[\d]{1,4}$/.test(phoneObj.countryCode) && 
               /^[\d\s-()]{5,15}$/.test(phoneObj.number);
      } catch (e) {
        // Fallback to simple string validation
        return /^[+]?[\d\s-()]{5,20}$/.test(data);
      }
    }
    
    case 'wifi': {
      // Enhanced wifi validation with password
      try {
        // Check if data is JSON with ssid and password
        const wifiObj = JSON.parse(data);
        return wifiObj.ssid && wifiObj.ssid.trim().length > 0;
      } catch (e) {
        // Fallback to simple string validation
        return data.trim().length > 0;
      }
    }
    
    case 'vcard': {
      // Enhanced vcard validation with phone
      try {
        // Check if data is JSON with name and phone
        const vcardObj = JSON.parse(data);
        return vcardObj.name && vcardObj.name.trim().length > 0;
      } catch (e) {
        // Fallback to simple string validation
        return data.trim().length > 0;
      }
    }
    
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

// Helper to parse country code and phone number from a string
export const parsePhoneWithCountryCode = (phone: string): { countryCode: string; number: string } => {
  // Simple regex to extract country code (starting with + and 1-4 digits)
  const match = phone.match(/^(\+\d{1,4})([\d\s-()]{5,15})$/);
  if (match) {
    return {
      countryCode: match[1],
      number: match[2].trim()
    };
  }
  return {
    countryCode: '',
    number: phone.trim()
  };
};
