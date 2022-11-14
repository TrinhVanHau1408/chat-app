import React from 'react'
import {Avatar, Button, Typography} from 'antd';
import styled from 'styled-components';
import { auth } from '../../firebase/config';
import { AuthContext } from '../../Context/AuthProvider';
const WarpperStyle = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-botoom: 1px solid rgbd(82, 38, 83);

    .username{
        color: white;
        margin-left: 5px;
    }
`;
export default function UserInfo() {
 
  const {
    user: {displayName, photoURL}
  } = React.useContext(AuthContext);
 
  return (
    <WarpperStyle>
      <div>
        <Avatar src={photoURL}>
          {photoURL ? '' : displayName?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography.Text className="username">{displayName}</Typography.Text>
      </div>
      <Button ghost 
        onClick={() => auth.signOut()}>
        Đăng xuất
      </Button>
    </WarpperStyle>
  )
}
