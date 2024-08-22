// src/pages/Dashboard.js
import React from 'react';
import { Box, Text, Grid, GridItem, Stat, StatLabel, StatNumber } from '@chakra-ui/react';

const Dashboard = () => (
  <Box p={4}>
    <Text fontSize="2xl" mb={6}>
      Dashboard
    </Text>
    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
      <GridItem>
        <Stat p={4} bg="white" borderRadius="md" boxShadow="md">
          <StatLabel>Total Clients</StatLabel>
          <StatNumber>128</StatNumber>
        </Stat>
      </GridItem>
      <GridItem>
        <Stat p={4} bg="white" borderRadius="md" boxShadow="md">
          <StatLabel>Documents Generated</StatLabel>
          <StatNumber>254</StatNumber>
        </Stat>
      </GridItem>
      <GridItem>
        <Stat p={4} bg="white" borderRadius="md" boxShadow="md">
          <StatLabel>Legal Texts</StatLabel>
          <StatNumber>37</StatNumber>
        </Stat>
      </GridItem>
    </Grid>
  </Box>
);

export default Dashboard;
