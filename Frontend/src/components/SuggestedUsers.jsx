import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import SuggestedUser from "./SuggestedUser";
import useShowToast from '../Hooks/useShowToast'

const SuggestedUsers = () => {
    const [loading, setLoading] = useState(false);
    const [suggestedUsers, setSuggestedUser] = useState([]);
    const showToast = useShowToast();

    useEffect(() => {
        const getSuggestedUsers = async () => {
            setLoading(true)
            try {
                const res = await fetch('/api/users/suggested')
                const data = await res.json();
                if(data.error){
                    showToast("Error",data.error, 'error');
                    return;
                }
                // console.log(data);
                setSuggestedUser(data);
            } catch (error) {
                showToast('Error',error.message, 'error');
            } finally{
                setLoading(false);
            }
        }
        getSuggestedUsers();
    }, [showToast])

  return (
    <>
        <Text mb={4} fontWeight={'bold'}>
            Suggested Users
        </Text>
        <Flex direction={'column'} gap={4}>
            {!loading && suggestedUsers.map(user => <SuggestedUser key={user._id} user={user}/>)}
            {/* if loading show the skeleton */}
            {loading && [0,1,2,3,4].map((_,idx) => (
                <Flex key={idx} gap={2} alignItems={'center'} p={1} borderRadius={"md"}>
                    {/* Avatar Skeleton */}
                    <Box>
                        <SkeletonCircle size={10}/>
                    </Box>
                    {/* username and fullname skeleton */}
                    <Flex flexDirection={'column'} w={'full'} gap={2}>
                        <Skeleton h={'8px'} w={"80px"}/>
                        <Skeleton h={'8px'} w={"90px"}/>
                    </Flex>
                    {/* Follow button skeleton */}
                    <Flex>
                        <Skeleton h={'20px'} w={'60px'} />
                    </Flex>
                </Flex>
            ))}
        </Flex>
    </>
  )
}

export default SuggestedUsers