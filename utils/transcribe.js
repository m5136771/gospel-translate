const WebSocket = require("ws");

const speech = require("@google-cloud/speech");
const recorder = require("node-record-lpcm16");
const { translateText } = require("./translate");
const ws = new WebSocket("ws://localhost:3001");


ws.on("open", function open() {
  console.log("Connected to WebSocket server from transcribe.js");
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

// Google Cloud Speech-to-Text client
const speechClient = new speech.SpeechClient();
const targetLanguage = "pt";

/**
 * Starts transcription service, listens to microphone input, and sends transcriptions for translation.
 */
const transcribe = () => {
  const request = {
    config: getConfig(),
    single_utterance: false, // If false, the stream will continue to listen and process audio until either the stream is closed directly, or the stream's limit length has been exceeded.
    interimResults: false, // Indicates that this stream request should return temporary results that may be refined at a later time (after processing more audio).
    // Interim results will be noted within responses through the setting of is_final to false.
  };

  const recognizeStream = createRecognizeStream(request);

  startRecording(recognizeStream);
};

const getConfig = () => ({
  encoding: "LINEAR16",
  sampleRateHertz: 16000,
  languageCode: "en-US",
  alternativeLanguageCodes: ["es-mx", "fr-fr", "pt-BR"],
  profanityFilter: true,
  // TODO: improve accuracy with model adaptation (https://cloud.google.com/speech-to-text/docs/adaptation-model)
  enableAutomaticPunctuation: true,
  //TODO: diarizationConfig (https://cloud.google.com/speech-to-text/docs/reference/rest/v1/RecognitionConfig#SpeakerDiarizationConfig)
  model: "default",
  useEnhanced: true,
});

const createRecognizeStream = (request) => {
  return speechClient
    .streamingRecognize(request)
    .on("error", (error) => {
      console.error("Error in Google Speech-to-Text API:", error);
    })
    .on("data", (data) => processTranscriptionData(data));
};

const processTranscriptionData = (data) => {
  if (data.results[0] && data.results[0].alternatives[0]) {
    const transcript = data.results[0].alternatives[0].transcript;
    const language = data.results[0].languageCode;
    console.log(`Transcription (${language}): ${transcript}`);
    if (data.results[0].isFinal) {
      translateText(transcript, targetLanguage, ws);
    }
  }
};

const startRecording = (recognizeStream) => {
  recorder
    .record({
      sampleRateHertz: 16000,
      threshold: 0,
      recordProgram: "rec",
      silence: "10.0",
    })
    .stream()
    .on("error", (error) => {
      console.error("Error in audio recording:", error);
    })
    .pipe(recognizeStream);

  console.log("Listening, press Ctrl+C to stop.");
};

transcribe();