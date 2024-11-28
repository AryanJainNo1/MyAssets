import React, { useEffect, useState } from 'react';
import {
  Box,
  FlatList,
  HStack,
  VStack,
  Text,
  Button,
  Heading,
  Pressable,
  IconButton,
  Badge,
  useToast,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';

const WillListScreen = ({ navigation }) => {
  const [wills, setWills] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchWills();
  }, []);

  const fetchWills = async () => {
    try {
      const response = await api.get('/wills/');
      setWills(response.data);
    } catch (error) {
      console.error('Error fetching wills:', error);
      toast.show({
        description: 'Error loading wills',
        status: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/wills/${id}/`);
      fetchWills();
      toast.show({
        description: 'Will deleted successfully',
        status: 'success',
      });
    } catch (error) {
      console.error('Error deleting will:', error);
      toast.show({
        description: 'Error deleting will',
        status: 'error',
      });
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('WillCreator', { id: item.id })}
    >
      <Box
        borderBottomWidth="1"
        borderColor="coolGray.200"
        p="4"
        bg="white"
        rounded="lg"
        mb="2"
      >
        <HStack justifyContent="space-between" alignItems="center">
          <VStack space={1} flex={1}>
            <Text bold fontSize="md">
              {item.title}
            </Text>
            <Text color="coolGray.600">Executor: {item.executor}</Text>
            <HStack space={2} alignItems="center">
              <Badge
                colorScheme={item.status === 'ACTIVE' ? 'success' : 'coolGray'}
                rounded="4"
              >
                {item.status_display}
              </Badge>
              <Text fontSize="xs" color="coolGray.500">
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </HStack>
          </VStack>
          <IconButton
            icon={<MaterialIcons name="delete" size={24} color="red" />}
            onPress={() => handleDelete(item.id)}
          />
        </HStack>
      </Box>
    </Pressable>
  );

  return (
    <Box flex={1} bg="coolGray.100" p={4}>
      <VStack space={4}>
        <HStack justifyContent="space-between" alignItems="center">
          <Heading size="lg">Wills</Heading>
          <Button
            onPress={() => navigation.navigate('WillCreator')}
            leftIcon={<MaterialIcons name="add" size={24} color="white" />}
          >
            Create Will
          </Button>
        </HStack>

        <FlatList
          data={wills}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </VStack>
    </Box>
  );
};

export default WillListScreen; 