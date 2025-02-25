import { Button } from "@chakra-ui/react"
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../Hooks/useShowToast";
import { FiLogOut } from "react-icons/fi";


const LogoutButton = () => {

    const setUser = useSetRecoilState(userAtom);
    const showToast = useShowToast()

    const handleLogout = async () => {
        try {
            // fetch
            const res = await fetch('/api/users/logout' , {
                method: 'POST',
                headers: {
                    "Content-Type" : "Application/json"
                }
                
            })
            const data = await res.json();
            if(data.error){
                showToast("Error", data.error, "error");
                return;
            }
            localStorage.removeItem("user-threads");
            setUser(null);
            showToast("Success", "Logout successfully!", "success");

        } catch (error) {
            console.log(error);
            showToast("Error", error, "error");
        }
    }

  return (
    <Button position={'fixed'} top={'30px'} right={'30px'} size={'sm'} onClick={handleLogout}>
        <FiLogOut size={20}/>
    </Button>
  )
}

export default LogoutButton