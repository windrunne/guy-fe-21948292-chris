// Custom hook for document upload functionality

import { useState } from 'react'
import { documentService } from '../services/documentService'
import { validateFile, formatFileSize } from '../utils/fileValidation'
import { UploadResponse } from '../types'

export const useDocumentUpload = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<UploadResponse | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const [uploadMessage, setUploadMessage] = useState<string>('')

  const handleFileSelect = (selectedFile: File) => {
    const validation = validateFile(selectedFile)
    if (validation.valid) {
      setFile(selectedFile)
      setResult(null)
    } else {
      alert(validation.error)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || isUploading) return

    setIsUploading(true)
    setResult(null)
    setUploadProgress(0)
    setUploadStatus('')
    setUploadMessage('')

    try {
      await documentService.uploadDocumentStream(
        file,
        (status, message, progress) => {
          setUploadStatus(status)
          setUploadMessage(message)
          setUploadProgress(progress)
        },
        (uploadResult) => {
          setResult({
            success: uploadResult.success !== false,
            message: uploadResult.message || 'Upload successful',
            filename: uploadResult.filename,
            chunks_processed: uploadResult.chunks_processed,
            total_chars: uploadResult.total_chars
          })
          setFile(null)
          setUploadProgress(100)
          setIsUploading(false)
        },
        (error) => {
          setResult({
            success: false,
            message: error
          })
          setIsUploading(false)
        }
      )
    } catch (error: any) {
      setResult({
        success: false,
        message: error.response?.data?.detail || error.message || 'Upload failed'
      })
      setIsUploading(false)
    }
  }

  return {
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
  }
}

