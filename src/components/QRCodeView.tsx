import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import type { BusinessCardData } from '../utils/createPkpass';
import { generateVCard } from '../utils/createPkpass';

interface QRCodeViewProps {
  data: BusinessCardData;
}

const QRCodeView = ({ data }: QRCodeViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasData = data.fullName.trim() !== '' || data.email.trim() !== '';

  useEffect(() => {
    if (canvasRef.current && hasData) {
      const vcard = generateVCard(data);
      
      QRCode.toCanvas(canvasRef.current, vcard, {
        width: 220,
        margin: 1,
        color: {
          dark: '#4F46E5', // Indigo-600
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      }, (error) => {
        if (error) {
          console.error('Error generating QR code:', error);
        }
      });
    }
  }, [data, hasData]);

  return (
    <div className="qrcode-container">
      <h2>Your Digital Business Card</h2>
      <p>Scan with any QR code reader to save contact info</p>

      {hasData ? (
        <>
          <div className="qrcode-wrapper">
            <canvas ref={canvasRef} />
            <div className="qrcode-overlay">BC</div>
          </div>
          
          <div className="qrcode-info">
            <div className="qrcode-name">{data.fullName || 'Your Name'}</div>
            <div className="qrcode-title">{data.title || 'Job Title'}</div>
          </div>
          
          <div className="wallet-card-preview">
            <div className="wallet-card">
              <div className="wallet-card-header">
                <div className="wallet-card-logo">BC</div>
                <div className="wallet-card-type">BUSINESS CARD</div>
              </div>
              
              <div className="wallet-card-content">
                <div className="wallet-card-name">{data.fullName || 'Your Name'}</div>
                <div className="wallet-card-title">{data.title || 'Job Title'}</div>
                
                <div className="wallet-card-details">
                  {data.phone && (
                    <div className="wallet-card-detail">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">{data.phone}</span>
                    </div>
                  )}
                  
                  {data.email && (
                    <div className="wallet-card-detail">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{data.email}</span>
                    </div>
                  )}
                  
                  {data.website && (
                    <div className="wallet-card-detail">
                      <span className="detail-label">Website</span>
                      <span className="detail-value">{data.website}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="wallet-card-footer">
                Digital Business Card
              </div>
            </div>
            <div className="wallet-card-caption">
              Preview of how your card will appear in digital wallets
            </div>
          </div>
        </>
      ) : (
        <div className="qrcode-placeholder">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 11H11V3H3V11ZM5 5H9V9H5V5Z" fill="#4F46E5"/>
            <path d="M3 21H11V13H3V21ZM5 15H9V19H5V15Z" fill="#4F46E5"/>
            <path d="M13 3V11H21V3H13ZM19 9H15V5H19V9Z" fill="#4F46E5"/>
            <path d="M21 19H19V21H21V19Z" fill="#4F46E5"/>
            <path d="M15 13H13V15H15V13Z" fill="#4F46E5"/>
            <path d="M17 15H15V17H17V15Z" fill="#4F46E5"/>
            <path d="M15 17H13V19H15V17Z" fill="#4F46E5"/>
            <path d="M17 19H15V21H17V19Z" fill="#4F46E5"/>
            <path d="M19 13H17V15H19V13Z" fill="#4F46E5"/>
            <path d="M19 17H17V19H19V17Z" fill="#4F46E5"/>
            <path d="M21 13H19V17H21V13Z" fill="#4F46E5"/>
            <path d="M21 17H19V19H21V17Z" fill="#4F46E5"/>
          </svg>
          <p>Fill out the form to generate your digital business card QR code</p>
        </div>
      )}
    </div>
  );
};

export default QRCodeView;
