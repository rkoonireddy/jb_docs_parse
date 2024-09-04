import React, { useState, useEffect } from 'react';
import { Button, Input, FormControl, FormLabel, VStack, Box, Select, Textarea, Checkbox, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { fetchLegalTexts } from '../services/api'; // Ensure this function is correctly defined

const ContractForm = () => {
    const [formData, setFormData] = useState({
        contractType: 'mortgage', // Default to 'mortgage'
        name: '',
        address: '',
        amount: '',
        duration: '',
        country: '',
        language: 'English', // Default to English
        specialInput: '',
        selectedDocuments: [], // For selected document titles
    });

    const [legalTexts, setLegalTexts] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const [loadingLegalTexts, setLoadingLegalTexts] = useState(true);

    useEffect(() => {
        const getLegalTexts = async () => {
            try {
                const response = await fetchLegalTexts();
                setLegalTexts(response);
            } catch (error) {
                console.error("Failed to fetch legal texts", error);
            } finally {
                setLoadingLegalTexts(false);
            }
        };
        getLegalTexts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDocumentSelect = (documentTitle) => {
        setFormData((prevData) => {
            const { selectedDocuments } = prevData;
            const newSelectedDocuments = selectedDocuments.includes(documentTitle)
                ? selectedDocuments.filter(title => title !== documentTitle)
                : [...selectedDocuments, documentTitle];

            return {
                ...prevData,
                selectedDocuments: newSelectedDocuments,
            };
        });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:8000/generate-contract', formData, {
                responseType: 'blob', // Expect a binary response (PDF)
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'contract.pdf');
            document.body.appendChild(link);
            link.click();
            setIsGenerated(true);
        } catch (error) {
            console.error('Error generating contract:', error.response ? error.response.data : error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box p={4}>
            <VStack spacing={4} align="stretch">
                <FormControl id="contractType" isRequired>
                    <FormLabel>Contract Type</FormLabel>
                    <Select name="contractType" value={formData.contractType} onChange={handleChange}>
                        <option value="mortgage">Mortgage</option>
                        <option value="loan">Loan</option>
                        <option value="lease">Lease</option>
                        {/* Add more options as needed */}
                    </Select>
                </FormControl>

                <FormControl id="name" isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input name="name" value={formData.name} onChange={handleChange} />
                </FormControl>
                <FormControl id="address" isRequired>
                    <FormLabel>Address</FormLabel>
                    <Input name="address" value={formData.address} onChange={handleChange} />
                </FormControl>
                <FormControl id="country" isRequired>
                    <FormLabel>Country</FormLabel>
                    <Input name="country" value={formData.country} onChange={handleChange} />
                </FormControl>
                <FormControl id="language" isRequired>
                    <FormLabel>Language</FormLabel>
                    <Select name="language" value={formData.language} onChange={handleChange}>
                        <option value="English">English</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Italian">Italian</option>
                    </Select>
                </FormControl>
                <FormControl id="specialInput" isRequired>
                    <FormLabel>Special Input</FormLabel>
                    <Textarea name="specialInput" value={formData.specialInput} onChange={handleChange} />
                </FormControl>

                {/* Legal Text Selection */}
                <FormControl id="legalTexts" isRequired>
                    <FormLabel>Select Legal Texts</FormLabel>
                    {loadingLegalTexts ? (
                        <Spinner />
                    ) : (
                        <VStack align="start">
                            {legalTexts.map((text) => (
                                <Checkbox
                                    key={text.title} // Use document title as key
                                    value={text.title} // Use title to manage state
                                    isChecked={formData.selectedDocuments.includes(text.title)}
                                    onChange={() => handleDocumentSelect(text.title)}
                                >
                                    {text.title} {/* Display document title */}
                                </Checkbox>
                            ))}
                        </VStack>
                    )}
                </FormControl>

                {/* Conditional fields based on contractType */}
                {formData.contractType === 'mortgage' && (
                    <>
                        <FormControl id="amount" isRequired>
                            <FormLabel>Amount</FormLabel>
                            <Input name="amount" type="number" value={formData.amount} onChange={handleChange} />
                        </FormControl>
                        <FormControl id="duration" isRequired>
                            <FormLabel>Duration (months)</FormLabel>
                            <Input name="duration" type="number" value={formData.duration} onChange={handleChange} />
                        </FormControl>
                    </>
                )}

                {formData.contractType === 'loan' && (
                    <>
                        {/* Add loan-specific fields here */}
                        <FormControl id="interestRate" isRequired>
                            <FormLabel>Interest Rate (%)</FormLabel>
                            <Input name="interestRate" type="number" step="0.01" value={formData.interestRate} onChange={handleChange} />
                        </FormControl>
                        {/* Other loan-specific fields */}
                    </>
                )}

                {formData.contractType === 'lease' && (
                    <>
                        {/* Add lease-specific fields here */}
                        <FormControl id="monthlyRent" isRequired>
                            <FormLabel>Monthly Rent</FormLabel>
                            <Input name="monthlyRent" type="number" value={formData.monthlyRent} onChange={handleChange} />
                        </FormControl>
                        {/* Other lease-specific fields */}
                    </>
                )}

                <Button
                    colorScheme="teal"
                    onClick={handleSubmit}
                    isDisabled={isSubmitting || isGenerated}
                >
                    Generate Contract
                </Button>
            </VStack>
        </Box>
    );
};

export default ContractForm;
