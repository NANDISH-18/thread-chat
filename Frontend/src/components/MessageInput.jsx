import { Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import { useState } from "react"
import {IoSendSharp} from 'react-icons/io5'
import useShowToast from "../Hooks/useShowToast";
import { useRecoilState } from "recoil";
import { conversationAtom, selectedConversationAtom } from "../atoms/messagesAtom";

const MessageInput = ({setMessages}) => {
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const [conversations, setConversations] = useRecoilState(conversationAtom);

  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if(!messageText) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: messageText,
            recipientId: selectedConversation.userId
          })
      });
      const data = await res.json();
      if(data.error){
        showToast('Error', data.error, 'error');
        return;
      }

      setMessages((messages) => [...messages, data]);
      setConversations((prevConv) => {
        const updatedConv = prevConv.map(conversation => {
          if(conversation._id === selectedConversation._id){
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender
              }
            }
          }
          return conversation;
        })
        return updatedConv;
      })
      setMessageText('')

    } catch (error) {
      showToast('Error', error.message, 'error');
      console.log(error);
    }

  }

  return (
    <form onSubmit={handleSendMessage}>
        <InputGroup>
            <Input 
                w={'full'}
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
            />
            <InputRightElement onClick={handleSendMessage} cursor={'pointer'}>
                <IoSendSharp />
            </InputRightElement>
        </InputGroup>
    </form>
  )
}

export default MessageInput