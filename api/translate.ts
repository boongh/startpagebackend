// This check is a common practice to only load dotenv in development,
// since Vercel and other platforms handle environment variables automatically.
import 'dotenv/config'

console.log(process.env)

const deepl = require('deepl-node');
const authKey = process.env.DEEPL_API_KEY;

// Initialize translator only if we have the key
let translator;
if (authKey) {
  translator = new deepl.DeepLClient(authKey);
}

export async function GET(request: Request) {
  // For GET requests, there's typically no body, but you can access URL parameters
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);
  
  return new Response(JSON.stringify({
    method: request.method,
    url: request.url,
    params: params
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request: Request) {
  try {
    let start = new Date().getMilliseconds();
    if(!authKey) throw new Error("No Auth key");
    // Or parse as JSON if you expect JSON
    const body = await request.json();
    
    // Or get as FormData if you expect form data
    // const body = await request.formData();
    const response = await translator.translateText(body.text, null, body.targetLang);

    let end = new Date().getMilliseconds()

    response.timetook = end;
    return new Response(JSON.stringify(response))
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to parse request body',
      message: error.message
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}