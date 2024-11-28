import React from 'react';
import {
  Box,
  ScrollView,
  VStack,
  Text,
  Heading,
  Image,
  HStack,
  Icon,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const ArticleDetailScreen = ({ route }) => {
  const { article } = route.params;

  return (
    <ScrollView bg="white">
      <VStack space={4}>
        {article.thumbnail && (
          <Image
            source={{ uri: article.thumbnail }}
            alt={article.title}
            height={200}
            width="100%"
          />
        )}
        <VStack p={4} space={4}>
          <Heading size="xl">{article.title}</Heading>
          <HStack space={2} alignItems="center">
            <Icon
              as={MaterialIcons}
              name="category"
              size={5}
              color="coolGray.500"
            />
            <Text color="coolGray.500">{article.category_display}</Text>
            <Icon
              as={MaterialIcons}
              name="schedule"
              size={5}
              color="coolGray.500"
            />
            <Text color="coolGray.500">{article.read_time} min read</Text>
          </HStack>
          <Text fontSize="md" lineHeight="lg">
            {article.content}
          </Text>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default ArticleDetailScreen; 