// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api', // Update with the actual backend URL
    headers: {
        'Content-Type': 'application a/a.json'
    },
});

export const fetchClients = async () => {
    return await apiClient.get('/clients');
};

export const fetchLegalTexts = async () => {
return await apiClient.get('/legal-texts');
};

// Add more API services as needed
