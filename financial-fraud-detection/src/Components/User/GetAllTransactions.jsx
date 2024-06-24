import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { backendURL } from "../../backendURL";

const GetAllTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios
      .get(`${backendURL}/api/transactions/user/${userId}`)
      .then(async (response) => {
        const transactionsWithUsernames = await Promise.all(
          response.data.map(async (transaction) => {
            const recipientName = await fetchUserName(transaction.recipientId);
            return {
              ...transaction,
              recipientName,
            };
          })
        );
        const sortedTransactions = transactionsWithUsernames.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setTransactions(sortedTransactions);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
  }, []);

  const fetchUserName = async (userId) => {
    try {
      const response = await axios.get(`${backendURL}/api/users/${userId}`);
      return response.data.username;
    } catch (error) {
      console.error("Error fetching user:", error);
      return "";
    }
  };

  return (
    <Box maxW="800px" mx="auto" mt={10} p={5}>
      <Heading mb={4}>All Transactions</Heading>
      {transactions.length === 0 ? (
        <Text>No transactions found.</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Recipient</Th>
              <Th>Amount</Th>
              <Th>Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((transaction) => (
              <Tr key={transaction.id}>
                <Td>{transaction.recipientName}</Td>
                <Td>{transaction.amount}</Td>
                <Td>{new Date(transaction.timestamp).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default GetAllTransactions;
