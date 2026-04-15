import { Camera, Mic, Brain, CheckCircle2, Shield } from "lucide-react";
import { Card } from "./ui/card";
import { useParams, useNavigate } from 'react-router-dom';

export function MonitoringPanel({ status }) {
  return (
    <Card className="p-4 bg-gradient-to-br from-purple-50 to-cyan-50 border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900">AI Monitoring</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className={`w-4 h-4 ${status.camera ? "text-green-600" : "text-gray-400"}`} />
            <span className="text-sm text-gray-700">Camera</span>
          </div>
          {status.camera ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className={`w-4 h-4 ${status.microphone ? "text-green-600" : "text-gray-400"}`} />
            <span className="text-sm text-gray-700">Microphone</span>
          </div>
          {status.microphone ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className={`w-4 h-4 ${status.aiDetection ? "text-green-600" : "text-gray-400"}`} />
            <span className="text-sm text-gray-700">AI Detection</span>
          </div>
          {status.aiDetection ? (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-600">Active</span>
            </div>
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-purple-200">
        <p className="text-xs text-gray-600 leading-relaxed">
          You are being monitored for fairness and integrity.
        </p>
      </div>
    </Card>
  );
}
