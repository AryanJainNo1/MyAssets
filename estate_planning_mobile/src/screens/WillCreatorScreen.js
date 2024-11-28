import React, { useState, useEffect } from 'react';
import {
  Box,
  ScrollView,
  VStack,
  HStack,
  Text,
  Button,
  Progress,
  useToast,
  IconButton,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';
import BasicInfoStep from '../components/will/BasicInfoStep';
import ExecutorStep from '../components/will/ExecutorStep';
import BeneficiariesStep from '../components/will/BeneficiariesStep';
import AssetsStep from '../components/will/AssetsStep';
import ReviewStep from '../components/will/ReviewStep';

const steps = [
  'Basic Information',
  'Executor Details',
  'Add Beneficiaries',
  'Asset Distribution',
  'Review & Sign',
];

const WillCreatorScreen = ({ navigation, route }) => {
  const { id } = route.params || {};
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [willData, setWillData] = useState({
    title: '',
    status: 'DRAFT',
    executor: '',
    executor_contact: '',
    witness_1_name: '',
    witness_2_name: '',
    beneficiaries: [],
    notes: '',
    signed_date: null,
  });

  useEffect(() => {
    if (id) {
      fetchWillData();
    }
  }, [id]);

  const fetchWillData = async () => {
    try {
      const response = await api.get(`/wills/${id}/`);
      setWillData(response.data);
    } catch (error) {
      console.error('Error fetching will data:', error);
      toast.show({
        description: 'Error loading will data',
        status: 'error',
      });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        await api.put(`/wills/${id}/`, willData);
      } else {
        await api.post('/wills/', willData);
      }
      navigation.goBack();
      toast.show({
        description: 'Will saved successfully',
        status: 'success',
      });
    } catch (error) {
      console.error('Error saving will:', error);
      toast.show({
        description: 'Error saving will',
        status: 'error',
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            willData={willData}
            setWillData={setWillData}
          />
        );
      case 1:
        return (
          <ExecutorStep
            willData={willData}
            setWillData={setWillData}
          />
        );
      case 2:
        return (
          <BeneficiariesStep
            willData={willData}
            setWillData={setWillData}
          />
        );
      case 3:
        return (
          <AssetsStep
            willData={willData}
            setWillData={setWillData}
          />
        );
      case 4:
        return (
          <ReviewStep
            willData={willData}
            setWillData={setWillData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box flex={1} bg="white" safeArea>
      <VStack space={4} flex={1}>
        <HStack p={4} justifyContent="space-between" alignItems="center">
          <IconButton
            icon={<MaterialIcons name="arrow-back" size={24} />}
            onPress={() => navigation.goBack()}
          />
          <Text bold fontSize="lg">
            {id ? 'Edit Will' : 'Create Will'}
          </Text>
          <Box width={10} /> {/* Spacer */}
        </HStack>

        <Progress
          value={(currentStep / (steps.length - 1)) * 100}
          mx={4}
        />

        <Text px={4} color="coolGray.600">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
        </Text>

        <ScrollView flex={1} px={4}>
          {renderStep()}
        </ScrollView>

        <HStack p={4} space={2} justifyContent="space-between">
          <Button
            flex={1}
            variant="ghost"
            onPress={handleBack}
            isDisabled={currentStep === 0}
          >
            Back
          </Button>
          {currentStep === steps.length - 1 ? (
            <Button flex={1} onPress={handleSubmit}>
              Finish
            </Button>
          ) : (
            <Button flex={1} onPress={handleNext}>
              Next
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default WillCreatorScreen; 