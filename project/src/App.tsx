import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishProvider, useWishes } from './context/WishContext';
import { Header } from './components/layout/Header';
import { WishCard } from './components/wishes/WishCard';
import { CreateWishModal } from './components/wishes/CreateWishModal';
import { ContributionModal } from './components/crowdfunding/ContributionModal';
import { AuthModal } from './components/auth/AuthModal';
import { ActivityFeed } from './components/social/ActivityFeed';
import { AIRecommendations } from './components/recommendations/AIRecommendations';
import { Filter, Grid, List, Plus } from 'lucide-react';
import { Wish } from './types';

const MainApp: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { wishes, isLoading } = useWishes();
  const [showCreateWish, setShowCreateWish] = useState(false);
  const [showContribution, setShowContribution] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [currentTab, setCurrentTab] = useState<'feed' | 'discover' | 'profile'>('feed');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleCreateWish = () => {
    if (!isAuthenticated) {
      setAuthMode('login');
      setShowAuth(true);
    } else {
      setShowCreateWish(true);
    }
  };

  const handleContribute = (wishId: string) => {
    if (!isAuthenticated) {
      setAuthMode('login');
      setShowAuth(true);
    } else {
      const wish = wishes.find(w => w.id === wishId);
      setSelectedWish(wish || null);
      setShowContribution(true);
    }
  };

  const handleLike = (wishId: string) => {
    if (!isAuthenticated) {
      setAuthMode('login');
      setShowAuth(true);
    } else {
      console.log('Liked wish:', wishId);
    }
  };

  const handleShare = (wishId: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this wish on WishFlick',
        url: `${window.location.origin}/wish/${wishId}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/wish/${wishId}`);
    }
  };

  const handleOpenProfile = () => {
    setCurrentTab('profile');
  };

  const filteredWishes = wishes.filter(wish => {
    if (currentTab === 'profile' && user) {
      return wish.userId === user.id;
    }
    return wish.privacy === 'public';
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B48DFE]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCreateWish={handleCreateWish} onOpenProfile={handleOpenProfile} />

      {/* Navigation Tabs */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentTab('feed')}
                className={`text-sm font-medium transition-colors ${
                  currentTab === 'feed'
                    ? 'text-[#B48DFE] border-b-2 border-[#B48DFE] pb-2'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Feed
              </button>
              <button
                onClick={() => setCurrentTab('discover')}
                className={`text-sm font-medium transition-colors ${
                  currentTab === 'discover'
                    ? 'text-[#B48DFE] border-b-2 border-[#B48DFE] pb-2'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Discover
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => setCurrentTab('profile')}
                  className={`text-sm font-medium transition-colors ${
                    currentTab === 'profile'
                      ? 'text-[#B48DFE] border-b-2 border-[#B48DFE] pb-2'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Wishes
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {filteredWishes.length > 0 ? (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                  {filteredWishes.map((wish) => (
                    <WishCard
                      key={wish.id}
                      wish={wish}
                      onContribute={handleContribute}
                      onLike={handleLike}
                      onShare={handleShare}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No wishes yet</h3>
                  <p className="text-gray-500 mb-4">Be the first to create a wish and start your journey!</p>
                  <button
                    onClick={handleCreateWish}
                    className="bg-gradient-to-r from-[#B48DFE] to-[#6A49C8] text-white px-6 py-2 rounded-full hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    Create Your First Wish
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ActivityFeed activities={[]} />
            </div>
          </div>
        )}

        {currentTab === 'discover' && (
          <AIRecommendations
            userId={user?.id || ''}
            onContribute={handleContribute}
            onLike={handleLike}
            onShare={handleShare}
          />
        )}

        {currentTab === 'profile' && isAuthenticated && (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt={user?.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600 mt-1">{user?.bio || 'Welcome to WishFlick!'}</p>
                  <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
                    <span><strong className="text-gray-900">{filteredWishes.length}</strong> wishes</span>
                    <span><strong className="text-gray-900">{user?.followers?.length || 0}</strong> followers</span>
                    <span><strong className="text-gray-900">{user?.following?.length || 0}</strong> following</span>
                  </div>
                </div>
                <button
                  onClick={handleCreateWish}
                  className="bg-gradient-to-r from-[#B48DFE] to-[#6A49C8] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
                >
                  New Wish
                </button>
              </div>
            </div>

            {/* User's Wishes */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">My Wishes</h3>
              {filteredWishes.length > 0 ? (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                  {filteredWishes.map((wish) => (
                    <WishCard
                      key={wish.id}
                      wish={wish}
                      onContribute={handleContribute}
                      onLike={handleLike}
                      onShare={handleShare}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No wishes created yet</h3>
                  <p className="text-gray-500 mb-4">Create your first wish and let the community support your dreams!</p>
                  <button
                    onClick={handleCreateWish}
                    className="bg-gradient-to-r from-[#B48DFE] to-[#6A49C8] text-white px-6 py-2 rounded-full hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    Create Your First Wish
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateWishModal
        isOpen={showCreateWish}
        onClose={() => setShowCreateWish(false)}
      />

      <ContributionModal
        isOpen={showContribution}
        onClose={() => setShowContribution(false)}
        wish={selectedWish}
      />

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      {/* Welcome Message for Guest Users */}
      {!isAuthenticated && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-100 p-4 max-w-sm">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#B48DFE] to-[#6A49C8] rounded-full flex items-center justify-center flex-shrink-0">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Welcome to WishFlick!</h4>
              <p className="text-xs text-gray-600 mt-1">
                Sign up to create wishes, contribute to dreams, and join our community.
              </p>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setShowAuth(true);
                }}
                className="text-xs text-[#B48DFE] hover:text-[#6A49C8] font-medium mt-2"
              >
                Get started →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Create Button */}
      {isAuthenticated && (
        <button
          onClick={handleCreateWish}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#B48DFE] to-[#6A49C8] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all md:hidden"
        >
          <Plus className="w-6 h-6 mx-auto" />
        </button>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <WishProvider>
        <MainApp />
      </WishProvider>
    </AuthProvider>
  );
}

export default App;