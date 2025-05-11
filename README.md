# Digital Business Card Generator

A fully client-side web application that allows users to create and download digital business cards as Apple Wallet (.pkpass) files without relying on any external services.

## Features

- **Simple Form Interface**: Enter your name, title, contact info, and website
- **QR Code Generation**: Automatically creates a QR code with your contact information
- **Apple Wallet Card**: Generate a .pkpass file compatible with Apple Wallet
- **100% Client-Side**: All processing happens in the browser, with no data sent to servers
- **Downloadable Cards**: Save your digital business card for sharing

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

## Important Notes

- The generated .pkpass files are not officially signed, so they may not work on all devices
- This is a demo implementation showing the technical concept
- For production use, proper Apple Developer certificates would be required

## Development

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# Clone the repository
git clone https://github.com/username/digital-business-card-generator.git
cd digital-business-card-generator

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building for Production

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
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
