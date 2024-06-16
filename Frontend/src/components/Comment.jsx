import { Avatar, Box, Divider, Flex, Text } from "@chakra-ui/react"
import { useState } from "react"
import { BsThreeDots } from "react-icons/bs"
import Actions from './Actions'


const Comment = ({reply, lastReply}) => {
  return (
    <>
        <Flex gap={4} py={2} my={2} w={'full'} alignItems={'flex-start'}>
            <Avatar src={reply.userProfilePic} size={'sm'} />
            <Box>
              <Flex gap={1} w={'full'} flexDirection={'column'}>
                  <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'}>
                    <Text fontSize={'sm'} fontWeight={'bold'}>{reply.username}</Text>
                  </Flex>
                  <Text >{reply.text}</Text>
                
              </Flex>
            </Box>
        </Flex>
        {!lastReply ?  <Divider /> : null}
    
    </>
  )
}

export default Comment