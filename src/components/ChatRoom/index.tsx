import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import ChatInput from '../ChatInput';
import { axiosInstance } from '../../utils/server';
import { Message, User, UsersObject } from './type';

import styles from './chatRoom.module.scss';

const ChatRoom: React.FC = () => {
    const [roomMessages, setRoomMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<Socket>();
    const [userName, setUserName] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [usersByKeyId, setUsersByKeyId] = useState<UsersObject>({});
    const [activeSelect, setActiveSelect] = useState<string>('[]');

    const sendMessage = (message: string) => {
        socket?.emit('message', {
            message,
            userId: user?.id,
            timestamp: new Date().toUTCString(),
        });
    };

    const messageListener = (message: Message) => {
        setRoomMessages([...roomMessages, message]);
    }

    const getAllMessages = async () => {
        try {
            const messageRes = await axiosInstance.get(`/messages`)
            setRoomMessages(messageRes?.data || []);
        } catch (err) {
            console.log(err);
        }
    }

    const getAllUsers = async () => {
        try {
            const usersRes = await axiosInstance.get(`/users`)
            if (usersRes?.data) {
                const newUserObject: UsersObject = {}
                for (const user of usersRes.data) {
                    newUserObject[user.id] = user;
                }
                setUsersByKeyId(newUserObject)
            }
        } catch (err) {
            console.log(err);
        }
    }

    const addUser = async () => {
        const userData = {
            name: userName,
            id: "id" + Math.random().toString(16),
        }
        try {
            await axiosInstance.post(`/users`, userData)
            setUser(userData);
            setUsersByKeyId({
                ...usersByKeyId,
                [userData.id]: userData
            })
        } catch (err) {
            console.log(err);
        }
    }

    const loginUser = async () => {
        try {
            const res = await axiosInstance.get(`/users/${activeSelect}`)
            setUser(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAllUsers()
    }, [])

    useEffect(() => {
        window.scrollTo({ top: document.body.scrollHeight });
    }, [roomMessages, user])

    useEffect(() => {
        if (user) {
            getAllMessages();
        }
    }, [user])

    useEffect(() => {
        if (user) {
            const newSocket = io(process.env.REACT_APP_SOKET_BASE || '');
            setSocket(newSocket)
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            socket?.on("message", messageListener);
        }
        return () => {
            socket?.off("message", messageListener)
        }
    }, [socket, messageListener, user]);

    return (
        <>
            {user ?
                <div className={styles.layout}>
                    <div className={styles.header}>
                        Chat Room
                    </div>
                    <div className={styles.content}>
                        <div className={styles.chatRoom}>
                            {roomMessages?.map((message, index) => (
                                <div key={index} className={`${styles.messageBox} ${user?.id === usersByKeyId[message.userId].id ? styles.myMessageBox : ''}`}>
                                    {usersByKeyId[message.userId].id != user?.id && <p className={styles.userName}>
                                        {usersByKeyId[message.userId].name}
                                    </p>}<p className={styles.message}>
                                        {message.message}
                                    </p>
                                    <p className={styles.timestamp}>{
                                        message.timestamp}</p>
                                </div>
                            ))}
                        </div>
                        <div className={styles.chatInput}>
                            <ChatInput onSendMessage={sendMessage} />
                        </div>
                    </div>
                </div>
                : <div className={styles.loginUser}>
                    <div className={styles.inputs}>
                        <label>Create User</label>
                        <input
                            placeholder="Type a name"
                            value={userName}
                            onChange={(e) =>
                                setUserName(e.target.value)
                            }
                            className={styles.loginInput}
                            onKeyDown={(e) => {
                                if (e.code === "Enter" || e.code === "NumpadEnter") {
                                    addUser();
                                }
                            }}
                        />
                        <button onClick={addUser} disabled={!userName}>Create</button>
                    </div>
                    <div className={styles.inputs}>
                        <label>Choose User</label>
                        <select defaultValue="" className={styles.loginInput} onChange={(e) => {
                            setActiveSelect(e.target.value)
                        }}>
                            <option></option>
                            {Object.values(usersByKeyId)?.map(item =>
                                <option value={item.id} >
                                    {item.name}
                                </option>
                            )}
                        </select>
                        <button onClick={loginUser} disabled={!activeSelect}>Login</button>
                    </div>
                </div>
            }
        </>
    );
};

export default ChatRoom;
