import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import { Button, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const AIBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! How can I assist you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim() === "") return;
    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        {
          prompt: generatePrompt([...messages, userMessage]),
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: { 
            'Authorization': `Bearer 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`,
            'Content-Type': 'application/json',
          },
        }
      );
      const botResponse = {
        text: response.data.choices[0].text.trim(),
        sender: "bot"
      };
      setMessages([...messages, userMessage, botResponse]);
    } catch (error) {
      console.error("Error calling OpenAI API", error);
    }
  };

  const generatePrompt = (messages) => {
    return messages.map(m => (m.sender === "user" ? `User: ${m.text}` : `Bot: ${m.text}`)).join('\n') + '\nBot:';
  };

  return (
    <ChatContainer>
      <ChatHeader>Customer Support Chatbot</ChatHeader>
      <ChatBody>
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender}>
            {msg.text}
          </Message>
        ))}
      </ChatBody>
      <ChatFooter>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <InputGroup.Append>
            <Button variant="primary" onClick={handleSend}>
              Send
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </ChatFooter>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  width: 400px;
  height: 500px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ChatHeader = styled.div`
  background-color: #007bff;
  color: white;
  padding: 10px;
  text-align: center;
  font-weight: bold;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
`;

const ChatFooter = styled.div`
  padding: 10px;
  border-top: 1px solid #ccc;
`;

const Message = styled.div`
  background-color: ${(props) => (props.sender === "bot" ? "#e9ecef" : "#007bff")};
  color: ${(props) => (props.sender === "bot" ? "#000" : "#fff")};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  align-self: ${(props) => (props.sender === "bot" ? "flex-start" : "flex-end")};
`;

export default AIBot;
