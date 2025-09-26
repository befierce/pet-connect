import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, DollarSign, Clock, Save, X } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  service_type: string;
  is_active: boolean;
}

const ServicesManagement: React.FC = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    price: 0,
    service_type: 'communication',
  });

  useEffect(() => {
    if (user) {
      fetchServices();
    }
  }, [user]);

  const fetchServices = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('communicator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async () => {
    if (!user || !formData.title || !formData.description || formData.price <= 0) return;

    try {
      const { error } = await supabase
        .from('services')
        .insert({
          communicator_id: user.id,
          title: formData.title,
          description: formData.description,
          duration: formData.duration,
          price: formData.price,
          service_type: formData.service_type,
          is_active: true
        });

      if (error) throw error;

      await fetchServices();
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const handleEditService = async () => {
    if (!editingService || !formData.title || !formData.description || formData.price <= 0) return;

    try {
      const { error } = await supabase
        .from('services')
        .update({
          title: formData.title,
          description: formData.description,
          duration: formData.duration,
          price: formData.price,
          service_type: formData.service_type,
        })
        .eq('id', editingService.id);

      if (error) throw error;

      await fetchServices();
      resetForm();
      setEditingService(null);
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !currentStatus })
        .eq('id', serviceId);

      if (error) throw error;
      await fetchServices();
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  };

  const startEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      duration: service.duration,
      price: service.price,
      service_type: service.service_type,
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: 60,
      price: 0,
      service_type: 'communication',
    });
  };

  const cancelEdit = () => {
    setEditingService(null);
    resetForm();
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Your Services</h2>
          <p className="text-sm text-gray-600">Manage your service offerings</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-primary text-white rounded-xl font-medium hover:bg-purple-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {services.length > 0 ? (
          services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-800">{service.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      service.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>${service.price}</span>
                    </div>
                    <span className="capitalize">{service.service_type.replace('-', ' ')}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleServiceStatus(service.id, service.is_active)}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                      service.is_active
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {service.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => startEdit(service)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Plus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-1">No services yet</h3>
            <p className="text-gray-600 text-sm">Create your first service to start accepting bookings</p>
          </div>
        )}
      </div>

      {/* Add/Edit Service Modal */}
      {(showAddForm || editingService) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                  placeholder="e.g., Animal Communication Session"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-primary focus:border-transparent resize-none"
                  placeholder="Describe what this service includes..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>120 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                    placeholder="120"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type *
                </label>
                <select
                  value={formData.service_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, service_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                >
                  <option value="communication">Communication</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="healing">Healing</option>
                  <option value="mediumship">Mediumship</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={editingService ? handleEditService : handleAddService}
                disabled={!formData.title || !formData.description || formData.price <= 0}
                className="flex-1 flex items-center justify-center space-x-2 bg-purple-primary text-white py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-dark transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{editingService ? 'Update Service' : 'Add Service'}</span>
              </button>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;