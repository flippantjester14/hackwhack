import React, { useState } from "react";

const ChatBot = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [pdfAvailable, setPdfAvailable] = useState(false);

  // Start the chat with the Flask backend
  const startChat = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/start_chat", {
        method: "POST",
      });
      const data = await response.json();
      setChatMessages([{ role: "bot", message: data.message }]);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  // Send a message to the Flask backend
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...chatMessages, { role: "user", message: userInput }];
    setChatMessages(newMessages);
    setUserInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/process_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await response.json();

      setChatMessages([
        ...newMessages,
        { role: "bot", message: data.message },
      ]);

      // Check if PDF is available
      if (data.pdf_available) {
        setPdfAvailable(true);
      }

      // If there's a follow-up question, add it to the messages
      if (data.next_question) {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { role: "bot", message: data.next_question },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Send the PDF via WhatsApp using Twilio API
  const sendPdfToWhatsApp = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/send_whatsapp_pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: prompt("Enter your WhatsApp number (e.g., +123456789):"),
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("PDF sent to WhatsApp successfully!");
      } else {
        alert("Failed to send PDF to WhatsApp.");
      }
    } catch (error) {
      console.error("Error sending PDF to WhatsApp:", error);
    }
  };

  // Handle the Enter key press to send messages
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Chat with Dr. Lah Wada
        </h2>
        <div className="h-64 overflow-y-auto mb-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700">
          {chatMessages.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              Click "Start Chat" to begin the conversation.
            </div>
          )}
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.role === "bot"
                  ? "text-left text-blue-600"
                  : "text-right text-gray-700 dark:text-gray-300"
              }`}
            >
              <strong>{msg.role === "bot" ? "Dr. Lah Wada: " : "You: "}</strong>
              {msg.message}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isChatLoading || chatMessages.length === 0}
          />
          <button
            onClick={sendMessage}
            className={`px-4 py-2 rounded-lg ${
              isChatLoading
                ? "bg-gray-500 text-white cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={isChatLoading || chatMessages.length === 0}
          >
            {isChatLoading ? "Sending..." : "Send"}
          </button>
        </div>
        <div className="flex justify-between">
          <button
            onClick={startChat}
            className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
          >
            Start Chat
          </button>
          {pdfAvailable && (
            <div className="flex gap-2">
              <button
                onClick={() =>
                  window.open("http://127.0.0.1:5000/download_report", "_blank")
                }
                className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
              >
                Download PDF
              </button>
              <button
                onClick={sendPdfToWhatsApp}
                className="px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600"
              >
                Send to WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
