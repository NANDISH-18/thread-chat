import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import { useParams } from "react-router-dom";
import useShowToast from "../Hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetProfile from "../Hooks/useGetProfile";
import { useRecoilState } from "recoil";
import postAtom from "../atoms/postAtom";
const UserPage = () => {
  const {user, loading} = useGetProfile();
  const { username } = useParams();

  const showToast = useShowToast();
  // I can use here to postAtom for global state
  const [posts, setPosts] = useRecoilState(postAtom);
  const [fetchingPost, setFetchingPost] = useState(true);

  useEffect(() => {
    

    const getPosts = async ()=> {
      if(!user) return;
      setFetchingPost(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast('Error', data.error, 'error');
          return;

        }
        console.log("post Data",data);
        setPosts(data);
      } catch (error) {
        showToast('Error', error, 'error');
        setPosts([])
      } finally {
        setFetchingPost(false)
      }
    }

    getPosts();
  }, [username, showToast,setPosts,user]);
  // console.log('post is here and it is recoil State', posts);

  if(!user && loading){
    return(
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
      
    )
  }
  // console.log(user)

  if (!user && !loading) return <h1>User not Found!</h1>

  return (
    <>
      <UserHeader user={user}/>
      {!fetchingPost && posts.length === 0 && <h1>User has no post.</h1>}
      {fetchingPost && (
        <Flex justifyContent={'center'}>
          <Spinner size={'xl'}/>
        </Flex>
      )}
      {posts.map((post)=> (
        <Post key={post._id} post={post} postedBy={post.postedBy} setPosts={setPosts}/>
      ))}



    </>
  )
}

export default UserPage