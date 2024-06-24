import React from 'react';
import { Button, VStack } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <VStack spacing={4}>
      <Link to="/login">
        <Button colorScheme="teal" size="lg">Login</Button>
      </Link>
      <Link to="/register">
        <Button colorScheme="teal" size="lg">Register</Button>
      </Link>
      <Button 
        colorScheme="teal" 
        size="lg" 
        onClick={() => navigate('/admin')}
      >
        Admin Dashboard
      </Button>
    </VStack>
  );
}

export default HomePage;
