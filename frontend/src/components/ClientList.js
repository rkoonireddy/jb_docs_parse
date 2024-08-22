// src/components/ClientList.js
import React, { useState, useEffect } from 'react';
import { Box, Text, List, ListItem } from '@chakra-ui/react';
import { fetchClients } from '../services/api';

const ClientList = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const getClients = async () => {
      const response = await fetchClients();
      setClients(response.data);
    };
    getClients();
  }, []);

  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="md">
      <Text fontSize="2xl" mb={4}>
        Clients
      </Text>
      <List spacing={3}>
        {clients.map((client) => (
          <ListItem key={client.id} p={2} bg="gray.50" borderRadius="md">
            {client.name}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ClientList;
