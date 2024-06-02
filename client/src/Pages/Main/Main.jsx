import React, { useCallback, useEffect, useState } from "react";
import { RiSendPlane2Fill } from "react-icons/ri";
import { MdSummarize } from "react-icons/md"
import { sendReqToServer } from "../../../api/useAxios";
import { USER, axios } from "../../../api";
import PropTypes from "prop-types";

function QuestionInput({ state,question }) {
  const [userInput, setUserInput] = useState("");

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`Submitted answer for ${question}: ${userInput}`);
    try {
        const { response, error } = await sendReqToServer({
            axiosInstance: axios,
            url: USER.checkAns,
            method: "POST",
            requestConfig: {
                question:question,
                answer: userInput,
                videoURL:state.videoLink,
            },
        });
        console.log(response);
        if (response) {
            alert(response.result)
        }
    }
    catch (err) {
        console.log('In client error handleSubmit')
        console.log(err)
    }
  };

  return (
//     <div style={{ marginBottom: '20px' }}>
//   <h3>{question}</h3>
//   <form onSubmit={handleSubmit}>
//     <textarea
//       rows={4} // Adjust the number of rows as needed
//       value={userInput}
//       onChange={handleInputChange}
//       placeholder="Enter your answer (up to 2 lines)"
//       style={{ width: '100%', marginBottom: '10px', resize: 'vertical' }}
//     />
//     <br />
//     <button type="submit">Submit</button>
//   </form>
// </div>

<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '60px' }}>
  <h3 className="p-2">{question}</h3>
  <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <textarea
      rows={4} // Adjust the number of rows as needed
      value={userInput}
      onChange={handleInputChange}
      placeholder="Enter your answer (up to 2 lines)"
      style={{ width: '60%', marginBottom: '20px', resize: 'vertical', textAlign: 'center' }}
      className="border border-slate-900"
    />
    <div className="w-full flex place-content-end">
        <button
        type="submit"
        style={{
            backgroundColor: 'blue',
            color: 'white',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        }}
        className="mx-[150px]"
        >
        Check
        </button>
    </div>
  </form>
</div>

  );
}

QuestionInput.propTypes = {
  question: PropTypes.string.isRequired,
};

