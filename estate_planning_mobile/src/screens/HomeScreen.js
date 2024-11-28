import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  ScrollView,
  VStack,
  HStack,
  Text,
  Heading,
  Pressable,
  Progress,
  Divider,
  Spinner,
} from 'native-base';
import { fetchAssets } from '../redux/slices/assetsSlice';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.assets);

  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Box>
    );
  }

  const totalValue = items.reduce((sum, asset) => sum + Number(asset.value), 0);

  const assetsByType = items.reduce((acc, asset) => {
    const type = asset.asset_type_display;
    if (!acc[type]) {
      acc[type] = {
        type,
        count: 0,
        value: 0,
      };
    }
    acc[type].count += 1;
    acc[type].value += Number(asset.value);
    return acc;
  }, {});

  const assetTypes = Object.values(assetsByType);

  return (
    <ScrollView bg="white">
      <VStack space={4} p={4}>
        <Box bg="primary.100" p={4} rounded="lg">
          <Heading size="md" mb={2}>
            Total Portfolio Value
          </Heading>
          <Text fontSize="2xl" bold>
            ${totalValue.toLocaleString()}
          </Text>
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Asset Distribution
          </Heading>
          <VStack space={4}>
            {assetTypes.map((type) => (
              <Box key={type.type}>
                <HStack justifyContent="space-between" mb={1}>
                  <Text>{type.type}</Text>
                  <Text>${type.value.toLocaleString()}</Text>
                </HStack>
                <Progress
                  value={(type.value / totalValue) * 100}
                  colorScheme="blue"
                />
              </Box>
            ))}
          </VStack>
        </Box>

        <Divider />

        <Box>
          <Heading size="md" mb={4}>
            Recent Assets
          </Heading>
          <VStack space={3}>
            {items.slice(0, 3).map((asset) => (
              <Pressable
                key={asset.id}
                onPress={() => navigation.navigate('Assets')}
                bg="coolGray.50"
                p={3}
                rounded="md"
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <VStack>
                    <Text bold>{asset.name}</Text>
                    <Text fontSize="sm" color="coolGray.600">
                      {asset.asset_type_display}
                    </Text>
                  </VStack>
                  <Text>${Number(asset.value).toLocaleString()}</Text>
                </HStack>
              </Pressable>
            ))}
          </VStack>
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Quick Stats
          </Heading>
          <HStack space={4} justifyContent="space-between">
            <Box flex={1} bg="coolGray.50" p={4} rounded="md">
              <Text color="coolGray.600">Total Assets</Text>
              <Text bold fontSize="xl">
                {items.length}
              </Text>
            </Box>
            <Box flex={1} bg="coolGray.50" p={4} rounded="md">
              <Text color="coolGray.600">Categories</Text>
              <Text bold fontSize="xl">
                {assetTypes.length}
              </Text>
            </Box>
          </HStack>
        </Box>
      </VStack>
    </ScrollView>
  );
};

export default HomeScreen; 