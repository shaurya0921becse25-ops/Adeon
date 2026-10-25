import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Send, CheckCheck, MessageSquare, ArrowLeft } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { quickReplies } from "../data/chats";
import { formatTime } from "../utils/dates";
import "./Chat.css";

export const Chat = () => {
  const navigate = useNavigate();
  const { threads, activeThreadId, setActiveThreadId, sendMessage, isTyping } = useChat();
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const activeThread = threads.find((t) => t.threadId === activeThreadId) || threads[0] || null;

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages, isTyping]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeThread) return;
    sendMessage(activeThread.threadId, inputText);
    setInputText("");
  };

  const handleQuickReplyClick = (replyText) => {
    if (!activeThread) return;
    sendMessage(activeThread.threadId, replyText);
  };

  if (threads.length === 0) {
    return (
      <div className="container" style={{ padding: "40px 20px 80px", textAlign: "center" }}>
        <div style={{ textAlign: "left", marginBottom: "24px" }}>
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/trip"))}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "9999px",
              background: "#FFFFFF",
              border: "1.5px solid #91B8C7",
              color: "#2B4E5B",
              fontSize: "0.9rem",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(118, 95, 83, 0.08)",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            aria-label="Back"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
        </div>
        <MessageSquare size={48} className="text-taupe-muted" style={{ margin: "0 auto 16px" }} />
        <h2 className="font-heading">No Active Guide Chats</h2>
        <p className="text-taupe-soft" style={{ margin: "12px auto 24px", maxWidth: 440 }}>
          Direct chat unlocks once you have a confirmed booking with a local guide.
        </p>
        <Link to="/trip" className="btn btn-primary">
          Explore Experiences
        </Link>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="container" style={{ paddingTop: "20px", marginBottom: "16px" }}>
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/trip"))}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 18px",
            borderRadius: "9999px",
            background: "#FFFFFF",
            border: "1.5px solid #91B8C7",
            color: "#2B4E5B",
            fontSize: "0.9rem",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(118, 95, 83, 0.08)",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          aria-label="Back"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      <div className="container chat-container-box">
        {/* Left Column: Conversation Threads */}
        <aside className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2 className="font-heading chat-list-title">Guide Messages</h2>
            <span className="badge badge-aegean">{threads.length}</span>
          </div>

          <div className="chat-threads-list">
            {threads.map((thread) => {
              const isActive = thread.threadId === activeThread?.threadId;
              const lastMsg = thread.messages[thread.messages.length - 1];

              return (
                <div
                  key={thread.threadId}
                  className={`chat-thread-item ${isActive ? "active" : ""}`}
                  onClick={() => setActiveThreadId(thread.threadId)}
                >
                  <img
                    src={thread.providerAvatar}
                    alt={thread.providerName}
                    className="thread-avatar"
                    onError={(e) => {
                      e.currentTarget.src = "/agam-profile.jpg";
                    }}
                  />
                  <div className="thread-content-col">
                    <div className="flex items-center justify-between">
                      <span className="thread-host-name font-semibold">{thread.providerName}</span>
                      <span className="thread-time text-xs text-taupe-soft">
                        {formatTime(thread.lastMessageTimestamp)}
                      </span>
                    </div>
                    <div className="thread-service-name text-xs text-aegean-deep font-medium">
                      {thread.serviceTitle}
                    </div>
                    <p className="thread-last-snippet text-xs text-taupe-soft">
                      {lastMsg?.text || "Conversation started"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Column: Chat Feed & Controls */}
        <main className="chat-main-area">
          {activeThread ? (
            <>
              {/* Chat Header */}
              <div className="chat-active-header">
                <div className="flex items-center gap-3">
                  <img
                    src={activeThread.providerAvatar}
                    alt={activeThread.providerName}
                    className="active-header-avatar"
                    onError={(e) => {
                      e.currentTarget.src = "/agam-profile.jpg";
                    }}
                  />
                  <div>
                    <h3 className="active-host-name font-heading">{activeThread.providerName}</h3>
                    <div className="active-sub-status text-xs text-taupe-soft flex items-center gap-1">
                      <span className="online-indicator-dot" />
                      <span>{activeThread.serviceTitle}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/service/${activeThread.serviceId}`}
                    className="btn btn-secondary btn-sm"
                  >
                    View Service
                  </Link>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="chat-messages-viewport">
                <div className="security-notice-chip text-center">
                  <span>🔒 Messages are private & encrypted. Booking Ref: {activeThread.bookingId}</span>
                </div>

                {activeThread.messages.map((msg) => {
                  const isUser = msg.sender === "user";

                  return (
                    <div
                      key={msg.id}
                      className={`chat-message-bubble-row ${isUser ? "user-row" : "guide-row"}`}
                    >
                      {!isUser && (
                        <img
                          src={activeThread.providerAvatar}
                          alt={activeThread.providerName}
                          className="msg-guide-avatar"
                        />
                      )}
                      <div className={`message-bubble ${isUser ? "user-bubble" : "guide-bubble"}`}>
                        <div className="msg-text">{msg.text}</div>
                        <div className="msg-meta-row">
                          <span className="msg-time">{formatTime(msg.timestamp)}</span>
                          {isUser && (
                            <span className="msg-receipt">
                              <CheckCheck size={14} className="text-aegean" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Simulated Typing Indicator */}
                {isTyping && (
                  <div className="chat-message-bubble-row guide-row typing-indicator-row">
                    <img
                      src={activeThread.providerAvatar}
                      alt={activeThread.providerName}
                      className="msg-guide-avatar"
                    />
                    <div className="message-bubble guide-bubble typing-bubble">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Chips */}
              <div className="quick-replies-tray">
                <span className="quick-label text-xs text-taupe-soft">Suggested:</span>
                <div className="quick-chips-scroll">
                  {quickReplies.map((reply, i) => (
                    <button
                      key={i}
                      type="button"
                      className="quick-chip"
                      onClick={() => handleQuickReplyClick(reply)}
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSend} className="chat-input-bar">
                <input
                  type="text"
                  className="chat-text-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${activeThread.providerName}...`}
                />
                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={!inputText.trim()}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="empty-chat-state text-center">
              <p>Select a conversation from the left to start chatting.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
