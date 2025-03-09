import { useEffect, useRef } from "react";
import styled from "styled-components";

interface MessagesDisplayProps {
  messages: { id: string; text: string }[];
  newMessage: string;
  activeUsers: { id: string; name: string }[];
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => Promise<void>;
}

const MessagesDisplay = ({ messages, newMessage, activeUsers, setNewMessage, sendMessage }: MessagesDisplayProps) => {
  const messageListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]); 
  
  return (
    <StyledMessagesContainer>
      <StyledUserList>
        <div>Players:</div>
        {activeUsers.map((user) => (
          <li key={`user-${user.id}`}>{ user.name }</li>
        ))}
      </StyledUserList>
      <StyledMessageList ref={messageListRef}>
        <div>Messages:</div>
        {messages.map((msg) => (
          <li key={msg.id}>{msg.text}</li>
        ))}
      </StyledMessageList>

      <StyledInputWrapper>
        <StyledInput
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <StyledSendButton onClick={sendMessage}>Send</StyledSendButton>
      </StyledInputWrapper>
      
    </StyledMessagesContainer>
  )
}

const StyledMessagesContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: scroll;
  width: 362px;
  background-color: #1f1f1f;
  color: white;
`;

const StyledMessageList = styled.ul`
  padding-left: 8px;
  flex-grow: 1;
  overflow: scroll;

  li {
    margin-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
`;

const StyledInputWrapper = styled.div`
  position: relative;
  height: 50px;
  width: 100%;
  display: flex;
    
`;

const StyledInput = styled.input`
  width: 260px;
  background-color: #1f1f1f;
  border: 2px solid white;
  box-sizing: border-box;
`;

const StyledSendButton = styled.button`
  flex-grow: 1;
  background-color: #64388c;
`;

const StyledUserList = styled.ul`
  display: flex;
  flex-direction: column;

  padding: 8px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 5px;
`;

export default MessagesDisplay;