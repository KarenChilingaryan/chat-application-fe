import React, { useState } from 'react';
import { Input, Button } from 'antd';

interface ChatInputProps {
    onSendMessage: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        if (message.trim() !== '') {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div style={{ marginTop: 20 }}>
            <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ width: '70%', marginRight: 10 }}
                onKeyDown={(e) => {
                    console.log(e)
                    if (e.code === "Enter" || e.code === "NumpadEnter") {
                        sendMessage()
                    }
                }
                }
            />
            <Button type="primary" onClick={sendMessage} >
                Send
            </Button>
        </div>
    );
};

export default ChatInput;
