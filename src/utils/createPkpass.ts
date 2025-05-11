import JSZip from 'jszip';
import { SHA1 } from 'crypto-js';

// Wallet platform types
export type WalletPlatform = 'apple' | 'android' | 'both';

// Define the types for our business card data
export interface BusinessCardData {
  fullName: string;
  title: string;
  phone: string;
  email: string;
  website: string;
}

/**
 * Generate a vCard string from user data
 * @param data User's business card data
 * @returns vCard formatted string
 */
export function generateVCard(data: BusinessCardData): string {
  const { fullName, title, phone, email, website } = data;
  
  // Create vCard format (RFC 2426)
  return `BEGIN:VCARD
VERSION:3.0
N:${fullName.split(' ').reverse().join(';')}
FN:${fullName}
TITLE:${title}
TEL;TYPE=CELL:${phone}
EMAIL:${email}
URL:${website}
END:VCARD`;
}

/**
 * Convert SVG content to PNG data URL
 * This is a basic implementation - in production you might want to use a more robust SVG-to-PNG converter
 * @param svgContent SVG content as string
 * @returns Promise resolving to data URL
 */
async function svgToPng(svgContent: string, width: number, height: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load SVG'));
    
    // Create a blob URL from the SVG content
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    img.src = URL.createObjectURL(blob);
  });
}

/**
 * Convert data URL to Blob
 * @param dataURL Data URL string
 * @returns Blob object
 */
function dataURLToBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Generate a .pkpass file from user data
 * @param data User's business card data
 * @param platform Target wallet platform (apple, android, or both)
 * @returns Promise resolving to Blob containing the .pkpass file
 */
export async function createPkpass(data: BusinessCardData, platform: WalletPlatform = 'both'): Promise<Blob> {
  try {
    const zip = new JSZip();
    
    // Load SVG assets from public folder
    const iconResponse = await fetch('/src/assets/icons/icon.svg');
    const logoResponse = await fetch('/src/assets/icons/logo.svg');
    const stripResponse = await fetch('/src/assets/icons/strip.svg');
    const thumbnailResponse = await fetch('/src/assets/icons/thumbnail.svg');
    
    const iconSvg = await iconResponse.text();
    const logoSvg = await logoResponse.text();
    const stripSvg = await stripResponse.text();
    const thumbnailSvg = await thumbnailResponse.text();
    
    // Convert SVGs to PNGs
    const iconPng = await svgToPng(iconSvg, 58, 58);
    const logoPng = await svgToPng(logoSvg, 180, 110);
    const stripPng = await svgToPng(stripSvg, 180, 220);
    const thumbnailPng = await svgToPng(thumbnailSvg, 29, 29);
      // Create pass.json content
    const passJson = {
      formatVersion: 1,
      passTypeIdentifier: 'pass.com.example.businesscard', // In production, this would be your Pass Type ID
      serialNumber: `${Date.now()}`,
      teamIdentifier: 'ABCDE12345', // In production, this would be your Team ID
      organizationName: data.fullName,
      description: `Business card for ${data.fullName}`,
      logoText: data.fullName,
      foregroundColor: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(79, 70, 229)', // Indigo-600
      labelColor: 'rgb(224, 231, 255)', // Indigo-100
      // Add support for both Apple Wallet and Google Pay formats
      barcode: {
        message: generateVCard(data),
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'utf-8',
        altText: data.fullName
      },
      // Add barcodes as array for Android compatibility
      barcodes: [{
        message: generateVCard(data),
        format: 'PKBarcodeFormatQR',
        messageEncoding: 'utf-8',
        altText: data.fullName
      }],
      generic: {
        primaryFields: [
          {
            key: 'name',
            label: 'Name',
            value: data.fullName
          }
        ],
        secondaryFields: [
          {
            key: 'title',
            label: 'Title',
            value: data.title
          }
        ],
        auxiliaryFields: [
          {
            key: 'phone',
            label: 'Phone',
            value: data.phone
          },
          {
            key: 'email',
            label: 'Email',
            value: data.email
          },
          {
            key: 'website',
            label: 'Website',
            value: data.website
          }
        ]
      }
    };
    
    // Add files to the zip
    zip.file('pass.json', JSON.stringify(passJson, null, 2));
    zip.file('icon.png', dataURLToBlob(iconPng));
    zip.file('logo.png', dataURLToBlob(logoPng));
    zip.file('strip.png', dataURLToBlob(stripPng));
    zip.file('thumbnail.png', dataURLToBlob(thumbnailPng));
      // Generate manifest with SHA-1 hashes of all files
    const manifest: Record<string, string> = {};
    
    manifest['pass.json'] = SHA1(JSON.stringify(passJson, null, 2)).toString();
    
    // Convert ArrayBuffer to string before hashing
    const iconBlob = dataURLToBlob(iconPng);
    const logoBlob = dataURLToBlob(logoPng);
    const stripBlob = dataURLToBlob(stripPng);
    const thumbnailBlob = dataURLToBlob(thumbnailPng);
    
    // Read blobs as text for hashing
    manifest['icon.png'] = SHA1(await new Response(iconBlob).text()).toString();
    manifest['logo.png'] = SHA1(await new Response(logoBlob).text()).toString();
    manifest['strip.png'] = SHA1(await new Response(stripBlob).text()).toString();
    manifest['thumbnail.png'] = SHA1(await new Response(thumbnailBlob).text()).toString();
      zip.file('manifest.json', JSON.stringify(manifest, null, 2));
    
    // In a real implementation, we would add a signature file here
    // But for demo purposes, we'll just add a placeholder
    zip.file('signature', 'This is a placeholder for the real signature that would be added here.');
    
    // Add Android-specific files if requested
    if (platform === 'android' || platform === 'both') {
      // Create a Google Pay compatible JSON file
      const googlePayJson = {
        iss: 'digital-business-card-generator',
        iat: Math.floor(Date.now() / 1000),
        typ: 'googlewallet',
        payload: {
          genericObjects: [{
            id: `businesscard-${Date.now()}`,
            genericType: 'GENERIC_TYPE_UNSPECIFIED',
            cardTitle: {
              defaultValue: {
                language: 'en-US',
                value: data.fullName
              }
            },
            subheader: {
              defaultValue: {
                language: 'en-US',
                value: data.title
              }
            },
            header: {
              defaultValue: {
                language: 'en-US',
                value: 'Business Card'
              }
            },
            textModulesData: [
              {
                id: 'phone',
                header: 'Phone',
                body: data.phone
              },
              {
                id: 'email',
                header: 'Email',
                body: data.email
              },
              {
                id: 'website',
                header: 'Website',
                body: data.website
              }
            ],
            barcode: {
              type: 'QR_CODE',
              value: generateVCard(data),
              alternateText: data.fullName
            },
            hexBackgroundColor: '#4F46E5',
          }]
        }
      };
      
      // Add the Google Pay file to the zip
      zip.file('google-pay.json', JSON.stringify(googlePayJson, null, 2));
    }
    
    // Generate the zip file
    return await zip.generateAsync({ type: 'blob' });
  } catch (error) {
    console.error('Error creating .pkpass file:', error);
    throw error;
  }
}

/**
 * Download a blob as a file
 * @param blob Blob to download
 * @param filename Filename to use
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
