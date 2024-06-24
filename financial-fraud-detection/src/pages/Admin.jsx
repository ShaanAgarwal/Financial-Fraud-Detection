import React, { useState } from 'react';
import { Box, Button, VStack, Heading } from '@chakra-ui/react';
import ViewUsers from '../Components/Admin/ViewUsers';
import ViewTransactions from '../Components/Admin/ViewTransactions';
import ViewFraudTransactions from '../Components/Admin/ViewFraudTransactions';

const Admin = () => {
  const [activeComponent, setActiveComponent] = useState('viewUsers');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'viewUsers':
        return <ViewUsers />;
      case 'viewTransactions':
        return <ViewTransactions />;
      case 'viewFraudTransactions':
        return <ViewFraudTransactions />;
      default:
        return <ViewUsers />;
    }
  };

  return (
    <Box display="flex" minHeight="100vh">
      <Box w="250px" bg="gray.200" p={5}>
        <Heading mb={4}>Admin Dashboard</Heading>
        <VStack spacing={4} align="start">
          <Button colorScheme="teal" onClick={() => setActiveComponent('viewUsers')}>
            View All Users
          </Button>
          <Button colorScheme="teal" onClick={() => setActiveComponent('viewTransactions')}>
            View All Transactions
          </Button>
          <Button colorScheme="teal" onClick={() => setActiveComponent('viewFraudTransactions')}>
            View Fraud Transactions
          </Button>
        </VStack>
      </Box>
      <Box flex="1" p={5}>
        {renderComponent()}
      </Box>
    </Box>
  );
};

export default Admin;
