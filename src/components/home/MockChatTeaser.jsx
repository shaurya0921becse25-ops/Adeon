import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, Bot } from 'lucide-react';
import Button from '../common/Button';
import './MockChatTeaser.css';

const SCRIPTED_EXCHANGE = [
  {
    sender: 'bot',
    text: "Where do you want to head next? Pick a primary vibe:",
    chips: ["Peaceful & scenic", "Culture & heritage", "Food & alleys"]
  },
  {
    sender: 'user',
    text: "Culture & heritage, traveling as a couple for 3 days."
  },
  {
    sender: 'bot',
    text: "Checking opening hours and transit across pilot destinations..."
  },
  {
    sender: 'bot',
    text: "🎯 Top Match: Jaipur (94% Fit). Amer Fort & City Palace match your 3-day pace without afternoon rush bottlenecks.",
    isResult: true
  }
];

export default function MockChatTeaser() {
  const navigate = useNavigate();
  const [messagesCount, setMessagesCount] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          runAnimationSequence();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const runAnimationSequence = () => {
    // Step 1: User message arrives after 1.2s
    setTimeout(() => {
      setMessagesCount(2);
      setIsTyping(true);

      // Step 2: Bot thinking
      setTimeout(() => {
        setIsTyping(false);
        setMessagesCount(3);
        setIsTyping(true);

        // Step 3: Bot result
        setTimeout(() => {
          setIsTyping(false);
          setMessagesCount(4);
        }, 1200);
      }, 1400);
    }, 1200);
  };

  return (
    <div className="mock-chat-teaser" ref={containerRef}>
      <div className="mock-chat-window">
        {/* Chat header */}
        <div className="mock-chat-header">
          <div className="mock-chat-bot-info">
            <span className="mock-chat-bot-avatar">
              <Bot size={16} />
            </span>
            <div>
              <strong>Trip Match Simulator</strong>
              <small>Rule-based recommendation sample</small>
            </div>
          </div>
          <span className="mock-chat-live-badge">Auto Demo</span>
        </div>

        {/* Message body */}
        <div className="mock-chat-body">
          {SCRIPTED_EXCHANGE.slice(0, messagesCount).map((msg, i) => (
            <div
              key={i}
              className={`mock-chat-msg mock-chat-msg--${msg.sender} ${msg.isResult ? 'is-result' : ''}`}
            >
              {msg.sender === 'bot' && (
                <span className="mock-chat-icon" aria-hidden="true">
                  <Bot size={13} />
                </span>
              )}
              <div className="mock-chat-bubble">
                <p>{msg.text}</p>
                {msg.chips && messagesCount === 1 && (
                  <div className="mock-chat-chips">
                    {msg.chips.map((chip, idx) => (
                      <span key={idx} className="mock-chat-chip">{chip}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="mock-chat-msg mock-chat-msg--bot">
              <span className="mock-chat-icon"><Bot size={13} /></span>
              <div className="mock-chat-bubble mock-chat-typing">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
        </div>

        {/* Chat footer with CTA */}
        <div className="mock-chat-footer">
          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight size={16} />}
            onClick={() => navigate('/chatbot')}
            className="mock-chat-cta"
          >
            Start the real one
          </Button>
        </div>
      </div>
    </div>
  );
}
