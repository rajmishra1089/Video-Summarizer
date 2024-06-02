const {OpenAI} =require("openai");
const transcript = require("../utility/transcript");

require('dotenv').config();

const apiKey = process.env.API_KEY

const openai = new OpenAI({
  apiKey: apikey,
});


const checkAns = async(req,res)=>{
  try{
    const {question,answer,videoURL} = req.body;
    const transcriptText = await transcript(videoURL);
    let response;
  async function generateChatResponse(question,answer,userMessage) {
      console.log("2")
      response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
          {
              role: "system",
              content: `You are a highly skilled AI trained language which provides feedback on the correctness of the given question and answer pair based on the provided transcript.The answer need not be exactly correct but the keywords should be present.Do not question the question just answer correct or not`
            },
            { role: "user", content: `check for the correctness of the question answer pair using the transcript : ${userMessage}\nquestion : ${question}\nanswer:${answer}` }
          ],
        });
        console.log("3")
        console.log(response.choices[0]?.message?.content || "");
        res.status(200).json({result:response.choices[0]?.message?.content || ""});
      }
      await generateChatResponse(question,answer,transcriptText);
  }catch(error){

  }
}

const langChange = async(req,res)=>{
    try{
      const {text} = req.body;
      let response;
    async function generateChatResponse(userMessage) {
        console.log("2")
        response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
                role: "system",
                content: `You are a highly skilled AI trained language Translator. I would like you to convert the text into hindi language`
              },
              { role: "user", content: userMessage }
            ],
          });
          console.log("3")
          console.log(response.choices[0]?.message?.content || "");
          res.status(200).json({result:response.choices[0]?.message?.content || ""});
        }
        await generateChatResponse(text);
    }catch(error){

    }
}

const anyPrompt = async(req, res, next) => {
    try {
      const { prompt , videoURL } = req.body;
      const transcriptText = await transcript(videoURL);
      let response;
      console.log(transcriptText);
      console.log("In the anyPrompt server above function")
      async function generateChatResponse(prompt,userMessage) {
        console.log("In the anyPrompt server inside function")
          console.log("2")
          response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            messages: [
              {
                  role: "system",
                  content: `You are a highly skilled AI trained a chatbot."`
                },
                { role: "user", content: `${userMessage} \n the below is the prompt , answer it based on above text \n ${prompt}` }
                // ${userMessage} Answer the below prompt based on the above text 
              ],
            });
            console.log("3")
            console.log(response.choices[0]?.message?.content || "");
            res.status(200).json({result:response.choices[0]?.message?.content || ""});
          }
          await generateChatResponse(prompt,transcriptText);  
    } catch (error) {
      console.log('In catch server');
      res.status(500).json({ message: error.message })
    }
};

//CORRECT the summarize API by calling the getTranscript function correctly!
const summarize = async (req, res, next) => {
  try {
    const { videoURL } = req.body;
    const toSummarize = await transcript(videoURL);
    let response;
    async function generateChatResponse(userMessage) {
        console.log("2")
        response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
                role: "system",
                content: `You are a highly skilled AI trained in language comprehension and summarization. I would like you to read the following text and summarize it into a concise abstract paragraph. Aim to retain the most important points, providing a coherent and readable summary that could help a person understand the main points of the discussion without needing to read the entire text. Please avoid unnecessary details or tangential points.Do make sure you dont exceept ${toSummarize.length / 2} words.At the End provide the keypoints aswell`
              },
              { role: "user", content: userMessage }
            ],
          });
          console.log("3")
          console.log(response.choices[0]?.message?.content || "");
          res.status(200).json({result:response.choices[0]?.message?.content || ""});
        }
        await generateChatResponse(toSummarize);
        // const text =  response.choices[0]?.message?.content || "";
    // console.log(toSummarize);
    // const txt = `Give the Summary of the following youtube video transcript :\n "${toSummarize}"`;

    // console.log(txt);
    // const result = await client.generateText({
    //   model: MODEL_NAME,
    //   prompt: {
    //     text: txt,
    //   },
    // });
    // console.log(result);
  } catch (error) {
    console.log("I am here in catch of summary controller");
    res.status(500).json({ message: error.message });
  }
};

//CORRECT the quiz API by calling the getTranscript function correctly!
const quiz = async(req, res, next) => {
  try{
      const { videoURL } = req.body;
      const toQuiz = await transcript(videoURL);
      console.log(toQuiz)
      let response;
    async function generateChatResponse(userMessage) {
        console.log("2")
        response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-1106",
          messages: [
            {
                role: "system",
                content: `You are a highly skilled AI trained in creating questions.I would like you to create appropriate questions from the given text.Make sure no question gets repeated .the maximum number of questions should not exceed more than 12.The Output formate should be question followed by ?.For Example "1. What is his name?"`
              },
              { role: "user", content: userMessage }
            ],
          });
          console.log("3")
          console.log(response.choices[0]?.message?.content || "");
          res.status(200).json({result:response.choices[0]?.message?.content || ""});
        }
        await generateChatResponse(toQuiz);
      // const prompt = `Create a MCQ quiz on the following text: ${toQuiz}`;
      // const result = await client.generateText({
      //   model: MODEL_NAME,
      //   prompt: {
      //     text: prompt,
      //   },
      // });
      // res.status(200).json(result[0].candidates[0].output);
  } catch (error) {
    console.log('Some problem in quiz')
    res.status(500).json({ message: error.message })
  }
};


module.exports = { anyPrompt, summarize, quiz ,langChange,checkAns};