import React from 'react';
import {
  VStack,
  FormControl,
  Input,
} from 'native-base';

const ExecutorStep = ({ willData, setWillData }) => {
  return (
    <VStack space={4}>
      <FormControl isRequired>
        <FormControl.Label>Executor Name</FormControl.Label>
        <Input
          value={willData.executor}
          onChangeText={(value) =>
            setWillData({ ...willData, executor: value })
          }
          placeholder="Enter executor's full name"
        />
      </FormControl>

      <FormControl isRequired>
        <FormControl.Label>Executor Contact</FormControl.Label>
        <Input
          value={willData.executor_contact}
          onChangeText={(value) =>
            setWillData({ ...willData, executor_contact: value })
          }
          placeholder="Enter executor's contact information"
        />
      </FormControl>
    </VStack>
  );
};

export default ExecutorStep; 