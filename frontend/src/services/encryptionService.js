
// AES Encryption Service
export class EncryptionService {
  static async generateKey() {
    return await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  static async encryptData(data, key) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);
    
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encodedData
    );

    return {
      encryptedData: new Uint8Array(encryptedData),
      iv: iv
    };
  }

  static async decryptData(encryptedData, key, iv) {
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encryptedData
    );

    return new TextDecoder().decode(decryptedData);
  }

  static async encryptFile(file, keyString) {
    // Convert string key to CryptoKey
    const keyData = new TextEncoder().encode(keyString.padEnd(32, '0').slice(0, 32));
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const fileBuffer = await file.arrayBuffer();
    
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      cryptoKey,
      fileBuffer
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);

    return combined;
  }

  static async decryptFile(encryptedBuffer, keyString) {
    // Convert string key to CryptoKey
    const keyData = new TextEncoder().encode(keyString.padEnd(32, '0').slice(0, 32));
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    // Extract IV and encrypted data
    const iv = encryptedBuffer.slice(0, 12);
    const encryptedData = encryptedBuffer.slice(12);

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      cryptoKey,
      encryptedData
    );

    return decryptedData;
  }
}
