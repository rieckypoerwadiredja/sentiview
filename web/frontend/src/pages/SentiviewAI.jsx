import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  RefreshCw,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import InputAI from "../compoenents/fragments/InputAI";
import { deleteAllConversation, getConversation } from "../utils/convercation";
import { useChatScroll } from "../utils/autoScroll";
import { GeneralOpening } from "../compoenents/fragments/OpeningMessage";

export default function SentiviewAI() {
  const [fullSideBar, setFullSideBar] = useState(true);
  const [conversations, setConversations] = useState({});
  const [conversationActive, setConversationsActive] = useState([]);
  const [roomActive, setRoomActive] = useState("");
  const [userSendMsg, setUserSendMsg] = useState(false);
  const [aiSendMsg, setAiSendMsg] = useState(false);
  const [loadingAiResponse, setLoadingAiResponse] = useState(false);
  const ref = useChatScroll(conversationActive);

  useEffect(() => {
    const Conversations = getConversation();
    setConversations(Conversations);
    setUserSendMsg(false);
    setAiSendMsg(false);
    // reload new convercation
    if (roomActive !== "") getConversationByRoom(roomActive);
  }, [userSendMsg, aiSendMsg]);

  const getConversationByRoom = (platform) => {
    const conversationsRoom = conversations[platform] || [];
    setConversationsActive(conversationsRoom);
    setRoomActive(platform);
  };

  const regenerateReseponse = (idAiResponse) => {
    alert(idAiResponse); //todo cari posisinya dmn trs cek sblmnya ada response user kan, panggil ulang
  };

  const convercationRooms = Object.keys(conversations);

  return (
    <div className="flex h-screen bg-[#FFF9F3]">
      <div className="relative">
        <div
          className={`relative ${
            fullSideBar ? "w-64" : "w-20 items-center"
          } border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out overflow-hidden h-screen bg-white`}
        >
          {/* Logo */}
          <Link to="/" className="p-4 flex gap-x-2 items-center">
            <div className="w-8 h-8">
              <img className="max-w-8" src="/logo/sentiview.png" alt="Logo" />
            </div>
            {fullSideBar && (
              <span className="text-lg font-semibold text-gray-800">
                Sentiview
              </span>
            )}
          </Link>

          {/* New Chat Button */}
          <div className="px-4 py-2">
            <button className="w-full p-2 rounded-xl cursor-pointer bg-[#3a30ba] hover:bg-[#4550e5] text-white flex items-center gap-2">
              <Lock size={18} />
              {fullSideBar && <span>New chat</span>}
            </button>
          </div>

          {/* Conversations Header */}
          {fullSideBar && (
            <div className="flex justify-between items-center px-4 py-2 text-sm">
              <span className="text-gray-500">Your conversations</span>
              <button
                onClick={() => deleteAllConversation()}
                className="text-[#3a30ba] text-xs cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Conversation List */}
          <div className="flex-1 overflow-auto">
            <div className="px-4 py-2">
              {convercationRooms.map((conversation) => (
                <div
                  onClick={() => getConversationByRoom(conversation)}
                  className={`flex items-center gap-2 p-2 rounded-xl hover:bg-[#EFF0F1] ${
                    roomActive === conversation && "bg-[#EFF0F1]"
                  } cursor-pointer`}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-gray-500">1</span>
                  </div>
                  {fullSideBar && (
                    <span className="text-sm text-gray-700">
                      {conversation}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Settings & User */}
          <div className="mt-auto">
            <div className="px-4 py-3 flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
              <div className="w-5 h-5 flex items-center justify-center">
                <span className="text-gray-500">⚙️</span>
              </div>
              {fullSideBar && (
                <span className="text-sm text-gray-700">Settings</span>
              )}
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                  <img
                    src="/placeholder.svg?height=32&width=32"
                    alt="User avatar"
                    width={32}
                    height={32}
                  />
                </div>
                {fullSideBar && (
                  <span className="text-sm text-gray-700">Andrew Neilson</span>
                )}
              </div>
              {fullSideBar && (
                <button className="w-6 h-6 rounded-full bg-[#d9d9d9] flex items-center justify-center text-gray-600">
                  <span className="text-xs">↪</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <div className="absolute top-4 -right-4 z-10">
          <button
            className="w-8 h-8 rounded-full bg-[#3a30ba] flex items-center justify-center text-white"
            onClick={() => setFullSideBar(!fullSideBar)}
          >
            {fullSideBar ? (
              <ChevronLeft size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* auto */}
        <div
          ref={ref}
          className="overflow-auto p-8 w-full flex flex-col gap-y-5"
        >
          <div className="max-w-4xl mx-auto bg-white p-4 rounded-xl shadow-lg">
            <GeneralOpening />
            <div className="flex justify-center mb-6">
              <button className="flex items-center gap-2 text-[#3a30ba] border border-[#3a30ba] py-2 px-3 rounded-4xl">
                <RefreshCw size={16} />
                <span>Regenerate response</span>
              </button>
            </div>
          </div>

          {/* convercation */}

          {conversationActive.map((convercation, index) => {
            if (convercation.role === "ai") {
              return (
                <div
                  key={convercation.id || index}
                  className="max-w-4xl w-full mx-auto bg-white p-4 rounded-xl shadow-lg mb-4"
                >
                  <p>{convercation.text}</p>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => regenerateReseponse(convercation.id)}
                      className="flex items-center gap-2 text-[#3a30ba] border border-[#3a30ba] py-2 px-3 rounded-4xl"
                    >
                      <RefreshCw size={16} />
                      <span>Regenerate response</span>
                    </button>
                  </div>
                </div>
              );
            }

            if (convercation.role === "user") {
              return (
                <div
                  key={convercation.id || index}
                  className="max-w-4xl w-full mx-auto mb-4"
                >
                  <p className="text-right">{convercation.text}</p>
                </div>
              );
            }
            return null;
          })}

          {loadingAiResponse && (
            <div className="max-w-4xl w-full mx-auto bg-white p-4 rounded-xl shadow-lg mb-4">
              <p>Loading...</p>
              <div className="flex justify-center mt-4">
                <button className="flex items-center gap-2 text-[#3a30ba] border border-[#3a30ba] py-2 px-3 rounded-4xl">
                  <RefreshCw size={16} />
                  <span>Regenerate response</span>
                </button>
              </div>
            </div>
          )}
        </div>
        {roomActive !== "" ? (
          <InputAI
            platform={roomActive}
            statusUserSendMsg={setUserSendMsg}
            statusAiSendMsg={setAiSendMsg}
            loadingAiResponse={setLoadingAiResponse}
          />
        ) : (
          <div className="p-4 bg-white border-t">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-semibold text-[#cccccc] text-center">
                Select Converation Room
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
