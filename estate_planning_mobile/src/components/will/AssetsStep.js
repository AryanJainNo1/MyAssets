import React, { useEffect, useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Select,
  ScrollView,
  Divider,
} from 'native-base';
import api from '../../services/api';

const AssetsStep = ({ willData, setWillData }) => {
  const [assets, setAssets] = useState([]);
  const [assetDistribution, setAssetDistribution] = useState({});

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await api.get('/assets/');
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const handleAssetAssignment = (assetId, beneficiaryId) => {
    setAssetDistribution({
      ...assetDistribution,
      [assetId]: beneficiaryId,
    });
    
    // Update willData with the new asset distribution
    const updatedWillData = {
      ...willData,
      asset_distribution: {
        ...willData.asset_distribution,
        [assetId]: beneficiaryId,
      },
    };
    setWillData(updatedWillData);
  };

  return (
    <ScrollView>
      <VStack space={4}>
        <Text bold fontSize="md" mb={2}>
          Assign Assets to Beneficiaries
        </Text>

        {assets.map((asset) => (
          <Box key={asset.id} bg="coolGray.50" p={4} rounded="md">
            <VStack space={2}>
              <HStack justifyContent="space-between">
                <Text bold>{asset.name}</Text>
                <Text>${Number(asset.value).toLocaleString()}</Text>
              </HStack>
              <Text color="coolGray.600">{asset.asset_type_display}</Text>
              <Divider my={2} />
              <Select
                selectedValue={assetDistribution[asset.id] || ''}
                placeholder="Select Beneficiary"
                onValueChange={(value) => handleAssetAssignment(asset.id, value)}
              >
                {willData.beneficiaries.map((beneficiary, index) => (
                  <Select.Item
                    key={index}
                    label={beneficiary.name}
                    value={beneficiary.id || index.toString()}
                  />
                ))}
              </Select>
            </VStack>
          </Box>
        ))}
      </VStack>
    </ScrollView>
  );
};

export default AssetsStep; 