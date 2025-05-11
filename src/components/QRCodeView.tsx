import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { type BusinessCardData, generateVCard } from '../utils/createPkpass';

interface QRCodeViewProps {
  data: BusinessCardData;
}

const QRCodeView = ({ data }: QRCodeViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.fullName) return;
    
    const vCardData = generateVCard(data);
    
    QRCode.toCanvas(
      canvasRef.current, 
      vCardData, 
      {
        width: 200,
        margin: 2,
        color: {
          dark: '#4F46E5', // Indigo-600
          light: '#ffffff',
        },
      },
      (error) => {
        if (error) console.error('Error generating QR code:', error);
      }
    );
  }, [data]);
  if (!data.fullName) {
    return (
      <div className="qrcode-container">
        <h2>QR Code Preview</h2>
        <p>Your QR code will appear here</p>
        <div className="qrcode-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path d="M6 11.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
          </svg>
          <p>Fill in your information to generate a QR code</p>
        </div>
      </div>
    );
  }  return (
    <div className="qrcode-container">
      <h2>QR Code Preview</h2>
      <p>Scan this code to add contact information</p>
      <div className="qrcode-wrapper">
        <canvas ref={canvasRef} />
        <div className="qrcode-overlay">
          {data.fullName.split(' ')[0]?.charAt(0) || ''}
          {data.fullName.split(' ')[1]?.charAt(0) || ''}
        </div>
      </div>
      <div className="qrcode-info">
        <p className="qrcode-name">{data.fullName}</p>
        <p className="qrcode-title">{data.title}</p>
      </div>
      
      <div className="wallet-card-preview">
        <div className="wallet-card">
          <div className="wallet-card-header">
            <div className="wallet-card-logo">BC</div>
            <div className="wallet-card-type">BUSINESS CARD</div>
          </div>
          <div className="wallet-card-content">
            <div className="wallet-card-name">{data.fullName}</div>
            <div className="wallet-card-title">{data.title}</div>
            
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
            <span>Digital Business Card</span>
          </div>
        </div>
        <p className="wallet-card-caption">Preview of your wallet card</p>
      </div>
    </div>
  );
};

export default QRCodeView;
