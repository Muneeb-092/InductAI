import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Camera, Mic, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function SystemCheckDialog({ open, onOpenChange }) {
  const [checking, setChecking] = useState(false);
  const [cameraStatus, setCameraStatus] = useState("idle");
  const [micStatus, setMicStatus] = useState("idle");

  const runSystemCheck = async () => {
    setChecking(true);
    setCameraStatus("checking");
    setMicStatus("checking");

    // Simulate camera check
    setTimeout(() => {
      try {
        // In a real app, you would check actual camera permissions here
        setCameraStatus("success");
      } catch {
        setCameraStatus("error");
      }
    }, 1000);

    // Simulate microphone check
    setTimeout(() => {
      try {
        // In a real app, you would check actual microphone permissions here
        setMicStatus("success");
        setChecking(false);
        toast.success("System check completed successfully!");
      } catch {
        setMicStatus("error");
        setChecking(false);
        toast.error("System check failed. Please check your permissions.");
      }
    }, 1500);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "checking":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>System Check</DialogTitle>
          <DialogDescription>
            We'll verify that your camera and microphone are working properly
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Camera</span>
            </div>
            {getStatusIcon(cameraStatus)}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Microphone</span>
            </div>
            {getStatusIcon(micStatus)}
          </div>

          {cameraStatus === "error" || micStatus === "error" ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                Please allow camera and microphone access in your browser settings to continue.
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={runSystemCheck}
            disabled={checking}
            className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-400 hover:from-purple-700 hover:to-cyan-500"
          >
            {checking ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              "Run Check"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
