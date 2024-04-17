const { Translate } = require("@google-cloud/translate").v2;
const translateClient = new Translate();

async function translateText (text, target, ws) {
  try {
    const [translation] = await translateClient.translate(text, target);
    console.log(`Translation (${target}): ${translation}`);
    ws.send(JSON.stringify({ translation }));
  } catch (error) {
    console.error("Error during translation:", error);
  }
};

module.exports = { translateText };