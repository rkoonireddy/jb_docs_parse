import React from 'react';
import { Box, Flex, Link as ChakraLink, Heading, Button, Image } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/JbLogo.png'; // Replace with your logo path

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box bg="blue.900" p={4} color="white">
      <Flex justify="space-between" align="center">
        <Flex align="center">
          <Image src={logo} alt="Company Logo" boxSize="50px" mr={4} />
          <Heading size="md">BJB Documentation System</Heading>
        </Flex>
        <Flex align="center">
          <ChakraLink as={Link} to="/" mr={4}>
            Dashboard
          </ChakraLink>
          <ChakraLink as={Link} to="/contract-form" mr={4}>
            Contract Generation
          </ChakraLink>
          <ChakraLink as={Link} to="/clients" mr={4}>
            Clients
          </ChakraLink>
          <ChakraLink as={Link} to="/legal-texts" mr={4}>
            Legal Texts
          </ChakraLink>
          <ChakraLink as={Link} to="/upload-document" mr={4}>
            Document Synthesis
          </ChakraLink>
          <Button colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
