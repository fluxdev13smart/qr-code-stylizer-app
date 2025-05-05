
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import YoutubeBackground from "@/components/YoutubeBackground";
import { QrCode, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <>
      <YoutubeBackground videoId="PQoLr7eVLUI" opacity={0.6} />
      
      <div className="min-h-screen px-4 py-8 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <header className="text-center mb-10">
            <div className="inline-block">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-qr-purple via-qr-light-purple to-qr-dark-purple bg-clip-text text-transparent mb-2 animate-float flex items-center justify-center">
                <QrCode className="mr-2 text-qr-purple animate-pulse-light" size={40} /> 
                <span className="relative">
                  Pixel Snap
                  <Sparkles className="absolute -top-4 -right-6 text-yellow-300" size={20} />
                </span>
              </h1>
              <div className="h-1 w-full bg-gradient-to-r from-qr-purple/50 to-qr-dark-purple/80 rounded-full my-1"></div>
              <p className="text-sm text-qr-purple font-medium mb-4 animate-fade-in">by Saeid Mohammad</p>
            </div>
            <p className="text-gray-100 text-lg max-w-xl mx-auto animate-fade-in backdrop-blur-md p-2 rounded-md bg-black/30">
              Create custom QR codes for your business, marketing campaigns, or personal use. 
              Customize colors, add your logo, text, or emoji, and download in multiple formats.
            </p>
          </header>

          <main>
            <QRCodeGenerator />
          </main>

          <footer className="mt-16 text-center text-gray-300 text-sm backdrop-blur-md bg-black/30 p-2 rounded-md">
            <p>© 2025 Pixel Snap. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Index;
