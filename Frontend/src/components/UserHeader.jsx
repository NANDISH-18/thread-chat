import { Avatar, Box, Flex, Text, VStack, Link, MenuButton, Portal, MenuList, MenuItem, Menu, useToast } from "@chakra-ui/react"
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"



const UserHeader = () => {

    // Use Toast
    const toast = useToast();

    const copyUrl =() => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(()=> {
            toast({description: 'Profile link copied', status:'success', duration: 3000, isClosable:  true});
        })
    }
    return (
        <>
            <VStack gap={4} alignItems={'start'}>
                <Flex justifyContent={'space-between'} w={'full'}>
                    <Box>
                        <Text fontSize={'2xl'} fontWeight={'bold'}>
                            Nandish Mohanty
                        </Text>
                        <Flex>
                            <Text fontSize={'sm'}>nandishmohanty</Text>
                            <Text fontSize={{
                                base: 'xs',
                                md: 'sm',
                                lg: 'md'
                            }}
                                bg={'gray.dark'}
                                color={'gray.light'}
                                p={1}
                                borderRadius={'full'}
                            >
                                threads.net

                            </Text>

                        </Flex>
                    </Box>
                    <Box>
                        <Avatar
                            name="Nandish Mohanty"
                            src="/nmimage.JPEG"
                            size={
                                {
                                   base: "md",
                                   md: 'xl' 
                                }
                            }
                        />
                    </Box>

                </Flex>
                <Text>Software Developer</Text>
                <Flex w={'full'} justifyContent={'space-between'}>
                    <Flex gap={2} alignItems={'center'}>
                        <Text color={'gray.light'}>1K followers</Text>
                        <Box w="1" h="1" bg={'gray.light'} borderRadius={"full"}></Box>
                        <Link color="gray.light">instagram.com</Link>
                    </Flex>
                    <Flex>
                        <Box className="icon-container">
                            <BsInstagram size={24} cursor={'pointer'} />
                        </Box>
                        <Box className="icon-container">
                            <Menu>
                                <MenuButton>
                                    <CgMoreO size={24} cursor={'pointer'} />
                                </MenuButton>
                                <Portal>
                                    <MenuList bg={'gray.dark'}>
                                        <MenuItem bg={'gray.dark'} onClick={copyUrl}>Copy link</MenuItem>
                                    </MenuList>
                                </Portal>
                            </Menu>
                        </Box>
                    </Flex>

                </Flex>
                <Flex w={'full'}>
                    <Flex flex={1} borderBottom={'1.5px solid white'} justifyContent={'center'} pb="3" cursor={'pointer'}>
                        <Text fontWeight={'bold'} >threads</Text>
                    </Flex>
                    <Flex flex={1} borderBottom={'1.5px solid gray'} justifyContent={'center'} color={'gray.light'} pb="3" cursor={'pointer'} >
                        <Text fontWeight={'bold'}>Replies</Text>
                    </Flex>

                </Flex>

            </VStack>
        </>
    )
}

export default UserHeader