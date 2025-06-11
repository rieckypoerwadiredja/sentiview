import React, { useState } from "react";
import PropTypes from "prop-types";
import { Send } from "lucide-react";
import {
  addAiMessage,
  addUserMessage,
  conversationPredict,
} from "../../utils/convercation";

function InputAI({
  platform,
  statusUserSendMsg,
  statusAiSendMsg,
  loadingAiResponse,
}) {
  const [userInput, setUserInput] = useState("");

  const onSubmit = async (e, text) => {
    e.preventDefault();
    addUserMessage(platform, text);
    setUserInput("");
    statusUserSendMsg(true);
    loadingAiResponse(true);
    const data = await conversationPredict(text);

    // Jika ingin tampilkan responsenya ke UI:
    if (data && data.sentiment) {
      addAiMessage(platform, data.id, data.response);
      statusAiSendMsg(true);
    } else {
      addAiMessage(platform, data.id, data.error);
      statusAiSendMsg(true);
    }

    loadingAiResponse(false);
    statusUserSendMsg(false);
  };
  return (
    <div className="p-4 bg-white border-t">
      <div className="max-w-4xl mx-auto">
        <form className="relative" onSubmit={(e) => onSubmit(e, userInput)}>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <div className="w-6 h-6 rounded-full bg-[#ffcc85] flex items-center justify-center">
              <span className="text-xs">🐶</span>
            </div>
          </div>
          <textarea
            rows={1}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="pl-12 pr-12 py-6 rounded-full w-full bg-white border border-gray-200"
            placeholder="What's in your mind?..."
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-[#3a30ba] hover:bg-[#4550e5] flex items-center justify-center p-0"
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

InputAI.propTypes = {};

export default InputAI;
