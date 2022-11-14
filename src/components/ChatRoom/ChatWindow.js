import React, { useContext, useState } from 'react'
import Styled from 'styled-components';
import {Avatar, Button, Tooltip, Input, Form, Alert} from 'antd'
import { UserAddOutlined } from '@ant-design/icons';
import Message from './Message';
import { AppContext } from '../../Context/AppProvider';
import {addDocument} from '../../firebase/services';
import { AuthContext } from '../../Context/AuthProvider';
import useFirestore from '../../hooks/useFirestore';


const HeaderStyled = Styled.div`
    display: flex;
    justify-content: space-between;
    height: 56px;
    padding: 0 10px;
    align-items: center;
    border-bottom: 1px solid rgb(230, 230, 230);

    .header {
        &__info {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        &__title {
            margin: 0;
            font-weight: bold;
        }

        &__description {
            font-size: 12px;
        }
    }
`;

const WarpperStyled = Styled.div`
    height: 100vh;
`;
const ButtonGroupStyled = Styled.div`
    display: flex;
    align-items: center;
`;

const ContentStyled = Styled.div`
    height: calc(100% - 56px);
    display: flex;
    flex-direction: column;
    padding: 11px;
    justify-content: flex-end;
`;

const FormStyled = Styled(Form)`
    display: flex;
    justify-content: space-between;
    algin-items: center;
    padding: 2px 2px 2px 0;
    border: 1px solid rgb(230. 230, 230);
    border-radius: 2px;

    .ant-form-item{
        flex: 1;
        margin-bottom: 0;
    }
`;
const MessageListStyled = Styled.div`
    max-height: 100%;
    overflow-y: auto;
`;
// search: 'Tun'
/**
 * db: collection: 'users'
 * {
 *  displayName: "Tung Nguyen"
 * keyword: ["T", "Tu", "Tun", "Tung", "Tung N", .... "N", "Ng", ...]
 * ...
 * }
 * {
 *  displayName: "ABC Tung"
 * }
 * 
 */
export default function ChatWindow() {
  const [form] = Form.useForm();
  const {selectedRoom, 
         members, 
         setIsInviteMemberVisible} = useContext(AppContext);
  const {user: {displayName, uid, photoURL}} = useContext(AuthContext);
  const [inputValue, setInputValue] = useState('');
    
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = () => {
    addDocument('messages',{
        text: inputValue,
        uid,
        photoURL,
        roomId: selectedRoom.id,
        displayName
    })

    form.resetFields(['message']);
  }

  const conditionMessages = React.useMemo(() =>(
    {
        fieldName: 'roomId',
        operator: '==',
        compareValue: selectedRoom? selectedRoom.id : null,
    }),[selectedRoom]);

  const messages = useFirestore('messages', conditionMessages);
  console.log('messages',messages, selectedRoom)

 
  return <WarpperStyled>
    {!selectedRoom? <Alert message="Hãy chọn phòng!" type="info" showIcon style={{margin: 5}} closable/>:<>
    <HeaderStyled>
        <div className="header__info">
            <p className="header__title">{selectedRoom.name}</p>
            <span className="header__description">{selectedRoom.description}</span>
        </div>
        <ButtonGroupStyled>
            <Button type="text" icon={<UserAddOutlined></UserAddOutlined>} onClick={()=>setIsInviteMemberVisible(true)}>Mời</Button>
            <Avatar.Group size="small" maxCount={2}>
                {members.map(member => <Tooltip key={member.id} title={member.displayName}>
                    <Avatar src={member.photoURL}>{member.URL? '':member.URL?.charAt(0).toUpperCase() }</Avatar>
                </Tooltip>)}
            </Avatar.Group>
        </ButtonGroupStyled>
    </HeaderStyled>

    <ContentStyled>
        <MessageListStyled>
            {messages.map(mes => <Message
                key={mes.id}
                text={mes.text}
                photoURL={mes.photoURL} 
                displayName={mes.displayName} 
                createAt={mes.createdAt} 
            />)}
            
        </MessageListStyled>
       
        <FormStyled form={form}>
            <Form.Item name="message">  
                <Input 
                    onChange={handleInputChange}
                    onPressEnter={handleSubmit}
                    placeholder='Nhập tin nhắn ...' 
                    bordered={false} 
                    autoComplete='off'/>
            </Form.Item>
            <Button type='primary' onClick={handleSubmit}>Gửi</Button>
        </FormStyled>
    </ContentStyled>
    </>
}
  </WarpperStyled>
  
}
