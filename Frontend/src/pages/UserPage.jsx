import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"

const UserPage = () => {
  return (
    <>
        <UserHeader />
        <UserPost likes={1200} replies={482} postImg='/post1.png' postTitle='co-founder of facebook' />
        <UserPost likes={1500} replies={492} postImg='/post3.png' postTitle='co-founder of X' />
        <UserPost likes={100} replies={42} postTitle="Let's talk about thread" />

        

    </>
  )
}

export default UserPage