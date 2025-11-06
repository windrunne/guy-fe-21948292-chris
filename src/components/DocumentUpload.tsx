// Document upload component

import { Upload, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useDocumentUpload } from '../hooks/useDocumentUpload'
import { ALLOWED_FILE_EXTENSIONS } from '../constants'

const DocumentUpload: React.FC = () => {
  const {
    file,
    setFile,
    isUploading,
    result,
    dragActive,
    uploadProgress,
    uploadStatus,
    uploadMessage,
    handleDrag,
    handleDrop,
    handleFileInput,
    handleUpload,
    formatFileSize
  } = useDocumentUpload()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Upload Document
        </h2>
        <p className="text-gray-600 text-sm">
          Upload documents (DOCX, DOC, PDF, TXT) to enhance the chatbot's knowledge base
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 sm:p-12 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".docx,.doc,.pdf,.txt"
          onChange={handleFileInput}
          aria-label="Upload document"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload
            size={48}
            className={`mb-4 mx-auto ${
              dragActive ? 'text-blue-500' : 'text-gray-400'
            }`}
          />
          <p className="text-gray-900 font-medium mb-2">
            Drag and drop your document here, or click to browse
          </p>
          <p className="text-sm text-gray-500">
            Supported formats: {ALLOWED_FILE_EXTENSIONS.join(', ').toUpperCase()}
          </p>
        </label>
      </div>

      {/* Selected File */}
      {file && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-600" size={24} />
            <div>
              <p className="text-gray-900 font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setFile(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Remove file"
          >
            <XCircle size={20} />
          </button>
        </div>
      )}

      {/* Upload Button */}
      {file && (
        <div className="space-y-3">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing document...
              </>
            ) : (
              <>
                <Upload size={20} />
                Upload and Process
              </>
            )}
          </button>

          {/* Progress Bar */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">
                  {uploadStatus ? uploadStatus.charAt(0).toUpperCase() + uploadStatus.slice(1) : 'Processing...'}
                </span>
                <span className="text-gray-500">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              {uploadMessage && (
                <p className="text-xs text-gray-500">
                  {uploadMessage}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className={`rounded-lg p-4 flex items-start gap-3 border ${
            result.success
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          {result.success ? (
            <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
          ) : (
            <XCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
          )}
          <div className="flex-1">
            <p
              className={`font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {result.message}
            </p>
            {result.success && result.chunks_processed && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Chunks processed: {result.chunks_processed}</p>
                {result.total_chars && (
                  <p>Total characters: {result.total_chars.toLocaleString()}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentUpload
