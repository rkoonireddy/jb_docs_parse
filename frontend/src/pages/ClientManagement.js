// src/pages/ClientManagement.js
import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import ClientList from '../components/ClientList';

const ClientManagement = () => (
  <Flex>
    <Box>
      <ClientList />
    </Box>
  </Flex>
);

export default ClientManagement;
