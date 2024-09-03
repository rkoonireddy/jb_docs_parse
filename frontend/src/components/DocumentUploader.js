import React from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Box, Text, Spinner, VStack } from '@chakra-ui/react';

const DocumentUploader = () => {
    const [uploading, setUploading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: ['application/pdf', 'application/msword', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        onDrop: async (acceptedFiles) => {
            setUploading(true);
            setError(null);

            try {
                const file = acceptedFiles[0];
                const formData = new FormData();
                formData.append('file', file);

                await axios.post('http://localhost:8000/upload-document/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                alert('File uploaded successfully');
            } catch (err) {
                setError('Error uploading file');
            } finally {
                setUploading(false);
            }
        },
    });

    return (
        <VStack spacing={4} p={4} {...getRootProps()} border="2px dashed gray" borderRadius="md" w="100%" minH="200px" align="center" justify="center">
            <input {...getInputProps()} />
            {uploading ? <Spinner size="xl" /> : <Text>Drag & drop a document here, or click to select one</Text>}
            {error && <Text color="red.500">{error}</Text>}
        </VStack>
    );
};

export default DocumentUploader;
