import React, { createContext, useContext, useState, useEffect } from 'react';
import { Wish, Contribution, WishFilters } from '../types';

interface WishContextType {
  wishes: Wish[];
  contributions: Contribution[];
  filters: WishFilters;
  isLoading: boolean;
  createWish: (wish: Omit<Wish, 'id' | 'createdAt' | 'updatedAt' | 'currentAmount'>) => Promise<void>;
  updateWish: (id: string, updates: Partial<Wish>) => Promise<void>;
  deleteWish: (id: string) => Promise<void>;
  contributeToWish: (wishId: string, amount: number, message?: string, isAnonymous?: boolean) => Promise<void>;
  likeWish: (wishId: string) => Promise<void>;
  setFilters: (filters: Partial<WishFilters>) => void;
  getWishById: (id: string) => Wish | undefined;
  getUserWishes: (userId: string) => Wish[];
  getRecommendedWishes: (userId: string) => Wish[];
}

const WishContext = createContext<WishContextType | undefined>(undefined);

export const useWishes = () => {
  const context = useContext(WishContext);
  if (!context) {
    throw new Error('useWishes must be used within a WishProvider');
  }
  return context;
};

export const WishProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [filters, setFilters] = useState<WishFilters>({ sortBy: 'newest' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mock data
    const mockWishes: Wish[] = [
      {
        id: '1',
        userId: '1',
        title: 'MacBook Pro for Creative Work',
        description: 'I need a powerful laptop for video editing and graphic design. This will help me start my freelance career!',
        targetAmount: 2500,
        currentAmount: 1200,
        imageUrl: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500',
        category: 'Technology',
        isActive: true,
        createdAt: new Date('2025-01-10'),
        updatedAt: new Date('2025-01-10'),
        tags: ['laptop', 'creative', 'work'],
        privacy: 'public',
      },
      {
        id: '2',
        userId: '2',
        title: 'Photography Equipment',
        description: 'Professional camera and lenses to capture life\'s beautiful moments and start my photography business.',
        targetAmount: 3200,
        currentAmount: 800,
        imageUrl: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'Creative',
        isActive: true,
        createdAt: new Date('2025-01-08'),
        updatedAt: new Date('2025-01-08'),
        tags: ['photography', 'camera', 'business'],
        privacy: 'public',
      },
      {
        id: '3',
        userId: '3',
        title: 'Gaming Setup',
        description: 'Building the ultimate gaming setup for streaming and content creation. Join me on this journey!',
        targetAmount: 1800,
        currentAmount: 1600,
        imageUrl: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=500',
        category: 'Gaming',
        isActive: true,
        createdAt: new Date('2025-01-05'),
        updatedAt: new Date('2025-01-05'),
        tags: ['gaming', 'streaming', 'setup'],
        privacy: 'public',
      },
    ];

    const mockContributions: Contribution[] = [
      {
        id: '1',
        wishId: '1',
        contributorId: '2',
        amount: 50,
        message: 'Good luck with your creative journey!',
        isAnonymous: false,
        createdAt: new Date('2025-01-11'),
        paymentStatus: 'completed',
      },
      {
        id: '2',
        wishId: '1',
        amount: 25,
        message: 'Every step counts!',
        isAnonymous: true,
        createdAt: new Date('2025-01-10'),
        paymentStatus: 'completed',
      },
    ];

    setWishes(mockWishes);
    setContributions(mockContributions);
    setIsLoading(false);
  }, []);

  const createWish = async (wishData: Omit<Wish, 'id' | 'createdAt' | 'updatedAt' | 'currentAmount'>) => {
    const newWish: Wish = {
      ...wishData,
      id: Date.now().toString(),
      currentAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setWishes(prev => [newWish, ...prev]);
  };

  const updateWish = async (id: string, updates: Partial<Wish>) => {
    setWishes(prev =>
      prev.map(wish =>
        wish.id === id
          ? { ...wish, ...updates, updatedAt: new Date() }
          : wish
      )
    );
  };

  const deleteWish = async (id: string) => {
    setWishes(prev => prev.filter(wish => wish.id !== id));
  };

  const contributeToWish = async (
    wishId: string,
    amount: number,
    message?: string,
    isAnonymous = false
  ) => {
    const contribution: Contribution = {
      id: Date.now().toString(),
      wishId,
      contributorId: isAnonymous ? undefined : '1', // Current user
      amount,
      message,
      isAnonymous,
      createdAt: new Date(),
      paymentStatus: 'completed',
    };

    setContributions(prev => [contribution, ...prev]);
    setWishes(prev =>
      prev.map(wish =>
        wish.id === wishId
          ? { ...wish, currentAmount: wish.currentAmount + amount }
          : wish
      )
    );
  };

  const likeWish = async (wishId: string) => {
    // Implementation for liking wishes
    console.log(`Liked wish ${wishId}`);
  };

  const getWishById = (id: string) => wishes.find(wish => wish.id === id);

  const getUserWishes = (userId: string) => wishes.filter(wish => wish.userId === userId);

  const getRecommendedWishes = (userId: string) => {
    // Simple recommendation logic based on categories
    return wishes.slice(0, 3);
  };

  return (
    <WishContext.Provider
      value={{
        wishes,
        contributions,
        filters,
        isLoading,
        createWish,
        updateWish,
        deleteWish,
        contributeToWish,
        likeWish,
        setFilters,
        getWishById,
        getUserWishes,
        getRecommendedWishes,
      }}
    >
      {children}
    </WishContext.Provider>
  );
};