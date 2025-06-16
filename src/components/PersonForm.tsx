import React, { useState } from 'react';
import { Save, X, Upload } from 'lucide-react';
import { Person } from '../types';
import { PhotoUpload } from './PhotoUpload';

interface PersonFormProps {
  person?: Person;
  onSubmit: (person: Omit<Person, 'id'>) => void;
  onCancel: () => void;
}

export const PersonForm: React.FC<PersonFormProps> = ({
  person,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    fullName: person?.fullName || '',
    dateOfBirth: person?.dateOfBirth || '',
    phoneNumber: person?.phoneNumber || '',
    roleOrGroup: person?.roleOrGroup || '',
    photo: person?.photo || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const date = new Date(formData.dateOfBirth);
      if (isNaN(date.getTime())) {
        newErrors.dateOfBirth = 'Please enter a valid date';
      }
    }

    if (!formData.roleOrGroup.trim()) {
      newErrors.roleOrGroup = 'Role or group is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        fullName: formData.fullName.trim(),
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber.trim() || undefined,
        roleOrGroup: formData.roleOrGroup.trim(),
        photo: formData.photo || undefined,
        celebrated: false
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photo (Optional)
        </label>
        <PhotoUpload
          currentPhoto={formData.photo}
          onPhotoChange={(photo) => handleInputChange('photo', photo)}
        />
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="fullName"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.fullName ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter full name"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
          Date of Birth *
        </label>
        <input
          type="date"
          id="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.dateOfBirth && (
          <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter phone number"
        />
      </div>

      {/* Role or Group */}
      <div>
        <label htmlFor="roleOrGroup" className="block text-sm font-medium text-gray-700 mb-2">
          Role or Group *
        </label>
        <input
          type="text"
          id="roleOrGroup"
          value={formData.roleOrGroup}
          onChange={(e) => handleInputChange('roleOrGroup', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.roleOrGroup ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="e.g., Family, Friends, Colleagues"
        />
        {errors.roleOrGroup && (
          <p className="mt-1 text-sm text-red-600">{errors.roleOrGroup}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" />
          {person ? 'Update Person' : 'Add Person'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>
    </form>
  );
};