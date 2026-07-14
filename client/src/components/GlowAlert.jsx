import React from 'react';

const GlowAlert = ({
  message,
  onClose,
  okText = 'OK',
  onCancel,
  cancelText = 'Cancel',
  variant = 'success',
}) => {
  if (!message) return null;

  const showCancel = typeof onCancel === 'function';

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center px-4">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/40" onClick={showCancel ? onCancel : onClose} />
      <div className="realistic-paper-card relative w-full max-w-sm p-8 transform -rotate-1 shadow-2xl" role="alertdialog" aria-live="assertive">
        {/* Fold effect corner */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-paper border-b border-l border-ink/20 shadow-sm rounded-bl-sm" style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}></div>
        
        <div className="text-center mt-2">
          <p className="text-xl font-bold font-serif text-[#B8860B] mb-8 leading-relaxed">
            {message}
          </p>
          <div className="flex justify-center gap-4">
            {showCancel && (
              <button 
                type="button" 
                className="bg-transparent border-2 border-dashed border-[#B8860B]/50 text-[#B8860B] px-6 py-2 rounded-sm text-sm font-bold shadow-[2px_2px_0px_rgba(184,134,11,0.2)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_rgba(184,134,11,0.2)] transition-all font-serif" 
                onClick={onCancel}
              >
                {cancelText}
              </button>
            )}
            <button 
              type="button" 
              className="bg-[#B8860B] text-[#FAF8F2] px-8 py-2 rounded-sm text-sm font-bold shadow-[3px_3px_0px_rgba(184,134,11,0.3)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_rgba(184,134,11,0.3)] transition-all font-serif" 
              onClick={onClose}
            >
              {okText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlowAlert;
