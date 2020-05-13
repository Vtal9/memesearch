import React from 'react'
import { useDropzone } from 'react-dropzone';
import Gluejar from './Gluejar'
import { ButtonBase, Typography } from '@material-ui/core';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';


export default function FilePicker(props: { handleFiles: (files: File[]) => void }) {
  function handleFiles(files: File[]) {
    if (!files || files.length === 0) return
    props.handleFiles(files)
  }

  const { isDragActive, getRootProps, getInputProps} = useDropzone({
    onDrop: files => handleFiles(files),
    accept: 'image/*'
  })

  return (
    <ButtonBase {...getRootProps()} style={{ width: '100%' }}>
      <div className={isDragActive ? 'file-picker over' : 'file-picker'}>
        <input {...getInputProps()} />
        <CloudUploadOutlinedIcon fontSize='large' />
        <Typography>Выберите файл с компьютера</Typography>
        <Typography variant='caption'>или</Typography>
        <Typography>Перетащите файлы сюда</Typography>
        <Typography variant='caption'>или</Typography>
        <Typography>Вставьте картинку из буфера обмена</Typography>
        <Gluejar onPaste={files => handleFiles(files)} onError={() => {}} />
      </div>
    </ButtonBase>
  )
}