import { useState } from "react"
import useShowToast from "./useShowToast";

const usePreviewImage = () => {
    const [imgUrl, setImgUrl] = useState(null);
    const showToast = useShowToast()
    const handlePreviewImage = (e) => {
        const file = e.target.files[0];
        // console.log(file)
        if(file && file.type.startsWith("image/")){
            const reader = new FileReader();

            reader.onload = () => {
                setImgUrl(reader.result);
            }
            reader.readAsDataURL(file);
        }else{
            showToast("Invalid File type","Please select image file", "error" );
            setImgUrl(null)
        }
    }
    // console.log(imgUrl)
  return {handlePreviewImage, imgUrl}
}

export default usePreviewImage