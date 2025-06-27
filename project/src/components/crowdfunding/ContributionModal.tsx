import React, { useState } from 'react';
import { X, DollarSign, Heart, CreditCard, Shield } from 'lucide-react';
import { useWishes } from '../../context/WishContext';
import { useAuth } from '../../context/AuthContext';
import { Wish } from '../../types';

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  wish: Wish | null;
}

export const ContributionModal: React.FC<ContributionModalProps> = ({ isOpen, onClose, wish }) => {
  const { contributeToWish } = useWishes();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const predefinedAmounts = [5, 10, 25, 50, 100];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wish || !amount) return;

    setIsLoading(true);
    try {
      await contributeToWish(wish.id, parseFloat(amount), message || undefined, isAnonymous);
      
      // Reset form
      setAmount('');
      setMessage('');
      setIsAnonymous(false);
      
      onClose();
    } catch (error) {
      console.error('Error contributing to wish:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!isOpen || !wish) return null;

  const progressPercentage = Math.min((wish.currentAmount / wish.targetAmount) * 100, 100);
  const remainingAmount = wish.targetAmount - wish.currentAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="relative">
            {wish.imageUrl && (
              <img
                src={wish.imageUrl}
                alt={wish.title}
                className="w-full h-32 object-cover"
              />
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6">
            {/* Wish Info */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{wish.title}</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {formatCurrency(wish.currentAmount)} raised
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-[#B48DFE] to-[#98E2D5] h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {formatCurrency(remainingAmount)} needed to reach the goal of {formatCurrency(wish.targetAmount)}
              </p>
            </div>

            {/* Contribution Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose your contribution amount
                </label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {predefinedAmounts.map((preAmount) => (
                    <button
                      key={preAmount}
                      type="button"
                      onClick={() => setAmount(preAmount.toString())}
                      className={`p-3 text-center border rounded-lg transition-all ${
                        amount === preAmount.toString()
                          ? 'border-[#B48DFE] bg-[#B48DFE] text-white'
                          : 'border-gray-200 hover:border-[#B48DFE] hover:bg-purple-50'
                      }`}
                    >
                      {formatCurrency(preAmount)}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter custom amount"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B48DFE] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave a message (optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your encouragement or support..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B48DFE] focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Anonymous Option */}
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="text-[#B48DFE] focus:ring-[#B48DFE] rounded"
                  />
                  <span className="text-sm text-gray-700">Contribute anonymously</span>
                </label>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Secure Payment</span>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Your payment is processed securely through Stripe. Funds are released when the wish is completed.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Platform fee (2%)</span>
                  <span className="text-gray-600">
                    {amount ? formatCurrency(parseFloat(amount) * 0.02) : '$0.00'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-medium pt-2 border-t border-gray-200 mt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    {amount ? formatCurrency(parseFloat(amount) * 1.02) : '$0.00'}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !amount}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#B48DFE] to-[#6A49C8] text-white py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none"
              >
                <Heart className="w-5 h-5" />
                <span>{isLoading ? 'Processing...' : `Contribute ${amount ? formatCurrency(parseFloat(amount)) : ''}`}</span>
              </button>
            </form>

            {/* Payment Methods */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-4 text-gray-400">
                <CreditCard className="w-6 h-6" />
                <span className="text-sm">Visa</span>
                <span className="text-sm">Mastercard</span>
                <span className="text-sm">PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};