
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import QRCodeGenerator from "@/components/QRCodeGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-8">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-qr-purple to-qr-dark-purple bg-clip-text text-transparent mb-2">
            QR Code Stylizer
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Create custom QR codes for your business, marketing campaigns, or personal use. 
            Customize colors, add your logo, and download in multiple formats.
          </p>
        </header>

        <main>
          <QRCodeGenerator />
        </main>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2025 QR Code Stylizer. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
