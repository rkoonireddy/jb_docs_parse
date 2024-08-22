// src/components/Sidebar.js
import React from 'react';
import { Box, VStack, Link as ChakraLink } from '@chakra-ui/react';

const Sidebar = () => (
  <Box w="200px" bg="gray.100" p={4}>
    <VStack align="start" spacing={4}>
      <ChakraLink>Quick Link 1</ChakraLink>
      <ChakraLink>Quick Link 2</ChakraLink>
      <ChakraLink>Quick Link 3</ChakraLink>
    </VStack>
  </Box>
);

export default Sidebar;
