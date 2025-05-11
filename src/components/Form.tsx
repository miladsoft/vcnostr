import { type ChangeEvent } from 'react';
import type { BusinessCardData, WalletPlatform } from '../utils/createPkpass';

interface FormProps {
  data: BusinessCardData;
  onChange: (data: BusinessCardData) => void;
  onGenerateWalletCard: (platform: WalletPlatform) => void;
}

const Form = ({ data, onChange, onGenerateWalletCard }: FormProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const isFormValid = () => {
    return data.fullName && data.title && data.phone && data.email;
  };

  return (
    <div className="form-container">
      <h2>Your Business Card Information</h2>
      <p>Fill in your details to generate your digital business card</p>
      
      <div className="form-group">
        <label htmlFor="fullName">Full Name*</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={data.fullName}
          onChange={handleChange}
          placeholder="Jane Doe"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="title">Job Title*</label>
        <input
          type="text"
          id="title"
          name="title"
          value={data.title}
          onChange={handleChange}
          placeholder="Software Engineer"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="phone">Phone Number*</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={data.phone}
          onChange={handleChange}
          placeholder="+1 (555) 123-4567"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email Address*</label>
        <input
          type="email"
          id="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          placeholder="jane.doe@example.com"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="website">Website</label>
        <input
          type="url"
          id="website"
          name="website"
          value={data.website}
          onChange={handleChange}
          placeholder="https://example.com"
        />
      </div>      <div className="wallet-buttons">
        <button
          onClick={() => onGenerateWalletCard('both')}
          disabled={!isFormValid()}
          className="generate-button both-button"
        >
          Download for Both Platforms
        </button>
        
        <div className="platform-buttons">
          <button
            onClick={() => onGenerateWalletCard('apple')}
            disabled={!isFormValid()}
            className="platform-button apple-button"
          >
            <svg className="wallet-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.86-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.38C2.79 15.15 3.51 6.6 8.92 6.32c1.56.06 2.63.95 3.47.95.83 0 2.38-1.18 4.01-.95 4.81.7 6.21 7.42 2.65 13.96z" />
              <path d="M12.03 6.15c-.17-2.85 2.18-5.8 5.2-5.96.37 2.91-2.1 5.72-5.2 5.96z" />
            </svg>
            Apple Wallet
          </button>
          
          <button
            onClick={() => onGenerateWalletCard('android')}
            disabled={!isFormValid()}
            className="platform-button android-button"
          >
            <svg className="wallet-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.61 15.15v-3.08c0-.35-.06-.69-.2-1h2.25c.69 0 1.25.56 1.25 1.25v1.25h1.25c.35 0 .63.28.63.63v.31c0 .35-.28.63-.63.63h-4.55zM16.41 17.78c0 .69-.56 1.25-1.25 1.25h-1.05c.07-.16.11-.33.11-.51v-1.27h2.19v.53zm-4.27 2.32c-.61 0-1.1-.49-1.1-1.09s.49-1.09 1.1-1.09 1.09.49 1.09 1.09-.48 1.09-1.09 1.09zm.03-17.35c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm-3.34 17.35c-.61 0-1.09-.49-1.09-1.09s.49-1.09 1.09-1.09 1.09.49 1.09 1.09-.49 1.09-1.09 1.09zm-1.97-2.33h.45v1.28c0 .18.04.35.11.51H6.85c-.7 0-1.26-.56-1.26-1.25v-.54h2.27zm-2.27-5.57h2c0 .55.45 1 1 1h7.22c.55 0 1-.45 1-1h2v4.59h-2.18v-1.26c0-.19-.03-.38-.09-.56H5.32c-.06.19-.09.38-.09.56v1.26H3.05v-4.59zM8.35 9.09h7.3c.46 0 .84.38.84.84v1.43c0 .47-.38.84-.84.84h-7.3c-.46 0-.84-.38-.84-.84v-1.43c0-.46.38-.84.84-.84zm-5.3 1.42V9.25c0-.69.56-1.25 1.26-1.25h2.24c-.14.32-.2.65-.2 1v3.08H4.31c-.35 0-.63-.28-.63-.63v-.31c0-.35.28-.63.63-.63h1.25v-1.25h-1.25c-.35 0-.63-.28-.63-.63z" />
            </svg>
            Google Wallet
          </button>
        </div>
      </div>
      
      <p className="form-note">* Required fields</p>
    </div>
  );
};

export default Form;
