// src/components/DocumentViewer.js
import React from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const DocumentViewer = ({ url, onClose }) => {
    return (
        <Box position="fixed" top="0" left="0" width="100%" height="100%" bg="rgba(0, 0, 0, 0.8)" zIndex="overlay" p={4}>
            <IconButton
                aria-label="Close"
                icon={<CloseIcon />}
                position="absolute"
                top="16px"
                right="16px"
                colorScheme="whiteAlpha"
                onClick={onClose} // Call the onClose function when clicked
            />
            <iframe
                src={url}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Document Viewer"
            />
        </Box>
    );
};

export default DocumentViewer;
