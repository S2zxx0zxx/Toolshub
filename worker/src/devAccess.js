export async function handleDevAccessRedeem(request, env, corsHeaders) {
  try {
    const body = await request.json();
    if (!body || !body.uid || !body.code) {
      return new Response(JSON.stringify({ error: 'Missing uid or code' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }
    const devCode = env.DEV_ACCESS_CODE || 'BUILD2026';
    if (body.code !== devCode) {
      return new Response(JSON.stringify({ error: 'Invalid developer code' }), { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    const { FirebaseAdmin } = await import('./firebaseAdmin.js');
    const fbAdmin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
    
    // 1. Verify Authorization Header
    const authHeader = request.headers.get('Authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing token' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }
    const token = authHeader.split(' ')[1];
    
    let tokenUid;
    try {
      tokenUid = await fbAdmin.verifyIdToken(token);
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    if (tokenUid !== body.uid) {
      return new Response(JSON.stringify({ error: 'Token UID mismatch' }), { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    // 2. Authorization check (Fetch user doc to check email)
    const userDoc = await fbAdmin.getUserDoc(tokenUid);
    const ALLOWED_DEVELOPERS = ['satyamk82476@gmail.com'];
    if (!userDoc || !userDoc.email || !ALLOWED_DEVELOPERS.includes(userDoc.email.toLowerCase())) {
      return new Response(JSON.stringify({ error: 'Not an authorized developer account' }), { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    
    // Update user's firestore document with the expiry timestamp
    await fbAdmin.updateDevAccess(body.uid, expiresAt);

    return new Response(JSON.stringify({ success: true, devAccessExpiresAt: expiresAt }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json', ...corsHeaders } 
    });
  } catch (error) {
    console.error('Error redeeming dev access:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  }
}
