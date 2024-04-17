const fs = require("fs");
const WebSocket = require("ws");
const ws = new WebSocket("ws://localhost:3001");

// Imports the Google Cloud client library
const speech = require("@google-cloud/speech");
const recorder = require("node-record-lpcm16");
const { translateText } = require("./translate");

// Creates a client
const speechClient = new speech.SpeechClient();

// const filename = "./Holland.mp3";

ws.on('open', function open() {
  console.log('Connected to WebSocket server from transcribe.js');
});

const transcribe = () => {
  const request = {
    config: {
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
    },
    single_utterance: false, // If false, the stream will continue to listen and process audio until either the stream is closed directly, or the stream's limit length has been exceeded.
    interimResults: false, // Indicates that this stream request should return temporary results that may be refined at a later time (after processing more audio).
    // Interim results will be noted within responses through the setting of is_final to false.
  };

  const recognizeStream = speechClient
    .streamingRecognize(request)
    .on("error", console.error)
    .on("data", async (data) => {
      if (data.results[0] && data.results[0].alternatives[0]) {
        const transcript = data.results[0].alternatives[0].transcript;
        const language = data.results[0].languageCode;
        console.log(`Transcription (${language}): ${transcript}`);
        if (data.results[0].isFinal) {
          // Only translate final results
          console.log(`Final transcription: ${transcript}`); // Log to confirm
          translateText(transcript, "pt", ws); // Passing the transcript for translation
        }
      }
    });

  recorder
      .record({
          sampleRateHertz: 16000,
          threshold: 0,
          verbose: false,
          recordProgram: 'rec',
          silence: '10.0', // 10 seconds of silence will signal the end of the recording
      })
      .stream()
      .on('error', console.error)
      .pipe(recognizeStream);

  console.log("Listening, press Ctrl+C to stop.");

  // Stream an audio file from disk to the Speech API, e.g. "./resources/audio.raw"
  // fs.createReadStream(filename).pipe(recognizeStream);
};

transcribe();
