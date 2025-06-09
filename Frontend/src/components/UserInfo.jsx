import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserInfoContent = ({ user, onProfileUpdate }) => { 
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    weight: '',
    height: '',
    bloodGroup: '',
    dateOfBirth: '',
    gender: '',
    allergies: '',
    currentMedications: '',
    chronicConditions: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); 
  const BACKEND_URL = 'http://localhost:8001'; 

  // Initialize form data when the user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        weight: user.weight || '',
        height: user.height || '',
        bloodGroup: user.blood_group || '', // Note: DB field is blood_group
        dateOfBirth: user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : '', // Format for date input
        gender: user.gender || '',
        allergies: user.allergies || '',
        currentMedications: user.current_medications || '',
        chronicConditions: user.chronic_conditions || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveDetails = async () => {
    setIsSaving(true);
    setSaveStatus(''); 

    try {
     const payload = {
        userId: user.id, 
        ...formData,
      };

      const response = await axios.put(`${BACKEND_URL}/api/user/profile`, payload);

      if (response.status === 200) {
        setSaveStatus('success');

        if (onProfileUpdate && response.data.user) {
          onProfileUpdate(response.data.user);
        }
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Error saving user details:', error);
      setSaveStatus('error');
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(''), 5000);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Any Other'];
  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-inner border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h2>
      {user ? (
        <div className="space-y-4 text-lg text-gray-700">
          <p><strong className="text-purple-600">Username:</strong> <span className="font-semibold">{formData.username}</span></p>
          <p><strong className="text-purple-600">Email:</strong> <span className="font-semibold">{formData.email}</span></p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {/* Weight Field */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg):</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2"
                placeholder="e.g., 70.5"
              />
            </div>

            {/* Height Field */}
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (cm):</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2"
                placeholder="e.g., 175"
              />
            </div>

            {/* Blood Group */}
            <div>
              <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">Blood Group:</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2"
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth:</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2"
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender:</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2"
              >
                <option value="">Select Gender</option>
                {genders.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {/* Allergies */}
            <div>
              <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">Known Allergies (comma-separated):</label>
              <textarea
                id="allergies"
                name="allergies"
                rows="3"
                value={formData.allergies}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2"
                placeholder="e.g., Penicillin, Peanuts, Dust"
              ></textarea>
            </div>

            {/* Current Medications */}
            <div>
              <label htmlFor="currentMedications" className="block text-sm font-medium text-gray-700">Current Medications (comma-separated):</label>
              <textarea
                id="currentMedications"
                name="currentMedications"
                rows="3"
                value={formData.currentMedications}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2"
                placeholder="e.g., Lisinopril 10mg, Metformin 500mg"
              ></textarea>
            </div>

            {/* Chronic Conditions */}
            <div>
              <label htmlFor="chronicConditions" className="block text-sm font-medium text-gray-700">Chronic Conditions (comma-separated):</label>
              <textarea
                id="chronicConditions"
                name="chronicConditions"
                rows="3"
                value={formData.chronicConditions}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2"
                placeholder="e.g., Type 2 Diabetes, Hypertension, Asthma"
              ></textarea>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handleSaveDetails}
              disabled={isSaving}
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md
                         hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                         disabled:bg-purple-300 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Details'}
            </button>
            {saveStatus === 'success' && (
              <p className="text-green-600 font-semibold">Details saved successfully!</p>
            )}
            {saveStatus === 'error' && (
              <p className="text-red-600 font-semibold">Failed to save details. Please try again.</p>
            )}
          </div>

          <p className="text-gray-500 text-sm italic mt-4">
            Manage your personal health details here. This information helps the chatbot provide more personalized assistance.
          </p>
        </div>
      ) : (
        <p className="text-red-500">User data not available. Please ensure you are logged in.</p>
      )}
    </div>
  );
};

export default UserInfoContent;