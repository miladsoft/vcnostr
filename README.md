# Digital Business Card Generator

A web application that allows users to create digital business cards for Apple Wallet and Google Wallet.

## Features

- **Simple Form Interface**: Enter your name, title, contact info, and website
- **QR Code Generation**: Automatically creates a QR code with your contact information
- **Apple Wallet Card**: Generate a .pkpass file compatible with Apple Wallet
- **Google Wallet Card**: Generate a .gpay file compatible with Google Wallet
- **100% Client-Side**: All processing happens in the browser, with no data sent to servers
- **Downloadable Cards**: Save your digital business card for sharing

## How to Add to Your Mobile Wallet

### For iPhone users:
1. Generate your business card on this website
2. Download the .pkpass file
3. If using Safari on your iPhone: The file should automatically prompt to be added to your Apple Wallet
4. If using another browser or computer:
   - Email the .pkpass file to yourself
   - Open the email on your iPhone
   - Tap the attachment, and you'll see the "Add to Wallet" option

### For Android users:
1. Generate your business card on this website
2. Download the .gpay file
3. Make sure you have Google Wallet app installed
4. Open the .gpay file with Google Wallet
5. If that doesn't work automatically:
   - Go to Google Wallet app
   - Tap "+" button
   - Select "Loyalty card" or "Other"
   - Scan the QR code from your downloaded pass

## Important Notice About Wallet Files

Currently, the generated wallet files (.pkpass for Apple Wallet and .gpay for Google Wallet) may not work directly when attempting to add them to your mobile wallet applications. This is because:

1. **Apple Wallet (.pkpass) Files**: 
   - Require proper code signing with an Apple Developer certificate
   - Need a valid Pass Type ID registered with Apple
   - Require proper cryptographic signature with a valid certificate

2. **Google Wallet (.gpay) Files**:
   - Require proper Google Pay API integration
   - Need valid Google Pay API credentials
   - Must be properly formatted JSON with valid issuer details

### Current Implementation Limitations

The current implementation creates a structurally correct file with the necessary file structure, but:

- It uses placeholder values for Pass Type ID and Team ID
- It includes a placeholder for the signature file instead of an actual cryptographic signature
- It's not signed with a valid Apple/Google developer certificate

## Development

### Install dependencies
```bash
npm install
```

### Run the development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

## Technical Details

- Built with React and TypeScript
- Uses Vite as the build tool
- Wallet file generation happens entirely in the client's browser
- No data is sent to any server

## Tech Stack

- React + TypeScript
- Vite for build system
- QRCode.js for QR code generation
- JSZip for creating the .pkpass archive
- Crypto-JS for generating SHA-1 hashes

## How It Works

1. User fills in their business card information
2. The app generates a QR code of the contact information in vCard format
3. When the "Download Wallet Card" button is clicked, the app:
   - Creates pass.json with the user's data
   - Includes necessary images (icon.png, logo.png, etc.)
   - Generates a manifest.json with SHA-1 hashes
   - Creates a placeholder signature file
   - Packages everything into a .pkpass zip archive
   - Triggers a download of the .pkpass file

## Converting SVG Assets to PNG

For the .pkpass to work correctly, PNG images are required. Use the included converter:

1. Navigate to `/svg-converter.html` in the browser while running the dev server
2. Click the "Convert SVGs to PNGs" button
3. Save the generated PNG files
4. Place them in the `src/assets/icons` folder

## Deployment

The app can be deployed to GitHub Pages or any static site hosting:

```bash
# Build the app
npm run build

# Deploy to GitHub Pages (requires gh-pages package)
npm run deploy
```

## License

MIT
