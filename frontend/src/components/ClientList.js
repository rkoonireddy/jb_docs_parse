import React, { useEffect, useState } from 'react';
import { Box, Text, List, ListItem } from '@chakra-ui/react';
import { fetchClients } from '../services/api';

const ClientList = () => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const getClients = async () => {
            try {
                const data = await fetchClients();
                setClients(data.data); // Ensure data structure matches the backend response
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
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
