import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import { useParams } from "react-router-dom";
import useShowToast from "../Hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
const UserPage = () => {
  const [user, setUser] = useState('');
  const { username } = useParams();

  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [fetchingPost, setFetchingPost] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();

        if (data.error) {
          showToast('Error', data.error, 'error');
          return;

        }
        setUser(data);
      } catch (error) {
        showToast('Error', error, 'error');
      } finally {
        setLoading(false)
      }
    }

    const getPosts = async ()=> {
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

    getUser();
    getPosts();
  }, [username, showToast]);

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
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}



    </>
  )
}

export default UserPage