import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { backendURL } from '../../backendURL';

const ViewTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionResponse = await axios.get(`${backendURL}/api/transactions`);
        const transactions = transactionResponse.data;

        const userIds = [
          ...new Set(transactions.flatMap(tx => [tx.userId, tx.recipientId]))
        ];

        const userResponses = await Promise.all(userIds.map(id => axios.get(`${backendURL}/api/users/${id}`)));
        const users = userResponses.reduce((acc, userResponse) => {
          acc[userResponse.data.userId] = userResponse.data.username;
          return acc;
        }, {});

        const transactionsWithUsernames = transactions.map(tx => ({
          ...tx,
          username: users[tx.userId],
          recipientName: users[tx.recipientId]
        }));

        setTransactions(transactionsWithUsernames);
        setLoading(false);
      } catch (error) {
        setError('Error fetching transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
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
            <Th>Transaction ID</Th>
            <Th>User</Th>
            <Th>Recipient</Th>
            <Th>Amount</Th>
            <Th>Timestamp</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map(transaction => (
            <Tr key={transaction.id}>
              <Td>{transaction.id}</Td>
              <Td>{transaction.username}</Td>
              <Td>{transaction.recipientName}</Td>
              <Td>${transaction.amount}</Td>
              <Td>{new Date(transaction.timestamp).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ViewTransactions;
