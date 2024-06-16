import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetProfile = () => {
    const showToast = useShowToast();
    const [user, setUser] = useState(null);
    const [loading, setLoading]= useState(true);
    const {username} = useParams();
    useEffect(() => {
      const getUser = async () => {
        setLoading(true);
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
          return;
        } finally {
            setLoading(false);
            
        }
      }
      getUser();
    },[username, showToast]);
    return {user, loading};
}

export default useGetProfile