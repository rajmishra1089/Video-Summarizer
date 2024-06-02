const { YoutubeTranscript } = require("youtube-transcript");

const transcript = async (videoURL) => {
  try {
    const result = await YoutubeTranscript.fetchTranscript(videoURL).then((transcript) => {
        const completeText = transcript.map((entry) => entry.text).join(' ');
        return completeText;
      });
  
    return result;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = transcript;
