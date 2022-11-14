import React, { useContext, useState }from 'react';
import { AuthContext } from './AuthProvider';
import useFirestore from '../hooks/useFirestore';

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const {user: {uid}} = useContext(AuthContext);
    /**
     * {
     *  name: 'room name',
     *  description: 'mo ta',
     *  nembers: [uid1, uid2, ...]
     * }
     */
    const roomsCondition = React.useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: uid,
        }
    }, [uid]);

    const rooms = useFirestore('rooms', roomsCondition);

    
    const selectedRoom = React.useMemo(() => 
        rooms.find((room) => room.id === selectedRoomId)
    ,[rooms, selectedRoomId])

    const usersCondition = React.useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: selectedRoom? selectedRoom.members : null,
        }
    }, [selectedRoom])

    const members = useFirestore('users', usersCondition);

    return (
        <AppContext.Provider value={ {rooms, isAddRoomVisible, setIsAddRoomVisible, selectedRoomId, setSelectedRoomId, selectedRoom, members, isInviteMemberVisible, setIsInviteMemberVisible} }>
              {children}
        </AppContext.Provider>
          
    )
}