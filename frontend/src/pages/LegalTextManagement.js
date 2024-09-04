// src/pages/LegalTextManagement.js
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Box, Text, Button, VStack, List, ListItem, Image, Skeleton } from '@chakra-ui/react';
import { fetchLegalTexts } from '../services/api';

const DocumentViewer = lazy(() => import('../components/DocumentViewer'));

const LegalTextManagement = () => {
  const [legalTexts, setLegalTexts] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    const getLegalTexts = async () => {
      try {
        const response = await fetchLegalTexts();
        setLegalTexts(response);
      } catch (error) {
        console.error("Failed to fetch documents", error);
      }
    };
    getLegalTexts();
  }, []);

  const handleDocumentClick = (url) => {
    setSelectedDocument(url);
  };

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
            <ListItem key={text.id} p={4} bg="white" borderRadius="md" boxShadow="md" onClick={() => handleDocumentClick(text.url)}>
              <Box display="flex" alignItems="center">
                <Image
                  src={text.iconUrl}
                  alt={text.title}
                  boxSize="50px"
                  objectFit="cover"
                  mr={4}
                  fallbackSrc="https://via.placeholder.com/50"
                />
                <Text fontSize="lg">{text.title}</Text>
              </Box>
            </ListItem>
          ))}
        </List>
      </VStack>
      {selectedDocument && (
        <Suspense fallback={<Skeleton height="200px" width="100%" />}>
          <DocumentViewer url={selectedDocument} />
        </Suspense>
      )}
    </Box>
  );
};

export default LegalTextManagement;
