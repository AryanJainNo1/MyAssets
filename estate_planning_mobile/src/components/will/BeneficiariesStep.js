import React from 'react';
import {
  VStack,
  HStack,
  FormControl,
  Input,
  Select,
  IconButton,
  Button,
  Box,
  Divider,
  Text,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const BeneficiariesStep = ({ willData, setWillData }) => {
  const handleAddBeneficiary = () => {
    setWillData({
      ...willData,
      beneficiaries: [
        ...willData.beneficiaries,
        {
          name: '',
          relationship: '',
          contact_info: '',
          percentage_share: '',
          specific_assets: [],
        },
      ],
    });
  };

  const handleRemoveBeneficiary = (index) => {
    const newBeneficiaries = willData.beneficiaries.filter((_, i) => i !== index);
    setWillData({ ...willData, beneficiaries: newBeneficiaries });
  };

  const updateBeneficiary = (index, field, value) => {
    const newBeneficiaries = [...willData.beneficiaries];
    newBeneficiaries[index] = {
      ...newBeneficiaries[index],
      [field]: value,
    };
    setWillData({ ...willData, beneficiaries: newBeneficiaries });
  };

  return (
    <VStack space={4}>
      <Button
        leftIcon={<MaterialIcons name="person-add" size={24} color="white" />}
        onPress={handleAddBeneficiary}
      >
        Add Beneficiary
      </Button>

      {willData.beneficiaries.map((beneficiary, index) => (
        <Box key={index} p={4} bg="coolGray.50" rounded="md">
          <HStack justifyContent="space-between" alignItems="center" mb={2}>
            <Text bold fontSize="md">
              Beneficiary {index + 1}
            </Text>
            <IconButton
              icon={<MaterialIcons name="delete" size={24} color="red" />}
              onPress={() => handleRemoveBeneficiary(index)}
            />
          </HStack>
          <Divider mb={4} />
          <VStack space={3}>
            <FormControl isRequired>
              <FormControl.Label>Name</FormControl.Label>
              <Input
                value={beneficiary.name}
                onChangeText={(value) => updateBeneficiary(index, 'name', value)}
                placeholder="Enter beneficiary name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormControl.Label>Relationship</FormControl.Label>
              <Select
                selectedValue={beneficiary.relationship}
                onValueChange={(value) =>
                  updateBeneficiary(index, 'relationship', value)
                }
              >
                <Select.Item label="Spouse" value="SPOUSE" />
                <Select.Item label="Child" value="CHILD" />
                <Select.Item label="Parent" value="PARENT" />
                <Select.Item label="Sibling" value="SIBLING" />
                <Select.Item label="Friend" value="FRIEND" />
                <Select.Item label="Other" value="OTHER" />
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormControl.Label>Contact Information</FormControl.Label>
              <Input
                value={beneficiary.contact_info}
                onChangeText={(value) =>
                  updateBeneficiary(index, 'contact_info', value)
                }
                placeholder="Enter contact information"
              />
            </FormControl>

            <FormControl isRequired>
              <FormControl.Label>Percentage Share</FormControl.Label>
              <Input
                value={beneficiary.percentage_share.toString()}
                onChangeText={(value) =>
                  updateBeneficiary(index, 'percentage_share', value)
                }
                keyboardType="numeric"
                placeholder="Enter percentage share"
              />
            </FormControl>
          </VStack>
        </Box>
      ))}
    </VStack>
  );
};

export default BeneficiariesStep; 