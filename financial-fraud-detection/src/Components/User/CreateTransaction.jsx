import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Select,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { backendURL } from "../../backendURL";

const CreateTransaction = () => {
  const [users, setUsers] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [amount, setAmount] = useState("");
  const toast = useToast();

  useEffect(() => {
    axios
      .get(`${backendURL}/api/users`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleTransactionSubmit = () => {
    const transaction = {
      userId: localStorage.getItem("userId"),
      recipientId,
      amount: parseInt(amount),
      timestamp: new Date().toISOString(),
    };

    axios
      .post(`${backendURL}/api/transactions`, transaction)
      .then((response) => {
        toast({
          title: "Transaction Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: "Transaction Failed",
          description: "Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Box maxW="500px" mx="auto">
      <Heading mb={4}>Create Transaction</Heading>
      <FormControl mb={4}>
        <FormLabel>Recipient</FormLabel>
        <Select
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
        >
          <option value="">Select Recipient</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.username}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Amount</FormLabel>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="teal" onClick={handleTransactionSubmit}>
        Submit
      </Button>
    </Box>
  );
};

export default CreateTransaction;
