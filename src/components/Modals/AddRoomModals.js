
import React, { useContext, useState } from 'react';
import { Form, Modal, Input } from 'antd';
import { AppContext } from '../../Context/AppProvider';
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../Context/AuthProvider';

export default function AddRoomModals() {

  const {isAddRoomVisible, setIsAddRoomVisible} = useContext(AppContext)
  const {user: {uid}} = useContext(AuthContext);
  const [form] = Form.useForm();
  const handleOk = () => {
    // add rooms in DB
    addDocument('rooms', {...form.getFieldValue(), members: [uid] });
    // Reset form value
    setIsAddRoomVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsAddRoomVisible(false);

    // Reset form value
    form.resetFields();
  };
  return (
    <div>
      <Modal
        title="Tạo phòng"
        open={isAddRoomVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
            <Form.Item label="Tên phòng" name='name'>
                <Input placeholder='Nhập tên phòng'/>
            </Form.Item>
            <Form.Item label="Mô tả" name='description'>
                <Input.TextArea placeholder='Nhập mô tả'/>
            </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
