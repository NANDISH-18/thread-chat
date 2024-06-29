import { Box, Flex, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import useShowToast from "../Hooks/useShowToast"
import Post from "../components/Post"
import { useRecoilState } from "recoil"
import postAtom from "../atoms/postAtom"



const HomePage = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postAtom);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    const getFeedPost = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/posts/feed');
        const data = await res.json();
        if(data.error){
          showToast('Error', data.error, 'error');
          return;
        }
        // console.log(data);
        // Ensure data is in the array
        if(Array.isArray(data)){
          setPosts(data);
          
        }else{
          setPosts([])
        }
        
        
      } catch (error) {
        // console.log(error);
        setPosts([])
        showToast('Error', error, 'error');
      }finally{
        setLoading(false);
      }
    }
    getFeedPost()
  },[showToast])
  return (
    <Flex gap={'10'} alignItems={'flex-start'}>
      <Box flex={70}>
        {!loading && posts.length === 0 && (
        <h1>Follow some users to see the feed</h1>)}

        {loading && (
          <Flex justify={'center'}>
            <Spinner size={'xl'}/>
          </Flex>
        )}

        {posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}

      </Box>
    </Flex>
  )
}

export default HomePage