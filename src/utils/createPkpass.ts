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
    
    // Define SVG assets as inline strings
    const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58 58"><rect width="58" height="58" rx="10" fill="#4F46E5"/><text x="29" y="36" font-family="Arial" font-size="24" font-weight="bold" fill="white" text-anchor="middle">BC</text></svg>`;
    const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 110"><rect width="180" height="110" rx="10" fill="#4F46E5" fill-opacity="0.8"/><text x="90" y="60" font-family="Arial" font-size="18" font-weight="bold" fill="white" text-anchor="middle">BUSINESS CARD</text></svg>`;
    const stripSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 220"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" /><stop offset="100%" style="stop-color:#3730A3;stop-opacity:1" /></linearGradient></defs><rect width="180" height="220" fill="url(#grad)"/></svg>`;
    const thumbnailSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29"><circle cx="14.5" cy="14.5" r="14.5" fill="#4F46E5"/><text x="14.5" y="19" font-family="Arial" font-size="12" font-weight="bold" fill="white" text-anchor="middle">BC</text></svg>`;
    
    // Convert SVGs to PNGs
    const iconPng = await svgToPng(iconSvg, 58, 58);
    const logoPng = await svgToPng(logoSvg, 180, 110);
    const stripPng = await svgToPng(stripSvg, 180, 220);
    const thumbnailPng = await svgToPng(thumbnailSvg, 29, 29);
    
    // Create pass.json content with proper identifiers
    const passJson = {
      formatVersion: 1,
      passTypeIdentifier: 'pass.com.digitalcard.businesscard',  // This should be registered with Apple
      serialNumber: `${Date.now()}`,
      teamIdentifier: 'YOURTEAMIDxxx', // This should be your actual Apple Team ID
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
      },
      // Adding Apple Wallet specific web service details
      webServiceURL: 'https://yourwebservice.com/passes/',
      authenticationToken: 'vxwxd7J8AlNNFPS8k0a0FfUFtq0ewzFdc',
      // Add relevant URLs for automatic updates
      locations: [
        {
          longitude: -122.3748889,
          latitude: 37.6189722,
          relevantText: "Your digital business card"
        }
      ]
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
    
    // In a real implementation, we would add a proper signature file here
    // For demo purposes, we'll just add a placeholder
    // This is why the pass doesn't work on real devices
    zip.file('signature', 'This is a placeholder for the real signature that would be added here.');
    
    // Add Android-specific files if requested
    if (platform === 'android' || platform === 'both') {
      // Create a Google Pay compatible JSON file
      const googlePayJson = {
        iss: 'your-issuer-id@gmail.com', // This should be registered with Google Pay API
        iat: Math.floor(Date.now() / 1000),
        typ: 'savetowallet',  // Changed from "googlewallet" to "savetowallet" for compatibility
        payload: {
          // Changed to follow official Google Pay Pass API structure
          genericObjects: [{
            id: `businesscard-${Date.now()}`,
            classId: "your-class-id", // Should be registered in Google Pay API console
            genericType: "GENERIC_TYPE_UNSPECIFIED",
            logo: {
              sourceUri: {
                uri: `https://yourdomain.com/logos/${data.fullName.replace(/\s+/g, '-')}.png`
              }
            },
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
            // Added links to make it work with Google Wallet
            linksModuleData: {
              uris: [
                {
                  uri: `https://yourwebsite.com/contact/${data.fullName.replace(/\s+/g, '-')}`,
                  description: "Contact Information"
                }
              ]
            }
          }]
        },
        // Add JWT signature details for Google Pay
        "exp": Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // Valid for 1 year
      };
      
      // Add the Google Pay file to the zip
      zip.file('google-pay.json', JSON.stringify(googlePayJson, null, 2));
    }
    
    // Generate the zip file
    return await zip.generateAsync({ type: 'blob' });
  } catch (error) {
    console.error('Error creating wallet file:', error);
    throw error;
  }
}

/**
 * Download a blob as a file with appropriate MIME type
 * @param blob Blob to download
 * @param filename Filename to use
 */
export function downloadBlob(blob: Blob, filename: string): void {
  // Set the correct MIME type based on file extension
  let mimeType;
  
  if (filename.endsWith('.pkpass')) {
    mimeType = 'application/vnd.apple.pkpass';
  } else if (filename.endsWith('.gpay')) {
    mimeType = 'application/vnd.google.pay.pass-data+json';
  } else {
    mimeType = 'application/octet-stream';
  }
  
  // Create a blob with the correct MIME type
  const blobWithMimeType = new Blob([blob], { type: mimeType });
  
  // Check if on iOS device
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  
  if (isIOS && filename.endsWith('.pkpass')) {
    // For iOS devices, we need to open the file directly rather than downloading it
    // This approach works better for handling .pkpass files
    
    // First create a data URL with the proper MIME type
    const reader = new FileReader();
    
    reader.onload = function() {
      const dataUrl = reader.result as string;
      
      // Create an iframe to handle the file opening (this trick works better on iOS)
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Set a timeout to ensure the iframe is ready
      setTimeout(() => {
        if (iframe.contentWindow) {
          // Navigate the iframe to the data URL
          iframe.contentWindow.location.href = dataUrl;
          
          // Clean up after a delay
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 5000);
        } else {
          // Fallback if iframe approach doesn't work
          window.location.href = dataUrl;
        }
      }, 100);
    };
    
    reader.readAsDataURL(blobWithMimeType);
    return;
  }
  
  // For non-iOS or non-pkpass files, use standard download approach
  const url = URL.createObjectURL(blobWithMimeType);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  
  // For mobile Safari and some other browsers
  a.setAttribute('rel', 'noopener noreferrer');
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Clean up the object URL
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}
