import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react"
import Message from "./Message"
import MessageInput from "./MessageInput"
import { useEffect, useRef, useState } from "react"
import useShowToast from "../Hooks/useShowToast"
import {  useRecoilValue, useSetRecoilState } from "recoil"
import { conversationAtom, selectedConversationAtom } from "../atoms/messagesAtom"
import userAtom from "../atoms/userAtom"
import { useSocketNew } from "../appContext/AppSocketContextNew";
import messageSound from '../assets/sounds/message.mp3'

const MessageContainer = () => {
    const showToast = useShowToast()
    const selectedConversation= useRecoilValue(selectedConversationAtom);
    const [loadingMessages , setLoadingMessages] = useState(true);
    const [messages, setMessages]= useState([]);
    const currentUser =  useRecoilValue(userAtom);
    const {socket} = useSocketNew();
    const setConversations = useSetRecoilState(conversationAtom);
    const messageEndRef = useRef(null);

    useEffect(() => {
        socket.on('newMessage', (message) => {
            if(selectedConversation._id === message.conversationId){
                setMessages((prevMessages) => [...prevMessages, message]);
            }

            if(!document.hasFocus()){
                const sound = new Audio(messageSound);
                sound.play();
            }
            

            setConversations((prev) => {
                const updatedConversation = prev.map(conversation => {
                    if(conversation._id === message.conversationId){
                        return {
                            ...conversation,
                            lastMessage: {
                                text: message.text,
                                sender: message.sender
                            }
                        }
                    }
                    return conversation
                });
                return updatedConversation;
            })
        })

        return () =>  socket.off("newMessage");
    },[selectedConversation._id, setConversations, socket]);

    useEffect(() => {
        const lastMessageFromOtherUser = messages.length && messages[messages.length-1].sender !== currentUser._id;

        if(lastMessageFromOtherUser){
            socket.emit('markMessageAsSeen' , {
                conversationId: selectedConversation._id,
                userId: selectedConversation.userId,
            })
        }
        
        socket.on('messagesSeen' , ({conversationId}) => {
            if(selectedConversation._id === conversationId){
                setMessages(prev => {
                    const updatedMessage = prev.map(message => {
                        if(!message.seen){
                            return {
                                ...message,
                                seen: true
                            }
                        }
                        return message
                    })
                    return updatedMessage;
                })
            }
        })

    }, [socket, messages, selectedConversation, currentUser]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    },[messages])

    useEffect(()=> {
        const getMessage = async () => {
            try {
                if(selectedConversation.mock) return;
                const res = await fetch(`/api/messages/${selectedConversation.userId}`);
                const data = await res.json();
                if (data.error){
                    showToast('Error',data.error, "error");
                    return;
                }
                // console.log("Message: ", data)
                setMessages(data);
            } catch (error) {
                showToast('Error', error, 'Error');
                console.log(error);
            } finally{
                setLoadingMessages(false);
            }
        }
        getMessage();

    }, [showToast, selectedConversation.userId, selectedConversation.mock])


  return (
    <Flex
        flex={70}
        bg={useColorModeValue("gray.600", "gray.dark")}
        borderRadius={'md'}
        p={2}
        flexDirection={'column'}
    >
        {/* Message Header */}
        <Flex w={'full'} h={12} alignItems={'center'} gap={2}>
            <Avatar src={selectedConversation.userProfilePic} size={'sm'} />
            <Text
                display={'flex'} alignItems={'center'}
            >{selectedConversation.username} <Image src="/verified.png" h={4} w={4} ml={1} />
            </Text>
        </Flex>

        <Divider />

        {/* Messages */}
        <Flex flexDirection={'column'} gap={4} my={4} p={3} height={"400px"} overflowY={"auto"}>
            {/* Skeleton */}
            {loadingMessages && (
                [...Array(5)].map((_,i) => (
                    <Flex key={i}
                        gap={2}
                        alignItems={'center'}
                        p={1}
                        borderRadius={'md'}
                        alignSelf={i % 2 ===0 ? 'flex-start' : 'flex-end'}
                    >
                        {i % 2===0 && <SkeletonCircle size={7}/>}
                        <Flex flexDir={'column'} gap={2}>
                            <Skeleton h={"8px"} w={"250px"}/>
                            <Skeleton h={"8px"} w={"250px"}/>
                            <Skeleton h={"8px"} w={"250px"}/>

                        </Flex>
                        {i%2!==0 && <SkeletonCircle size={7}/>}
                    </Flex>
                ))
            )}

            {!loadingMessages && (
                messages.map((message) => (
                    <Flex key={message._id} 
                        direction={'column'}
                        ref={messages.length -1 === messages.indexOf(message) ? messageEndRef : null}
                    >
                        <Message key={message._id} message={message} ownMessage={currentUser._id === message.sender} />
                    </Flex>
                     
                ))
            )}            

            

        </Flex>
        {/* Message Input */}

        <MessageInput setMessages={setMessages} />
        
    </Flex>
  )
}

export default MessageContainer