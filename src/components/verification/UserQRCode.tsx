
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserQRCodeProps {
  userId: string;
  userName: string;
}

const UserQRCode = ({ userId, userName }: UserQRCodeProps) => {
  const { toast } = useToast();
  
  // Generate verification URL with hash
  const verificationHash = btoa(`${userId}-${Date.now()}`).slice(0, 16);
  const verificationUrl = `${window.location.origin}/verify/${userId}/${verificationHash}`;

  const downloadQR = () => {
    // Create a canvas from the SVG for download
    const svg = document.querySelector('#qr-code-svg') as SVGElement;
    if (svg) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        canvas.width = 250;
        canvas.height = 250;
        ctx?.drawImage(img, 0, 0, 250, 250);
        
        const link = document.createElement('a');
        link.download = `${userName}-verification-qr.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        URL.revokeObjectURL(url);
        
        toast({
          title: "QR Code Downloaded",
          description: "Your verification QR code has been saved",
        });
      };
      
      img.src = url;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          My QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Verification QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 p-4">
          <div className="bg-white p-4 rounded-lg border">
            <QRCodeSVG
              id="qr-code-svg"
              value={verificationUrl}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <div className="text-center text-sm text-gray-600">
            <p>Share this QR code with employers for instant verification</p>
            <p className="text-xs mt-1">Code links to your achievement profile</p>
          </div>
          <Button onClick={downloadQR} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserQRCode;
