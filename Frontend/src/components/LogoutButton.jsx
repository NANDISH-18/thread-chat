import { Button, useToast } from "@chakra-ui/react"
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";


const LogoutButton = () => {

    const toast = useToast();
    const setUser = useSetRecoilState(userAtom)

    const handleLogout = async () => {
        try {
            localStorage.removeItem("user-threads");
            // fetch
            const res = await fetch('/api/users/logout' , {
                method: 'POST',
                headers: {
                    "Content-Type" : "Application/json"
                }
                
            })
            const data = await res.json();
            if(data.error){
                toast({
                    title: 'Error',
                    description: data.error,
                    status: 'error',
                    duration: 3000,
                    isClosable: true
                })
            }
            setUser(null);
            toast({
                title: 'Success',
                description: 'Logout successfully!',
                status:'success',
                duration: 3000,
                isClosable: true
            })



        } catch (error) {
            console.log(error)
        }
    }

  return (
    <Button position={'fixed'} top={'30px'} right={'30px'} size={'sm'} onClick={handleLogout}>Logout</Button>
  )
}

export default LogoutButton