// src/components/DocumentGenerator.js
import React from 'react';
import { Box, Text, Button, FormControl, FormLabel, Select, VStack } from '@chakra-ui/react';
import { fetchClients, fetchLegalTexts } from '../services/api';

const DocumentGenerator = () => {
  const [clients, setClients] = React.useState([]);
  const [legalTexts, setLegalTexts] = React.useState([]);
  const [selectedClient, setSelectedClient] = React.useState('');
  const [selectedLegalText, setSelectedLegalText] = React.useState('');

  React.useEffect(() => {
    const getClients = async () => {
      const response = await fetchClients();
      setClients(response.data);
    };
    const getLegalTexts = async () => {
      const response = await fetchLegalTexts();
      setLegalTexts(response.data);
    };
    getClients();
    getLegalTexts();
  }, []);

  const handleGenerate = () => {
    // Add logic to generate the document
    console.log(`Generating document for client ${selectedClient} with legal text ${selectedLegalText}`);
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={6}>
        Document Generation
      </Text>
      <VStack align="stretch" spacing={4}>
        <FormControl>
          <FormLabel>Select Client</FormLabel>
          <Select placeholder="Select client" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Select Legal Text Template</FormLabel>
          <Select placeholder="Select legal text" value={selectedLegalText} onChange={(e) => setSelectedLegalText(e.target.value)}>
            {legalTexts.map((text) => (
              <option key={text.id} value={text.id}>
                {text.title}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button colorScheme="blue" onClick={handleGenerate}>
          Generate Document
        </Button>
      </VStack>
    </Box>
  );
};

export default DocumentGenerator;
