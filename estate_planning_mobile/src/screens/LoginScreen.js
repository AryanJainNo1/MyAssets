import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  FormControl,
  Heading,
  useToast,
} from 'native-base';
import { setAuth } from '../redux/slices/authSlice';
import api from '../services/api';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login/', credentials);
      await AsyncStorage.setItem('token', response.data.access);
      await AsyncStorage.setItem('refresh_token', response.data.refresh);
      dispatch(setAuth(response.data.user));
    } catch (error) {
      toast.show({
        title: 'Error',
        description: 'Invalid credentials',
        status: 'error',
      });
    }
  };

  return (
    <Box flex={1} p={4} bg="white" justifyContent="center">
      <VStack space={4} alignItems="center">
        <Heading size="lg">Estate Planning</Heading>
        <FormControl>
          <FormControl.Label>Username</FormControl.Label>
          <Input
            value={credentials.username}
            onChangeText={(text) =>
              setCredentials({ ...credentials, username: text })
            }
            autoCapitalize="none"
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Password</FormControl.Label>
          <Input
            value={credentials.password}
            onChangeText={(text) =>
              setCredentials({ ...credentials, password: text })
            }
            type="password"
            autoCapitalize="none"
          />
        </FormControl>
        <Button width="100%" onPress={handleLogin}>
          Sign In
        </Button>
      </VStack>
    </Box>
  );
};

export default LoginScreen; 