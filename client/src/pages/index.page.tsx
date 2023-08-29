import { SendOutlined } from '@ant-design/icons';
import { AutoComplete, Button, message } from 'antd';
import assert from 'assert';
import type { MessageModel } from 'commonTypesWithClient/models';
import dotenv from 'dotenv';
import { useAtom } from 'jotai';
import frame from 'public/5389.png';
import beimax from 'public/pngwing.com.png';
import { useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { BasicHeader } from 'src/pages/@components/BasicHeader/BasicHeader';
import { apiClient } from 'src/utils/apiClient';
import { useSendMsg } from 'src/utils/sendMsg';
import { userAtom } from '../atoms/user';
import styles from './index.module.css';
dotenv.config();
//a

const Home = () => {
  const [user] = useAtom(userAtom);
  const [msg, setMsg] = useState('');
  const [roomId, setRoomId] = useState('');
  const [myId, setmyId] = useState<string>('');
  const [msgAsse, setMsgAsse] = useState<MessageModel[]>([]);

  const createRoom = async () => {
    const room = await apiClient.room.$post({ body: { roomId } });
    console.log(roomId);
    setRoomId(room.roomId);
    console.log(roomId);
  };

  const lookMsg = async () => {
    const msg = await apiClient.lookMsg.$post();
    setMsgAsse(msg.reverse());
    console.log(msg);
    voice(msgAsse);
  };

  const voice= (messages: MessageModel[]) => {
    const sortedMessages = messages.sort((a, b) => b.sent_at - a.sent_at);
    const latestMessage = sortedMessages.find((message) => message.sender_Id === 2);
    
    if (latestMessage) {
      const uttr = new SpeechSynthesisUtterance(latestMessage.content);
      window.speechSynthesis.speak(uttr);
    } else {
      console.log("最新の sender_Id が 2 のメッセージが見つかりませんでした。");
    }
  };

  const sendMsg = useSendMsg();
  //メッセージ送信
  const sendMsgs = async () => {
    const SendMsg = await sendMsg(msg, roomId);
    assert(SendMsg, 'コメントなし');
    console.log(SendMsg);
  };

  const onMsg = (msg: string) => {
    setMsg(msg);
  };

  // useEffect(() => {
  //   createRoom();
  // }, [createRoom]);

  if (!user) return <Loading visible />;

  return (
    <>
      <BasicHeader user={user} />
      <div style={{ position: 'relative' }}>
        <img
          src={frame.src}
          alt="frame"
          style={{ position: 'fixed', marginLeft: '15%', width: '50%', height: 'auto' }}
        />
        <div style={{ position: 'fixed', width: '20%', height: '14%', overflow: 'hidden' }}>
          <img
            src={beimax.src}
            alt="Beimax"
            style={{ position: 'fixed', left: '20%', top: '21%', width: '40%', height: 'auto' }}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          marginLeft: '75%',
          marginBottom: '100%',

          alignItems: 'flex-end',
        }}
      >
        <div className={styles.box14}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '10px',
            }}
          >
            {msgAsse.map((message) => (
              <div
                key={message.id}
                style={{
                  backgroundColor: message.sender_Id === 1 ? '#ffffff' : '#ffffff',
                  maxWidth: '80%',
                  borderRadius: '8px',
                  padding: '8px',
                  marginBottom: '10px',
                  alignSelf: message.sender_Id === 1 ? 'flex-start' : 'flex-end',
                }}
              >
                {message.content}
              </div>
            ))}
          </div>
        </div>
      </div>
      <AutoComplete
        style={{ width: '40%', height: '80%', position: 'fixed', top: '95%', right: '30%' }}
        onSearch={onMsg}
        placeholder="input her"
      />
      <Button
        icon={<SendOutlined />}
        style={{ position: 'fixed', top: '95%', right: '30%' }}
        type="primary"
        onClick={() => sendMsgs()}
      />
      <Button
        style={{ position: 'fixed', top: '88%', right: '3%' ,width: '20%',height: '10%'}}
        type="primary"
        onClick={() => lookMsg()}
      >
        check
      </Button>
    </>
  );
};

export default Home;
