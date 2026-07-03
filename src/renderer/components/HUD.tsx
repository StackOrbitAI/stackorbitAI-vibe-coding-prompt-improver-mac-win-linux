import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';

interface HUDData {
  status: 'enhancing' | 'success' | 'error';
  progress: number;
  preview: string;
}

declare global {
  interface Window {
    api: {
      onHUDUpdate: (callback: (data: HUDData) => void) => () => void;
    };
  }
}

export default function HUD() {
  const [hudState, setHudState] = useState<HUDData>({
    status: 'enhancing',
    progress: 0,
    preview: '',
  });

  const previewEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register IPC HUD updater listener
    const unsubscribe = window.api.onHUDUpdate((data) => {
      setHudState(data);
    });
    return () => unsubscribe();
  }, []);

  // Auto-scroll preview window to the bottom as new chunks stream in
  useEffect(() => {
    if (previewEndRef.current) {
      previewEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hudState.preview]);

  const { status, progress, preview } = hudState;

  return (
    <div className="w-full h-full p-4 flex items-center justify-center select-none bg-transparent">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="w-full max-w-sm glass-panel rounded-2xl overflow-hidden p-4 flex flex-col justify-between"
        style={{ height: '160px' }}
      >
        {/* Status Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {status === 'enhancing' && (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </motion.div>
                <span className="text-sm font-semibold text-indigo-200">Enhancing prompt...</span>
              </>
            )}
            {status === 'success' && (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-200">Inserted successfully</span>
              </>
            )}
            {status === 'error' && (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="text-sm font-semibold text-rose-200">Enhancement failed</span>
              </>
            )}
          </div>
          <span className="text-xs font-semibold text-slate-400">{progress}%</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-900/60 rounded-full h-2 overflow-hidden border border-slate-800 mb-3">
          <motion.div
            className={`h-full rounded-full ${
              status === 'error' 
                ? 'bg-rose-500' 
                : status === 'success' 
                ? 'bg-emerald-500' 
                : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500'
            }`}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        {/* Text Preview Box */}
        <div className="flex-1 bg-slate-950/60 rounded-lg p-2.5 overflow-y-auto text-xs text-slate-300 font-mono border border-slate-900">
          {status === 'error' ? (
            <span className="text-rose-400">{preview || 'An error occurred during prompt improvement.'}</span>
          ) : status === 'success' ? (
            <span className="text-emerald-400 font-semibold">✅ Enhanced prompt inserted into text field!</span>
          ) : (
            <AnimatePresence mode="popLayout">
              {preview ? (
                <motion.div
                  key={preview.length}
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="whitespace-pre-wrap leading-relaxed"
                >
                  {preview}
                </motion.div>
              ) : (
                <span className="text-slate-500 italic">Starting LLM stream...</span>
              )}
            </AnimatePresence>
          )}
          <div ref={previewEndRef} />
        </div>
      </motion.div>
    </div>
  );
}
