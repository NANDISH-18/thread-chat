import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom"
import Actions from "./Actions"
import { useEffect, useState } from "react"
import useShowToast from "../Hooks/useShowToast"
import {formatDistanceToNow} from 'date-fns'

const Post = ({post, postedBy}) => {
    const showToast = useShowToast()
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch('/api/users/profile/' + postedBy);
                const data = await res.json();
                if(data.error){
                    showToast("Error", data.error, 'error');
                    return
                }
                // console.log(data);
                setUser(data);
               
            } catch (error) {
                showToast("Error", error, 'error');
                setUser(null);
            }
        }
        getUser();
        
    },[postedBy,showToast])

  return (
    <Link to={`/${user?.username}/post/${post._id}`}>
        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={'column'} alignItems={'center'}>
                <Avatar size='md' name={user?.name} src={user?.profilePic} 
                    onClick={(e) => {
                        e.preventDefault()
                        navigate(`/${user.username}`)
                    }}
                />
                <Box w='1px' bg='gray.light'></Box>
                <Box w='1px' h='full' bg={'gray.light'} my={2}></Box>
                <Box position={'relative'} w={'full'}>
                    {post.replies.length === 0 && <Text textAlign={'center'}>🥱</Text>}
                    {post.replies[0] && (
                        <Avatar
                        size={'xs'}
                        name="Rahul kumar"
                        src={post?.replies[0]?.userProfilePic}
                        position={'absolute'}
                        top={'0px'}
                        left='15px'
                        padding={'2px'}
                    />
                    )}
                    {post.replies[1] && (
                        <Avatar
                        size={'xs'}
                        name="suraj Roy"
                        src={post?.replies[1]?.userProfilePic}
                        position={'absolute'}
                        bottom={'0px'}
                        right='-5px'
                        padding={'2px'}
                    />
                    )}
                    {post.replies[2] && (
                        <Avatar
                        size={'xs'}
                        name="Subham Das"
                        src={post?.replies[2]?.userProfilePic}
                        position={'absolute'}
                        bottom={'0px'}
                        left='4px'
                        padding={'2px'}
                    />
                    )}
                    
                    
                </Box>
            </Flex>
            <Flex flex={1} flexDirection={'column'} gap={2}>
                <Flex justifyContent={'space-between'} w={'full'}>
                    <Flex w={'full'} alignItems={'center'}>
                        <Text fontSize={'sm'} fontWeight={'bold'}>{user?.username}</Text>
                        <Image src="/verified.png" w={4} h={4} ml={1} />
                    </Flex>
                    <Flex gap={4} alignItems={'center'}>
                        <Text fontSize={'xs'} width={36} textAlign={'right'} color={'gray.light'}>{formatDistanceToNow(new Date(post.createdAt))} ago</Text>
                    </Flex>

                </Flex>
                <Text fontSize={'sm'}>{post.text}</Text>
                {post.img && (
                    <Box borderRadius={6} border={'1px solid'} borderColor={'gray.light'} overflow={'hidden'}>
                        <Image src={post.img}  w={'full'}/>
                    </Box>
                )}
                <Flex gap={3} my={1}>
                    <Actions post={post}/>
                </Flex>
                {/* How much likes */}
                {/* <Flex gap={2} alignItems={'center'}>
                    <Text fontSize={'sm'} color={'gray.light'}>{post.replies.length} replies</Text>
                    <Box w={0.5} h={0.5} bg={'gray.light'} borderRadius={'full'}></Box>
                    <Text fontSize={'sm'} color={'gray.light'}>{post.likes.length} likes</Text>

                </Flex> */}
            </Flex>
        </Flex>
    </Link>
  )
}

export default Post