
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import { Button, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const API_KEY="AIzaSyDtkh5t4GV_07NJS3a7-HEZe22KIEd3vi0";


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
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          prompt: generatePrompt([...messages, userMessage]),
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: { 
            model: "gemini-1.5-flash",
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            role: "user", 
            parts: [{ text: userMessage }] 
          })
        }
      );
      const botResponse = {
        text: response.data.choices[0].text.trim(),
        sender: "bot"
      };
      setMessages([...messages, userMessage, botResponse]);
    } catch (error) {
      console.error("Error calling API", error);
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
          {/* <InputGroup.Append> */}
            <Button variant="primary" onClick={handleSend}>
              Send
            </Button>
          {/* </InputGroup.Append> */}
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
