import React, { useState } from 'react';
import { ChatInputProps } from './chatInput.interface';

import styles from './chatInput.module.scss';

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        if (message.trim() !== '') {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className={styles.sender}>
            <input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={styles.chatInput}
                onKeyDown={(e) => {
                    if (e.code === "Enter" || e.code === "NumpadEnter") {
                        sendMessage()
                    }
                }}
            />
            <button className={styles.sendButton} onClick={sendMessage} >
                Send
            </button>
        </div>
    );
};

export default ChatInput;
