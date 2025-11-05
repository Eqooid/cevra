import useSWR from "swr";
import { create } from "zustand";

/**
 * Chat interface representing a chat session.
 * @interface Chat
 * @author Cristono Wijaya
 */
export interface Chat {
  id: string;
  name: string;
  description: string;
  storageId: string;
  storageName: string;
  createdAt: string;
  messages: Message[];
  lastMessage?: {role: 'user' | 'assistant'; content: string};
  countMessages: number;
}

/**
 * Message interface representing a single message in a chat.
 * @interface Message
 * @author Cristono Wijaya
 */
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

/**
 * Dummy data for initial chats.
 * In a real application, this data would come from a backend service.
 * @constant {Chat[]}
 */
const dummyData: Chat[] = [
  {
    id: "chat-1",
    name: "Project Discussion",
    description: "Discussion about the new project requirements",
    storageId: "ad123133",
    storageName: "Storage A",
    createdAt: "2024-11-04",
    lastMessage: { role:"assistant", content:"Hello! How can I help you with your project today?" },
    messages: [
      {
        id: "msg-1",
        content: "Hello! How can I help you with your project today?",
        role: "assistant",
        timestamp: "2024-11-04T10:00:00Z"
      }
    ],
    countMessages: 1
  },
  {
    id: "chat-2",
    name: "Data Analysis",
    description: "Analyzing customer data patterns",
    storageId: "bd456456",
    storageName: "Storage B",
    createdAt: "2024-11-03",
    lastMessage: { role:"assistant", content: "Of course! I'd be happy to help you analyze your customer data. What specific aspects would you like to focus on?" },
    messages: [
      {
        id: "msg-2",
        content: "Can you help me analyze the latest customer data?",
        role: "user",
        timestamp: "2024-11-03T14:30:00Z"
      },
      {
        id: "msg-3",
        content: "Of course! I'd be happy to help you analyze your customer data. What specific aspects would you like to focus on?",
        role: "assistant",
        timestamp: "2024-11-03T14:30:30Z"
      }
    ],
    countMessages: 2
  }
];

/**
 * ChatState interface representing the state and actions for chat management.
 * @interface ChatState
 * @author Cristono Wijaya
 */
export interface ChatState {
  isStreaming: boolean;
  isLoading: boolean;
  isSelectingLoading: boolean;
  chats: Chat[];
  isCreateDialogOpen: boolean;
  setChats: (chats: Chat[]) => void;
  selectedChat: Chat | undefined;
  setSelectedChatById: (chatId: string) => void;
  setSelectedChat: (chat: Chat | undefined) => void;
  handleCreateChat: (newChat: Omit<Chat, 'id' | 'createdAt' | 'messages' | 'lastMessage' | 'countMessages'>) => void;
  handleSendMessage: (content: string, callback?: () => void) => void;
  handleEditChat: (chatId: string, updatedData: { name: string; description: string }) => void;
  handleDeleteChat: (chatId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setSelectingLoading: (isLoading: boolean) => void;
  toggleCreateDialog: (isOpen: boolean) => void;
};

/**
 * Zustand store for managing chat state.
 * @constant {import('zustand').UseStore<ChatState>}
 * @author Cristono Wijaya
 */
const useChat = create<ChatState>((set, get) => ({
  isStreaming:false,
  isLoading: true,
  isSelectingLoading: true,
  chats: [],
  isCreateDialogOpen: false,
  selectedChat: undefined,
  setSelectedChat: (chat: Chat|undefined) => {
    set({ selectedChat: chat });
  },
  setSelectedChatById: async (chatId: string) => {
    const chat = await fetchSingleChatData(chatId);
    set({ selectedChat: chat });
  },
  setChats: (chats: Chat[]) => {
    set({ chats, isLoading: false })
  },
  handleCreateChat: async (newChat) => {
    const chat = await addChat(newChat);
    set((state) => ({
      chats: [chat, ...state.chats],
      selectedChat: chat,
      isCreateDialogOpen: false
    }));
  },
  handleSendMessage: async (content: string, callback) => {
    const selectedChat = get().selectedChat;
    if (!selectedChat) return;

    set({ isStreaming: true });
    const userMessage = await sendMessage(selectedChat.id, content);
    
    set((state) => ({
      selectedChat: {
        ...selectedChat,
        messages: [...selectedChat.messages, userMessage]
      },
      chats: state.chats.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, lastMessage: { 
            content: userMessage.content,
            role: "user"
          }, countMessages: chat.countMessages + 1 }
          : chat
      )
    }));
    
    if (callback) callback();
    
    aiReply(selectedChat.id, content).then((assistantMessage) => {
      const currentSelectedChat = get().selectedChat;
      if (!currentSelectedChat) return;
      set((state) => ({
        selectedChat: {
          ...currentSelectedChat,
          messages: [...currentSelectedChat.messages, assistantMessage]
        },
        chats: state.chats.map(chat => 
          chat.id === currentSelectedChat.id 
            ? { 
                ...chat, 
                lastMessage: { 
                  role: "assistant",
                  content: assistantMessage.content
                }, 
                countMessages: chat.countMessages + 1 
              }
            : chat
        ),
        isStreaming: false
      }));
      if (callback) callback();
    });
  },
  handleEditChat: async (chatId: string, updatedData: { name: string; description: string }) => {
    await editChat(chatId, updatedData);
    set((state) => ({
      chats: state.chats.map(chat => 
        chat.id === chatId ? { ...chat, ...updatedData } : chat
      ),
      selectedChat: state.selectedChat?.id === chatId 
        ? { ...state.selectedChat, ...updatedData }
        : state.selectedChat
    }));
  },
  handleDeleteChat: async (chatId: string) => {
    await deleteChat(chatId);
    set((state) => ({
      chats: state.chats.filter(chat => chat.id !== chatId),
      selectedChat: state.selectedChat?.id === chatId ? undefined : state.selectedChat
    }));
  },
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setSelectingLoading: (isSelectingLoading: boolean) => set({ isSelectingLoading }),
  toggleCreateDialog: (isOpen: boolean) => set({ isCreateDialogOpen: isOpen }),
}));