export default function Main() {
    const [state, setState] = useState({
        videoId: "",
        videoLink: "",
        transcript: "",
        promptValue: "",
        chat: [],
    });

    const [questions, setQuestions] = useState("");
    const [questionSet,setQuestionSet] = useState([]);
    const [onQuiz, setOnQuiz] = useState(false);

    const extractVideoId = (link) => {
        const regex = /[?&]v=([^&]+)/;
        const match = link.match(regex);
        return match && match[1];
    };

    const getTranscript = useCallback(async (videoLink) => {
        try {
            const { response, error } = await sendReqToServer({
                axiosInstance: axios,
                url: USER.getTranscript,
                method: "POST",
                requestConfig: {
                    videoURL: videoLink,
                },
            });

            if (response) {
                setState((prevState) => ({
                    ...prevState,
                    transcript: response.transcript,
                }));
            }
        } catch (err) {
            console.log(err);
        }
    }, []);

    const summarize = async (videoLink) => {
        try {
            const { response, error } = await sendReqToServer({
                axiosInstance: axios,
                url: USER.summarize,
                method: "POST",
                requestConfig: {
                    videoURL: videoLink,
                },
            });
            console.log(response);
            if (response) {
                const updatedChat = [
                    ...state.chat,
                    { question: "Summarize the video for me", answer: response.result },
                ];

                setState((prevState) => ({
                    ...prevState,
                    chat: updatedChat,
                }));
            }
        }
        catch (err) {
            console.log('In client error summary')
            console.log(err)
        }
    }

    const genQuiz = async (videoLink) => {
        try {
            const { response, error } = await sendReqToServer({
                axiosInstance: axios,
                url: USER.quiz,
                method: "POST",
                requestConfig: {
                    videoURL: videoLink,
                },
            });
            console.log('I am above response if statement')
            console.log(response);
            if (response) {
                // console.log(response);
                console.log(response)
                setQuestions(response.result);
            }
            setOnQuiz(true);
        }
        catch (err) {
            console.log('Client side quiz error')
            console.log(err)
        }
    }

        const promptResult = async (value) => {
        try {
            const { response, error } = await sendReqToServer({
                axiosInstance: axios,
                url: USER.anyPrompt,
                method: "POST",
                requestConfig: {
                    prompt: value,
                    videoURL:state.videoLink,
                },
            });

            if (response) {
                console.log(response)
                // Update the chat item with both question and answer
                const updatedChat = [
                    ...state.chat,
                    { question: value, answer: response.result },
                ];

                setState((prevState) => ({
                    ...prevState,
                    chat: updatedChat,
                }));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getResult = async () => {
        // Call the promptResult function with the question
        promptResult(state.promptValue);
    };

    const handelLang = async () => {
        const updatedChat = []; // Initialize an array to hold the updated chat items

        // Iterate over each item in the chat array
        for (const item of state.chat) {
            const questi = item.question;
            const answ = item.answer;
            let hindiansw = ""; // Initialize translated answer to Hindi

            try {
                // Translate the answer to Hindi
                const { response, error } = await sendReqToServer({
                    axiosInstance: axios,
                    url: USER.langChange,
                    method: "POST",
                    requestConfig: {
                        text: answ,
                    },
                });

                if (response) {
                    hindiansw = response.result; // Set the translated answer to Hindi
                }
            } catch (err) {
                console.log('Error translating answer:', err);
                // If translation fails, set the translated answer to the original answer
                hindiansw = answ;
            }

            // Push the updated chat item to the array
            updatedChat.push({
                question: questi,
                answer: hindiansw,
            });
        }

        // Update the state with the updated chat array
        setState(prevState => ({
            ...prevState,
            chat: updatedChat,
        }));
    };



    useEffect(() => {
        const savedVideoLink = localStorage.getItem("videoLink");
        const extractedVideoId = extractVideoId(savedVideoLink);

        setState((prevState) => ({
            ...prevState,
            videoLink: savedVideoLink || "",
            videoId: extractedVideoId || "",
        }));

        if (savedVideoLink) {
            getTranscript(savedVideoLink);
        }
    }, [getTranscript]);
    // Function to handle sending a message (you can implement your logic here)
    const statements = questions.split("\n")
    return (
        <div>
            {
                 
                onQuiz ? (
                    // const regex = /\n/;

                    // Split the paragraph into an array of statements
                    // const statements = paragraph.split("\n");
                    <div className="flex flex-col justify-center items-center my-4">
                        <div className="flex justify-around w-full ">
                            <p>TakeQuiz</p>
                            <header className="text-[32px] ">Quiz</header>
                            <button className="font-medium md:text-md lg:text-lg font-raleway text-[#15213c] p-3 rounded-md bg-[#85B1CC] hover:shadow-md hover:shadow-[#3B5594]"
                            onClick={()=>{setOnQuiz(false)}}
                            >Back</button>
                        </div>
                        <div>
                            {statements.map((question, index) => (
                                <QuestionInput key={index} question={question} state={state} />
                            ))}
                        </div>
                        <button className="font-medium md:text-md lg:text-lg font-raleway text-[#15213c] p-3 rounded-md bg-[#85B1CC] hover:shadow-md hover:shadow-[#3B5594]"
                            onClick={()=>{setOnQuiz(false)}}
                        >Back</button>
                    </div>
                ) :
                    (
                    <div className="w-screen h-screen overflow-hidden gap-4 flex p-2 md:p-4">
                    <div className="h-full w-full overflow-hidden">
                <section className="flex h-full w-full flex-col justify-center items-center">
                    <div className="h-full w-full">
                        <div className="h-full rounded bg-[#686882]/70 shadow-lg backdrop-blur flex flex-col overflow-hidden">
                            <div className="w-full p-1 relative flex justify-center bg-slate-900">
                                {/* <div className="flex items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#EC6A5F]"></div>
                                    <div className="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#F4BF50]"></div>
                                    <div className="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#61C454]"></div>
                                    <svg width="24" height="24" fill="none" className="ml-4 flex-none text-slate-400 dark:text-slate-500"><path d="m15 7-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                    <svg width="24" height="24" fill="none" className="ml-2 flex-none text-slate-400 dark:text-slate-500"><path d="m10 7 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                </div> */}
                                <div className="">
                                    <div><div className="bg-slate-100 rounded-md font-medium text-xs leading-6 py-1 flex items-center justify-center ring-1 ring-inset ring-slate-900/5 mx-auto px-10 dark:bg-slate-800 dark:text-slate-500">InfiniVerse</div></div>
                                </div>
                            </div>

                            <iframe
                                className="w-full h-full"
                                src= {`https://www.youtube.com/embed/${state.videoId}`}
                                title="YouTube Video Player"
                                allowFullScreen
                            ></iframe>

                        </div>
                    </div>
                    <div className="h-full text-justify mt-2 text-slate-200 w-full p-3 overflow-y-auto rounded bg-gray-800 shadow">
                        {state.transcript}
                    </div>
                </section>
            </div>
            <div className="md:flex hidden w-full h-full md:flex-col overflow-hidden rounded relative bg-gray-700 shadow-lg backdrop-blur">
                <div className="w-full p-3 bg-gray-900 backdrop-blur absolute top-0 left-0 text-slate-100 font-semibold text-center">Chat</div>
                <div className="w-full pb-24 pt-12 overflow-y-auto h-full">
                    <div className=""></div>
                    {state.chat.map((chatItem, index) => (
                        <div key={index}>
                            <div className="py-3 w-full px-6 text-slate-200 bg-gray-800">{chatItem.question}</div>
                            <div className="py-3 w-full px-6 text-slate-200 bg-transparent">{chatItem.answer}</div>
                        </div>
                    ))}
                </div>
                <div className="w-full flex flex-col p-2 bg-gray-800 backdrop-blur absolute bottom-0 left-0">
                    <div className="w-full flex gap-2 mb-2">
                        <button type="button" className="bg-gray-700 text-slate-200 py-2 px-3 rounded-lg" onClick={()=>summarize(state.videoLink)}>Summarize</button>
                        <button type="button" className="bg-gray-700 text-slate-200 py-2 px-3 rounded-lg" onClick={()=>genQuiz(state.videoLink)}>Generate Quiz</button>
                        <button type="button" className="bg-gray-700 text-slate-200 py-2 px-3 rounded-lg" onClick={handelLang}>Hindi</button>
                    </div>
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 21">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z" />
                            </svg>
                        </div>
                        <input type="text" value={state.promptValue} onChange={(e) => {
                            setState((prevState) => ({
                                ...prevState,
                                promptValue: e.target.value
                            }));
                        }} id="voice-search" className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Send a Message" required />
                        <button type="button" onClick={getResult} className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <RiSendPlane2Fill className="text-gray-400" />
                        </button>

                    </div>
                </div>
            </div>
                </div>
                    )
            }
        </div>
    )
}





// import React, { useCallback, useEffect, useState } from "react";
// import { RiSendPlane2Fill } from "react-icons/ri";
// import { MdSummarize } from "react-icons/md"
// import { sendReqToServer } from "../../../api/useAxios";
// import { USER, axios } from "../../../api";

// export default function Main() {
//     const [state, setState] = useState({
//         videoId: "",
//         videoLink: "",
//         transcript: "",
//         promptValue: "",
//         chat: [],
//     });

//     const [questions, setQuestions] = useState("");
//     const [questionSet,setQuestionSet] = useState([]);
//     const [onQuiz, setOnQuiz] = useState(false);

//     const extractVideoId = (link) => {
//         const regex = /[?&]v=([^&]+)/;
//         const match = link.match(regex);
//         return match && match[1];
//     };

//     const getTranscript = useCallback(async (videoLink) => {
//         try {
//             const { response, error } = await sendReqToServer({
//                 axiosInstance: axios,
//                 url: USER.getTranscript,
//                 method: "POST",
//                 requestConfig: {
//                     videoURL: videoLink,
//                 },
//             });

//             if (response) {
//                 setState((prevState) => ({
//                     ...prevState,
//                     transcript: response.transcript,
//                 }));
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     }, []);

//     const summarize = async (videoLink) => {
//         try {
//             const { response, error } = await sendReqToServer({
//                 axiosInstance: axios,
//                 url: USER.summarize,
//                 method: "POST",
//                 requestConfig: {
//                     videoURL: videoLink,
//                 },
//             });
//             console.log(response);
//             if (response) {
//                 const updatedChat = [
//                     ...state.chat,
//                     { question: "Summarize the video for me", answer: response.result },
//                 ];

//                 setState((prevState) => ({
//                     ...prevState,
//                     chat: updatedChat,
//                 }));
//             }
//         }
//         catch (err) {
//             console.log('In client error summary')
//             console.log(err)
//         }
//     }

//     const genQuiz = async (videoLink) => {
//         try {
//             const { response, error } = await sendReqToServer({
//                 axiosInstance: axios,
//                 url: USER.quiz,
//                 method: "POST",
//                 requestConfig: {
//                     videoURL: videoLink,
//                 },
//             });
//             console.log('I am above response if statement')
//             console.log(response);
//             if (response) {
//                 // console.log(response);
//                 console.log(response)
//                 setQuestions(response.result);
//             }
//             setOnQuiz(true);
//         }
//         catch (err) {
//             console.log('Client side quiz error')
//             console.log(err)
//         }
//     }

//     const promptResult = async (value) => {
//         try {
//             const { response, error } = await sendReqToServer({
//                 axiosInstance: axios,
//                 url: USER.anyPrompt,
//                 method: "POST",
//                 requestConfig: {
//                     prompt: value,
//                     videoURL:state.videoLink,
//                 },
//             });

//             if (response) {
//                 console.log(response)
//                 // Update the chat item with both question and answer
//                 const updatedChat = [
//                     ...state.chat,
//                     { question: value, answer: response.result },
//                 ];

//                 setState((prevState) => ({
//                     ...prevState,
//                     chat: updatedChat,
//                 }));
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     const getResult = async () => {
//         // Call the promptResult function with the question
//         promptResult(state.promptValue);
//     };

//     const handelLang = async () => {
//         const updatedChat = []; // Initialize an array to hold the updated chat items

//         // Iterate over each item in the chat array
//         for (const item of state.chat) {
//             const questi = item.question;
//             const answ = item.answer;
//             let hindiansw = ""; // Initialize translated answer to Hindi

//             try {
//                 // Translate the answer to Hindi
//                 const { response, error } = await sendReqToServer({
//                     axiosInstance: axios,
//                     url: USER.langChange,
//                     method: "POST",
//                     requestConfig: {
//                         text: answ,
//                     },
//                 });

//                 if (response) {
//                     hindiansw = response.result; // Set the translated answer to Hindi
//                 }
//             } catch (err) {
//                 console.log('Error translating answer:', err);
//                 // If translation fails, set the translated answer to the original answer
//                 hindiansw = answ;
//             }

//             // Push the updated chat item to the array
//             updatedChat.push({
//                 question: questi,
//                 answer: hindiansw,
//             });
//         }

//         // Update the state with the updated chat array
//         setState(prevState => ({
//             ...prevState,
//             chat: updatedChat,
//         }));
//     };



//     useEffect(() => {
//         const savedVideoLink = localStorage.getItem("videoLink");
//         const extractedVideoId = extractVideoId(savedVideoLink);

//         setState((prevState) => ({
//             ...prevState,
//             videoLink: savedVideoLink || "",
//             videoId: extractedVideoId || "",
//         }));

//         if (savedVideoLink) {
//             getTranscript(savedVideoLink);
//         }
//     }, [getTranscript]);
//     // Function to handle sending a message (you can implement your logic here)

//     return (
//         <div>
//             {
//                 onQuiz ? (
//                     <div>Hello</div>
//                 ) :
//                     (
//                     <div className="w-screen h-screen overflow-hidden gap-4 flex p-2 md:p-4">
//                     <div className="h-full w-full overflow-hidden">
//                 <section className="flex h-full w-full flex-col justify-center items-center">
//                     <div className="h-full w-full">
//                         <div className="h-full rounded bg-[#686882]/70 shadow-lg backdrop-blur flex flex-col overflow-hidden">
//                             <div className="w-full p-3 px-4 relative flex justify-between bg-slate-900">
//                                 <div className="flex items-center">
//                                     <div className="w-2.5 h-2.5 rounded-full bg-[#EC6A5F]"></div>
//                                     <div className="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#F4BF50]"></div>
//                                     <div className="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#61C454]"></div>
//                                     <svg width="24" height="24" fill="none" className="ml-4 flex-none text-slate-400 dark:text-slate-500"><path d="m15 7-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
//                                     <svg width="24" height="24" fill="none" className="ml-2 flex-none text-slate-400 dark:text-slate-500"><path d="m10 7 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
//                                 </div>
//                                 <div>
//                                     <svg width="24" height="24" fill="none" className="text-slate-400 dark:text-slate-500">
//                                         <path d="M12.5 6a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM12.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM18.5 6a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM18.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM6.5 6a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM6.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM12.5 18a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM18.5 18a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM6.5 18a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
//                                     </svg>
//                                 </div>

//                                 <div className="absolute left-1/2 top-2 -translate-x-1/2">
//                                     <div><div className="bg-slate-100 rounded-md font-medium text-xs leading-6 py-1 flex items-center justify-center ring-1 ring-inset ring-slate-900/5 mx-auto px-10 dark:bg-slate-800 dark:text-slate-500"><svg viewBox="0 0 20 20" fill="currentColor" className="text-slate-300 w-3.5 h-3.5 mr-1.5 dark:text-slate-500"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>NRAM.ai</div></div>
//                                 </div>
//                             </div>

//                             <iframe
//                                 className="w-full h-full"
//                                 src= {`https://www.youtube.com/embed/${state.videoId}`}
//                                 title="YouTube Video Player"
//                                 allowFullScreen
//                             ></iframe>

//                         </div>
//                     </div>
//                     <div className="h-full text-justify mt-2 text-slate-200 w-full p-3 overflow-y-auto rounded bg-gray-800 shadow">
//                         {state.transcript}
//                     </div>
//                 </section>
//             </div>
//             <div className="md:flex hidden w-full h-full md:flex-col overflow-hidden rounded relative bg-gray-700 shadow-lg backdrop-blur">
//                 <div className="w-full p-3 bg-gray-900 backdrop-blur absolute top-0 left-0 text-slate-100 font-semibold text-center">Chatbot</div>
//                 <div className="w-full pb-24 pt-12 overflow-y-auto h-full">
//                     <div className=""></div>
//                     {state.chat.map((chatItem, index) => (
//                         <div key={index}>
//                             <div className="py-3 w-full px-6 text-slate-200 bg-gray-800">{chatItem.question}</div>
//                             <div className="py-3 w-full px-6 text-slate-200 bg-transparent">{chatItem.answer}</div>
//                         </div>
//                     ))}
//                 </div>
//                 <div className="w-full flex flex-col p-2 bg-gray-800 backdrop-blur absolute bottom-0 left-0">
//                     <div className="w-full flex gap-2 mb-2">
//                         <button type="button" className="bg-gray-700 text-slate-200 py-2 px-3 rounded-lg" onClick={()=>summarize(state.videoLink)}>Summarize</button>
//                         <button type="button" className="bg-gray-700 text-slate-200 py-2 px-3 rounded-lg" onClick={()=>genQuiz(state.videoLink)}>Generate Quiz</button>
//                         <button type="button" className="bg-gray-700 text-slate-200 py-2 px-3 rounded-lg" onClick={handelLang}>Hindi</button>
//                     </div>
//                     <div className="relative w-full">
//                         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                             <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 21">
//                                 <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z" />
//                             </svg>
//                         </div>
//                         <input type="text" value={state.promptValue} onChange={(e) => {
//                             setState((prevState) => ({
//                                 ...prevState,
//                                 promptValue: e.target.value
//                             }));
//                         }} id="voice-search" className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Send a Message" required />
//                         <button type="button" onClick={getResult} className="absolute inset-y-0 right-0 flex items-center pr-3">
//                             <RiSendPlane2Fill className="text-gray-400" />
//                         </button>

//                     </div>
//                 </div>
//             </div>
//                 </div>
//                     )
//             }
//         </div>
//     )
// }
