
import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Image } from "lucide-react";
import { toast } from "sonner";
import QRCodeStyling from "qr-code-styling";
import { QRCodeOptions } from "@/types/qrTypes";
import { downloadQRCode, formatQRData } from "@/lib/qrHelpers";

interface QRCodePreviewProps {
  options: QRCodeOptions;
}

const QRCodePreview = ({ options }: QRCodePreviewProps) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);
  
  useEffect(() => {
    if (!qrRef.current) return;
    
    const formattedData = formatQRData(options);
    if (!formattedData) return;
    
    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling({
        width: options.size,
        height: options.size,
        type: "svg",
        data: formattedData,
        dotsOptions: {
          color: options.foregroundColor,
          type: options.dotType,
        },
        cornersSquareOptions: {
          color: options.foregroundColor,
          type: options.dotType === "rounded" ? "extra-rounded" : "square", 
        },
        cornersDotOptions: {
          color: options.foregroundColor,
          type: options.dotType === "rounded" ? "dot" : "square",
        },
        backgroundOptions: {
          color: options.backgroundColor,
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 5,
        },
        qrOptions: {
          errorCorrectionLevel: options.errorCorrectionLevel,
        },
      });
      
      qrCode.current.append(qrRef.current);
    } else {
      qrCode.current.update({
        data: formattedData,
        width: options.size,
        height: options.size,
        dotsOptions: {
          color: options.foregroundColor,
          type: options.dotType,
        },
        cornersSquareOptions: {
          color: options.foregroundColor,
          type: options.dotType === "rounded" ? "extra-rounded" : "square", 
        },
        cornersDotOptions: {
          color: options.foregroundColor,
          type: options.dotType === "rounded" ? "dot" : "square", 
        },
        backgroundOptions: {
          color: options.backgroundColor,
        },
        qrOptions: {
          errorCorrectionLevel: options.errorCorrectionLevel,
        },
        image: options.logoImage || undefined,
        imageOptions: {
          crossOrigin: "anonymous",
          width: options.logoWidth,
          height: options.logoHeight,
          margin: 5,
          hideBackgroundDots: true,
        },
      });
    }
  }, [options]);
  
  const handleDownload = async (format: "svg" | "png") => {
    try {
      if (!qrCode.current) return;
      
      const dataUrl = await qrCode.current.getRawData(format);
      if (!dataUrl) {
        toast.error("Failed to generate QR code for download");
        return;
      }
      
      downloadQRCode(URL.createObjectURL(dataUrl), format);
      toast.success(`QR code downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("An error occurred while downloading the QR code");
    }
  };
  
  return (
    <Card className="w-full bg-gradient-to-br from-white to-gray-50 border">
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-6">
        <div ref={qrRef} className="rounded-lg overflow-hidden shadow-sm" />
        
        <div className="flex flex-wrap gap-2 justify-center">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => handleDownload("png")}
          >
            <Image size={16} />
            <span>Download PNG</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => handleDownload("svg")}
          >
            <Download size={16} />
            <span>Download SVG</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodePreview;
