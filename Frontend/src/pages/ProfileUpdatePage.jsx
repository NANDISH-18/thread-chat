import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    // HStack,
    Avatar,

    Center,
} from '@chakra-ui/react';
import {  useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import usePreviewImage from '../Hooks/usePreviewImage';
import useShowToast from '../Hooks/useShowToast';

const ProfileUpdatePage = () => {
    const [user, setUser] = useRecoilState(userAtom);
    const showToast = useShowToast();

    const [inputs, setInputs] = useState({
        name: user?.name,
        username: user?.username,
        email: user?.email,
        bio: user?.bio,
        password: '',

    })
    // console.log("User is here", user);
    const fileRef = useRef(null)

    const { handlePreviewImage, imgUrl } = usePreviewImage();
    console.log(user)


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`/api/users/update/${user._id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...inputs, profilePic: imgUrl})
        
            })
            const data = await res.json(); //updated user object
            console.log(data);
            if(data.error){
                showToast("Error",data.error, 'error');
                return;
            }
            localStorage.setItem('user-threads', JSON.stringify(data));
            setUser(data);
            showToast("Success","Profile updated successfully!", 'success');
            
        } catch (error) {
            console.log(error);
            showToast("Error", error, 'error');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Flex

                align={'center'}
                justify={'center'}
                my={6}
            >
                <Stack
                    spacing={4}
                    w={'full'}
                    maxW={'md'}
                    bg={useColorModeValue('white', 'gray.dark')}
                    rounded={'xl'}
                    boxShadow={'lg'}
                    p={6}
                >
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                        User Profile Edit
                    </Heading>
                    <FormControl id="userName">
                        <Stack direction={['column', 'row']} spacing={6}>
                            <Center>
                                <Avatar size="xl" boxShadow={'md'} src={imgUrl || user.profilePic} />


                            </Center>
                            <Center w="full">
                                <Button w="full" onClick={() => fileRef.current.click()}>Change Icon</Button>
                                <Input type='file' hidden ref={fileRef} onChange={handlePreviewImage} />
                            </Center>
                        </Stack>
                    </FormControl>
                    <FormControl >
                        <FormLabel>Full name</FormLabel>
                        <Input
                            placeholder="John Doe"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                            value={inputs.name}
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>User name</FormLabel>
                        <Input
                            placeholder="johndoe"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                            value={inputs.username}
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Email address</FormLabel>
                        <Input
                            placeholder="your-email@example.com"
                            _placeholder={{ color: 'gray.500' }}
                            type="email"
                            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                            value={inputs.email}
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Bio</FormLabel>
                        <Input
                            placeholder="Your bio..."
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                            onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                            value={inputs.bio}
                        />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Password</FormLabel>
                        <Input
                            placeholder="password"
                            _placeholder={{ color: 'gray.500' }}
                            type="password"
                            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                            value={inputs.password}
                        />
                    </FormControl>
                    <Stack spacing={6} direction={['column', 'row']}>
                        <Button
                            bg={'red.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'red.500',
                            }}>
                            Cancel
                        </Button>
                        <Button
                            bg={'green.400'}
                            color={'white'}
                            w="full"
                            _hover={{
                                bg: 'green.500',
                            }}
                            type='submit'
                            >
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form>
    );
}

export default ProfileUpdatePage;