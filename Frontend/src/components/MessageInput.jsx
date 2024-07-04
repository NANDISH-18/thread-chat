import { Flex, Image, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react"
import { useRef, useState } from "react"
import {IoSendSharp} from 'react-icons/io5'
import useShowToast from "../Hooks/useShowToast";
import { useRecoilState } from "recoil";
import { conversationAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImage from "../Hooks/usePreviewImage";

const MessageInput = ({setMessages}) => {
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const [conversations, setConversations] = useRecoilState(conversationAtom);

  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();
  const imageRef = useRef(null);
  const {onClose} = useDisclosure();
  const {handlePreviewImage, imgUrl, setImgUrl} = usePreviewImage();
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if(!messageText && !imgUrl) return;
    
    if(isSending) return;
    setIsSending(true)

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: messageText,
            recipientId: selectedConversation.userId,
            img: imgUrl
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
      setMessageText('');
      setImgUrl('');

    } catch (error) {
      showToast('Error', error.message, 'error');
      console.log(error);
    } finally{
      setIsSending(false);
    }

  }

  return (
    <Flex gap={2} alignItems={'center'}>
      <form onSubmit={handleSendMessage} style={{flex: 95}}>
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
      <Flex flex={5} cursor={"pointer"}>
				<BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
				<Input type={"file"} hidden ref={imageRef} onChange={handlePreviewImage} />
			</Flex>
			<Modal
				isOpen={imgUrl}
				onClose={() => {
					onClose();
          setImgUrl("");
					
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"}>
							<Image src={imgUrl} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
							{!isSending ? (
								<IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
							) : (
								<Spinner size={"md"} />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
    </Flex>
  )
}

export default MessageInput