/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import './style.css';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: true,
  onChange(info: { file: { name?: any; status?: any; }; fileList: any; }) {
    const { status } = info.file;
    if (status !== 'uploading') {
      message.success(`${info.file.name} file uploading.`);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e: { dataTransfer: { files: any; }; }) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

function OpenFlyMission() {
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Нажмите или перетащите файл в эту область, чтобы загрузить</p>
      <p className="ant-upload-hint">Поддерживается одиночная или массовая загрузка.</p>
    </Dragger>
  );
}

export default OpenFlyMission;
