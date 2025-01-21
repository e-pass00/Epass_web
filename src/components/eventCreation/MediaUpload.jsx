import React from 'react';
import styled from 'styled-components';
import { Image as ImageIcon, Video, X } from 'lucide-react';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #e5e7eb;
  font-size: 0.975rem;
  font-weight: 600;
`;

const UploadContainer = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3ecf8e;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #ff4d4d;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const MediaUpload = ({
  formData,
  mediaPreviews,
  handleFileChange,
  removeMedia,
}) => {
  return (
    <Form>
      <FormGroup>
        <Label>Photo de couverture</Label>
        <UploadContainer
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
              const event = { target: { files: [file] } };
              handleFileChange('image', event);
            }
          }}
          onClick={() => document.getElementById('imageInput').click()}
        >
          {mediaPreviews.image ? (
            <div style={{ position: 'relative' }}>
              <img
                src={mediaPreviews.image}
                alt="Aperçu"
                style={{ maxWidth: '100%', maxHeight: '200px' }}
              />
              <IconButton
                onClick={() => removeMedia('image')}
                style={{ position: 'absolute', top: '5px', right: '5px' }}
              >
                <X size={20} />
              </IconButton>
            </div>
          ) : (
            <>
              <ImageIcon className="mx-auto mb-2" />
              <p>Cliquez ou glissez-déposez une image</p>
              <p className="text-sm text-gray-400 mt-1">
                Formats acceptés : JPG, PNG, WEBP (max 10MB)
              </p>
            </>
          )}
        </UploadContainer>
        <input
          id="imageInput"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => handleFileChange('image', e)}
          style={{ display: 'none' }}
        />
      </FormGroup>

      <FormGroup>
        <Label>Vidéo de couverture</Label>
        <UploadContainer
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
              const event = { target: { files: [file] } };
              handleFileChange('video', event);
            }
          }}
          onClick={() => document.getElementById('videoInput').click()}
        >
          {mediaPreviews.video ? (
            <div style={{ position: 'relative' }}>
              <video
                src={mediaPreviews.video}
                controls
                style={{ maxWidth: '100%', maxHeight: '200px' }}
              ></video>
              <IconButton
                onClick={() => removeMedia('video')}
                style={{ position: 'absolute', top: '5px', right: '5px' }}
              >
                <X size={20} />
              </IconButton>
            </div>
          ) : (
            <>
              <Video className="mx-auto mb-2" />
              <p>Cliquez ou glissez-déposez une vidéo</p>
              <p className="text-sm text-gray-400 mt-1">
                Formats acceptés : MP4, WEBM (max 10MB)
              </p>
            </>
          )}
        </UploadContainer>
        <input
          id="videoInput"
          type="file"
          accept="video/mp4,video/webm"
          onChange={(e) => handleFileChange('video', e)}
          style={{ display: 'none' }}
        />
      </FormGroup>
    </Form>
  );
};

export default MediaUpload;
