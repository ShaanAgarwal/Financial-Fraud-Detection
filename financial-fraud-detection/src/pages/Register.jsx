import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  FormControl,
  FormLabel,
  Heading,
  Alert,
  AlertIcon,
  CloseButton,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { backendURL } from "../backendURL";
import Login from "./Login";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [balance, setBalance] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${backendURL}/api/users/register`, {
        username,
        password,
        accountBalance: balance,
      });
      toast({
        title: "Registration successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setRegistrationSuccess(true);
    } catch (error) {
      setError("Registration failed");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Heading mb={6}>Register</Heading>
      {error && (
        <Alert status="error" mb={4} rounded="md">
          <AlertIcon />
          {error}
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={() => setError("")}
          />
        </Alert>
      )}
      {registrationSuccess ? (
        <Login />
      ) : (
        <VStack spacing={4}>
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl id="balance">
            <FormLabel>Account Balance</FormLabel>
            <Input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="teal" onClick={handleSubmit}>
            Register
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default Register;
