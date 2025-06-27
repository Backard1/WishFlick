import React, { useState } from 'react';
import { Heart, Share2, MessageCircle, DollarSign, Calendar, Tag } from 'lucide-react';
import { Wish } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface WishCardProps {
  wish: Wish;
  onContribute: (wishId: string) => void;
  onLike: (wishId: string) => void;
  onShare: (wishId: string) => void;
}

export const WishCard: React.FC<WishCardProps> = ({ wish, onContribute, onLike, onShare }) => {
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const progressPercentage = Math.min((wish.currentAmount / wish.targetAmount) * 100, 100);
  const remainingAmount = wish.targetAmount - wish.currentAmount;
  const daysLeft = wish.deadline ? Math.ceil((wish.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  const handleLike = () => {
    if (!isAuthenticated) return;
    setIsLiked(!isLiked);
    onLike(wish.id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {/* Image */}
      {wish.imageUrl && (
        <div className="relative">
          <img
            src={wish.imageUrl}
            alt={wish.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
              {wish.category}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {wish.title}
          </h3>
          {daysLeft && (
            <div className="flex items-center text-sm text-gray-500 ml-4">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{daysLeft}d</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {wish.description}
        </p>

        {/* Tags */}
        {wish.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {wish.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {formatCurrency(wish.currentAmount)} raised
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#B48DFE] to-[#98E2D5] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>Goal: {formatCurrency(wish.targetAmount)}</span>
            <span>{formatCurrency(remainingAmount)} to go</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              disabled={!isAuthenticated}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                isLiked
                  ? 'text-red-500'
                  : isAuthenticated
                  ? 'text-gray-500 hover:text-red-500'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>124</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-[#B48DFE] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>8</span>
            </button>
            <button
              onClick={() => onShare(wish.id)}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-[#B48DFE] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          <button
            onClick={() => onContribute(wish.id)}
            disabled={!isAuthenticated || progressPercentage >= 100}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !isAuthenticated || progressPercentage >= 100
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#B48DFE] to-[#6A49C8] text-white hover:shadow-lg transform hover:scale-105'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Support</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="space-y-3">
              <div className="flex space-x-3">
                <img
                  src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=50"
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-medium">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">This is such a great cause! Wishing you all the best! 🎉</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
            {isAuthenticated && (
              <div className="mt-3 pt-3 border-t border-gray-50">
                <div className="flex space-x-3">
                  <img
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50"
                    alt="You"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 text-sm bg-gray-50 rounded-full px-4 py-2 border-0 focus:ring-2 focus:ring-[#B48DFE] transition-all"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};