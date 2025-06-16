import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import avatarUploaderStyles from '../css/avatarUploader.module.css'
import { useAuth } from './AuthContext';


const AvatarUploader = () => {
  const { checkAuth } = useAuth();
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ 
    aspect: 1,
    unit: 'px',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
const [croppedImage, setCroppedImage] = useState(null);
const imageRef = useRef(null);
  
const closePreview = () => {
  setImageSrc(null);
  setCroppedImage(null);
}


const handleFileSelect = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];
    const reader = new FileReader();
      
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  }
};
  
const handleCropComplete = (crop) => {
  if (!imageRef.current || !crop.width || !crop.height) return;

  const canvas = document.createElement('canvas');
  const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
  const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;

  const ctx = canvas.getContext('2d');
  
  ctx.drawImage(
    imageRef.current,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  canvas.toBlob((blob) => {
    setCroppedImage(URL.createObjectURL(blob));
  }, 'image/jpeg', 0.9);
};
  

const handleSavePhoto = async () => {
    if (!croppedImage) return;
    
    try {
      const blob = await fetch(croppedImage).then(r => r.blob());
        
      const file = new File([blob], 'profile.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now()
      });
      

      const formData = new FormData();
      formData.append('image', file);
    
      const response = await fetch('https://damko13.pythonanywhere.com/profile_picture', {
        method: 'PUT',
        body: formData,
        credentials: 'include'
      });
    
      if (!response.ok) throw new Error('Upload failed');
        
      // const data = await response.json();
      alert('Upload successful');
      setImageSrc(null);
      setCroppedImage(null);
      setCrop({ 
        aspect: 1,
        unit: 'px',
        width: 100,
        height: 100,
        x: 0,
        y: 0
    });
    const fileInput = document.getElementById('avatar-input');
    if (fileInput) fileInput.value = '';
    checkAuth();
      
    } catch (error) {
      console.error('Upload error:', error);
    }
  };
      




  return (
    <div className={avatarUploaderStyles['main-uploader-div']}>
      {/* File input */}
      <input type="file" accept="image/*" onChange={handleFileSelect} id="avatar-input" style={{ display: 'none' }}/>
      <div className={avatarUploaderStyles['label-preview-div']}>
        {imageSrc ? (<button className={avatarUploaderStyles['preview-button']} onClick={handleSavePhoto}>Save Photo</button>) : (<label htmlFor="avatar-input" className={avatarUploaderStyles['upload-button']}>Upload new profile picture</label>)}
        {/* Preview */}
        {imageSrc && (
          <div className={avatarUploaderStyles['preview']}>
            <img src={croppedImage} className={avatarUploaderStyles['preview-image']} />
          </div>
        )}
      </div>

      {imageSrc ? <p className={avatarUploaderStyles['helper-p']}>Click and drag the rectangle to choose which part of the picture you want, click and drag the edges of the rectangle to edit its size. If the rectangle disappears, just click and drag anywhere in the picture </p> : null}
        
        
      <div className={avatarUploaderStyles['images-div']}>
      {/* Cropping interface */}
      {imageSrc && (
        <div className={avatarUploaderStyles['main-crop-div']}>
          <ReactCrop crop={crop} onChange={(newCrop) => setCrop(newCrop)} onComplete={handleCropComplete} aspect={1} minWidth={50} minHeight={50} >
            <img ref={imageRef} src={imageSrc} alt="Upload preview" className={avatarUploaderStyles['upload-image']}/>
          </ReactCrop>
          <button className={avatarUploaderStyles['close-button']} onClick={() => {closePreview()}}>×</button>
        </div>
      )}
      </div>
    </div>
  );
};
  


export default AvatarUploader;