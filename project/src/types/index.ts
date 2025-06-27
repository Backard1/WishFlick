export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  privacy: 'public' | 'private' | 'friends';
  createdAt: Date;
  following: string[];
  followers: string[];
}

export interface Wish {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  imageUrl?: string;
  category: string;
  isActive: boolean;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  privacy: 'public' | 'private' | 'friends';
}

export interface Contribution {
  id: string;
  wishId: string;
  contributorId?: string;
  amount: number;
  message?: string;
  isAnonymous: boolean;
  createdAt: Date;
  paymentStatus: 'pending' | 'completed' | 'refunded';
}

export interface Activity {
  id: string;
  type: 'wish_created' | 'contribution_made' | 'wish_completed' | 'wish_liked' | 'wish_shared';
  userId: string;
  wishId?: string;
  contributionId?: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface WishFilters {
  category?: string;
  priceRange?: [number, number];
  sortBy: 'newest' | 'popular' | 'progress' | 'deadline';
}