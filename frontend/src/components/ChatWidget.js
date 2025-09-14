import React, { useState, useEffect, useRef } from "react";

export default function ChatWidget() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello 👋 I’m your Salon Assistant. How can I help you today?", quickReplies: ["Haircut", "Shaving", "Trimming", "Facewash", "Manicure", "Pedicure"] }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (overrideText) => {
    const finalText = overrideText || input;
    if (!finalText.trim()) return;

    const userMessage = { from: "user", text: finalText };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/agent/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalText })
      });
      const data = await res.json();
      const botMessage = { from: "bot", text: data.reply || "⚠️ Something went wrong", quickReplies: data.suggestions || [] };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { from: "bot", text: "⚠️ Error connecting to server" }]);
    }
    setLoading(false);
  };

  const handleQuickReply = (text) => sendMessage(text);

  return (
    <div className="chat-widget">
      <div className="chat-widget-header">💇 Salon Assistant</div>
      <div className="chat-widget-messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.from}`}>
            {m.from === "bot" && <div className="avatar">🤖</div>}
            <div className="message-text">{m.text}</div>
            {m.from === "bot" && m.quickReplies?.length > 0 && (
              <div className="quick-replies">
                {m.quickReplies.map((qr, idx) => (
                  <button key={idx} onClick={() => handleQuickReply(qr)}>{qr}</button>
                ))}
              </div>
            )}
            {m.from === "user" && <div className="avatar">🧑</div>}
          </div>
        ))}
        {loading && <div className="typing-indicator">🤖 Salon Assistant is typing<span className="animate-pulse">...</span></div>}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="chat-widget-input">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Type a message..." />
        <button onClick={() => sendMessage()}>Send</button>
      </div>
    </div>
  );
}
