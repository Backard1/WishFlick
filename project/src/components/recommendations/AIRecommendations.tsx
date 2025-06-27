import React from 'react';
import { Sparkles, TrendingUp, Users, Clock } from 'lucide-react';
import { Wish } from '../../types';
import { WishCard } from '../wishes/WishCard';

interface AIRecommendationsProps {
  userId: string;
  onContribute: (wishId: string) => void;
  onLike: (wishId: string) => void;
  onShare: (wishId: string) => void;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  userId,
  onContribute,
  onLike,
  onShare,
}) => {
  // Mock recommended wishes based on user interests
  const recommendedWishes: Wish[] = [
    {
      id: 'rec1',
      userId: 'rec_user_1',
      title: 'Digital Art Tablet for Illustrations',
      description: 'Looking to upgrade my digital art setup with a professional tablet. This will help me create better illustrations for my freelance work.',
      targetAmount: 800,
      currentAmount: 320,
      imageUrl: 'https://images.pexels.com/photos/265667/pexels-photo-265667.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Creative',
      isActive: true,
      createdAt: new Date('2025-01-09'),
      updatedAt: new Date('2025-01-09'),
      tags: ['art', 'digital', 'creative'],
      privacy: 'public',
    },
    {
      id: 'rec2',
      userId: 'rec_user_2',
      title: 'Coding Bootcamp Tuition',
      description: 'Seeking support for coding bootcamp tuition to transition into tech. This will help me start a new career in software development.',
      targetAmount: 2000,
      currentAmount: 1400,
      imageUrl: 'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Education',
      isActive: true,
      createdAt: new Date('2025-01-07'),
      updatedAt: new Date('2025-01-07'),
      tags: ['coding', 'education', 'career'],
      privacy: 'public',
    },
  ];

  const categories = [
    { name: 'Similar Interests', icon: Sparkles, color: 'text-[#B48DFE]' },
    { name: 'Trending', icon: TrendingUp, color: 'text-orange-500' },
    { name: 'Friends Activity', icon: Users, color: 'text-blue-500' },
    { name: 'Ending Soon', icon: Clock, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Recommendation Categories */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#B48DFE]" />
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category.name}
              className="flex flex-col items-center p-4 rounded-lg border border-gray-100 hover:border-[#B48DFE] hover:bg-purple-50 transition-all group"
            >
              <category.icon className={`w-6 h-6 ${category.color} mb-2 group-hover:scale-110 transition-transform`} />
              <span className="text-sm font-medium text-gray-700 text-center">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Wishes */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Recommended for You</h3>
          <button className="text-sm text-[#B48DFE] hover:text-[#6A49C8] transition-colors">
            See all recommendations
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {recommendedWishes.map((wish) => (
            <WishCard
              key={wish.id}
              wish={wish}
              onContribute={onContribute}
              onLike={onLike}
              onShare={onShare}
            />
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-[#B48DFE]/10 to-[#98E2D5]/10 rounded-2xl p-6 border border-purple-100">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#B48DFE] to-[#6A49C8] rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Insights</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Based on your interests in <strong>Technology</strong> and <strong>Creative</strong> categories</p>
              <p>• Similar users also supported wishes in <strong>Education</strong> and <strong>Art</strong></p>
              <p>• <strong>87%</strong> of users like you contribute to wishes under $1000</p>
              <p>• Peak contribution time: <strong>Weekends</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};