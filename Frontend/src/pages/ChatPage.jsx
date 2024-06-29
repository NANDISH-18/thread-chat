import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react"
import {SearchIcon} from '@chakra-ui/icons'
import Conversation from "../components/Conversation";
import {GiConversation} from "react-icons/gi"
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from '../Hooks/useShowToast';
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";

const ChatPage = () => {
  
  const [loadingConversation, setLoadingConversation] = useState(true);
  const [conversations, setConversations] = useRecoilState(conversationAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const [searchText, setSearchText] = useState('')
  const [searchingUser, setSearchingUser] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  useEffect(()=> {
    const getConversation = async () => {
      try {

        const res = await fetch('/api/messages/conversation');
        const data = await res.json();
        if(data.error) {
          showToast(data.error, 'error');
        }
        console.log(data);
        setConversations(data);
        
      } catch (error) {
        console.log(error);
        showToast("Error", error, 'error');
      } finally{
        setLoadingConversation(false);
      }
    }
    getConversation();
  }, [showToast, setConversations])

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if(searchedUser.error) {
        showToast("Error",searchedUser.error, 'error');
        return;
      }
      // console.log('searched User: ' , searchedUser);
      // If user trying to message themselves
      if(searchedUser._id === currentUser._id){
        showToast("Error", "You can't message yourself", 'error');
        return;
      }
      // If user is already in conversation with searched user
      if(conversations.find(conversation => conversation.participants[0]._id === searchedUser._id)){
        setSelectedConversation({
          _id: conversations.find(conversation => conversation.participants[0]._id === searchedUser._id)._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic
        })
        return;
      }

      //  Mock converation
      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: ""
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            userProfilePic: searchedUser.profilePic
          }
        ]
      }
      setConversations((prevConv) => [...prevConv, mockConversation]);
    

      
      
    } catch (error) {
      showToast("Error", error.message, 'error');
    } finally{
      setSearchingUser(false);
    }
  }



  return (
    <Box
        position={'absolute'}
        left={'50%'}
        w={
          {
            base: '100%',
            md: '80%',
            lg: '750px%',
          }
        }
        p={4}
        transform={'translatex(-50%)'}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: 'column',
          md: 'row',
        }}
        maxW={{
          sm: '400px',
          md: 'full'
        }}
      >
        <Flex flex={30} 
          gap={2}
          flexDirection={'column'}
          maxW={{
            sm: "250px",
            md: 'full'
          }}
          mx={'auto'}
        >
          <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>Your Conversation</Text>
          {/* Search */}
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={'center'} gap={2}>
              <Input placeholder="Search for a user" onChange={(e)=> setSearchText(e.target.value) } value={searchText}/>
              <Button size={'sm'} onClick={handleConversationSearch} isLoading={searchingUser}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>
          {/* Skeleton */}
          {loadingConversation  && (
            [0,1,2,3,4].map((_,i) => (
              <Flex key={i} gap={4} alignItems={'center'} p={'1'} borderRadius={'md'}>
                <Box>
                  <SkeletonCircle size={10} />
                </Box>
                <Flex w={'full'} flexDirection={'column'} gap={2}>
                  <Skeleton h={'10px'} w={"80px"}/>
                  <Skeleton h={'8px'} w={'90%'}/>
                </Flex>
              </Flex>
            ))
          )}
          {!loadingConversation && 
          
            conversations.map(conversation => (
              <Conversation key={conversation._id} conversation={conversation} />
            ))
          }
          
          


        </Flex>
        {/* For the right if there no conversation select */}
        {!selectedConversation._id && 
          <Flex
            flex={70}
            borderRadius={'md'}
            p={2}
            flexDir={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            height={'400px'}
          >
            <GiConversation size={100}/>
            <Text fontSize={20}>Select a conversation to start messaging</Text>

          </Flex>
         }
         {selectedConversation._id && <MessageContainer />}
          
        
      </Flex>
    </Box>
  )
}

export default ChatPage