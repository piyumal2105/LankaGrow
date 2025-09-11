import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { Upload, FileImage, X, CheckCircle } from "lucide-react";
import { expenseService } from "../../services/expenseService";
import Button from "../common/Button";

function ReceiptUpload({ onClose, onSuccess }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation(expenseService.uploadReceipt, {
    onSuccess: (response) => {
      toast.success(
        "Receipt uploaded successfully! AI is processing the data..."
      );
      queryClient.invalidateQueries("expenses");
      onSuccess(response.data);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to upload receipt");
    },
  });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".pdf"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleUpload = () => {
    if (uploadedFile) {
      const formData = new FormData();
      formData.append("receipt", uploadedFile);
      uploadMutation.mutate(formData);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Upload Receipt
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your receipt here, or click to browse
          </p>
          <p className="text-sm text-gray-500">
            Supports: JPG, PNG, PDF (Max 5MB)
          </p>
        </div>
      ) : (
        /* Preview Area */
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileImage className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900">
                  {uploadedFile.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image Preview */}
          {preview && uploadedFile.type.startsWith("image/") && (
            <div className="mb-4">
              <img
                src={preview}
                alt="Receipt preview"
                className="max-w-full h-64 object-contain rounded-lg border"
              />
            </div>
          )}

          {/* AI Processing Info */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-purple-800 mb-1">
                  AI Processing Ready
                </h4>
                <p className="text-sm text-purple-700">
                  Our AI will automatically extract expense details, categorize
                  the expense, and detect vendor information from your receipt.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!uploadedFile}
          loading={uploadMutation.isLoading}
          className="flex-1"
        >
          Upload & Process
        </Button>
      </div>
    </div>
  );
}

export default ReceiptUpload;
