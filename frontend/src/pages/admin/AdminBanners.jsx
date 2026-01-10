/**
 * ADMIN BANNERS - Manage Homepage Sliders with File Upload
 */

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, X, Save, Loader2, Image, Eye, EyeOff, Upload, Link } from 'lucide-react';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageInputType, setImageInputType] = useState('file'); // 'file' or 'url'
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '', subtitle: '', image: '', buttonText: '', buttonLink: '',
    order: 0, position: 'home_hero', isActive: true
  });

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    try {
      const res = await api.get('/banners/admin/all');
      setBanners(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const res = await api.post('/upload?folder=banners', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setFormData(p => ({ ...p, image: res.data.data.url }));
        toast.success('Image uploaded');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error('Please add an image');
      return;
    }
    setSaving(true);
    try {
      if (editingBanner) {
        await api.put(`/banners/${editingBanner._id}`, formData);
        toast.success('Banner updated');
      } else {
        await api.post('/banners', formData);
        toast.success('Banner created');
      }
      fetchBanners();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success('Deleted');
      fetchBanners();
    } catch { toast.error('Failed to delete'); }
  };

  const toggleActive = async (banner) => {
    try {
      await api.put(`/banners/${banner._id}`, { isActive: !banner.isActive });
      toast.success(banner.isActive ? 'Hidden' : 'Visible');
      fetchBanners();
    } catch { toast.error('Failed'); }
  };

  const openModal = (banner = null) => {
    setEditingBanner(banner);
    setImageInputType(banner?.image ? 'url' : 'file');
    setFormData(banner ? {
      title: banner.title, subtitle: banner.subtitle || '', image: banner.image,
      buttonText: banner.buttonText || '', buttonLink: banner.buttonLink || '',
      order: banner.order || 0, position: banner.position || 'home_hero', isActive: banner.isActive
    } : { title: '', subtitle: '', image: '', buttonText: '', buttonLink: '', order: 0, position: 'home_hero', isActive: true });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">Manage Banners</h1><p className="text-gray-500">Homepage slider images</p></div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <div className="col-span-full py-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" /></div>
        : banners.length === 0 ? <div className="col-span-full py-12 text-center bg-white rounded-xl border"><Image className="w-12 h-12 mx-auto text-gray-300 mb-2" /><p className="text-gray-500">No banners</p></div>
        : banners.map(b => (
          <div key={b._id} className={`bg-white rounded-xl border overflow-hidden ${!b.isActive ? 'opacity-60' : ''}`}>
            <div className="aspect-video bg-gray-100 relative">
              {b.image ? <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><Image className="w-12 h-12 text-gray-300" /></div>}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${b.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                  {b.isActive ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-black/50 text-white rounded text-xs">Order: {b.order}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 truncate">{b.title}</h3>
              <p className="text-sm text-gray-500 truncate mb-3">{b.subtitle || 'No subtitle'}</p>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(b)} className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 border rounded-lg text-sm ${b.isActive ? 'text-orange-600 border-orange-200' : 'text-green-600 border-green-200'}`}>
                  {b.isActive ? <><EyeOff className="w-4 h-4" /> Hide</> : <><Eye className="w-4 h-4" /> Show</>}
                </button>
                <button onClick={() => openModal(b)} className="p-2 border rounded-lg hover:bg-gray-50"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(b._id)} className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold">{editingBanner ? 'Edit' : 'Add'} Banner</h2>
            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div><label className="block text-sm font-medium mb-1">Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium mb-1">Subtitle</label>
              <input name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
            
            {/* Image Input Type Toggle */}
            <div>
              <label className="block text-sm font-medium mb-2">Banner Image *</label>
              <div className="flex gap-2 mb-3">
                <button type="button" onClick={() => setImageInputType('file')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${imageInputType === 'file' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-200'}`}>
                  <Upload className="w-4 h-4" /> Upload File
                </button>
                <button type="button" onClick={() => setImageInputType('url')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${imageInputType === 'url' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-200'}`}>
                  <Link className="w-4 h-4" /> URL (Optional)
                </button>
              </div>

              {imageInputType === 'file' ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2 text-indigo-600">
                      <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
                    </div>
                  ) : formData.image ? (
                    <div className="space-y-3">
                      <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="text-sm text-indigo-600 hover:underline">Change Image</button>
                    </div>
                  ) : (
                    <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                      <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload image</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 5MB</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <input name="image" value={formData.image} onChange={handleChange} placeholder="https://... (optional)"
                    className="w-full px-4 py-2 border rounded-lg" />
                  {formData.image && <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-2" />}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Button Text</label>
                <input name="buttonText" value={formData.buttonText} onChange={handleChange} placeholder="Book Now" className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Button Link</label>
                <input name="buttonLink" value={formData.buttonLink} onChange={handleChange} placeholder="/packages" className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Order</label>
                <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Position</label>
                <select name="position" value={formData.position} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                  <option value="home_hero">Home Hero</option>
                  <option value="home_secondary">Home Secondary</option>
                  <option value="offers_page">Offers Page</option>
                </select></div>
            </div>
            <label className="flex items-center gap-2"><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} /> Active</label>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
              </button>
            </div>
          </form>
        </div>
      </div>}
    </div>
  );
}
