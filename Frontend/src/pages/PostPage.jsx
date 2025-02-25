import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react"
// import { BsThreeDots } from "react-icons/bs"
import Actions from "../components/Actions"
import { useEffect } from "react"
import Comment from "../components/Comment"
import useShowToast from "../Hooks/useShowToast"
import useGetProfile from "../Hooks/useGetProfile"
import { useNavigate, useParams } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { DeleteIcon } from "@chakra-ui/icons"
import postAtom from "../atoms/postAtom"


const PostPage = () => {
  const { user, loading } = useGetProfile();
  const showToast = useShowToast();
  const { pid } = useParams();
  const [posts, setPosts] = useRecoilState(postAtom);
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const currentPost = posts[0];

  useEffect(() => {
    const getPosts = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast('Error', data.error, 'error');
          return;
        }
        console.log(data);
        setPosts([data]);
      } catch (error) {
        showToast('Error', error, 'error');
        return
      }
    }

    getPosts();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();

      if (!window.confirm('Are you sure you want to delete the post')) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, 'error');
        return
      }

      showToast('Success', "Post deleted!", "success")
      navigate(`/${user.username}`)


    } catch (error) {
      showToast("Error", error, 'error');
    }
  }

  if (!user && loading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'x1'} />
      </Flex>
    )
  }

  if (!currentPost) return null;

  return (
    <>
      <Flex>
        <Flex w={'full'} alignItems={'center'} gap={3} >
          <Avatar src={user.profilePic} size={'md'} name="Nandish Mohanty" />
          <Flex>
            <Text fontSize={'sm'} fontWeight={'bold'}>{user.username}</Text>
            <Image src="/verified.png" w={4} h={4} ml={4} />

          </Flex>
        </Flex>

        <Flex gap={4} alignItems={'center'}>
          <Text fontSize={'xs'} width={36} textAlign={'right'} color={'gray.light'}>{formatDistanceToNow(new Date(currentPost.createdAt))} ago</Text>

          {currentUser?._id === user?._id && <DeleteIcon cursor={'pointer'} size={20} onClick={handleDeletePost} />}
        </Flex>




      </Flex>
      <Flex alignItems={'flex-start'}>
      <Box>
        <Text my={3}>{currentPost.text}</Text>
      </Box>
      </Flex>
      {currentPost.img && (
        <Box borderRadius={6} border={'1px solid'} borderColor={'gray.light'} overflow={'hidden'}>
          <Image src={currentPost.img} w={'full'} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text fontSize={'2xl'}>👋</Text>
          <Text color={'gray.light'}>Get the app to like, reply and post</Text>
        </Flex>
        <Button>
          Get
        </Button>
      </Flex>
      <Divider my={4} />
      {currentPost.replies.map(reply => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
        />

      ))}

    </>
  )
}

export default PostPage