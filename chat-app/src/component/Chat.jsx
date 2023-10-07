import React, { useEffect, useState } from 'react'
import { user } from './Join'
import socketIO from 'socket.io-client'
import './Chat.css'
import ReactScrollToBottom from 'react-scroll-to-bottom'
import Message from './Message'
import UserName from './UserName'
import './Message.css'

let socket;

const ENDPOINT = 'http://localhost:4500/'

const Chat = () => {

    const [id, setID] = useState("");
    const [messages, setMessages] = useState([])

    const send = () => {
        const message = document.getElementById('chatInp').value;
        socket.emit('message', { message, id })
        document.getElementById('chatInp').value = "";
    }

    useEffect(() => {

        socket = socketIO(ENDPOINT, { transports: ['websocket'] })

        socket.on('connect', () => {
            console.log('New Connection')
            alert(user + " Connected")
            setID(socket.id);
        })
        socket.emit('joined', { user });

        socket.on('welcome', (data) => {
            setMessages([...messages, data])
            console.log(data.user, data.message);
        })

        socket.on('user-joined', (data) => {
            setMessages([...messages, data])
            console.log(data.user, data.message);
        })

        socket.on('user-left', (data) => {
            setMessages([...messages, data]);
            console.log(data.user, data.message);
        })

        return () => {
            socket.emit('disconnection', { user });
            socket.off();
        }
    }, [])

    useEffect(() => {
        socket.on('send-message', (data) => {
            setMessages([...messages, data])
            console.log(data.user, data.message, data.id)
        })

        return () => {
            socket.off();
        }
    }, [messages])



    return (
        <div className='chatPage'>
            <div className="chatContainer">
                <div className="chatHeader">
                    <UserName name={'MyChatApp'} />
                </div>
                <ReactScrollToBottom className="chatBox" id='chatBox'>
                    {
                        messages.map((item) => <Message key={item.id} user={item.id === id ? '' : item.user} message={item.message} classs={item.id === id ? 'rightBox' : 'leftBox'} />)
                    }
                </ReactScrollToBottom>
                <div className="InputBox">
                    <input type="text" id='chatInp' onKeyDown={(event) => event.key === 'Enter' ? send() : null} />
                    <button onClick={send} className="sendBtn">Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chat