import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  ScrollView,
  Divider,
  Button,
  FormControl,
  Input,
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';

const ReviewStep = ({ willData, setWillData }) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const calculateTotalShare = () => {
    return willData.beneficiaries.reduce(
      (sum, beneficiary) => sum + Number(beneficiary.percentage_share || 0),
      0
    );
  };

  return (
    <ScrollView>
      <VStack space={4}>
        <Box bg="coolGray.50" p={4} rounded="md">
          <Text bold fontSize="lg" mb={2}>
            Basic Information
          </Text>
          <VStack space={2}>
            <Text>Title: {willData.title}</Text>
            <Text>Status: {willData.status}</Text>
            <Text>Notes: {willData.notes}</Text>
          </VStack>
        </Box>

        <Box bg="coolGray.50" p={4} rounded="md">
          <Text bold fontSize="lg" mb={2}>
            Executor Details
          </Text>
          <VStack space={2}>
            <Text>Name: {willData.executor}</Text>
            <Text>Contact: {willData.executor_contact}</Text>
          </VStack>
        </Box>

        <Box bg="coolGray.50" p={4} rounded="md">
          <Text bold fontSize="lg" mb={2}>
            Beneficiaries
          </Text>
          <Text color="coolGray.600" mb={2}>
            Total Share: {calculateTotalShare()}%
          </Text>
          {willData.beneficiaries.map((beneficiary, index) => (
            <Box key={index} mb={2}>
              <HStack justifyContent="space-between">
                <Text bold>{beneficiary.name}</Text>
                <Text>{beneficiary.percentage_share}%</Text>
              </HStack>
              <Text color="coolGray.600">
                Relationship: {beneficiary.relationship}
              </Text>
              <Divider my={2} />
            </Box>
          ))}
        </Box>

        <Box bg="coolGray.50" p={4} rounded="md">
          <Text bold fontSize="lg" mb={4}>
            Witness Information
          </Text>
          <VStack space={4}>
            <FormControl>
              <FormControl.Label>Witness 1 Name</FormControl.Label>
              <Input
                value={willData.witness_1_name}
                onChangeText={(value) =>
                  setWillData({ ...willData, witness_1_name: value })
                }
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>Witness 2 Name</FormControl.Label>
              <Input
                value={willData.witness_2_name}
                onChangeText={(value) =>
                  setWillData({ ...willData, witness_2_name: value })
                }
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>Signing Date</FormControl.Label>
              <Button
                variant="outline"
                onPress={() => setShowDatePicker(true)}
              >
                {willData.signed_date
                  ? new Date(willData.signed_date).toLocaleDateString()
                  : 'Select Date'}
              </Button>
            </FormControl>
          </VStack>
        </Box>

        {showDatePicker && (
          <DateTimePicker
            value={willData.signed_date ? new Date(willData.signed_date) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setWillData({ ...willData, signed_date: selectedDate });
              }
            }}
          />
        )}
      </VStack>
    </ScrollView>
  );
};

export default ReviewStep; 