import React, { useEffect, useState } from 'react';
import { api } from './services/api';
import { Activity, CheckCircle2, AlertCircle } from 'lucide-react';

function App() {
  const [healthStatus, setHealthStatus] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    let isMounted = true;
    api.checkHealth()
      .then((data) => {
        if (isMounted) setHealthStatus({ loading: false, data, error: null });
      })
      .catch((err) => {
        if (isMounted) setHealthStatus({ loading: false, data: null, error: err.message });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#181b20] border border-gray-800 rounded-2xl p-6 shadow-xl text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF655B] to-[#FF4458] mb-4 shadow-lg shadow-red-500/20">
          <Activity className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Coy — Discover</h1>
        <p className="text-gray-400 text-sm mb-6">
          Project Initialized (Stage 1 Setup)
        </p>

        <div className="bg-[#101216] rounded-xl p-4 border border-gray-800 flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Backend Status</span>
          {healthStatus.loading ? (
            <span className="text-xs text-yellow-400 font-medium">Checking...</span>
          ) : healthStatus.error ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-red-400 font-medium">
              <AlertCircle className="w-4 h-4" /> Disconnected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Connected ({healthStatus.data?.status})
            </span>
          )}
        </div>

        {healthStatus.data && (
          <div className="mt-4 text-left text-xs bg-gray-900/60 p-3 rounded-lg border border-gray-800/80 font-mono text-gray-300">
            <div><strong>Status:</strong> {healthStatus.data.status}</div>
            <div><strong>Timestamp:</strong> {healthStatus.data.timestamp}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
