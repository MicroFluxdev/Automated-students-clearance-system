import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  QrCode,
  Loader2,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanSuccess?: (decodedText: string) => void;
}

export function QRScannerModal({
  open,
  onOpenChange,
  onScanSuccess,
}: QRScannerModalProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isScannerRunning, setIsScannerRunning] = useState(false);
  const scanAreaRef = useRef<HTMLDivElement>(null);
  const isProcessingScan = useRef(false); // Prevent multiple scans

  // Initialize scanner when modal opens, stop when it closes
  useEffect(() => {
    // Add error handler for video abort events
    const handleVideoAbort = (event: Event) => {
      // Prevent the error from propagating
      event.stopPropagation();
      event.preventDefault();
    };

    const handleVideoError = (event: Event) => {
      // Prevent video errors from showing in console
      event.stopPropagation();
    };

    // Attach error handlers to scanner container
    const scannerContainer = document.getElementById("qr-reader");
    if (scannerContainer) {
      const videos = scannerContainer.querySelectorAll("video");
      videos.forEach((video) => {
        video.addEventListener("abort", handleVideoAbort, { capture: true });
        video.addEventListener("error", handleVideoError, { capture: true });
      });
    }

    if (open && !scannerRef.current && !isScannerRunning) {
      setError(null);
      setScannedResult(null);
      isProcessingScan.current = false;
      startScanning();
    } else if (!open) {
      // Modal is closing - ensure camera is released
      if (isScannerRunning || scannerRef.current) {
        stopScanning();
      }
      setError(null);
      setScannedResult(null);
      isProcessingScan.current = false; // Reset scan processing flag
    }

    // Cleanup function - ensures camera is released when component unmounts or modal closes
    return () => {
      // Remove event listeners
      if (scannerContainer) {
        const videos = scannerContainer.querySelectorAll("video");
        videos.forEach((video) => {
          video.removeEventListener("abort", handleVideoAbort, {
            capture: true,
          });
          video.removeEventListener("error", handleVideoError, {
            capture: true,
          });
        });
      }

      if (isScannerRunning || scannerRef.current) {
        stopScanning();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Get available cameras
      const cameras = await Html5Qrcode.getCameras();
      if (cameras.length === 0) {
        throw new Error(
          "No cameras found. Please ensure your camera is connected."
        );
      }

      // Use the first available camera (usually the default one)
      const selectedCameraId = cameras[0].id;

      // Create scanner instance
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      // Start scanning
      await scanner.start(
        selectedCameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Success callback
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Error callback (ignore most errors as they're just "no QR code found" messages)
          // Only log if it's not a common scanning error
          if (!errorMessage.includes("NotFoundException")) {
            // Silently ignore common scanning errors
          }
        }
      );
      setIsScannerRunning(true);

      // Set up error handlers for video elements after scanner starts
      // This prevents abort errors from propagating
      setTimeout(() => {
        const scannerContainer = document.getElementById("qr-reader");
        if (scannerContainer) {
          const videos = scannerContainer.querySelectorAll("video");
          videos.forEach((video) => {
            // Suppress abort and error events
            video.onabort = () => {
              // Silently handle abort - this is expected when stopping the scanner
            };
            video.onerror = () => {
              // Silently handle errors during cleanup
            };
          });
        }
      }, 200);
    } catch (err) {
      console.error("Error starting QR scanner:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to start camera. Please check permissions."
      );
      setIsScanning(false);
      setIsScannerRunning(false);
      scannerRef.current = null;
    }
  };

  const stopScanning = async () => {
    if (!scannerRef.current || !isScannerRunning) {
      // Scanner is not running, just reset state
      scannerRef.current = null;
      setIsScanning(false);
      setIsScannerRunning(false);
      // Still try to release any camera streams that might be active
      releaseCameraStream();
      return;
    }

    try {
      const scanner = scannerRef.current;

      // First, stop all video tracks to prevent abort errors
      // This must be done BEFORE calling scanner.stop()
      releaseCameraStream();

      // Small delay to ensure tracks are stopped before stopping scanner
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Try to stop the scanner (this releases the camera)
      try {
        await scanner.stop();
      } catch (stopErr: unknown) {
        // Ignore "scanner is not running" errors and abort errors
        const errorMessage =
          stopErr instanceof Error ? stopErr.message : String(stopErr);
        if (
          !errorMessage.includes("not running") &&
          !errorMessage.includes("not started") &&
          !errorMessage.includes("abort") &&
          !errorMessage.includes("onabort")
        ) {
          console.warn("Error stopping scanner:", stopErr);
        }
      }

      // Small delay before clearing to ensure stop is complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Try to clear the scanner
      try {
        await scanner.clear();
      } catch (clearErr: unknown) {
        // Ignore clear errors if scanner is already cleared or null
        const errorMessage =
          clearErr instanceof Error ? clearErr.message : String(clearErr);
        if (
          errorMessage &&
          !errorMessage.includes("null") &&
          !errorMessage.includes("cleared") &&
          !errorMessage.includes("abort")
        ) {
          console.warn("Error clearing scanner:", clearErr);
        }
      }

      // Final cleanup - ensure camera stream is released
      releaseCameraStream();
    } catch {
      // Silently ignore errors during cleanup
      // Still try to release camera
      releaseCameraStream();
    } finally {
      scannerRef.current = null;
      setIsScanning(false);
      setIsScannerRunning(false);
    }
  };

  // Helper function to manually release camera stream
  const releaseCameraStream = () => {
    try {
      // First, check the scanner's container element for video elements
      // This is the most likely place where the scanner video is
      const scannerContainer = document.getElementById("qr-reader");
      if (scannerContainer) {
        const scannerVideos = scannerContainer.querySelectorAll("video");
        scannerVideos.forEach((video) => {
          try {
            // Remove abort event listeners to prevent errors
            video.onabort = null;
            video.onerror = null;

            if (video.srcObject) {
              const stream = video.srcObject as MediaStream;
              stream.getTracks().forEach((track) => {
                try {
                  if (track.kind === "video" && track.readyState !== "ended") {
                    track.stop();
                  }
                } catch {
                  // Ignore errors when stopping individual tracks
                }
              });
              video.srcObject = null;
            }

            // Pause the video element
            video.pause();
            video.src = "";
          } catch {
            // Ignore errors for individual video elements
          }
        });
      }

      // Also check all video elements in the document
      const videoElements = document.querySelectorAll("video");
      videoElements.forEach((video) => {
        try {
          // Skip if this is not in the scanner container (might be other videos)
          if (scannerContainer && !scannerContainer.contains(video)) {
            return;
          }

          // Remove abort event listeners
          video.onabort = null;
          video.onerror = null;

          if (video.srcObject) {
            const stream = video.srcObject as MediaStream;
            stream.getTracks().forEach((track) => {
              try {
                if (track.kind === "video" && track.readyState !== "ended") {
                  track.stop();
                }
              } catch {
                // Ignore errors when stopping individual tracks
              }
            });
            video.srcObject = null;
          }

          // Pause and clear the video element
          video.pause();
          video.src = "";
        } catch {
          // Ignore errors for individual video elements
        }
      });
    } catch {
      // Silently ignore errors when releasing camera
      // This is just a safety measure
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    // Prevent multiple scans of the same QR code
    if (isProcessingScan.current) {
      return;
    }

    // Mark that we're processing a scan immediately to prevent race conditions
    isProcessingScan.current = true;

    // Immediately stop the scanner to prevent it from calling this callback again
    // We do this synchronously first to stop the scanner as quickly as possible
    if (scannerRef.current && isScannerRunning) {
      try {
        // Stop the scanner immediately without waiting for full cleanup
        const scanner = scannerRef.current;
        scanner.stop().catch(() => {
          // Ignore errors - we'll do full cleanup next
        });
      } catch {
        // Ignore errors
      }
    }

    // Now do full cleanup
    await stopScanning();

    // Store the scanned result to display
    setScannedResult(decodedText);

    // Call the success callback if provided
    if (onScanSuccess) {
      onScanSuccess(decodedText);
    } else {
      // Default behavior: log
      console.log("Scanned QR Code:", decodedText);
    }

    // Don't close modal immediately - show the result first
    // User can click the link or close manually
  };

  const handleClose = async () => {
    // Ensure camera is stopped before closing
    await stopScanning();
    setScannedResult(null);
    onOpenChange(false);
  };

  // Helper function to check if a string is a valid URL
  const isValidUrl = (string: string): boolean => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Scanner
          </DialogTitle>
          <DialogDescription>
            Position the QR code within the frame to scan
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {/* Scanner Area */}
          <div
            ref={scanAreaRef}
            id="qr-reader"
            className="w-full max-w-md rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-300"
            style={{ minHeight: "300px" }}
          />

          {/* Status Messages */}
          {isScanning && !error && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Scanning for QR code...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg w-full">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Scanned Result */}
          {scannedResult && (
            <div className="w-full p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold text-green-800">
                  QR Code Scanned Successfully!
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-gray-600 break-all">
                  {scannedResult}
                </p>
                {isValidUrl(scannedResult) && (
                  <a
                    href={scannedResult}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Link
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 w-full">
            {!isScanning && !error && !scannedResult && (
              <Button onClick={startScanning} className="flex-1">
                Start Scanning
              </Button>
            )}
            {isScanning && (
              <Button
                onClick={stopScanning}
                variant="outline"
                className="flex-1"
              >
                Stop Scanning
              </Button>
            )}
            {scannedResult && (
              <Button
                onClick={() => {
                  setScannedResult(null);
                  isProcessingScan.current = false; // Reset flag for new scan
                  startScanning();
                }}
                variant="outline"
                className="flex-1"
              >
                Scan Again
              </Button>
            )}
            <Button onClick={handleClose} variant="outline" className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
