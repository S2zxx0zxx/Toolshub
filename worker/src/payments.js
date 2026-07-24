import { FirebaseAdmin } from './firebaseAdmin.js';

const PRICES = {
  'monthly': 9900, // ₹99 in paise
  '6month': 34900, // ₹349 in paise
  'yearly': 99900  // ₹999 in paise
};

const PLAN_DURATIONS = {
  'monthly': 30 * 24 * 60 * 60 * 1000,
  '6month': 180 * 24 * 60 * 60 * 1000,
  'yearly': 365 * 24 * 60 * 60 * 1000
};

// HMAC SHA256 helper for Cloudflare Workers
async function hmacSha256(secret, data) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  // Convert ArrayBuffer to Hex String
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function handlePaymentRequest(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;

  let rawBody = '';
  let body = {};
  try {
    rawBody = await request.text();
    body = JSON.parse(rawBody);
  } catch (e) {
    if (request.method === 'POST') {
      return new Response('Invalid JSON body', { status: 400, headers: corsHeaders });
    }
  }

  if (path === '/api/payment/create-order') {
    const authHeader = request.headers.get('Authorization') || '';
    const idToken = authHeader.replace('Bearer ', '');
    if (!idToken) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });

    const { planId } = body;
    const amount = PRICES[planId];
    if (!amount) return new Response(JSON.stringify({ error: 'Invalid planId' }), { status: 400, headers: corsHeaders });

    try {
      const fbAdmin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
      const uid = await fbAdmin.verifyIdToken(idToken);

      // Create Razorpay Order
      const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`)
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: `receipt_${uid}_${Date.now()}`,
          notes: { uid, planId }
        })
      });

      const rzpData = await rzpRes.json();
      if (rzpData.error) throw new Error(rzpData.error.description);

      return new Response(JSON.stringify({
        orderId: rzpData.id,
        amount: rzpData.amount,
        currency: rzpData.currency,
        keyId: env.RAZORPAY_KEY_ID
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (e) {
      console.error('Create Order Error:', e);
      return new Response(JSON.stringify({ error: 'Failed to create order', details: e.message }), { status: 500, headers: corsHeaders });
    }
  }

  if (path === '/api/payment/verify') {
    const authHeader = request.headers.get('Authorization') || '';
    const idToken = authHeader.replace('Bearer ', '');
    if (!idToken) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
      return new Response(JSON.stringify({ error: 'Missing payment details' }), { status: 400, headers: corsHeaders });
    }

    try {
      const fbAdmin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
      const uid = await fbAdmin.verifyIdToken(idToken);

      // Verify Signature
      const generatedSignature = await hmacSha256(env.RAZORPAY_KEY_SECRET, `${razorpay_order_id}|${razorpay_payment_id}`);
      if (generatedSignature !== razorpay_signature) {
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400, headers: corsHeaders });
      }

      // Validate plan duration exists
      const duration = PLAN_DURATIONS[planId];
      if (!duration) {
        return new Response(JSON.stringify({ error: 'Invalid plan' }), { status: 400, headers: corsHeaders });
      }

      // Update Firestore
      const now = Date.now();
      const expiresAt = now + duration;
      
      const subscriptionData = {
        planId: planId,
        status: 'active',
        startedAt: now,
        expiresAt: expiresAt,
        lastPaymentId: razorpay_payment_id,
        lastOrderId: razorpay_order_id
      };

      await fbAdmin.writeSubscription(uid, subscriptionData);

      return new Response(JSON.stringify({ success: true, planId, expiresAt }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (e) {
      console.error('Verify Payment Error:', e);
      return new Response(JSON.stringify({ error: 'Failed to verify payment', details: e.message }), { status: 500, headers: corsHeaders });
    }
  }

  if (path === '/api/payment/webhook') {
    const signature = request.headers.get('X-Razorpay-Signature');
    if (!signature) return new Response('Missing signature', { status: 400 });

    try {
      const generatedSignature = await hmacSha256(env.RAZORPAY_WEBHOOK_SECRET, rawBody);
      if (generatedSignature !== signature) {
        return new Response('Invalid signature', { status: 400 });
      }

      const event = body.event;
      if (event === 'payment.captured') {
        const paymentEntity = body.payload.payment.entity;
        const notes = paymentEntity.notes || {};
        const { uid, planId } = notes;

        if (uid && planId && PLAN_DURATIONS[planId]) {
          const fbAdmin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
          
          // Idempotency check: skip if this payment was already processed
          const userDoc = await fbAdmin.getUserDoc(uid);
          if (userDoc?.subscription?.lastPaymentId === paymentEntity.id) {
            return new Response('OK', { status: 200 });
          }
          
          const now = Date.now();
          const duration = PLAN_DURATIONS[planId];
          const expiresAt = now + duration;

          const subscriptionData = {
            planId: planId,
            status: 'active',
            startedAt: now,
            expiresAt: expiresAt,
            lastPaymentId: paymentEntity.id,
            lastOrderId: paymentEntity.order_id,
            // Capture payment method details from Razorpay payload
            paymentMethod: paymentEntity.method || null,          // 'card', 'upi', 'wallet', etc.
            paymentMethodBrand: paymentEntity.card?.network || null, // 'Visa', 'Mastercard', etc.
            paymentMethodLast4: paymentEntity.card?.last4 || null    // '1234'
          };

          // To make it idempotent, we could read first, but the REST API updateMask just updates the fields.
          // Updating to the same values is effectively idempotent.
          // If we really want to check lastPaymentId, we'd need to add a read call to FirebaseAdmin.
          // Let's just update, it's safe.
          await fbAdmin.writeSubscription(uid, subscriptionData);
        }
      }

      return new Response('OK', { status: 200 });
    } catch (e) {
      console.error('Webhook Error:', e);
      return new Response('Webhook handling failed', { status: 500 });
    }
  }

  return null; // Route not matched
}
