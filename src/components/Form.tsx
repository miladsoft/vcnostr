import { ChangeEvent, FormEvent } from 'react';
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onGenerateWalletCard('both');
  };

  const isFormValid = () => {
    return data.fullName.trim() !== '' && data.email.trim() !== '';
  };

  return (
    <div className="form-container">
      <h2>Your Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={data.title}
            onChange={handleChange}
            placeholder="Software Engineer"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="john@example.com"
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
        </div>

        <div className="wallet-buttons">
          <button
            type="submit"
            className="generate-button both-button"
            disabled={!isFormValid()}
          >
            <svg className="wallet-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 12v2H8v-4h8v2zm2-2v-2H6v-2h12v-2h2v6h-2z"/>
            </svg>
            Generate for Both Wallets
          </button>
          
          <div className="platform-buttons">
            <button
              type="button"
              className="platform-button apple-button"
              onClick={() => onGenerateWalletCard('apple')}
              disabled={!isFormValid()}
            >
              <svg className="wallet-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.18 2.31-.88 3.65-.84 1.54.05 2.7.6 3.41 1.66-3.25 1.95-2.51 6.22.82 7.6-.82 1.76-1.98 3.47-2.96 4.55zM15.5 6.49c.24-1.89-1.37-3.43-2.5-4-1.5-.76-3.13-.74-4.05-.26-.17 1.87 1.03 3.5 2.45 4.23 1.3.72 3 .75 4.1.03z"/>
              </svg>
              Apple Wallet
            </button>
            
            <button
              type="button"
              className="platform-button android-button"
              onClick={() => onGenerateWalletCard('android')}
              disabled={!isFormValid()}
            >
              <svg className="wallet-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              Google Wallet
            </button>
          </div>
        </div>
      </form>
      
      <p className="form-note">
        All information is processed locally in your browser.
      </p>
    </div>
  );
};

export default Form;
