import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { backendURL } from '../../backendURL';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/users`);
        console.log('API response:', response.data);  // Logging API response
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setError('Unexpected response format');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);  // Logging error
        setError('Error fetching users');
        setLoading(false);
      }
    };

    fetchUsers();
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
            <Th>UserID</Th>
            <Th>Username</Th>
            <Th>Account Balance</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map(user => (
            <Tr key={user.userId}>
              <Td>{user.userId}</Td>
              <Td>{user.username}</Td>
              <Td>${user.accountBalance}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ViewUsers;
