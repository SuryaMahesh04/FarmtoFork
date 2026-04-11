import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { X } from 'lucide-react';
import Button from './Button';

const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
    const scannerRef = useRef(null);
    const scannerInstance = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        // Initialize scanner when modal opens
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
            rememberLastUsedCamera: true,
            aspectRatio: 1.0
        };

        scannerInstance.current = new Html5QrcodeScanner(
            "reader",
            config,
            false // verbose flag
        );

        const onScan = (decodedText) => {
            // Check if it's a JSON payload or straight text ID
            // usually Farm2Fork QR contains JSON like {"batchId":"BTH-000001"}
            try {
                const parsed = JSON.parse(decodedText);
                if (parsed.batchId) {
                    onScanSuccess(parsed.batchId);
                } else {
                    onScanSuccess(decodedText);
                }
            } catch (e) {
                // Not JSON, assume straight text
                onScanSuccess(decodedText);
            }
            handleClose();
        };

        const onScanFailure = (error) => {
            // quiet failure, scanner keeps trying
        };

        scannerInstance.current.render(onScan, onScanFailure);

        return () => {
            handleClose();
        }; // Cleanup on unmount
    }, [isOpen]);

    const handleClose = () => {
        if (scannerInstance.current) {
            try {
                scannerInstance.current.clear().catch(e => console.error("Failed to clear scanner", e));
            } catch (e) {
                console.error("Cleanup error", e);
            }
            scannerInstance.current = null;
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-display font-bold text-slate-800">Scan Product QR Code</h3>
                    <button onClick={handleClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 relative bg-black/5">
                    <div id="reader" className="w-full rounded-xl overflow-hidden shadow-inner bg-white min-h-[300px]"></div>
                    <p className="text-center text-sm text-slate-500 mt-4">Point your camera at the Farm2Fork QR code found on the product packaging.</p>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <Button variant="outline" className="w-full" onClick={handleClose}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default QRScannerModal;
