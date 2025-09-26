import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Plus, Award, CheckCircle, Clock, X, Upload } from 'lucide-react';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  imageUrl?: string;
  verified: boolean;
}

const CertificationsView: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: '1',
      name: 'Animal Communication Certification',
      issuer: 'International Association of Animal Communicators',
      date: '2020-03-15',
      verified: true,
    },
    {
      id: '2',
      name: 'Reiki for Animals',
      issuer: 'Animal Reiki Alliance',
      date: '2019-08-22',
      verified: true,
    },
    {
      id: '3',
      name: 'Pet Trauma Healing Specialist',
      issuer: 'Healing Arts Institute',
      date: '2021-11-10',
      verified: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCert, setNewCert] = useState({
    name: '',
    issuer: '',
    date: '',
    imageUrl: '',
  });

  const addCertification = () => {
    if (newCert.name && newCert.issuer && newCert.date) {
      const certification: Certification = {
        id: Date.now().toString(),
        ...newCert,
        verified: false,
      };
      
      setCertifications(prev => [...prev, certification]);
      setNewCert({ name: '', issuer: '', date: '', imageUrl: '' });
      setShowAddForm(false);
    }
  };

  const removeCertification = (id: string) => {
    setCertifications(prev => prev.filter(cert => cert.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const mockUrl = URL.createObjectURL(file);
      setNewCert(prev => ({ ...prev, imageUrl: mockUrl }));
    }
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
      {/* Header Stats */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-800">{certifications.length}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {certifications.filter(c => c.verified).length}
            </p>
            <p className="text-sm text-gray-600">Verified</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">
              {certifications.filter(c => !c.verified).length}
            </p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
        </div>
      </div>

      {/* Certifications List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Your Certifications</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-primary text-white rounded-xl font-medium hover:bg-purple-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {certifications.length > 0 ? (
          certifications.map((cert) => (
            <div key={cert.id} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {cert.imageUrl ? (
                    <img
                      src={cert.imageUrl}
                      alt="Certificate"
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-primary" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                      {cert.verified ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Issued: {new Date(cert.date).toLocaleDateString()}
                    </p>
                    
                    <div className="mt-2">
                      {cert.verified ? (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          Verified
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                          Pending Verification
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => removeCertification(cert.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-1">No certifications yet</h3>
            <p className="text-gray-600 text-sm">Add your first certification to build credibility</p>
          </div>
        )}
      </div>

      {/* Add Certification Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Certification</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certification Name *
                </label>
                <input
                  type="text"
                  value={newCert.name}
                  onChange={(e) => setNewCert(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                  placeholder="e.g., Animal Communication Certification"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert(prev => ({ ...prev, issuer: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                  placeholder="e.g., International Association of Animal Communicators"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date *
                </label>
                <input
                  type="date"
                  value={newCert.date}
                  onChange={(e) => setNewCert(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate Image (Optional)
                </label>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {newCert.imageUrl && (
                    <img
                      src={newCert.imageUrl}
                      alt="Certificate preview"
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={addCertification}
                disabled={!newCert.name || !newCert.issuer || !newCert.date}
                className="flex-1 bg-purple-primary text-white py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-dark transition-colors"
              >
                Add Certification
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Info */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Verification Process</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• All certifications are reviewed by our team</li>
          <li>• Verified certificates get a green checkmark</li>
          <li>• This helps build trust with potential clients</li>
          <li>• Upload clear images for faster verification</li>
        </ul>
      </div>
    </div>
  );
};

export default CertificationsView;