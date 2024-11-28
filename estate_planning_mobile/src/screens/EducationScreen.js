import React, { useState, useEffect } from 'react';
import {
  Box,
  ScrollView,
  VStack,
  HStack,
  Text,
  Heading,
  Select,
  Input,
  Button,
  Pressable,
  Image,
  Badge,
  IconButton,
  useToast,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';

const CATEGORIES = [
  { value: 'BASICS', label: 'Estate Planning Basics' },
  { value: 'WILLS', label: 'Wills and Trusts' },
  { value: 'TAXES', label: 'Estate Taxes' },
  { value: 'INSURANCE', label: 'Life Insurance' },
  { value: 'ASSETS', label: 'Asset Management' },
  { value: 'LEGAL', label: 'Legal Considerations' },
];

const EducationScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchContent();
    fetchRecommendations();
  }, [category]);

  const fetchContent = async () => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (searchTerm) params.append('search', searchTerm);

      const [articlesRes, videosRes] = await Promise.all([
        api.get(`/education/articles/?${params}`),
        api.get(`/education/videos/?${params}`),
      ]);

      setArticles(articlesRes.data);
      setVideos(videosRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.show({
        description: 'Error loading content',
        status: 'error',
      });
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await api.post('/education/recommendations/generate/');
      setRecommendations([response.data, ...recommendations]);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.show({
        description: 'Error generating recommendations',
        status: 'error',
      });
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <ScrollView bg="white">
      <VStack space={4} p={4}>
        {/* Filters */}
        <VStack space={3}>
          <Select
            selectedValue={category}
            onValueChange={setCategory}
            placeholder="Select Category"
          >
            {CATEGORIES.map((cat) => (
              <Select.Item
                key={cat.value}
                label={cat.label}
                value={cat.value}
              />
            ))}
          </Select>

          <HStack space={2}>
            <Input
              flex={1}
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search content..."
            />
            <Button onPress={fetchContent}>Search</Button>
          </HStack>
        </VStack>

        {/* AI Recommendations */}
        <VStack space={3}>
          <Heading size="md">Personalized Recommendations</Heading>
          <Button
            leftIcon={<MaterialIcons name="psychology" size={24} color="white" />}
            onPress={fetchRecommendations}
          >
            Generate New Recommendation
          </Button>
          {recommendations.map((rec, index) => (
            <Box
              key={index}
              bg="coolGray.50"
              p={4}
              rounded="md"
              borderWidth={1}
              borderColor="coolGray.200"
            >
              <Text>{rec.content}</Text>
              <Badge
                colorScheme={rec.is_implemented ? 'success' : 'coolGray'}
                mt={2}
              >
                {rec.is_implemented ? 'Implemented' : 'Pending'}
              </Badge>
            </Box>
          ))}
        </VStack>

        {/* Articles */}
        <VStack space={3}>
          <Heading size="md">Articles</Heading>
          {articles.map((article) => (
            <Pressable
              key={article.id}
              onPress={() =>
                navigation.navigate('ArticleDetail', { article })
              }
            >
              <Box
                bg="coolGray.50"
                p={4}
                rounded="md"
                borderWidth={1}
                borderColor="coolGray.200"
              >
                {article.thumbnail && (
                  <Image
                    source={{ uri: article.thumbnail }}
                    alt={article.title}
                    height={150}
                    rounded="md"
                    mb={3}
                  />
                )}
                <Heading size="sm">{article.title}</Heading>
                <Text color="coolGray.600" mt={1}>
                  {article.category_display} • {article.read_time} min read
                </Text>
                <Text numberOfLines={2} mt={2}>
                  {article.content}
                </Text>
              </Box>
            </Pressable>
          ))}
        </VStack>

        {/* Videos */}
        <VStack space={3}>
          <Heading size="md">Videos</Heading>
          {videos.map((video) => (
            <Box
              key={video.id}
              bg="coolGray.50"
              p={4}
              rounded="md"
              borderWidth={1}
              borderColor="coolGray.200"
            >
              {video.thumbnail && (
                <Image
                  source={{ uri: video.thumbnail }}
                  alt={video.title}
                  height={150}
                  rounded="md"
                  mb={3}
                />
              )}
              <Heading size="sm">{video.title}</Heading>
              <Text color="coolGray.600" mt={1}>
                {video.category_display} • {formatDuration(video.duration)}
              </Text>
              <Text numberOfLines={2} mt={2}>
                {video.description}
              </Text>
              <Button
                mt={3}
                onPress={() => Linking.openURL(video.url)}
                leftIcon={
                  <MaterialIcons name="play-circle-fill" size={24} color="white" />
                }
              >
                Watch Video
              </Button>
            </Box>
          ))}
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default EducationScreen; 