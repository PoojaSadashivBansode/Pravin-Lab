/**
 * ADMIN OFFERS - Manage Promo Codes
 */

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../context/AuthContext';
import { Plus, Search, Edit2, Trash2, X, Save, Loader2, Tag, Percent, Calendar } from 'lucide-react';

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '', couponCode: '', discountType: 'percentage', discountValue: '',
    maxDiscountAmount: '', minOrderValue: '', startDate: '', endDate: '',
    usageLimit: '', isFeatured: false, isActive: true
  });

  useEffect(() => { fetchOffers(); }, []);

  const fetchOffers = async () => {
    try {
      const res = await api.get('/offers/admin/all');
      setOffers(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData, discountValue: parseFloat(formData.discountValue) };
      if (editingOffer) {
        await api.put(`/offers/${editingOffer._id}`, payload);
        toast.success('Offer updated');
      } else {
        await api.post('/offers', payload);
        toast.success('Offer created');
      }
      fetchOffers();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this offer?')) return;
    try {
      await api.delete(`/offers/${id}`);
      toast.success('Deleted');
      fetchOffers();
    } catch { toast.error('Failed to delete'); }
  };

  const openModal = (offer = null) => {
    setEditingOffer(offer);
    setFormData(offer ? {
      title: offer.title, couponCode: offer.couponCode, discountType: offer.discountType,
      discountValue: offer.discountValue?.toString(), maxDiscountAmount: offer.maxDiscountAmount?.toString() || '',
      minOrderValue: offer.minOrderValue?.toString() || '', 
      startDate: offer.startDate?.split('T')[0] || '', endDate: offer.endDate?.split('T')[0] || '',
      usageLimit: offer.usageLimit?.toString() || '', isFeatured: offer.isFeatured, isActive: offer.isActive
    } : { title: '', couponCode: '', discountType: 'percentage', discountValue: '', maxDiscountAmount: '',
      minOrderValue: '', startDate: '', endDate: '', usageLimit: '', isFeatured: false, isActive: true });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const filtered = offers.filter(o => o.title.toLowerCase().includes(searchQuery.toLowerCase()) || o.couponCode.includes(searchQuery.toUpperCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">Manage Offers</h1><p className="text-gray-500">Create promo codes</p></div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <Plus className="w-4 h-4" /> Create Offer
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border rounded-lg" />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? <div className="py-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" /></div>
        : filtered.length === 0 ? <div className="py-12 text-center text-gray-500"><Tag className="w-12 h-12 mx-auto text-gray-300 mb-2" />No offers</div>
        : <table className="w-full">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Code</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Title</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Discount</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Validity</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Status</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500">Actions</th>
            </tr></thead>
            <tbody className="divide-y">{filtered.map(o => (
              <tr key={o._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-purple-600 font-bold">{o.couponCode}</td>
                <td className="px-6 py-4">{o.title}</td>
                <td className="px-6 py-4 text-green-600 font-medium">{o.discountType === 'percentage' ? `${o.discountValue}%` : `₹${o.discountValue}`}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(o.startDate).toLocaleDateString()} - {new Date(o.endDate).toLocaleDateString()}</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${o.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{o.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openModal(o)} className="p-2 hover:bg-gray-100 rounded"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(o._id)} className="p-2 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}</tbody>
          </table>}
      </div>

      {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold">{editingOffer ? 'Edit' : 'Create'} Offer</h2>
            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className="block text-sm font-medium mb-1">Title *</label>
                <input name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Code *</label>
                <input name="couponCode" value={formData.couponCode} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg uppercase" /></div>
              <div><label className="block text-sm font-medium mb-1">Type</label>
                <select name="discountType" value={formData.discountType} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                  <option value="percentage">Percentage</option><option value="fixed">Fixed</option>
                </select></div>
              <div><label className="block text-sm font-medium mb-1">Value *</label>
                <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Max Discount</label>
                <input type="number" name="maxDiscountAmount" value={formData.maxDiscountAmount} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">Start Date *</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">End Date *</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg" /></div>
              <div className="col-span-2 flex gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} /> Active</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} /> Featured</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
              </button>
            </div>
          </form>
        </div>
      </div>}
    </div>
  );
}
