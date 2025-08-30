const deepl = require('deepl-node');

// The environment variable is automatically available as process.env.
const authKey = process.env.DEEPL_API_KEY;

if (!authKey) {
  console.error('DEEPL_API_KEY environment variable is not set.');
  // Return an error for the client if the key is missing.
  // This is a safety check and shouldn't happen in a deployed environment.
  return (req, res) => {
    res.status(500).json({ error: 'Server configuration error.' });
  };
}

const translator = new deepl.Translator(authKey);

// This is the main function that handles requests to our endpoint.
// It's an async function because we'll be making an API call.
module.exports = async (req, res) => {
  // We only want to handle POST requests for translation.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Check for a text body in the request.
  const { text, targetLang } = req.body;
  if (!text || !targetLang) {
    return res.status(400).json({ error: '`text` and `targetLang` are required.' });
  }

  try {
    // Use the DeepL client to translate the text.
    // The source language is automatically detected (null for auto).
    const result = await translator.translateText(text, null, targetLang);

    // Send the translated text back to the client.
    return res.status(200).json({ translatedText: result.text });
  } catch (error) {
    console.error('DeepL API error:', error);
    return res.status(500).json({ error: 'Translation failed.' });
  }
};