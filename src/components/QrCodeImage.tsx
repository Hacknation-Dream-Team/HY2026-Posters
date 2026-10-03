import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrCodeImageProps {
  url: string;
  size?: number;
  label?: string;
  className?: string;
}

export const QrCodeImage: React.FC<QrCodeImageProps> = ({
  url,
  size = 120,
  label = 'Zeskanuj, aby nawigować do schronu',
  className = '',
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(
      url,
      {
        width: size,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      },
      (err, result) => {
        if (!err && result) {
          setDataUrl(result);
        }
      }
    );
  }, [url, size]);

  if (!dataUrl) return null;

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <img src={dataUrl} alt="Kod QR Nawigacji Do Schronu" className="border border-slate-300 rounded p-1 bg-white shadow-sm" style={{ width: `${size}px`, height: `${size}px` }} />
      {label && <p className="text-[10px] font-semibold text-slate-700 mt-1 max-w-[120px] leading-tight">{label}</p>}
    </div>
  );
};
