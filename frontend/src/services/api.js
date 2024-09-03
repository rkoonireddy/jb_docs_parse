import axios from 'axios';

// Create an Axios instance with default settings
const apiClient = axios.create({
    baseURL: 'http://localhost:8000/', // Ensure this matches your backend URL
    headers: {
        'Content-Type': 'application/json' // Correct content type
    },
});

// Function to fetch clients
export const fetchClients = async () => {
    try {
        const response = await apiClient.get('/clients');
        return response.data; // Return only the data part of the response
    } catch (error) {
        console.error("Error fetching clients:", error);
        throw error; // Rethrow error after logging
    }
};

// Function to fetch legal texts (ensure endpoint is defined in your backend)
export const fetchLegalTexts = async () => {
    try {
        const response = await apiClient.get('/legal-texts');
        return response.data; // Return only the data part of the response
    } catch (error) {
        console.error("Error fetching legal texts:", error);
        throw error; // Rethrow error after logging
    }
};

// Add more API services as needed