/**
 * Fetches chat data from a simulated backend service.
 * @return {Promise<Chat[]>} A promise that resolves to an array of Chat objects.
 * @author Cristono Wijaya
 */
const fetchChatData = async (): Promise<Chat[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyData);
    }, 500);
  });
};

/**
 * Fetches a single chat's data by its ID from a simulated backend service.
 * @param {string} chatId - The ID of the chat to fetch.
 * @return {Promise<Chat | undefined>} A promise that resolves to a Chat object or undefined if not found.
 * @author Cristono Wijaya
 */
const fetchSingleChatData = async (chatId: string): Promise<Chat | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const chat = dummyData.find(chat => chat.id === chatId);
      resolve(chat);
    }, 500);
  });
};

/**
 * Adds a new chat to the simulated backend service.
 * @param {Omit<Chat, 'id' | 'createdAt' | 'messages' | 'lastMessage' | 'countMessages'>} newChat - The new chat data to add.
 * @return {Promise<Chat>} A promise that resolves to the newly created Chat object.
 * @author Cristono Wijaya
 */
const addChat = async (newChat: Omit<Chat, 'id' | 'createdAt' | 'messages' | 'lastMessage' | 'countMessages'>): Promise<Chat> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const chat: Chat = {
        ...newChat,
        id: `chat-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        messages: [],
        countMessages: 0,
        lastMessage: {role: 'assistant', content: ''},
      };
      resolve(chat);
    }, 500);
  });
};

/**
 * Sends a message in a chat to the simulated backend service.
 * @param {string} chatId - The ID of the chat to send the message to.
 * @param {string} content - The content of the message to send.
 * @return {Promise<Message>} A promise that resolves to the sent Message object.
 * @author Cristono Wijaya
 */
const sendMessage = async (chatId: string, content: string): Promise<Message> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const message: Message = {
        id: `msg-${Date.now()}`,
        content,
        role: 'user',
        timestamp: new Date().toISOString()
      };
      resolve(message);
    }, 500);
  });
};

/**
 * Simulates an AI reply to a message in a chat.
 * @param {string} chatId - The ID of the chat to send the AI reply to.
 * @param {string} content - The content of the user's message to which the AI is replying.
 * @return {Promise<Message>} A promise that resolves to the AI's Message object.
 * @author Cristono Wijaya
 */
const aiReply = async (chatId: string, content: string): Promise<Message> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const message: Message = {
        id: `msg-${Date.now() + 1}`,
        content: `This is a simulated AI response to your message: "${content}"`,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      resolve(message);
    }, 1000);
  });
};

/**
 * Updates a chat's name and description in the simulated backend service.
 * @param {string} chatId - The ID of the chat to update.
 * @param {object} updatedData - The updated name and description.
 * @return {Promise<Chat>} A promise that resolves to the updated Chat object.
 * @author Cristono Wijaya
 */
const editChat = async (chatId: string, updatedData: { name: string; description: string }): Promise<Chat> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const chatIndex = dummyData.findIndex(chat => chat.id === chatId);
      if (chatIndex !== -1) {
        dummyData[chatIndex] = { ...dummyData[chatIndex], ...updatedData };
        resolve(dummyData[chatIndex]);
      }
    }, 500);
  });
};

/**
 * Deletes a chat from the simulated backend service.
 * @param {string} chatId - The ID of the chat to delete.
 * @return {Promise<void>} A promise that resolves when the chat is deleted.
 * @author Cristono Wijaya
 */
const deleteChat = async (chatId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const chatIndex = dummyData.findIndex(chat => chat.id === chatId);
      if (chatIndex !== -1) {
        dummyData.splice(chatIndex, 1);
      }
      resolve();
    }, 500);
  });
};

/**
 * Custom hook to fetch chat data using SWR and manage loading state.
 * @return {{ data: Chat[]; isLoading: boolean }} An object containing the chat data and loading state.
 * @author Cristono Wijaya
 */
export const useFetchChatData = () => {
  const chats = useChat((state) => state.chats);
  const setChats = useChat((state) => state.setChats);
  const setLoading = useChat((state) => state.setLoading);
  const isLoading = useChat((state) => state.isLoading);

  useSWR<Chat[]>('chats', fetchChatData, {
    suspense: true,
    fallback: [],
    fallbackData: [],
    refreshInterval: 0,
    revalidateOnFocus: false,
    onSuccess: (data) => {
      setChats(data);
      setLoading(false);
    }
  });

  return { 
    data: chats, 
    isLoading 
  };
};

export default useChat;