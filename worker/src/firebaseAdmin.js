export class FirebaseAdmin {
  constructor(serviceAccountJson) {
    this.sa = JSON.parse(serviceAccountJson);
    this.projectId = this.sa.project_id;
    this.accessToken = null;
    this.tokenExp = 0;
  }

  async getAccessToken() {
    const now = Math.floor(Date.now() / 1000);
    if (this.accessToken && now < this.tokenExp - 60) {
      return this.accessToken;
    }

    const header = { alg: 'RS256', typ: 'JWT' };
    const claim = {
      iss: this.sa.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };

    const encodeB64Url = (obj) => btoa(JSON.stringify(obj)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    const signatureInput = `${encodeB64Url(header)}.${encodeB64Url(claim)}`;

    const pemHeader = '-----BEGIN PRIVATE KEY-----';
    const pemFooter = '-----END PRIVATE KEY-----';
    const pemContents = this.sa.private_key.substring(
      this.sa.private_key.indexOf(pemHeader) + pemHeader.length,
      this.sa.private_key.indexOf(pemFooter)
    ).replace(/\s/g, '');
    
    const binaryDerString = atob(pemContents);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
      binaryDer[i] = binaryDerString.charCodeAt(i);
    }

    const key = await crypto.subtle.importKey(
      'pkcs8',
      binaryDer.buffer,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      key,
      new TextEncoder().encode(signatureInput)
    );

    const signatureB64Url = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

    const jwt = `${signatureInput}.${signatureB64Url}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`
    });
    
    const data = await res.json();
    if (!data.access_token) {
      throw new Error('Failed to get access token: ' + JSON.stringify(data));
    }

    this.accessToken = data.access_token;
    this.tokenExp = now + data.expires_in;
    return this.accessToken;
  }

  async verifyIdToken(idToken) {
    const token = await this.getAccessToken();
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${this.projectId}/accounts:lookup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idToken })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    if (!data.users || data.users.length === 0) throw new Error('User not found');
    return data.users[0].localId;
  }

  async writeSubscription(uid, subscriptionData) {
    const token = await this.getAccessToken();
    
    // Convert subscriptionData to Firestore Document format
    const fields = {};
    for (const [key, value] of Object.entries(subscriptionData)) {
      if (typeof value === 'string') fields[key] = { stringValue: value };
      else if (typeof value === 'number') fields[key] = { integerValue: value.toString() }; 
      else if (typeof value === 'boolean') fields[key] = { booleanValue: value };
    }
    
    const firestoreDoc = {
      fields: {
        subscription: {
          mapValue: {
            fields: fields
          }
        }
      }
    };

    const res = await fetch(`https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/users/${uid}?updateMask.fieldPaths=subscription`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(firestoreDoc)
    });
    
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data;
  }
}
