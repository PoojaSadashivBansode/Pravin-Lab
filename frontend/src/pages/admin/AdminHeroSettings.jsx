// src/pages/admin/AdminHeroSettings.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Save, Image as ImageIcon, Loader2, Eye } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminHeroSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    heroImage: '',
    imageAlt: '',
    ctaText: '',
    ctaLink: ''
  });

  const [previewImage, setPreviewImage] = useState(null);

  // Fetch current hero settings
  useEffect(() => {
    fetchHeroSettings();
  }, []);

  const fetchHeroSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/hero-settings`);
      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching hero settings:', error);
      // Set default values if no settings exist yet
      setFormData({
        title: 'Book Lab Tests Online',
        subtitle: 'WITH TRUSTED DIAGNOSTICS',
        description: 'Accurate reports • Home sample collection • Online payment',
        heroImage: '/uploads/hero/default-lab-hero.webp',
        imageAlt: 'Laboratory Hero Image',
        ctaText: '',
        ctaLink: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('heroImage', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/hero-settings/upload`,
        uploadFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          heroImage: response.data.imageUrl
        }));
        setPreviewImage(null);
        alert('Hero image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handlePreviewChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setShowPreview(true); // Automatically show preview when file is selected
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      alert('Title is required');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/hero-settings`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        alert('Hero settings updated successfully!');
        fetchHeroSettings();
      }
    } catch (error) {
      console.error('Error updating hero settings:', error);
      alert(error.response?.data?.message || 'Failed to update hero settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hero Settings</h1>
        <p className="text-gray-600">Manage homepage hero section content and image</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hero Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Book Lab Tests Online"
                required
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="WITH TRUSTED DIAGNOSTICS"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Accurate reports • Home sample collection • Online payment"
              />
            </div>

            {/* CTA Button Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CTA Button Text (Optional)
              </label>
              <input
                type="text"
                name="ctaText"
                value={formData.ctaText}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Book Now"
              />
            </div>

            {/* CTA Button Link */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CTA Button Link (Optional)
              </label>
              <input
                type="text"
                name="ctaLink"
                value={formData.ctaLink}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="/tests"
              />
            </div>

            {/* Image Alt Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image Alt Text
              </label>
              <input
                type="text"
                name="imageAlt"
                value={formData.imageAlt}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Laboratory Hero Image"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Image Upload & Preview Section */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Hero Image (Optional - has default)
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="heroImageUpload"
                accept="image/*"
                onChange={(e) => {
                  handlePreviewChange(e);
                  handleImageUpload(e);
                }}
                className="hidden"
              />
              
              <label
                htmlFor="heroImageUpload"
                className="cursor-pointer flex flex-col items-center"
              >
                {uploading ? (
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-3" />
                ) : (
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                )}
                <p className="text-gray-700 font-medium mb-1">
                  {uploading ? 'Uploading...' : 'Click to upload hero image'}
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </label>
            </div>

            {formData.heroImage && (
              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium">Current Image:</p>
                <p className="text-blue-600 truncate">{formData.heroImage}</p>
              </div>
            )}
          </div>

          {/* Current Image Preview */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showPreview && (
              <div className="rounded-lg overflow-hidden border border-gray-200">
                {previewImage || formData.heroImage ? (
                  <img
                    src={previewImage || `http://localhost:5000${formData.heroImage}`}
                    alt={formData.imageAlt || 'Hero preview'}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="flex items-center justify-center h-48 bg-gray-100">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeroSettings;
