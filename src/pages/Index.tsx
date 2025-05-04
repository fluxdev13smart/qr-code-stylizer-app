
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import YoutubeBackground from "@/components/YoutubeBackground";
import { QrCode } from "lucide-react";

const Index = () => {
  return (
    <>
      <YoutubeBackground videoId="PQoLr7eVLUI" opacity={0.6} />
      
      <div className="min-h-screen px-4 py-8 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-qr-purple to-qr-dark-purple bg-clip-text text-transparent mb-2 animate-fade-in flex items-center justify-center">
              <QrCode className="mr-2 text-qr-purple" size={36} /> 
              QR Code Stylizer
            </h1>
            <p className="text-gray-100 text-lg max-w-xl mx-auto animate-fade-in backdrop-blur-md p-2 rounded-md bg-black/30">
              Create custom QR codes for your business, marketing campaigns, or personal use. 
              Customize colors, add your logo, text, or emoji, and download in multiple formats.
            </p>
          </header>

          <main>
            <QRCodeGenerator />
          </main>

          <footer className="mt-16 text-center text-gray-300 text-sm backdrop-blur-md bg-black/40 p-2 rounded-md">
            <p>© 2025 QR Code Stylizer. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Index;
