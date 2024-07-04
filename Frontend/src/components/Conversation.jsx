import { Avatar, AvatarBadge, Box, Flex, Image, Stack, Text, WrapItem, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom'
import {BsCheck2All, BsFillImageFill} from 'react-icons/bs'
import { selectedConversationAtom } from '../atoms/messagesAtom';


const Conversation = ({conversation, isOnline}) => {
    const user = conversation.participants[0];
    const currentUser = useRecoilValue(userAtom)
    const lastMassage = conversation.lastMessage;
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
    const colorMode = useColorMode();

    console.log("selected Conversation",selectedConversation);
    return (
        <Flex
            gap={4}
            alignItems={'center'}
            p={'1'}
            _hover={{
                cursor: 'pointer',
                bg: useColorModeValue("gray.600, gray.dark"),
                color: 'white'
            }}
            onClick={()=> setSelectedConversation({
                _id: conversation._id,
                userId: user._id,
                userProfilePic: user.profilePic,
                username: user.username,
                mock: conversation.mock
            })}
            bg={selectedConversation?._id ===  conversation._id ? (colorMode === "light" ? "gray.400" : "gray.dark" ) : ""}
            borderRadius={'md'}
        >
            <WrapItem>
                <Avatar size={{
                    base: 'xs',
                    md: 'md',
                    sm: "sm"
                    }} 
                    src={user.profilePic}
                >
                    {isOnline ? <AvatarBadge boxSize={'1rem'} bg={"green.500"} /> : "" }
                </Avatar>
            </WrapItem>
            <Stack direction={'column'} fontSize={'sm'}>
                    <Text fontWeight={'700'} display={'flex'} alignItems={'center'} >
                        {user.username} <Image src='/verified.png' w={4} h={4} ml={1} />
                    </Text>
                    <Text fontSize={'xs'} display={'flex'} alignItems={'center'}>
                        {currentUser._id === lastMassage.sender ? (
                            <Box color={lastMassage.seen ? 'blue.400' : ""}>
                                <BsCheck2All size={16}/>
                            </Box>
                        ) : ""}
                        {lastMassage.text.length > 18 ? lastMassage.text.substring(0,18) + "..." : lastMassage.text || <BsFillImageFill size={16} />}
                    </Text>
            </Stack>
        </Flex>
    )
}

export default Conversation