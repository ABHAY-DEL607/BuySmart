'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/services/config';
import { BarChart, Clock, Settings, ShoppingBag, User } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [comparisonHistory, setComparisonHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadUserData();
    loadPriceHistory();
    loadComparisonHistory();
  }, []);

  const loadUserData = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        username: userData.username,
        email: userData.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  const loadPriceHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/prices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPriceHistory(response.data.products || []);
    } catch (error) {
      console.error('Error loading price history:', error);
      toast.error('Failed to load price history');
    }
  };

  const loadComparisonHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/comparison/getbyuser/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComparisonHistory(response.data || []);
    } catch (error) {
      console.error('Error loading comparison history:', error);
      toast.error('Failed to load comparison history');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/auth/update-profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Profile updated successfully');
      setIsEditing(false);
      loadUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'priceHistory', label: 'Price History', icon: <BarChart className="w-4 h-4" /> },
    { id: 'comparisons', label: 'Comparisons', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64">
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-500 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                } w-full justify-start`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>

                <form onSubmit={handleUpdateProfile}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Username</label>
                      <Input
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email</label>
                      <Input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>

                    {isEditing && (
                      <>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Current Password</label>
                          <Input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">New Password</label>
                          <Input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Confirm New Password</label>
                          <Input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Save Changes
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Price History Tab */}
          {activeTab === 'priceHistory' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Price History</h2>
              {priceHistory.length > 0 ? (
                <div className="grid gap-4">
                  {priceHistory.map((item) => (
                    <Card key={item._id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{item.productName}</h3>
                            <p className="text-sm text-gray-500">
                              Current Price: {item.currentPrice} on {item.currentSite}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              <Clock className="w-3 h-3 inline-block mr-1" />
                              Last updated: {new Date(item.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No price history available</p>
              )}
            </div>
          )}

          {/* Comparisons Tab */}
          {activeTab === 'comparisons' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Comparison History</h2>
              {comparisonHistory.length > 0 ? (
                <div className="grid gap-4">
                  {comparisonHistory.map((comparison) => (
                    <Card key={comparison._id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">
                              Comparison on {new Date(comparison.comparedAt).toLocaleDateString()}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {comparison.comparisonData.length} products compared
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No comparison history available</p>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Notifications</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>Email notifications for price drops</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>Email notifications for new comparisons</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Privacy</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>Make my comparisons public</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>Share my price tracking history</span>
                      </label>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;