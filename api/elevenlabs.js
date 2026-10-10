// Vercel Serverless Function Proxy for ElevenLabs
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'ELEVENLABS_API_KEY not configured on server' });
  }

  try {
    const { text, voiceId = 'Xb7hH8MSUJpSbSDYk0k2', modelId = 'eleven_multilingual_v2', voiceSettings } = req.body || {};

    if (!text || typeof text !== 'string' || text.length > 600) {
      return res.status(400).json({ error: 'Invalid or missing text (max 600 chars)' });
    }

    const payload = {
      text,
      model_id: modelId,
      voice_settings: voiceSettings || {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      }
    };

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `ElevenLabs upstream error: ${errText}` });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).send(buffer);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
