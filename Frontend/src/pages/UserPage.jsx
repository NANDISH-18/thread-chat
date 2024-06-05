import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
import { useParams } from "react-router-dom";
import useShowToast from "../Hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";

const UserPage = () => {
  const [user, setUser] = useState('');
  const { username } = useParams();

  const showToast = useShowToast();
  const [loading, setLoading] = useState(true)

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
    getUser();
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
      <UserPost likes={1200} replies={482} postImg='/post1.png' postTitle='co-founder of facebook' />
      <UserPost likes={1500} replies={492} postImg='/post3.png' postTitle='co-founder of X' />
      <UserPost likes={100} replies={42} postTitle="Let's talk about thread" />



    </>
  )
}

export default UserPage