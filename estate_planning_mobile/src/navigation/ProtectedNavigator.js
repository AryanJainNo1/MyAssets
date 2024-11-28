import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AssetListScreen from '../screens/AssetListScreen';
import WillListScreen from '../screens/WillListScreen';
import WillCreatorScreen from '../screens/WillCreatorScreen';
import EducationScreen from '../screens/EducationScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';

const Stack = createNativeStackNavigator();

const ProtectedNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Assets" component={AssetListScreen} />
      <Stack.Screen name="Wills" component={WillListScreen} />
      <Stack.Screen name="WillCreator" component={WillCreatorScreen} />
      <Stack.Screen name="Education" component={EducationScreen} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
    </Stack.Navigator>
  );
};

export default ProtectedNavigator; 