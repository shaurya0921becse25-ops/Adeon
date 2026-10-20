import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Send, MessageSquare, Clock, ShieldCheck, CheckCheck, Paperclip,
  Sparkles, X
} from 'lucide-react';
import {
  selectThreads,
  selectGuides,
  selectAllServices,
  appendMessage,
  markThreadRead
} from '../../store/servicesSlice';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import './TalkToGuideView.css';

const CANNED_REPLIES = [
  'Namaste! Yes, that sounds great. We can easily customize the stops and pacing for your party.',
  'Thanks for reaching out! The morning light at that hour is ideal. I suggest wearing comfortable walking shoes.',
  'Hello! Yes, that date is open on my schedule. I will bring our heritage route zine and water for everyone.',
  'Understood! I know a quiet shortcut right past the main crowds. Looking forward to meeting you!'
];

export default function TalkToGuideView({ initialGuideId = null, attachedService = null }) {
  const dispatch = useDispatch();
  const threads = useSelector(selectThreads);
  const guides = useSelector(selectGuides);
  const services = useSelector(selectAllServices);

  // Active thread selection
  const [activeThreadId, setActiveThreadId] = useState(() => {
    if (initialGuideId) {
      const match = threads.find((t) => t.guideId === initialGuideId);
      if (match) return match.id;
    }
    return threads[0]?.id || null;
  });

  const [inputText, setInputText] = useState('');
  const [activeAttachedService, setActiveAttachedService] = useState(attachedService);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Handle switching initialGuideId if passed from outside
  useEffect(() => {
    if (initialGuideId) {
      const match = threads.find((t) => t.guideId === initialGuideId);
      if (match) {
        setActiveThreadId(match.id);
      } else {
        // If thread doesn't exist, create one
        const newThreadId = `th-${initialGuideId}-${Date.now()}`;
        const guide = guides.find((g) => g.id === initialGuideId);
        dispatch(
          appendMessage({
            threadId: newThreadId,
            message: {
              id: `m-${Date.now()}`,
              guideId: initialGuideId,
              from: 'guide',
              text: `Hello! I'm ${guide?.name || 'your guide'}. Let me know if you have any questions about this service.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          })
        );
        setActiveThreadId(newThreadId);
      }
    }
  }, [initialGuideId, threads, guides, dispatch]);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];
  const activeGuide = guides.find((g) => g.id === activeThread?.guideId) || {};

  // Auto-mark read when thread selected
  useEffect(() => {
    if (activeThread && activeThread.unread > 0) {
      dispatch(markThreadRead(activeThread.id));
    }
  }, [activeThread?.id, dispatch]);

  // Scroll to bottom of message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages?.length, isTyping]);

  const handleSendMessage = (textToSend = null) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeThread) return;

    const travelerMsg = {
      id: `msg-${Date.now()}`,
      from: 'traveler',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      serviceChip: activeAttachedService
        ? { id: activeAttachedService.id, title: activeAttachedService.title }
        : null
    };

    dispatch(
      appendMessage({
        threadId: activeThread.id,
        message: travelerMsg
      })
    );

    setInputText('');
    setActiveAttachedService(null);

    // Simulate Guide typing and canned demo reply after 1.5 - 2.5s
    setIsTyping(true);
    const replyDelay = 1500 + Math.random() * 1000;

    setTimeout(() => {
      setIsTyping(false);
      const randomReply =
        CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];

      const guideReply = {
        id: `msg-guide-${Date.now()}`,
        from: 'guide',
        text: randomReply,
        isDemoReply: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      dispatch(
        appendMessage({
          threadId: activeThread.id,
          message: guideReply
        })
      );
    }, replyDelay);
  };

  const quickQuestions = [
    'Where is the exact meetup point?',
    'Is this walk suitable for children?',
    'Can we shift the start by 30 mins?'
  ];

  return (
    <div className="messages-layout-grid">
      {/* Left: Thread List */}
      <aside className="thread-list-pane">
        <div className="thread-pane-header">
          <h3 className="thread-pane-title">Conversations</h3>
          <span className="thread-count-badge">{threads.length} guides</span>
        </div>

        <div className="thread-items-list" role="tablist">
          {threads.length === 0 ? (
            <p className="no-threads-text">No active messages yet.</p>
          ) : (
            threads.map((t) => {
              const g = guides.find((guide) => guide.id === t.guideId) || {};
              const lastMsg = t.messages[t.messages.length - 1];
              const isActive = t.id === activeThread?.id;

              return (
                <div
                  key={t.id}
                  className={`thread-item-card ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveThreadId(t.id)}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveThreadId(t.id)}
                >
                  <div className="thread-avatar-col">
                    <Avatar src={g.photo} name={g.name || 'Guide'} size="md" />
                    {t.unread > 0 && <span className="thread-unread-dot" />}
                  </div>

                  <div className="thread-info-col">
                    <div className="thread-name-row">
                      <strong className="thread-guide-name">{g.name || 'Local Guide'}</strong>
                      <span className="thread-time-label tabular-nums">
                        {lastMsg?.timestamp || ''}
                      </span>
                    </div>

                    <div className="thread-city-sub">{g.city} &bull; {g.responseTime}</div>

                    <p className="thread-last-snippet">
                      {lastMsg?.text || 'No messages yet'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Right: Active Conversation */}
      <section className="conversation-pane">
        {activeThread ? (
          <>
            {/* Conversation Header */}
            <div className="conversation-header">
              <div className="conv-guide-info">
                <Avatar src={activeGuide.photo} name={activeGuide.name} size="md" />
                <div>
                  <div className="conv-name-row">
                    <strong className="conv-name">{activeGuide.name}</strong>
                    {activeGuide.verified && (
                      <span className="verified-pill">
                        <ShieldCheck size={12} /> verified
                      </span>
                    )}
                    <span className="demo-tag-pill">demo guide</span>
                  </div>
                  <span className="conv-meta">
                    <Clock size={12} /> Responds {activeGuide.responseTime || '< 2h'} &bull;{' '}
                    {(activeGuide.languages || []).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Attached Service Chip Notice */}
            {activeAttachedService && (
              <div className="attached-service-composer-chip">
                <span>Attaching inquiry about: <strong>{activeAttachedService.title}</strong></span>
                <button
                  type="button"
                  onClick={() => setActiveAttachedService(null)}
                  className="chip-remove-btn"
                  aria-label="Remove attached service"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="messages-stream">
              <div className="chat-demo-disclaimer">
                <span>Demo chat &bull; Guide replies are simulated in 1-3 seconds</span>
              </div>

              {activeThread.messages.map((m) => {
                const isTraveler = m.from === 'traveler';

                return (
                  <div
                    key={m.id}
                    className={`message-bubble-row ${isTraveler ? 'is-traveler' : 'is-guide'}`}
                  >
                    {!isTraveler && (
                      <span className="guide-bubble-author">{activeGuide.name}</span>
                    )}

                    <div className="message-bubble">
                      {/* Service chip inside message if attached */}
                      {m.serviceChip && (
                        <div className="message-service-attachment">
                          <Paperclip size={12} />
                          <span>Regarding: {m.serviceChip.title}</span>
                        </div>
                      )}

                      <p className="message-text">{m.text}</p>

                      <div className="message-meta-row">
                        {!isTraveler && m.isDemoReply && (
                          <span className="demo-reply-label">demo reply</span>
                        )}
                        <span className="message-timestamp tabular-nums">{m.timestamp}</span>
                        {isTraveler && <CheckCheck size={13} className="read-receipt" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="message-bubble-row is-guide">
                  <span className="guide-bubble-author">{activeGuide.name}</span>
                  <div className="message-bubble typing-bubble">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="quick-prompts-bar">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="quick-prompt-chip"
                  onClick={() => handleSendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Message Composer */}
            <form
              className="message-composer-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                type="text"
                className="composer-input"
                placeholder={`Message ${activeGuide.name || 'guide'}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!inputText.trim()}
                rightIcon={<Send size={15} />}
              >
                Send
              </Button>
            </form>
          </>
        ) : (
          <div className="empty-conversation">
            <MessageSquare size={36} />
            <p>Select a guide on the left to start a conversation.</p>
          </div>
        )}
      </section>
    </div>
  );
}
