import React, { useState, useEffect } from "react";
import { Box, Heading, Button, VStack, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendURL } from "../backendURL";
import CreateTransaction from "../Components/User/CreateTransaction";
import GetAllTransactions from "../Components/User/GetAllTransactions";

const User = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`${backendURL}/api/users/${userId}`)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <Box display="flex" maxW="1200px" mx="auto" mt={10}>
      <Box w="250px" bg="gray.200" p={5}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Dashboard</Heading>
          <Button colorScheme="teal" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
        <VStack spacing={4} align="start">
          <Button
            colorScheme="teal"
            onClick={() => setActiveComponent("createTransaction")}
          >
            Create Transaction
          </Button>
          <Button
            colorScheme="teal"
            onClick={() => setActiveComponent("getAllTransactions")}
          >
            Get All Transactions
          </Button>
        </VStack>
      </Box>
      <Box flex="1" p={5}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">
            Welcome to the Dashboard, {userData ? userData.username : ""}!
          </Heading>
          <Text>
            Account Balance: ${userData ? userData.accountBalance : ""}
          </Text>
        </Flex>
        {activeComponent === "createTransaction" && <CreateTransaction />}
        {activeComponent === "getAllTransactions" && <GetAllTransactions />}
      </Box>
    </Box>
  );
};

export default User;
