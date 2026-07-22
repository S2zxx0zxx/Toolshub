export async function recordUsageStat(fbAdmin, modelId, toolCategory, env) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const docPath = `projects/${fbAdmin.projectId}/databases/(default)/documents/dailyUsageStats/${today}`;
    
    const fieldTransforms = [
      { fieldPath: "totalRequests", increment: { integerValue: "1" } },
      { fieldPath: "updatedAt", setToServerValue: "REQUEST_TIME" }
    ];
    
    if (modelId) {
      // Escape modelId to handle special characters like '.' and '/' in field paths
      const safeModelId = '`' + modelId.replace(/`/g, '') + '`';
      fieldTransforms.push({ fieldPath: `modelUsage.${safeModelId}`, increment: { integerValue: "1" } });
    }
    
    if (toolCategory) {
      const safeCategory = '`' + toolCategory.replace(/`/g, '') + '`';
      fieldTransforms.push({ fieldPath: `toolUsage.${safeCategory}`, increment: { integerValue: "1" } });
    }
    
    const token = await fbAdmin.getAccessToken();
    const payload = {
      writes: [
        {
          update: {
            name: docPath,
            fields: {
              date: { stringValue: today }
            }
          },
          updateTransforms: fieldTransforms
        }
      ]
    };
    
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/${fbAdmin.projectId}/databases/(default)/documents:commit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to commit usage stat:", errorText);
    }
  } catch (err) {
    console.error("Error in recordUsageStat:", err);
    // Deliberately swallowed to avoid failing the user's request
  }
}
