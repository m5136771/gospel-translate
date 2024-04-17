const { Translate } = require("@google-cloud/translate").v2;
const translateClient = new Translate();

// TODO: Add API rate limits

/**
 * Translates text to the specified target language and sends the translation over a WebSocket.
 * @param {string} text - The text to be translated.
 * @param {string} target - The target language code (e.g., 'pt', 'es').
 * @param {WebSocket} ws - The WebSocket connection to send results to.
 */

async function translateText (text, target, ws) {
  if (!text || !target) {
    console.error("Invalid input: text and target language are required.");
    return;
  }

  try {
    const [translation] = await translateClient.translate(text, target);
    console.log(`Translation (${target}): ${translation}`);
    ws.send(JSON.stringify({ translation }));
  } catch (error) {
    console.error("Error during translation:", error);
    ws.send(JSON.stringify({ error: "Failed to translate due to server error." }));
  }
};

module.exports = { translateText };