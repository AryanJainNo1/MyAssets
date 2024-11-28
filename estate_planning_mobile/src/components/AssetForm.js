import React, { useState } from 'react';
import {
  Modal,
  FormControl,
  Input,
  Select,
  Button,
  VStack,
  HStack,
  Text,
  ScrollView,
  TextArea,
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';

const AssetForm = ({ isOpen, onClose, initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    asset_type: '',
    value: '',
    date_acquired: new Date(),
    location: '',
    description: '',
    notes: '',
    status: 'ACTIVE',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>
          {initialData ? 'Edit Asset' : 'Add New Asset'}
        </Modal.Header>
        <Modal.Body>
          <ScrollView>
            <VStack space={4}>
              <FormControl isRequired>
                <FormControl.Label>Name</FormControl.Label>
                <Input
                  value={formData.name}
                  onChangeText={(value) => handleChange('name', value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormControl.Label>Asset Type</FormControl.Label>
                <Select
                  selectedValue={formData.asset_type}
                  onValueChange={(value) => handleChange('asset_type', value)}
                >
                  <Select.Item label="Real Estate" value="REAL_ESTATE" />
                  <Select.Item label="Vehicle" value="VEHICLE" />
                  <Select.Item label="Investment" value="INVESTMENT" />
                  <Select.Item label="Bank Account" value="BANK_ACCOUNT" />
                  <Select.Item label="Personal Property" value="PERSONAL_PROPERTY" />
                  <Select.Item label="Other" value="OTHER" />
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormControl.Label>Value</FormControl.Label>
                <Input
                  keyboardType="numeric"
                  value={formData.value.toString()}
                  onChangeText={(value) => handleChange('value', value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormControl.Label>Date Acquired</FormControl.Label>
                <Button
                  onPress={() => setShowDatePicker(true)}
                  variant="outline"
                >
                  {formData.date_acquired.toLocaleDateString()}
                </Button>
              </FormControl>

              <FormControl>
                <FormControl.Label>Status</FormControl.Label>
                <Select
                  selectedValue={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <Select.Item label="Active" value="ACTIVE" />
                  <Select.Item label="Sold" value="SOLD" />
                  <Select.Item label="Transferred" value="TRANSFERRED" />
                  <Select.Item label="Deprecated" value="DEPRECATED" />
                </Select>
              </FormControl>

              <FormControl>
                <FormControl.Label>Location</FormControl.Label>
                <Input
                  value={formData.location}
                  onChangeText={(value) => handleChange('location', value)}
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Description</FormControl.Label>
                <TextArea
                  value={formData.description}
                  onChangeText={(value) => handleChange('description', value)}
                  autoCompleteType={false}
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Notes</FormControl.Label>
                <TextArea
                  value={formData.notes}
                  onChangeText={(value) => handleChange('notes', value)}
                  autoCompleteType={false}
                />
              </FormControl>
            </VStack>
          </ScrollView>
        </Modal.Body>
        <Modal.Footer>
          <HStack space={2}>
            <Button variant="ghost" onPress={onClose}>
              Cancel
            </Button>
            <Button onPress={handleSubmit}>
              {initialData ? 'Update' : 'Add'} Asset
            </Button>
          </HStack>
        </Modal.Footer>
      </Modal.Content>
      {showDatePicker && (
        <DateTimePicker
          value={formData.date_acquired}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              handleChange('date_acquired', selectedDate);
            }
          }}
        />
      )}
    </Modal>
  );
};

export default AssetForm; 