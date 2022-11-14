import React, { useContext, useState } from 'react';
import { Avatar, Form, Modal, Select, Spin } from 'antd';
import { AppContext } from '../../Context/AppProvider';
import { debounce } from 'lodash';
import { db } from '../../firebase/config';


function DebounceSelect({ fetchOptions, debounceTimeout = 300, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOption] = useState([]);
    console.log(props.curMembers);
    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
            setOption([]);
            setFetching(true);

            fetchOptions(value, props.curMembers).then(newOptions => {
                setOption(newOptions);
                setFetching(false);
            })
        }
        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions]);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent = { fetching ? <Spin size="small"/> : null}
            {...props}
        >
            {
                options.map(opt => (
                    <Select.Option key={opt.value} value={opt.value} title={opt.label}>
                        <Avatar size="small" src={opt.photoURL}>
                            {opt.photoURL ? '' : opt.label?.CharAt(0)?.toUpperCase()}
                        </Avatar>
                        {`${opt.label}`}
                    </Select.Option>
                ))
            }
        </Select>
    )
}

async function fetchUserList(search, curMembers) {
  return db.collection('users')
           .where('keywords', 'array-contains', search )
           .orderBy('displayName')
           .limit(20)
           .get()
           .then(snapshot => {
            return snapshot.docs.map(doc => ({
              label: doc.data().displayName,
              value: doc.data().uid,
              photoURL: doc.data().photoURL,
            })).filter(opt => !curMembers.includes(opt.value));
           });
}
export default function InviteMemberModal() {
  const [value, setValue] = useState([]);

  const {isInviteMemberVisible, 
         setIsInviteMemberVisible, 
         selectedRoomId, 
         selectedRoom} = useContext(AppContext)

  const [form] = Form.useForm();

  const handleOk = () => {
    // Update members om current room
    const roomRef = db.collection('rooms').doc(selectedRoomId);
    roomRef.update({
      members: [...selectedRoom.members, ...value.map(val => val.value)]
    });


    // Reset form value
    setIsInviteMemberVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsInviteMemberVisible(false);

    // Reset form value
    form.resetFields();
  };

  console.log({value})
  return (
    <div>
      <Modal
        title="Mời thêm thành viên"
        open={isInviteMemberVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
            <DebounceSelect 
                mode="multiple"
                label="Tên các thành viên mới"
                value={value}
                placeholder="Nhập tên thành viên mới"
                fetchOptions={fetchUserList}
                onChange={newValue => setValue(newValue)}
                style={{ width: '100%' }}
                curMembers={selectedRoom? selectedRoom.members : null}
            />
        </Form>
      </Modal>
    </div>
  )
}
