import { useState, useEffect } from "react";
import { Search, Send, CheckCheck, Phone, Video } from "lucide-react";
import Card from "../ui/card";
import {
  loadChatThreads,
  saveChatThreads,
  subscribeToDataChanges
} from "../data/sharedDataBridge";

export default function Messages() {
  const [chats, setChats] = useState(() => {
    return loadChatThreads();
  });

  const [activeId, setActiveId] = useState(() => {
    const list = loadChatThreads();
    return list[0]?.threadId || list[0]?.id || null;
  });

  const [text, setText] = useState("");
  const [search, setSearch] = useState("");

  // Subscribe to real-time incoming messages from traveler in user guide
  useEffect(() => {
    const unsubscribe = subscribeToDataChanges((type, payload) => {
      if (type === "chats" && Array.isArray(payload)) {
        setChats(payload);
      }
    });
    return () => unsubscribe();
  }, []);

  // Normalize active chat
  const activeChat =
    chats.find(c => (c.threadId || c.id) === activeId) || chats[0] || null;

  const handleSend = () => {
    if (!text.trim() || !activeChat) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg = {
      id: "msg-" + Date.now(),
      from: "me",
      sender: "guide",
      text: text.trim(),
      time: timeStr,
      timestamp: new Date().toISOString(),
      status: "read"
    };

    const currentChatId = activeChat.threadId || activeChat.id;

    setChats(prev => {
      const updated = prev.map(c => {
        const id = c.threadId || c.id;
        if (id === currentChatId) {
          return {
            ...c,
            lastMsg: text.trim(),
            time: timeStr,
            lastMessageTimestamp: newMsg.timestamp,
            messages: [...(c.messages || []), newMsg],
          };
        }
        return c;
      });
      // Save to shared bridge, which notifies user guide in real time
      saveChatThreads(updated);
      return updated;
    });

    setText("");
  };

  const getChatName = (c) => c.userName || c.name || "Traveler";
  const getChatService = (c) => c.serviceTitle || c.service || "Himalayan Experience";
  const getChatAvatar = (c) =>
    c.userAvatar || c.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80";
  const getChatLastMsg = (c) =>
    c.lastMsg || (c.messages && c.messages.length ? c.messages[c.messages.length - 1].text : "");
  const getChatTime = (c) =>
    c.time || (c.lastMessageTimestamp ? new Date(c.lastMessageTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now");

  const filtered = chats.filter(c =>
    getChatName(c).toLowerCase().includes(search.toLowerCase()) ||
    getChatService(c).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="messages-page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Messages</h1>
          <p className="page-sub">
            Connected live with <strong>User Guide</strong>. Communicate directly with your travelers and answer queries.
          </p>
        </div>
      </div>

      <div className="messages-layout">
        {/* Chat List */}
        <Card className="chat-list-card">
          <div className="chat-search">
            <Search size={16} />
            <input
              placeholder="Search conversations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="chat-users-list">
            {filtered.map(c => {
              const currentId = c.threadId || c.id;
              const isSelected = activeChat && (activeChat.threadId || activeChat.id) === currentId;
              const unread = c.unreadCount ?? c.unread ?? 0;

              return (
                <div
                  key={currentId}
                  className={`chat-user-item ${isSelected ? "active" : ""}`}
                  onClick={() => {
                    setActiveId(currentId);
                    setChats(prev => {
                      const updated = prev.map(item =>
                        (item.threadId || item.id) === currentId ? { ...item, unread: 0, unreadCount: 0 } : item
                      );
                      saveChatThreads(updated);
                      return updated;
                    });
                  }}
                >
                  <div className="chat-avatar-wrap">
                    <img src={getChatAvatar(c)} alt={getChatName(c)} className="chat-avatar" />
                    <span className="online-indicator" />
                  </div>
                  <div className="chat-user-meta">
                    <div className="chat-user-top">
                      <span className="chat-user-name">{getChatName(c)}</span>
                      <span className="chat-time">{getChatTime(c)}</span>
                    </div>
                    <div className="chat-service-tag">{getChatService(c)}</div>
                    <div className="chat-snippet">
                      <span>{getChatLastMsg(c)}</span>
                      {unread > 0 && <span className="chat-unread-badge">{unread}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Active Conversation */}
        {activeChat ? (
          <Card className="conversation-card">
            <div className="convo-header">
              <div className="convo-user">
                <div className="chat-avatar-wrap">
                  <img src={getChatAvatar(activeChat)} alt={getChatName(activeChat)} className="chat-avatar" />
                  <span className="online-indicator" />
                </div>
                <div>
                  <h4 className="convo-name">{getChatName(activeChat)}</h4>
                  <p className="convo-sub">{getChatService(activeChat)} · Online in User Guide</p>
                </div>
              </div>
              <div className="convo-actions">
                <button
                  className="icon-btn"
                  title="Voice call"
                  onClick={() => alert(`Starting voice call with ${getChatName(activeChat)} (+91 98765 43210)...`)}
                >
                  <Phone size={18} />
                </button>
                <button
                  className="icon-btn"
                  title="Video briefing"
                  onClick={() => alert(`Launching pre-trek video briefing room with ${getChatName(activeChat)}...`)}
                >
                  <Video size={18} />
                </button>
              </div>
            </div>

            <div className="convo-messages">
              <div className="chat-date-divider">
                <span>Direct Data Exchange • Live Traveler Thread</span>
              </div>

              {(activeChat.messages || []).map((m, idx) => {
                const isFromGuide = m.from === "me" || m.sender === "guide";

                return (
                  <div key={m.id || idx} className={`convo-bubble-wrap ${isFromGuide ? "sent" : "received"}`}>
                    <div className="convo-bubble">
                      <p>{m.text}</p>
                      <span className="bubble-meta">
                        {m.time || (m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Now")}
                        {isFromGuide && <CheckCheck size={13} className="check-icon" />}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="convo-input-bar">
              <input
                placeholder={`Message ${getChatName(activeChat).split(" ")[0]} in User Guide...`}
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
              />
              <button className="btn btn-primary send-btn" onClick={handleSend}>
                <Send size={16} />
                <span>Send</span>
              </button>
            </div>
          </Card>
        ) : (
          <Card className="conversation-card" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#888" }}>Select a conversation to reply to travelers.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
