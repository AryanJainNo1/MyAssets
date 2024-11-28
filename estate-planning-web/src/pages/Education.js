import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import api from '../services/api';

const CATEGORIES = [
  { value: 'BASICS', label: 'Estate Planning Basics' },
  { value: 'WILLS', label: 'Wills and Trusts' },
  { value: 'TAXES', label: 'Estate Taxes' },
  { value: 'INSURANCE', label: 'Life Insurance' },
  { value: 'ASSETS', label: 'Asset Management' },
  { value: 'LEGAL', label: 'Legal Considerations' },
];

const Education = () => {
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await api.post('/education/recommendations/generate/');
      setRecommendations([response.data, ...recommendations]);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12}>
          <Box display="flex" gap={2} mb={3}>
            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchContent()}
            />
            <Button variant="contained" onClick={fetchContent}>
              Search
            </Button>
          </Box>
        </Grid>

        {/* AI Recommendations */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Personalized Recommendations
          </Typography>
          <Button variant="outlined" onClick={fetchRecommendations} sx={{ mb: 2 }}>
            Generate New Recommendation
          </Button>
          {recommendations.map((rec, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body1">{rec.content}</Typography>
                <Box mt={2}>
                  <Chip
                    label={rec.is_implemented ? 'Implemented' : 'Pending'}
                    color={rec.is_implemented ? 'success' : 'default'}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 3 }} />
        </Grid>

        {/* Articles */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Articles
          </Typography>
          <Grid container spacing={2}>
            {articles.map((article) => (
              <Grid item xs={12} key={article.id}>
                <Card>
                  {article.thumbnail && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={article.thumbnail}
                      alt={article.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">{article.title}</Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {article.category_display} • {article.read_time} min read
                    </Typography>
                    <Typography variant="body2" noWrap>
                      {article.content.substring(0, 150)}...
                    </Typography>
                    <Button sx={{ mt: 1 }}>Read More</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Videos */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Videos
          </Typography>
          <Grid container spacing={2}>
            {videos.map((video) => (
              <Grid item xs={12} key={video.id}>
                <Card>
                  {video.thumbnail && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={video.thumbnail}
                      alt={video.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">{video.title}</Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {video.category_display} • {formatDuration(video.duration)}
                    </Typography>
                    <Typography variant="body2" noWrap>
                      {video.description}
                    </Typography>
                    <Button
                      sx={{ mt: 1 }}
                      onClick={() => window.open(video.url, '_blank')}
                    >
                      Watch Video
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Education; 