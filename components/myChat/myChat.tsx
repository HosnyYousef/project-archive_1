'use client';

import { useEffect, useState } from 'react';
import type { Channel as StreamChannel } from 'stream-chat';
import { StreamChat } from 'stream-chat';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Window,
} from 'stream-chat-react';
import { createTokenProvider } from '@/lib/streamClient';
import 'stream-chat-react/dist/css/v2/index.css';

export default function MyChat({
  userId,
  userName,
  isStreamer,
}: {
  userId: string;
  userName: string;
  isStreamer: boolean;
}) {
  const [client, setClient] = useState<StreamChat | undefined>();
  const [channel, setChannel] = useState<StreamChannel | undefined>();

  useEffect(() => {
    const initializeChatClient = async () => {
      const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
      if (!apiKey) {
        console.error('[MyChat] Stream API key is not set');
        return;
      }
      const client = new StreamChat(apiKey);
      await client.connectUser(
        {
          id: userId,
          name: userName,
        },
        createTokenProvider(userId)
      );
      setClient(client);
    };

    const createChannel = async () => {
      if (!client) {
        return;
      }
      const chatChannel = client.channel('livestream', userName.toLowerCase());
      await chatChannel.create();
      await chatChannel.addMembers([userId], {
        text: `${userName} joined the stream.`,
        user_id: userId,
      });
      setChannel(chatChannel);
    };

    if (!client) {
      console.log('[MyChat] Client is not set');
      initializeChatClient();
      return;
    }

    if (!channel) {
      createChannel();
    }
  }, [client, userName, userId, channel]);

  if (!client || !channel) return <div>Setting up client & connection...</div>;

  return (
    <Chat client={client}>
      <Channel channel={channel}>
        <Window>
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
}