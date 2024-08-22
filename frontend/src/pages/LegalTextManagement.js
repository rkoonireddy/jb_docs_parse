// src/pages/LegalTextManagement.js
import React from 'react';
import { Box, Text, Button, VStack, List, ListItem } from '@chakra-ui/react';
import { fetchLegalTexts } from '../services/api';

const LegalTextManagement = () => {
  const [legalTexts, setLegalTexts] = React.useState([]);

  React.useEffect(() => {
    const getLegalTexts = async () => {
      const response = await fetchLegalTexts();
      setLegalTexts(response.data);
    };
    getLegalTexts();
  }, []);

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={6}>
        Legal Text Management
      </Text>
      <Button colorScheme="blue" mb={4}>
        Add New Legal Text
      </Button>
      <VStack align="stretch" spacing={4}>
        <List spacing={3}>
          {legalTexts.map((text) => (
            <ListItem key={text.id} p={4} bg="white" borderRadius="md" boxShadow="md">
              {text.title}
            </ListItem>
          ))}
        </List>
      </VStack>
    </Box>
  );
};

export default LegalTextManagement;
