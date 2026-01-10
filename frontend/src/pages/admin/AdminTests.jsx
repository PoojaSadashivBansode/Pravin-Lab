/**
 * ADMIN TESTS - Manage Lab Tests with All Required Fields
 */

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../context/AuthContext';
import { Plus, Search, Edit2, Trash2, X, Save, Loader2, TestTube, Check, Eye, Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    sampleType: '',
    reportTime: '',
    parameters: '', // e.g., "60+ Parameters" or count
    preparationInstructions: '',
    isPopular: false,
    isActive: true
  });

  // Bulk Import State
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [bulkResults, setBulkResults] = useState(null);

  const categories = ['Blood Test', 'Diabetes', 'Thyroid', 'Vitamin', 'Organ Health', 'Screening', 'Allergy', 'Infection'];
  const sampleTypes = ['Blood', 'Urine', 'Stool', 'Serum', 'Saliva', 'Swab'];
  const reportTimes = ['Same Day', 'Reports in 12 Hours', 'Reports in 24 Hours', 'Reports in 48 Hours', '2-3 Days'];

  useEffect(() => { fetchTests(); }, []);

  const fetchTests = async () => {
    try {
      const res = await api.get('/tests/admin/all');
      // Filter out inactive (deleted) tests
      const activeTests = (res.data.data || []).filter(test => test.isActive !== false);
      setTests(activeTests);
    } catch (error) {
      toast.error('Failed to load tests');
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
      if (editingTest) {
        await api.put(`/tests/${editingTest._id}`, payload);
        toast.success('Test updated');
      } else {
        await api.post('/tests', payload);
        toast.success('Test created');
      }
      fetchTests();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this test?')) return;
    try {
      await api.delete(`/tests/${id}`);
      toast.success('Deleted');
      // Remove the deleted test from the list immediately
      setTests(prevTests => prevTests.filter(t => t._id !== id));
    } catch { toast.error('Failed'); }
  };

  const openModal = (test = null) => {
    setEditingTest(test);
    setFormData(test ? {
      name: test.name || '',
      description: test.description || '',
      price: test.price?.toString() || '',
      discountPrice: test.discountPrice?.toString() || '',
      category: test.category || '',
      sampleType: test.sampleType || '',
      reportTime: test.reportTime || '',
      parameters: test.parameters || '',
      preparationInstructions: test.preparationInstructions || '',
      isPopular: test.isPopular ?? false,
      isActive: test.isActive ?? true
    } : {
      name: '', description: '', price: '', discountPrice: '', category: '',
      sampleType: '', reportTime: '', parameters: '', preparationInstructions: '',
      isPopular: false, isActive: true
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleBulkImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.json')) {
      toast.error('Please upload a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        
        // Validate JSON structure
        if (!Array.isArray(jsonData)) {
          toast.error('JSON file must contain an array of tests');
          return;
        }

        setBulkImporting(true);
        setBulkResults(null);

        // Send to API
        const res = await api.post('/tests/bulk-import', { tests: jsonData });
        
        setBulkResults(res.data.data);
        fetchTests(); // Refresh list
        
        if (res.data.success) {
          toast.success(`Successfully imported ${res.data.data.success.length} tests!`);
        } else {
          toast.warning(`Imported ${res.data.data.success.length} tests with ${res.data.data.errors.length} errors`);
        }

      } catch (error) {
        if (error.message.includes('JSON')) {
          toast.error('Invalid JSON format');
        } else {
          toast.error (error.response?.data?.message || 'Bulk import failed');
        }
      } finally {
        setBulkImporting(false);
        e.target.value = ''; // Reset file input
      }
    };

    reader.onerror = () => toast.error('Failed to read file');
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: "Complete Blood Count (CBC)",
        description: "Measures red blood cells, white blood cells, and platelets",
        price: 500,
        discountPrice: 299,
        category: "Hematology",
        sampleType: "Blood",
        reportTime: "Same Day",
        parameters: ["Hemoglobin", "RBC", "WBC", "Platelets"],
        preparationInstructions: "No fasting required",
        isActive: true
      }
    ];
    
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tests-template.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const filtered = tests.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.category?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h1 className="text-2xl font-bold">Manage Tests</h1><p className="text-gray-500">Add tests that users can book</p></div>
        <div className="flex gap-2">
          <button onClick={() => setShowBulkImport(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Upload className="w-4 h-4" /> Bulk Import
          </button>
          <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add New Test
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" placeholder="Search tests..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border rounded-lg" />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? <div className="py-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" /></div>
        : filtered.length === 0 ? <div className="py-12 text-center text-gray-500"><TestTube className="w-12 h-12 mx-auto text-gray-300 mb-2" />No tests found</div>
        : <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b"><tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Test Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Category</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Parameters</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Price</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Report Time</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500">Actions</th>
              </tr></thead>
              <tbody className="divide-y">{filtered.map(t => (
                <tr key={t._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {t.isPopular && <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">Popular</span>}
                      <span className="font-medium">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{t.category || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{t.parameters || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">₹{t.discountPrice || t.price}</span>
                    {t.discountPrice && <span className="text-xs text-gray-400 line-through ml-2">₹{t.price}</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{t.reportTime || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${t.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {t.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(t)} className="p-2 hover:bg-gray-100 rounded"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(t._id)} className="p-2 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>}
      </div>

      {showModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold">{editingTest ? 'Edit' : 'Add'} Test</h2>
            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Test Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Test Name *</label>
              <input name="name" value={formData.name} onChange={handleChange} required
                placeholder="e.g., Complete Blood Count (CBC)"
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={2}
                placeholder="What does this test measure?"
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-1">MRP Price (₹) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required
                  placeholder="899" className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              {/* Discount Price */}
              <div>
                <label className="block text-sm font-medium mb-1">Offer Price (₹)</label>
                <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange}
                  placeholder="499" className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* Sample Type */}
              <div>
                <label className="block text-sm font-medium mb-1">Sample Type</label>
                <select name="sampleType" value={formData.sampleType} onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg">
                  <option value="">Select Sample</option>
                  {sampleTypes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {/* Parameters */}
              <div>
                <label className="block text-sm font-medium mb-1">Parameters (shown on card)</label>
                <input name="parameters" value={formData.parameters} onChange={handleChange}
                  placeholder="e.g., 60+ Parameters" className="w-full px-4 py-2.5 border rounded-lg" />
              </div>
              {/* Report Time */}
              <div>
                <label className="block text-sm font-medium mb-1">Report Time</label>
                <select name="reportTime" value={formData.reportTime} onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg">
                  <option value="">Select Time</option>
                  {reportTimes.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Preparation */}
            <div>
              <label className="block text-sm font-medium mb-1">Preparation Instructions</label>
              <textarea name="preparationInstructions" value={formData.preparationInstructions} onChange={handleChange} rows={2}
                placeholder="e.g., Fasting for 10-12 hours required"
                className="w-full px-4 py-2.5 border rounded-lg" />
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isPopular" checked={formData.isPopular} onChange={handleChange} className="w-4 h-4" />
                <span className="text-sm">Mark as Popular</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4" />
                <span className="text-sm">Active</span>
              </label>
            </div>

            {/* Preview */}
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-800 mb-2">Card Preview:</p>
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <p className="font-bold text-gray-900">{formData.name || 'Test Name'}</p>
                <p className="text-xs text-gray-500 mt-1">✓ {formData.parameters || 'Parameters'} • ✓ {formData.reportTime || 'Report Time'}</p>
                <p className="text-lg font-bold text-red-600 mt-2">
                  ₹{formData.discountPrice || formData.price || '0'}
                  {formData.discountPrice && formData.price && <span className="text-sm text-gray-400 line-through ml-2">₹{formData.price}</span>}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Test
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
              <h2 className="text-xl font-bold">Bulk Import Tests</h2>
              <p className="text-sm text-gray-500 mt-1">Upload a JSON file to add multiple tests at once</p>
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
                <li>Fill in your test data following the format</li>
                <li>Upload the completed JSON file</li>
              </ol>
            </div>

            {/* Download Template Button */}
            <button onClick={downloadTemplate} className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">Download JSON Template</span>
            </button>

            {/* File Upload */}
            <div>
              <label className="block w-full">
                <div className="flex items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 text-green-600" />
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
                <span className="text-gray-600">Importing tests...</span>
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
                    <p className="font-medium text-gray-700 mb-2">✅ Imported Tests:</p>
                    <div className="max-h-40 overflow-y-auto space-y-1 bg-gray-50 rounded p-3">
                      {bulkResults.success.map((item, idx) => (
                        <div key={idx} className="text-sm text-gray-600">
                          Line {item.line}: {item.name}
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
