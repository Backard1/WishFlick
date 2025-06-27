import React from 'react';
import { Heart, MessageCircle, Share2, DollarSign, Sparkles } from 'lucide-react';
import { Activity } from '../../types';

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'wish_created':
        return <Sparkles className="w-5 h-5 text-[#B48DFE]" />;
      case 'contribution_made':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'wish_completed':
        return <Heart className="w-5 h-5 text-red-500 fill-current" />;
      case 'wish_liked':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'wish_shared':
        return <Share2 className="w-5 h-5 text-blue-500" />;
      default:
        return <Heart className="w-5 h-5 text-gray-400" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'wish_created':
        return 'created a new wish';
      case 'contribution_made':
        return `contributed $${activity.metadata?.amount} to a wish`;
      case 'wish_completed':
        return 'completed their wish! 🎉';
      case 'wish_liked':
        return 'liked a wish';
      case 'wish_shared':
        return 'shared a wish';
      default:
        return 'had some activity';
    }
  };

  // Mock activities for demo
  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'contribution_made',
      userId: '2',
      wishId: '1',
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      metadata: { amount: 50, userName: 'Sarah Johnson', wishTitle: 'MacBook Pro for Creative Work' }
    },
    {
      id: '2',
      type: 'wish_created',
      userId: '3',
      wishId: '3',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      metadata: { userName: 'Mike Chen', wishTitle: 'Gaming Setup' }
    },
    {
      id: '3',
      type: 'wish_completed',
      userId: '4',
      wishId: '4',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      metadata: { userName: 'Emma Wilson', wishTitle: 'Art Supplies Collection' }
    },
    {
      id: '4',
      type: 'contribution_made',
      userId: '5',
      wishId: '2',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      metadata: { amount: 25, userName: 'Anonymous', wishTitle: 'Photography Equipment' }
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-[#B48DFE] hover:text-[#6A49C8] transition-colors">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <img
                  src={`https://images.pexels.com/photos/${activity.userId === '2' ? '415829' : activity.userId === '3' ? '733872' : activity.userId === '4' ? '1239291' : '220453'}/pexels-photo-${activity.userId === '2' ? '415829' : activity.userId === '3' ? '733872' : activity.userId === '4' ? '1239291' : '220453'}.jpeg?auto=compress&cs=tinysrgb&w=50`}
                  alt="User"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-900">
                  {activity.metadata?.userName || 'Someone'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {getActivityText(activity)}
                {activity.metadata?.wishTitle && (
                  <span className="font-medium text-gray-900">
                    {' "'}{activity.metadata.wishTitle}{'"'}
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatTimeAgo(activity.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Sparkles className="w-4 h-4" />
          <span>Stay tuned for more updates!</span>
        </div>
      </div>
    </div>
  );
};