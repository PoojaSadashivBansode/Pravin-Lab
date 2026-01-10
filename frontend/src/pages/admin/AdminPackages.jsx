/**
 * ADMIN PACKAGES - Manage Test Packages with All Required Fields
 */

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../context/AuthContext';
import { Plus, Search, Edit2, Trash2, X, Save, Loader2, Package, Star, Check, Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '', // Acts as "gender" on PackageCard
    tests: [],
    isPopular: false,
    isActive: true
  });

  // Bulk Import State
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [bulkResults, setBulkResults] = useState(null);

  const categories = [
    'For All Genders',
    'For Men',
    'For Women',
    'Senior Citizens (60+)',
    'Young Adults (18-30)',
    'Middle Age (30-50)',
    'Recommended 30+ Age',
    'Full Body Checkup',
    'Diabetes Care',
    'Heart Health',
    'Thyroid Care'
  ];

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [pkgRes, testRes] = await Promise.all([
        api.get('/packages/admin/all'),
        api.get('/tests/admin/all')
      ]);
      // Filter out inactive (deleted) packages
      const activePackages = (pkgRes.data.data || []).filter(pkg => pkg.isActive !== false);
      setPackages(activePackages);
      setTests(testRes.data.data || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined
      };
      if (editingPackage) {
        await api.put(`/packages/${editingPackage._id}`, payload);
        toast.success('Package updated');
      } else {
        await api.post('/packages', payload);
        toast.success('Package created');
      }
      fetchData();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this package?')) return;
    try {
      await api.delete(`/packages/${id}`);
      toast.success('Deleted');
      // Remove the deleted package from the list immediately
      setPackages(prevPackages => prevPackages.filter(p => p._id !== id));
    } catch { toast.error('Failed'); }
  };

  const openModal = (pkg = null) => {
    setEditingPackage(pkg);
    setFormData(pkg ? {
      name: pkg.name || '',
      description: pkg.description || '',
      price: pkg.price?.toString() || '',
      discountPrice: pkg.discountPrice?.toString() || '',
      category: pkg.category || '',
      tests: pkg.tests?.map(t => t._id || t) || [],
      isPopular: pkg.isPopular ?? false,
      isActive: pkg.isActive ?? true
    } : {
      name: '', description: '', price: '', discountPrice: '', category: '',
      tests: [], isPopular: false, isActive: true
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleTest = (testId) => {
    setFormData(p => ({
      ...p,
      tests: p.tests.includes(testId) ? p.tests.filter(id => id !== testId) : [...p.tests, testId]
    }));
  };

  const handleBulkImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Please upload a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        
        if (!Array.isArray(jsonData)) {
          toast.error('JSON file must contain an array of packages');
          return;
        }

        setBulkImporting(true);
        setBulkResults(null);

        const res = await api.post('/packages/bulk-import', { packages: jsonData });
        
        setBulkResults(res.data.data);
        fetchData();
        
        if (res.data.success) {
          toast.success(`Successfully imported ${res.data.data.success.length} packages!`);
        } else {
          toast.warning(`Imported ${res.data.data.success.length} packages with ${res.data.data.errors.length} errors`);
        }

      } catch (error) {
        if (error.message.includes('JSON')) {
          toast.error('Invalid JSON format');
        } else {
          toast.error(error.response?.data?.message || 'Bulk import failed');
        }
      } finally {
        setBulkImporting(false);
        e.target.value = '';
      }
    };

    reader.onerror = () => toast.error('Failed to read file');
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: "Full Body Health Checkup",
        description: "Comprehensive health screening with 60+ parameters",
        tests: ["Complete Blood Count (CBC)", "Lipid Profile"],
        price: 3999,
        discountPrice: 2499,
        category: "Full Body",
        isPopular: true,
        isActive: true
      }
    ];
    
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'packages-template.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const filtered = packages.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const selectedTests = tests.filter(t => formData.tests.includes(t._id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h1 className="text-2xl font-bold">Manage Packages</h1><p className="text-gray-500">Bundle tests for users to book</p></div>
        <div className="flex gap-2">
          <button onClick={() => setShowBulkImport(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Upload className="w-4 h-4" /> Bulk Import
          </button>
          <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus className="w-4 h-4" /> Add New Package
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="Search packages..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border rounded-lg" />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? <div className="py-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600" /></div>
        : filtered.length === 0 ? <div className="py-12 text-center text-gray-500"><Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />No packages</div>
        : <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b"><tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Package Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Category/For</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Tests</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Price</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500">Actions</th>
              </tr></thead>
              <tbody className="divide-y">{filtered.map(p => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {p.isPopular && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.category || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{p.tests?.length || 0} tests</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">₹{p.discountPrice || p.price}</span>
                    {p.discountPrice && <span className="text-xs text-gray-400 line-through ml-2">₹{p.price}</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${p.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(p)} className="p-2 hover:bg-gray-100 rounded"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-2 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>}
      </div>

      {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold">{editingPackage ? 'Edit' : 'Add'} Package</h2>
            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Package Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Package Name *</label>
              <input name="name" value={formData.name} onChange={handleChange} required
                placeholder="e.g., Executive Full Body Checkup"
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={2}
                placeholder="What does this package include?"
                className="w-full px-4 py-2.5 border rounded-lg" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-1">MRP Price (₹) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required
                  placeholder="4500" className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              {/* Discount Price */}
              <div>
                <label className="block text-sm font-medium mb-1">Offer Price (₹)</label>
                <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange}
                  placeholder="2499" className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Category / For (shown on card)</label>
              <select name="category" value={formData.category} onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Tests Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Tests to Include ({formData.tests.length} selected)</label>
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {tests.filter(t => t.isActive).map(t => (
                  <label key={t._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0">
                    <input type="checkbox" checked={formData.tests.includes(t._id)} onChange={() => toggleTest(t._id)}
                      className="w-4 h-4 text-green-600 rounded" />
                    <span className="flex-1 text-sm">{t.name}</span>
                    <span className="text-xs text-gray-400">₹{t.discountPrice || t.price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isPopular" checked={formData.isPopular} onChange={handleChange} className="w-4 h-4" />
                <span className="text-sm">⭐ Mark as Popular</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4" />
                <span className="text-sm">Active</span>
              </label>
            </div>

            {/* Preview */}
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-sm font-medium text-green-800 mb-2">Card Preview:</p>
              <div className="bg-white rounded-lg p-3 border border-green-100">
                <p className="font-bold text-gray-900">{formData.name || 'Package Name'}</p>
                <p className="text-xs text-blue-600 font-semibold mt-1">{formData.category || 'For All'}</p>
                <div className="mt-2 text-xs text-gray-500">
                  <p className="font-bold text-gray-400 mb-1">Includes {selectedTests.length} Tests:</p>
                  {selectedTests.slice(0, 4).map(t => (
                    <p key={t._id} className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" /> {t.name}
                    </p>
                  ))}
                  {selectedTests.length > 4 && <p className="text-blue-600">+ {selectedTests.length - 4} more</p>}
                </div>
                <p className="text-lg font-bold text-red-600 mt-3">
                  ₹{formData.discountPrice || formData.price || '0'}
                  {formData.discountPrice && formData.price && <span className="text-sm text-gray-400 line-through ml-2">₹{formData.price}</span>}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Package
              </button>
            </div>
          </form>
        </div>
      </div>}

      {/* Bulk Import Modal */}
      {showBulkImport && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-xl font-bold">Bulk Import Packages</h2>
              <p className="text-sm text-gray-500 mt-1">Upload a JSON file to add multiple packages at once</p>
            </div>
            <button onClick={() => { setShowBulkImport(false); setBulkResults(null); }} className="p-2 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <p className="font-medium text-blue-900 flex items-center gap-2">
                <FileText className="w-4 h-4" /> How to use:
              </p>
              <ol className="text-sm text-blue-800 space-y-1 ml-5 list-decimal">
                <li>Download the template JSON file below</li>
                <li>Fill in your package data (use test names from Tests page)</li>
                <li>Upload the completed JSON file</li>
              </ol>
              <p className="text-xs text-blue-700 mt-2">💡 Tip: Import tests first before importing packages</p>
            </div>

            {/* Download Template Button */}
            <button onClick={downloadTemplate} className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">Download JSON Template</span>
            </button>

            {/* File Upload */}
            <div>
              <label className="block w-full">
                <div className="flex items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 text-blue-600" />
                  <div className="text-center">
                    <p className="font-medium text-gray-700">Click to upload JSON file</p>
                    <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                  </div>
                </div>
                <input type="file" accept=".json" onChange={handleBulkImport} className="hidden" disabled={bulkImporting} />
              </label>
            </div>

            {/* Loading State */}
            {bulkImporting && (
              <div className="flex items-center justify-center gap-3 py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-600">Importing packages...</span>
              </div>
            )}

            {/* Results */}
            {bulkResults && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <p className="font-bold text-green-900">Successful</p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{bulkResults.success.length}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <p className="font-bold text-red-900">Failed</p>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{bulkResults.errors.length}</p>
                  </div>
                </div>

                {/* Success List */}
                {bulkResults.success.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-700 mb-2">✅ Imported Packages:</p>
                    <div className="max-h-40 overflow-y-auto space-y-1 bg-gray-50 rounded p-3">
                      {bulkResults.success.map((item, idx) => (
                        <div key={idx} className="text-sm text-gray-600">
                          Line {item.line}: {item.name} ({item.testsCount} tests)
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error List */}
                {bulkResults.errors.length > 0 && (
                  <div>
                    <p className="font-medium text-red-700 mb-2">❌ Errors:</p>
                    <div className="max-h-40 overflow-y-auto space-y-2 bg-red-50 rounded p-3">
                      {bulkResults.errors.map((err, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="font-medium text-red-900">Line {err.line}: {err.name}</p>
                          <p className="text-red-600">{err.error}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>}
    </div>
  );
}
