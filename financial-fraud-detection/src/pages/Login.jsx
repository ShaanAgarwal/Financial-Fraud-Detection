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
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${backendURL}/api/users/login`,
        null,
        {
          params: { username, password },
        }
      );
      if (response.data) {
        localStorage.setItem("userId", response.data);
        toast({
          title: "Login successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/user");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const isFormValid = () => {
    return username.trim() !== "" && password.trim() !== "" && !isSubmitting;
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Heading mb={6}>Login</Heading>
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
        <Button
          colorScheme="teal"
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          Login
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
