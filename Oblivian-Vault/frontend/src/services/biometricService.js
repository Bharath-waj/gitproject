
// WebAuthn Biometric Authentication Service
export class BiometricService {
  static async isSupported() {
    return window.PublicKeyCredential && 
           await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }

  static async createCredential(userId) {
    const publicKeyCredentialCreationOptions = {
      challenge: new Uint8Array(32),
      rp: {
        name: "Oblivian Vault",
        id: window.location.hostname,
      },
      user: {
        id: new TextEncoder().encode(userId),
        name: userId,
        displayName: userId,
      },
      pubKeyCredParams: [{alg: -7, type: "public-key"}],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required"
      },
      timeout: 60000,
      attestation: "direct"
    };

    return await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions
    });
  }

  static async authenticate() {
    const publicKeyCredentialRequestOptions = {
      challenge: new Uint8Array(32),
      allowCredentials: [],
      timeout: 60000,
      userVerification: "required"
    };

    return await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions
    });
  }
}
