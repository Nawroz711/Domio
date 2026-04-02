import { useDropzone } from 'react-dropzone'

const ImageUpload = ({ previewImages, onDrop, onRemove, isUploading }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 10 - previewImages.length,
    maxSize: 10 * 1024 * 1024,
  })

  return (
    <div className="mb-8">
      <h5 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
        Property Images
      </h5>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-blue-50'
            : 'border-gray-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <p className="text-gray-700 font-medium">
            Drag & drop images here, or click to select
          </p>
          <p className="text-sm text-gray-500">
            Maximum 10 images, each up to 10MB (JPEG, PNG, GIF, WebP)
          </p>
          <p className="text-sm text-gray-500">
            {previewImages.length}/10 images selected
          </p>
        </div>
      </div>

      {/* Image Previews */}
      {previewImages.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {previewImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.preview}
                  alt={image.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">Uploading...</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUpload