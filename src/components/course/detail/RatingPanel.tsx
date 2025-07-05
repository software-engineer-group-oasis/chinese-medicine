import React, { useEffect, useState } from 'react';
import { Card, Rate, Button, Input, message, Typography, Divider } from 'antd';
import { StarOutlined, SendOutlined } from '@ant-design/icons';
import { submitRating,fetchUserRating } from '@/hooks/useCourses';
const { TextArea } = Input;
const { Title, Text } = Typography;

interface RatingPanelProps {
  courseId: number;
  onRatingSubmit?: (rating: number) => void;
  initialRating?: number;
}

export default function RatingPanel({
  courseId,
  onRatingSubmit,
  initialRating = 0
}: RatingPanelProps) {

  const [rating, setRating] = useState<number>(initialRating);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [hasRated, setHasRated] = useState<boolean>(false);
  
  useEffect(() => {
    const checkRating =async() => {
      const {hasRated,ratingValue} = await fetchUserRating(courseId);

      if(hasRated){
        setHasRated(hasRated);
        setRating(ratingValue);
      }
    };
    checkRating();
  }, [courseId]);

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      message.warning('请先为课程评分');
      return;
    }

    setSubmitting(true);

    try {
      // 添加API调用来提交评分
      await submitRating(courseId, rating);
      
    
      if (onRatingSubmit) {
        onRatingSubmit(rating);
      }
      
      setHasRated(true);
    } catch (error) {
      console.error('Rating submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card 
      title={<span><StarOutlined className="mr-2 text-yellow-500" />我的评分</span>}
      className="mb-6"
    >
      {hasRated ? (
        <div className="text-center py-4">
          <Title level={4} className="mb-4">感谢您的评价！</Title>
          <div className="mb-2">您的评分：</div>
          <Rate disabled value={rating} className="text-2xl mb-4" />
        </div>
      ) : (
        <div>
          <div className="text-center mb-4">
            <div className="mb-2">请为本课程评分：</div>
            <Rate 
              allowHalf 
              value={rating} 
              onChange={handleRatingChange} 
              className="text-2xl"
            />
            <div className="mt-2 text-gray-500">
              {rating > 0 ? (
                rating <= 2 ? '需要改进' : 
                rating <= 3.5 ? '还不错' : 
                rating <= 4.5 ? '很好' : '非常棒！'
              ) : '点击星星进行评分'}
            </div>
          </div>
          <Divider />
          <div className="text-right">
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              loading={submitting}
              onClick={handleSubmit}
            >
              提交评分
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}