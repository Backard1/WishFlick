import React, { useState } from 'react';
import { Search, Bell, User, Menu, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../ui/Logo';

interface HeaderProps {
  onCreateWish: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCreateWish, onOpenProfile }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo size="md" showText={true} />

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search wishes, people, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-full border-0 focus:ring-2 focus:ring-[#B48DFE] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <button
                  onClick={onCreateWish}
                  className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-[#B48DFE] to-[#6A49C8] text-white px-4 py-2 rounded-full hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Wish</span>
                </button>

                <button className="relative p-2 text-gray-600 hover:text-[#B48DFE] transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              </>
            )}

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-600" />
                )}
                <Menu className="w-4 h-4 text-gray-600 md:hidden" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10">
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={onOpenProfile}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Profile
                      </button>
                      <button
                        onClick={onCreateWish}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors sm:hidden"
                      >
                        Create Wish
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="px-4 py-2 text-gray-700">
                      <p className="text-sm">Guest Mode</p>
                      <p className="text-xs text-gray-500">Limited functionality</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search wishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-full border-0 focus:ring-2 focus:ring-[#B48DFE] focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  );
};