import { useState } from 'react';
import Form from './components/Form';
import QRCodeView from './components/QRCodeView';
import { createPkpass, downloadBlob } from './utils/createPkpass';
import type { BusinessCardData, WalletPlatform } from './utils/createPkpass';
import './App.css';

function App() {
  const [businessCardData, setBusinessCardData] = useState<BusinessCardData>({
    fullName: '',
    title: '',
    phone: '',
    email: '',
    website: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormChange = (newData: BusinessCardData) => {
    setBusinessCardData(newData);
  };

  const handleGenerateWalletCard = async (platform: WalletPlatform = 'both') => {
    setLoading(true);
    setErrorMessage('');
    
    try {
      const pkpassBlob = await createPkpass(businessCardData, platform);
      
      // File extension and handling based on platform
      let extension = '.pkpass'; // Default for Apple
      
      if (platform === 'android') {
        extension = '.gpay';
      }
      
      const filename = `${businessCardData.fullName.replace(/\s+/g, '-')}-business-card${extension}`;
      
      // Check if on mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // Special handling for iOS devices
      if (isMobile && platform === 'apple' && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        // On iOS, we need to handle this differently by opening a data URL
        alert('Your pass will open in a new window. Click "Add to Wallet" when prompted.');
        
        // Create a temporary URL for the pass
        const url = URL.createObjectURL(new Blob([pkpassBlob], { 
          type: 'application/vnd.apple.pkpass' 
        }));
        
        // Open the URL in a new window
        window.open(url, '_blank');
      } else {
        // Regular download for desktop or Android
        downloadBlob(pkpassBlob, filename);
      }
    } catch (error) {
      console.error('Error generating wallet card:', error);
      setErrorMessage('Failed to generate wallet card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Digital Business Card Generator</h1>
        <p>Create your personalized digital business card for Apple Wallet and Google Wallet</p>
      </header>
      
      <main>
        <div className="container">
          <div className="card">
            <Form 
              data={businessCardData}
              onChange={handleFormChange}
              onGenerateWalletCard={handleGenerateWalletCard}
            />
          </div>
          
          <div className="card">
            <QRCodeView data={businessCardData} />
            
            {loading && (
              <div className="loading">
                <p>Generating your wallet card...</p>
              </div>
            )}
            
            {errorMessage && (
              <div className="error-message">
                <p>{errorMessage}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer>
        <p>All processing happens in your browser - no data is sent to any server.</p>
        <div className="footer-cta">
          <p className="footer-cta-text">Ready to go digital with your business card?</p>
          <p className="footer-security-note">
            <svg className="security-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"></path>
            </svg>
            Your privacy is our priority - all data stays on your device
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
