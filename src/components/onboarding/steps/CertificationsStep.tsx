import React, { useState } from 'react';
import { Plus, Upload, Award, CheckCircle, X } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  imageUrl?: string;
  verified: boolean;
}

const CertificationsStep: React.FC = () => {
  const { data, updateData } = useOnboarding();
  const [certifications, setCertifications] = useState<Certification[]>(data.certifications || []);
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
        verified: false, // Will be verified by platform
      };
      
      const updatedCerts = [...certifications, certification];
      setCertifications(updatedCerts);
      updateData({ certifications: updatedCerts });
      
      setNewCert({ name: '', issuer: '', date: '', imageUrl: '' });
      setShowAddForm(false);
    }
  };

  const removeCertification = (id: string) => {
    const updatedCerts = certifications.filter(cert => cert.id !== id);
    setCertifications(updatedCerts);
    updateData({ certifications: updatedCerts });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server
      const mockUrl = URL.createObjectURL(file);
      setNewCert(prev => ({ ...prev, imageUrl: mockUrl }));
    }
  };

  const commonCertifications = [
    'Animal Communication Certification',
    'Reiki for Animals',
    'Pet Psychic Certification',
    'Animal Healing Practitioner',
    'Telepathic Animal Communication',
    'Animal Behavior Specialist',
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">
          Your Certifications
        </h2>
        <p className="text-gray-600">
          Add your certifications to build trust with clients
        </p>
      </div>

      {/* Current Certifications */}
      {certifications.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Your Certifications</h3>
          {certifications.map((cert) => (
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
                      <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                      {cert.verified && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Issued: {new Date(cert.date).toLocaleDateString()}
                    </p>
                    {!cert.verified && (
                      <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Pending Verification
                      </span>
                    )}
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
          ))}
        </div>
      )}

      {/* Empty State */}
      {certifications.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">No certifications uploaded yet</h3>
          <p className="text-gray-600 text-sm">Add your first certification to build credibility</p>
        </div>
      )}

      {/* Add Certification Form */}
      {showAddForm ? (
        <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-4">
          <h3 className="font-semibold text-gray-800">Add Certification</h3>
          
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
              list="cert-suggestions"
            />
            <datalist id="cert-suggestions">
              {commonCertifications.map((cert, index) => (
                <option key={index} value={cert} />
              ))}
            </datalist>
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
                <span className="text-sm text-gray-600">Upload Image</span>
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

          <div className="flex space-x-3">
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
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-primary hover:text-purple-primary transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Certification</span>
        </button>
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

export default CertificationsStep;