import { Avatar, Box, Button, Divider, Flex, Image, Text } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import Actions from "../components/Actions"
import { useState } from "react"
import Comment from "../components/Comment"

const PostPage = () => {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex>
        <Flex w={'full'} alignItems={'center'} gap={3}>
          <Avatar src="/nmimage.JPEG" size={'md'} name="Nandish Mohanty" />
          <Flex>
            <Text fontSize={'sm'} fontWeight={'bold'}>nandishmohanty</Text>
            <Image src="/verified.png" w={4} h={4} ml={4} />

          </Flex>
        </Flex>
        <Flex gap={4} alignItems={'center'}>
          <Text fontSize={'sm'} color={'gray.light'}>1d</Text>
          <BsThreeDots />
        </Flex>
      </Flex>
      <Text my={3}>co-founder of facebook</Text>
      <Box borderRadius={6} border={'1px solid'} borderColor={'gray.light'} overflow={'hidden'}>
        <Image src={'/post1.png'} w={'full'} />
      </Box>
      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>
      <Flex gap={2} alignItems={'center'}>
        <Text fontSize={'sm'} color={'gray.light'}>123 replies</Text>
        <Box w={0.5} h={0.5} bg={'gray.light'} borderRadius={'full'}></Box>
        <Text fontSize={'sm'} color={'gray.light'}>{200 + (liked ? 1 : 0)} likes</Text>

      </Flex>
      <Divider my={4}/>
      <Flex justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text fontSize={'2xl'}>👋</Text>
          <Text color={'gray.light'}>Get the app to like, reply and post</Text>
        </Flex>
        <Button>
          Get
        </Button>
      </Flex>
      <Divider my={4}/>
      <Comment title='This looks great' createdAt='2d' username='nandishmohanty' userAvatar='https://bit.ly/prosper-baba'/>

    </>
  )
}

export default PostPage