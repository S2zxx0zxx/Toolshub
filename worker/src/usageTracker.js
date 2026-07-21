export async function checkAndIncrementDailyUsage(fbAdmin, uid, dailyLimit, env) {
  if (!uid || dailyLimit === Infinity) return { allowed: true };
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC
  const token = await fbAdmin.getAccessToken();
  const docPath = `users/${uid}/usage/${today}`;
  const url = `https://firestore.googleapis.com/v1/projects/${fbAdmin.projectId}/databases/(default)/documents/${docPath}`;

  const getRes = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
  let count = 0;
  if (getRes.status === 200) {
    const data = await getRes.json();
    count = parseInt(data.fields?.count?.integerValue || '0', 10);
  }

  if (count >= dailyLimit) {
    return { allowed: false, count };
  }

  await fetch(`${url}?updateMask.fieldPaths=count&updateMask.fieldPaths=updatedAt`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: { count: { integerValue: String(count + 1) }, updatedAt: { integerValue: String(Date.now()) } } })
  });

  return { allowed: true, count: count + 1 };
}
