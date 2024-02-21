// ChatRoom.tsx
import React, { useState } from 'react';
import { Layout, List } from 'antd';
import ChatInput from '../ChatInput';
import styles from './chatRoom.module.scss'; // Import the SCSS file as a module

interface Message {
    id: number;
    text: string;
}
interface Room {
    id: number;
    name: string;
    messages: Message[]
}

interface ChatRoomProps {
    chatRooms: Room[];
}

const { Header, Content, Sider } = Layout;

const ChatRoom: React.FC<ChatRoomProps> = ({ chatRooms }) => {
    const [selectedChat, setSelectedChat] = useState<Room | null>(null);
    const [roomMessages, setRoomMessages] = useState<Room[]>(chatRooms);

    const addMessage = (text: string) => {
        if (selectedChat) {

            const newMessages = [...selectedChat.messages]
            const newMessage: Message = {
                id: roomMessages.length + 1,
                text: text,
            };
            newMessages.push(newMessage)
            setSelectedChat({
                ...selectedChat,
                messages: newMessages
            });
        }
    };

    const handleChatRoomChange = (chatRoom: Room) => {
        const newRooms = [...roomMessages];
        for (let i = 0; i < newRooms.length; i++) {
            const room = newRooms[i];
            if (room?.id === selectedChat?.id) {
                newRooms[i] = selectedChat;
                break;
            }
        }
        console.log(selectedChat);

        console.log(newRooms);

        setRoomMessages(newRooms);
        setSelectedChat(chatRoom);
    };

    console.log(roomMessages);

    return (
        <Layout className={styles.chatRoomContainer}>
            <Sider width={200} theme="dark" className={styles.sider}>
                <List
                    dataSource={roomMessages}
                    renderItem={(chatRoom) => (
                        <List.Item
                            onClick={() => {
                                if (chatRoom?.id != selectedChat?.id) {
                                    handleChatRoomChange(chatRoom)
                                }
                            }
                            }
                            className={`${styles.chatListItem} ${selectedChat?.id == chatRoom?.id ? styles.chatActiveListItem : ''}`}
                        >
                            {chatRoom.name}
                        </List.Item>
                    )}
                />
            </Sider>
            <Layout className={styles.layout}>
                <Header className={styles.header}>
                    {selectedChat ? `Chat Room: ${selectedChat.name}` : 'Select a Chat Room'}
                </Header>
                <Content className={styles.content}>
                    <div className={styles.chatRoom}>
                        {selectedChat?.messages?.map((message) => (
                            <div key={message.id + message.text} className={`${styles.message} ${message}`}>
                                {message.text}
                            </div>
                        ))}
                    </div>
                    {selectedChat && <ChatInput onSendMessage={addMessage} />}
                </Content>
            </Layout>
        </Layout>
    );
};

export default ChatRoom;
