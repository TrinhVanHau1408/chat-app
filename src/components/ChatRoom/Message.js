
import React from 'react';
import { Avatar, Typography } from 'antd';
import { formatRelative } from 'date-fns/esm';
import Styled from 'styled-components';
const WarpperStyled = Styled.div`
    margin-bottom: 10px;

    .author {
        margin-left: 5px;
        font-weight: bold;
    }

    .date {
        margin-left: 10px;
        font-size: 11px;
        color: #a7a7a7;
    }

    .content {
        margin-left: 30px;
    }

`
export default function Message({ text, displayName, createAt, photoURL }) {
    function formatDate (second) {
        let formattedDate = '';

        if (second) {
            formattedDate = formatRelative(new Date(second * 1000), new Date());
            formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        }
        return formattedDate;
        }
  return (
    <WarpperStyled>
        <div>
        <Avatar size="small" src={photoURL}>{photoURL? '':displayName?.charAt(0).toUpperCase() }</Avatar>
        <Typography.Text className="author">{displayName}</Typography.Text>
        <Typography.Text className="date">{formatDate(createAt?.seconds)}</Typography.Text>
        </div>
        <div className='content'>
            <Typography.Text>{text}</Typography.Text>
        </div>
    </WarpperStyled>
  )
}
