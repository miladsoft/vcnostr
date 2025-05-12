# Digital Business Card Generator

A web application that allows users to create digital business cards for Apple Wallet and Google Wallet.

## Features

- **Simple Form Interface**: Enter your name, title, contact info, and website
- **QR Code Generation**: Automatically creates a QR code with your contact information
- **Apple Wallet Card**: Generate a .pkpass file compatible with Apple Wallet
- **Google Wallet Card**: Generate a .gpay file compatible with Google Wallet
- **100% Client-Side**: All processing happens in the browser, with no data sent to servers
- **Downloadable Cards**: Save your digital business card for sharing

## Important Notice About Wallet Files

Currently, the generated wallet files (.pkpass for Apple Wallet and .gpay for Google Wallet) **will not work** when attempting to add them to your mobile wallet applications. This is because:

1. **Apple Wallet (.pkpass) Files**: 
   - Require proper code signing with an Apple Developer certificate
   - Need a valid Pass Type ID registered with Apple
   - Require proper cryptographic signature with a valid certificate

2. **Google Wallet (.gpay) Files**:
   - Require proper Google Pay API integration
   - Need valid Google Pay API credentials
   - Must be properly formatted JSON with valid issuer details

### Current Implementation Limitations

The current implementation creates a structurally correct ZIP file with the necessary file structure, but:

- It uses placeholder values for Pass Type ID and Team ID
- It includes a placeholder for the signature file instead of an actual cryptographic signature
- It's not signed with a valid Apple Developer certificate

### What You Download

When you click on "Generate for Apple/Android Wallet", you download a file that:
- Has the correct internal structure
- Contains your business card data
- Includes the necessary images
- But lacks the proper cryptographic signatures required by wallet apps

### Production Implementation Requirements

To create working wallet passes in a production environment, you would need:

#### For Apple Wallet:
1. An Apple Developer account ($99/year)
2. A Pass Type ID registered with Apple
3. A valid certificate for signing passes
4. Proper implementation of cryptographic signing

#### For Google Wallet:
1. A Google Cloud account
2. Google Pay API credentials
3. Proper JWT token signing

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
