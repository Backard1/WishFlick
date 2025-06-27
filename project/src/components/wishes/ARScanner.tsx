import React, { useState, useRef } from 'react';
import { Camera, X, Scan, Upload, CheckCircle } from 'lucide-react';

interface ARScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onProductScanned: (product: { name: string; price: number; image: string; url?: string }) => void;
}

export const ARScanner: React.FC<ARScannerProps> = ({ isOpen, onClose, onProductScanned }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback to file upload
      fileInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const simulateProductScan = () => {
    // Simulate AI product recognition
    const mockProducts = [
      {
        name: 'iPhone 15 Pro',
        price: 999,
        image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300',
        url: 'https://apple.com/iphone-15-pro'
      },
      {
        name: 'MacBook Air M2',
        price: 1199,
        image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300',
        url: 'https://apple.com/macbook-air'
      },
      {
        name: 'Sony WH-1000XM4',
        price: 349,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
        url: 'https://sony.com/headphones'
      }
    ];

    const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    setScannedProduct(randomProduct);
    stopCamera();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate processing uploaded image
      setTimeout(() => {
        simulateProductScan();
      }, 1500);
    }
  };

  const handleUseProduct = () => {
    if (scannedProduct) {
      onProductScanned(scannedProduct);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-90" onClick={onClose}></div>

        <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">AR Product Scanner</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            {!isScanning && !scannedProduct && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-[#B48DFE] to-[#6A49C8] rounded-full flex items-center justify-center mx-auto">
                  <Scan className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Scan or Upload Product</h4>
                  <p className="text-sm text-gray-600 mb-6">
                    Use your camera to scan a product or upload an image to automatically detect and add it to your wish.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={startCamera}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#B48DFE] to-[#6A49C8] text-white py-3 rounded-lg hover:shadow-lg transition-all"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Start Camera Scan</span>
                  </button>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center space-x-2 border border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload Image</span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {isScanning && (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-[#B48DFE] rounded-lg">
                      <div className="w-full h-full border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center">
                        <Scan className="w-8 h-8 text-white animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Point your camera at a product to scan it
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={simulateProductScan}
                      className="flex-1 bg-gradient-to-r from-[#B48DFE] to-[#6A49C8] text-white py-2 rounded-lg hover:shadow-lg transition-all"
                    >
                      Scan Product
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {scannedProduct && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Product Detected!</h4>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex space-x-4">
                    <img
                      src={scannedProduct.image}
                      alt={scannedProduct.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{scannedProduct.name}</h5>
                      <p className="text-lg font-bold text-[#B48DFE]">${scannedProduct.price}</p>
                      {scannedProduct.url && (
                        <p className="text-xs text-gray-500 truncate">{scannedProduct.url}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleUseProduct}
                    className="flex-1 bg-gradient-to-r from-[#B48DFE] to-[#6A49C8] text-white py-3 rounded-lg hover:shadow-lg transition-all"
                  >
                    Use This Product
                  </button>
                  <button
                    onClick={() => {
                      setScannedProduct(null);
                      startCamera();
                    }}
                    className="px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Scan Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};