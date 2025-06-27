import React, { useState } from 'react';
import { X, Upload, DollarSign, Tag, Calendar, Lock, Globe, Users, Scan } from 'lucide-react';
import { useWishes } from '../../context/WishContext';
import { useAuth } from '../../context/AuthContext';
import { ARScanner } from './ARScanner';

interface CreateWishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateWishModal: React.FC<CreateWishModalProps> = ({ isOpen, onClose }) => {
  const { createWish } = useWishes();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showARScanner, setShowARScanner] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    category: 'Technology',
    imageUrl: '',
    tags: '',
    privacy: 'public' as 'public' | 'private' | 'friends',
    deadline: '',
    productUrl: '',
  });

  const categories = [
    'Technology', 'Creative', 'Gaming', 'Travel', 'Education', 
    'Health', 'Sports', 'Music', 'Art', 'Books', 'Fashion', 'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      await createWish({
        userId: user.id,
        title: formData.title,
        description: formData.description,
        targetAmount: parseFloat(formData.targetAmount),
        category: formData.category,
        imageUrl: formData.imageUrl || undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        privacy: formData.privacy,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined,
        isActive: true,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        category: 'Technology',
        imageUrl: '',
        tags: '',
        privacy: 'public',
        deadline: '',
        productUrl: '',
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating wish:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a service like Cloudinary
      // For demo, we'll use a placeholder
      setFormData(prev => ({
        ...prev,
        imageUrl: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500'
      }));
    }
  };

  const handleProductScanned = (product: { name: string; price: number; image: string; url?: string }) => {
    setFormData(prev => ({
      ...prev,
      title: product.name,
      targetAmount: product.price.toString(),
      imageUrl: product.image,
      productUrl: product.url || '',
    }));
    setShowARScanner(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

          <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Create a New Wish</h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* AR Scanner Button */}
              <div className="bg-gradient-to-r from-[#B48DFE]/10 to-[#98E2D5]/10 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Quick Add with AR</h4>
                    <p className="text-sm text-gray-600">Scan or upload a product image to auto-fill details</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowARScanner(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-[#B48DFE] to-[#6A49C8] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    <Scan className="w-4 h-4" />
                    <span>AR Scan</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's your wish?
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., MacBook Pro for Creative Work"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B48DFE] focus:border-transparent transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell your story
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Why is this wish important to you? How will it help you achieve your goals?"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B48DFE] focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Amount and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      required
                      min="1"
                      step="0.01"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B48DFE] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B48DFE] focus:border-transparent transition-all"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Product URL */}
              {formData.productUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product URL
                  </label>
                  <input
                    type="url"
                    value={formData.productUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, productUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B48DFE] focus:border-transparent transition-all"
                  />
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add an image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#B48DFE] transition-colors cursor-pointer"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload an image</p>
                    </div>
                  </label>
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="mt-2 w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., laptop, creative, work"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B48DFE] focus:border-transparent transition-all"
                />
              </div>

              {/* Privacy and Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Privacy
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="privacy"
                        value="public"
                        checked={formData.privacy === 'public'}
                        onChange={(e) => setFormData(prev => ({ ...prev, privacy: e.target.value as 'public' }))}
                        className="text-[#B48DFE] focus:ring-[#B48DFE]"
                      />
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Public</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="privacy"
                        value="friends"
                        checked={formData.privacy === 'friends'}
                        onChange={(e) => setFormData(prev => ({ ...prev, privacy: e.target.value as 'friends' }))}
                        className="text-[#B48DFE] focus:ring-[#B48DFE]"
                      />
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Friends only</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="privacy"
                        value="private"
                        checked={formData.privacy === 'private'}
                        onChange={(e) => setFormData(prev => ({ ...prev, privacy: e.target.value as 'private' }))}
                        className="text-[#B48DFE] focus:ring-[#B48DFE]"
                      />
                      <Lock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Private</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline (optional)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B48DFE] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-[#B48DFE] to-[#6A49C8] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none"
                >
                  {isLoading ? 'Creating...' : 'Create Wish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* AR Scanner Modal */}
      <ARScanner
        isOpen={showARScanner}
        onClose={() => setShowARScanner(false)}
        onProductScanned={handleProductScanned}
      />
    </>
  );
};