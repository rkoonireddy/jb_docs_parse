import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ClientManagement from './pages/ClientManagement';
import LegalTextManagement from './pages/LegalTextManagement';
import LoginPage from './pages/LoginPage';
import ProtectedRoutesWrapper from './components/ProtectedRoutesWrapper';
import { AuthProvider, useAuth } from './context/AuthContext';
import ContractForm from './pages/ContractForm';
import DocumentUploader from './components/DocumentUploader';


const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Flex direction="column" h="100vh">
      <Header /> {/* Header is included here */}
      <Flex flex="1">
        <Sidebar /> {/* Sidebar is included here */}
        <Box flex="1" p={4} bg="gray.50">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoutesWrapper>
                  <Dashboard />
                </ProtectedRoutesWrapper>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoutesWrapper>
                  <ClientManagement />
                </ProtectedRoutesWrapper>
              }
            />
            <Route
              path="/legal-texts"
              element={
                <ProtectedRoutesWrapper>
                  <LegalTextManagement />
                </ProtectedRoutesWrapper>
              }
            />
            <Route
              path="/upload-document"
              element={
                <ProtectedRoutesWrapper>
                  <DocumentUploader />
                </ProtectedRoutesWrapper>
              }
            />
            <Route
              path="/contract-form"
              element={
                <ProtectedRoutesWrapper>
                  <ContractForm />
                </ProtectedRoutesWrapper>
              }
            />
          </Routes>
        </Box>
      </Flex>
    </Flex>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
