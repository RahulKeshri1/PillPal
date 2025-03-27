import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';
import { Button } from '@/components/ui/button';

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
  onCancel: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetected, onCancel }) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    const initScanner = async () => {
      try {
        setError(null);
        
        await Quagga.init({
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              width: { min: 450 },
              height: { min: 300 },
              facingMode: "environment", // use the rear camera on mobile devices
            },
          },
          locator: {
            patchSize: "medium",
            halfSample: true,
          },
          numOfWorkers: navigator.hardwareConcurrency || 4,
          decoder: {
            readers: [
              "code_128_reader", 
              "ean_reader", 
              "ean_8_reader", 
              "code_39_reader", 
              "code_39_vin_reader", 
              "codabar_reader", 
              "upc_reader", 
              "upc_e_reader"
            ],
          },
          locate: true,
        });
        
        Quagga.start();
        setIsInitialized(true);
        
        Quagga.onDetected((result) => {
          if (result.codeResult.code) {
            onDetected(result.codeResult.code);
            stopScanner();
          }
        });
      } catch (err) {
        console.error('Error initializing barcode scanner:', err);
        setError('Could not access camera. Please make sure you have given permission to use the camera and try again.');
      }
    };

    initScanner();

    return () => {
      stopScanner();
    };
  }, [onDetected]);

  const stopScanner = () => {
    if (isInitialized) {
      Quagga.stop();
      setIsInitialized(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {error ? (
        <div className="p-4 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={onCancel}>Close</Button>
        </div>
      ) : (
        <>
          <div 
            ref={scannerRef} 
            className="bg-gray-800 rounded-lg overflow-hidden relative"
            style={{ height: '240px', width: '100%' }}
          >
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="absolute border-2 border-primary-400 opacity-50" 
                style={{ width: '80%', height: '60%', margin: 'auto' }}></div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            Align the barcode within the frame and hold steady
          </div>
        </>
      )}
    </div>
  );
};

export default BarcodeScanner;
