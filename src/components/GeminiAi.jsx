import axios from "axios";
import { marked } from "marked";
import { useState } from "react";
import "./chatbot.css";
const GeminiAi = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { type: "bot", content: "Welcome! How can I be of service today?" },
  ]);
  const [loading, setLoading] = useState(false);

  async function makeAnswer() {
    setLoading(true);

    // Add user question to messages
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", content: question },
    ]);

    try {
      const res = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCuYYYa0uox7mDqPrRsO73KB1n98137A6M",
        method: "POST",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      // Add bot response to messages
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "bot",
          content: res.data.candidates[0].content.parts[0]["text"],
        },
      ]);
      console.log(res.data.candidates[0].content.parts[0]["text"]);
    } catch (error) {
      console.error("Error fetching answer:", error);
    } finally {
      setQuestion("");
      setLoading(false);
    }
  }

  function refreshMessages() {
    setMessages([
      { type: "bot", content: "Welcome! How can I assist you today?" },
    ]);
  }

  return (
    <div className="text-center w-fill mx-auto overflow-hidden ">
      <div className="title text-white   flex justify-between">
        <h3 className="text-slate-50 text-center text-5xl px-2 py-10">
          Chat Bot AI
        </h3>
        <button
          onClick={refreshMessages}
          className="text-slate-50 rounded-lg px-4 py-2 text-xl"
        >
          refresh
        </button>
      </div>
      <div className="conversation overflow-auto h-[75vh] p-2 ">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`py-4 px-4 my-2 ${
              message.type === "user"
                ? "user text-white rounded-bl-lg  rounded-tr-lg rounded-br-lg self-end text-right text-xl"
                : "chatbot text-white rounded-l-lg rounded-br-lg  self-start text-left text-xl"
            }`}
            dangerouslySetInnerHTML={{ __html: marked(message.content) }}
          ></div>
        ))}
        {loading && (
          <div className="flex items-center">
            <svg
              className="animate-spin mr-2 h-5 w-5 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 4.418 3.582 8 8 8v-4c-2.628 0-4.919-1.057-6.627-2.709l2.382-2.382c1.053.78 2.324 1.259 3.776 1.259V17.29z"
              ></path>
            </svg>
            <span>Loading...</span>
          </div>
        )}
      </div>
      <div className="">
        <form
          className="flex"
          onSubmit={(e) => {
            e.preventDefault();
            makeAnswer();
          }}
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="p-4 flex-1 rounded-bl-lg focus:outline-none bg-slate-300"
            placeholder="Type your message here..."
          />
          <button type="submit" className="border-2 order-0  py-2 px-3 z-50">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 500 500"
            >
              <g>
                <g>
                  <polygon points="0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75" />
                </g>
              </g>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiAi;
