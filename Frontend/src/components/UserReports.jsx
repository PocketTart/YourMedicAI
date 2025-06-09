import React, { useState, useRef } from 'react';
import axios from 'axios';

const UserReportsContent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);
  const BACKEND_URL = 'http://localhost:8000';

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('❗ Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile); // must match FastAPI's field: "file"

    try {
      setUploadStatus('Uploading...');
      const response = await axios.post(`${BACKEND_URL}/upload_lab/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadStatus(`Uploading... ${percent}%`);
        }
      });

      setUploadStatus(`✅ ${response.data.message}`);
      handleClearFile();
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.detail || 'Upload failed.';
      setUploadStatus(`❌ ${message}`);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setUploadStatus('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-inner border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Health Reports & Summaries</h2>
      <p className="text-lg text-gray-700 mb-4">
        Upload your health-related PDF document for analysis and summarization.
      </p>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Upload PDF Document</h3>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
        />

        {selectedFile && (
          <div className="mt-4">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Selected File:</h4>
            <p className="text-gray-700 mb-4">
              &#128196; {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
            </p>

            <div className="flex space-x-4">
              <button
                onClick={handleUpload}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 disabled:bg-green-300"
                disabled={uploadStatus.includes('Uploading')}
              >
                {uploadStatus.includes('Uploading') ? 'Uploading...' : 'Upload PDF'}
              </button>
              <button
                onClick={handleClearFile}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {uploadStatus && (
          <p className={`mt-4 font-semibold text-sm ${uploadStatus.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {uploadStatus}
          </p>
        )}
      </div>

      <div className="mt-6 p-4 border border-blue-200 rounded-md bg-blue-50 text-blue-800">
        <p className="font-semibold">Coming Soon:</p>
        <ul className="list-disc list-inside ml-4">
          <li>Personalized health insights</li>
          <li>Downloadable consultation summaries</li>
          <li>Progress tracking for health goals</li>
        </ul>
      </div>
    </div>
  );
};

export default UserReportsContent;
