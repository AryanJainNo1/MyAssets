import React from 'react';
import {
  VStack,
  FormControl,
  Input,
  TextArea,
  Select,
} from 'native-base';

const BasicInfoStep = ({ willData, setWillData }) => {
  return (
    <VStack space={4}>
      <FormControl isRequired>
        <FormControl.Label>Will Title</FormControl.Label>
        <Input
          value={willData.title}
          onChangeText={(value) =>
            setWillData({ ...willData, title: value })
          }
          placeholder="Enter will title"
        />
      </FormControl>

      <FormControl>
        <FormControl.Label>Status</FormControl.Label>
        <Select
          selectedValue={willData.status}
          onValueChange={(value) =>
            setWillData({ ...willData, status: value })
          }
        >
          <Select.Item label="Draft" value="DRAFT" />
          <Select.Item label="Active" value="ACTIVE" />
          <Select.Item label="Revoked" value="REVOKED" />
        </Select>
      </FormControl>

      <FormControl>
        <FormControl.Label>Notes</FormControl.Label>
        <TextArea
          value={willData.notes}
          onChangeText={(value) =>
            setWillData({ ...willData, notes: value })
          }
          autoCompleteType={false}
          placeholder="Enter any additional notes"
          h={20}
        />
      </FormControl>
    </VStack>
  );
};

export default BasicInfoStep; 