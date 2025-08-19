
export async function generateWithGemini(apiKey: string, history: Array<{role: 'user'|'model', parts: string}>) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + encodeURIComponent(apiKey);
  const payload = {
    contents: history.map(h => ({ role: h.role, parts: [{ text: h.parts }]})),
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error('Gemini API error: ' + res.status + ' ' + t);
  }
  const data = await res.json();
  const txt = data?.candidates?.[0]?.content?.parts?.map((p:any)=>p.text).join('\n') || '';
  return txt;
}
