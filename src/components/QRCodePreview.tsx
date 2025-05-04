
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
    
    const dotType = options.dotType === "rounded" ? "dots" : "square";
    
    // Define overlay content based on type
    let image = undefined;
    if (options.overlayType === 'logo' && options.logoImage) {
      image = options.logoImage;
    }
    
    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling({
        width: options.size,
        height: options.size,
        type: "svg",
        data: formattedData,
        dotsOptions: {
          color: options.foregroundColor,
          type: dotType,
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
          imageSize: options.logoWidth,
          hideBackgroundDots: true,
        },
        image: image,
        qrOptions: {
          errorCorrectionLevel: options.errorCorrectionLevel,
        },
      });
      
      qrCode.current.append(qrRef.current);
      
      // Add text or emoji overlay if selected
      if (options.overlayType === 'text' || options.overlayType === 'emoji') {
        addOverlayToQRCode();
      }
    } else {
      qrCode.current.update({
        data: formattedData,
        width: options.size,
        height: options.size,
        dotsOptions: {
          color: options.foregroundColor,
          type: dotType,
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
        image: image,
        imageOptions: {
          crossOrigin: "anonymous",
          imageSize: options.logoWidth,
          margin: 5,
          hideBackgroundDots: true,
        },
      });
      
      // Add text or emoji overlay if selected
      if (options.overlayType === 'text' || options.overlayType === 'emoji') {
        addOverlayToQRCode();
      }
    }
  }, [options]);
  
  const addOverlayToQRCode = () => {
    // Wait for QR code to render first
    setTimeout(() => {
      if (!qrRef.current) return;
      
      // Remove any existing text overlay
      const existingOverlay = qrRef.current.querySelector('.qr-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }
      
      // Create overlay div
      const overlay = document.createElement('div');
      overlay.className = 'qr-overlay';
      overlay.style.position = 'absolute';
      overlay.style.top = '50%';
      overlay.style.left = '50%';
      overlay.style.transform = 'translate(-50%, -50%)';
      overlay.style.background = 'white';
      overlay.style.borderRadius = '50%';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.padding = '10px';
      overlay.style.zIndex = '10';
      
      // Set size based on logo width
      const size = options.logoWidth;
      overlay.style.width = `${size}px`;
      overlay.style.height = `${size}px`;
      
      // Add content based on overlay type
      if (options.overlayType === 'text') {
        overlay.style.fontFamily = options.overlayFontFamily;
        overlay.style.fontSize = `${options.overlayFontSize}px`;
        overlay.style.fontWeight = options.overlayFontWeight;
        overlay.style.color = options.overlayFontColor;
        overlay.textContent = options.overlayText;
      } else if (options.overlayType === 'emoji') {
        overlay.style.fontSize = `${options.overlayFontSize}px`;
        overlay.textContent = options.overlayEmoji;
      }
      
      // Apply overlay to the QR code container
      if (qrRef.current) {
        const svgContainer = qrRef.current.querySelector('svg');
        if (svgContainer && svgContainer.parentNode) {
          // Fixed: Use type assertion and check for null before setting style
          const parentElement = svgContainer.parentNode as HTMLElement;
          parentElement.style.position = 'relative';
          qrRef.current.appendChild(overlay);
        }
      }
    }, 100);
  };
  
  const handleDownload = async (format: "svg" | "png") => {
    try {
      if (!qrCode.current) return;
      
      // For download, need to make sure the overlay is included
      const qrElement = qrRef.current?.cloneNode(true) as HTMLElement;
      
      const dataUrl = await qrCode.current.getRawData(format);
      if (!dataUrl) {
        toast.error("Failed to generate QR code for download");
        return;
      }
      
      // Fixed: Ensure we're only handling Blob type here, which is what qr-code-styling returns
      const blob = dataUrl as Blob;
      downloadQRCode(URL.createObjectURL(blob), format);
      toast.success(`QR code downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("An error occurred while downloading the QR code");
    }
  };
  
  return (
    <Card className="w-full bg-white/90 backdrop-blur-md border-white/20">
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-6">
        <div ref={qrRef} className="rounded-lg overflow-hidden shadow-sm relative" />
        
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
