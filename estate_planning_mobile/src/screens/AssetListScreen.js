import React, { useEffect, useState } from 'react';
import {
  Box,
  FlatList,
  HStack,
  VStack,
  Text,
  Pressable,
  IconButton,
  Button,
  Select,
  Heading,
  Badge,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssets } from '../redux/slices/assetsSlice';
import AssetForm from '../components/AssetForm';
import api from '../services/api';

const AssetListScreen = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.assets);
  const [showForm, setShowForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [filters, setFilters] = useState({
    asset_type: '',
    status: '',
  });

  useEffect(() => {
    dispatch(fetchAssets(filters));
  }, [dispatch, filters]);

  const handleAddEdit = async (formData) => {
    try {
      if (selectedAsset) {
        await api.put(`/assets/${selectedAsset.id}/`, formData);
      } else {
        await api.post('/assets/', formData);
      }
      dispatch(fetchAssets(filters));
      setShowForm(false);
      setSelectedAsset(null);
    } catch (error) {
      console.error('Error saving asset:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/assets/${id}/`);
      dispatch(fetchAssets(filters));
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => {
        setSelectedAsset(item);
        setShowForm(true);
      }}
    >
      <Box
        borderBottomWidth="1"
        borderColor="coolGray.200"
        pl="4"
        pr="5"
        py="2"
      >
        <HStack space={3} justifyContent="space-between">
          <VStack>
            <Text bold>{item.name}</Text>
            <Text fontSize="sm" color="coolGray.600">
              {item.asset_type_display}
            </Text>
          </VStack>
          <VStack alignItems="flex-end">
            <Text>${Number(item.value).toLocaleString()}</Text>
            <Badge
              colorScheme={item.status === 'ACTIVE' ? 'success' : 'coolGray'}
              rounded="4"
            >
              {item.status_display}
            </Badge>
          </VStack>
        </HStack>
      </Box>
    </Pressable>
  );

  return (
    <Box flex={1} bg="white">
      <VStack space={4} p={4}>
        <HStack justifyContent="space-between" alignItems="center">
          <Heading size="md">Assets</Heading>
          <Button
            onPress={() => {
              setSelectedAsset(null);
              setShowForm(true);
            }}
          >
            Add Asset
          </Button>
        </HStack>

        <HStack space={2}>
          <Select
            flex={1}
            selectedValue={filters.asset_type}
            onValueChange={(value) =>
              setFilters({ ...filters, asset_type: value })
            }
            placeholder="All Types"
          >
            <Select.Item label="Real Estate" value="REAL_ESTATE" />
            <Select.Item label="Vehicle" value="VEHICLE" />
            <Select.Item label="Investment" value="INVESTMENT" />
            <Select.Item label="Bank Account" value="BANK_ACCOUNT" />
            <Select.Item label="Personal Property" value="PERSONAL_PROPERTY" />
            <Select.Item label="Other" value="OTHER" />
          </Select>

          <Select
            flex={1}
            selectedValue={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
            placeholder="All Statuses"
          >
            <Select.Item label="Active" value="ACTIVE" />
            <Select.Item label="Sold" value="SOLD" />
            <Select.Item label="Transferred" value="TRANSFERRED" />
            <Select.Item label="Deprecated" value="DEPRECATED" />
          </Select>
        </HStack>

        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </VStack>

      <AssetForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedAsset(null);
        }}
        initialData={selectedAsset}
        onSubmit={handleAddEdit}
      />
    </Box>
  );
};

export default AssetListScreen; 