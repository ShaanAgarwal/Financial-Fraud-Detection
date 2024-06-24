import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Spinner, Alert, AlertIcon } from '@chakra-ui/react';

const ViewFraudTransactions = () => {
  const [fraudTransactions, setFraudTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFraudTransactions = async () => {
      try {
        const fraudTransactionResponse = await axios.get('http://localhost:8080/api/fraud-transactions');
        const fraudTransactions = fraudTransactionResponse.data;

        const userIds = [
          ...new Set(fraudTransactions.flatMap(tx => [tx.userId, tx.recipientId]))
        ];

        const userResponses = await Promise.all(userIds.map(id => axios.get(`http://localhost:8080/api/users/${id}`)));
        const users = userResponses.reduce((acc, userResponse) => {
          acc[userResponse.data.userId] = userResponse.data.username;
          return acc;
        }, {});

        const fraudTransactionsWithUsernames = fraudTransactions.map(tx => ({
          ...tx,
          username: users[tx.userId],
          recipientName: users[tx.recipientId]
        }));

        setFraudTransactions(fraudTransactionsWithUsernames);
        setLoading(false);
      } catch (error) {
        setError('Error fetching fraud transactions');
        setLoading(false);
      }
    };

    fetchFraudTransactions();
  }, []);

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Fraud Transaction ID</Th>
            <Th>User</Th>
            <Th>Recipient</Th>
            <Th>Amount</Th>
            <Th>Timestamp</Th>
            <Th>Description</Th>
          </Tr>
        </Thead>
        <Tbody>
          {fraudTransactions.map(fraudTransaction => (
            <Tr key={fraudTransaction.id}>
              <Td>{fraudTransaction.transactionId}</Td>
              <Td>{fraudTransaction.username}</Td>
              <Td>{fraudTransaction.recipientName}</Td>
              <Td>{fraudTransaction.amount}</Td>
              <Td>{new Date(fraudTransaction.timestamp).toLocaleString()}</Td>
              <Td>{fraudTransaction.description}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ViewFraudTransactions;
