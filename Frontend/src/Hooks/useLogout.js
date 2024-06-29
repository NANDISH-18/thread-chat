import userAtom from '../atoms/userAtom';
import useShowToast from './useShowToast';
import { useSetRecoilState } from 'recoil';

const useLogout = () => {
    const setUser = useSetRecoilState(userAtom);
    const showToast = useShowToast()

    const logout = async () => {
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
  return logout;
}

export default useLogout