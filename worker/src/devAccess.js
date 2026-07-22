export async function handleDevAccessRedeem(request, env, corsHeaders) {
  try {
    const body = await request.json();
    if (!body || !body.uid || !body.code) {
      return new Response(JSON.stringify({ error: 'Missing uid or code' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }
    if (body.code !== 'BUILD2026') {
      return new Response(JSON.stringify({ error: 'Invalid developer code' }), { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    const { FirebaseAdmin } = await import('./firebaseAdmin.js');
    const fbAdmin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
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
