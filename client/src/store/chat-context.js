import { create } from "zustand";
import { toast } from "sonner";
import { axiosService } from "../services/axios.service.js";
import useAuth from "./auth-context.js";

export const useChat = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosService.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosService.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: (messageData) => {
    const { selectedUser, messages } = get();
    const socket = useAuth.getState().socket;

    if (!socket || !socket.connected) {
      toast.error("Socket not connected.");
      return;
    }

    socket.emit(
      "sendMessage",
      { to: selectedUser._id, ...messageData },
      (ack) => {
        if (ack?.status === "ok") {
          set({ messages: [...messages, ack.message] });
        } else {
          toast.error("Message failed to send.");
        }
      }
    );
  },

  sendHeavyMessage: async (messageData) => {
  const { selectedUser, messages } = get();
  console.log("msg body : " + selectedUser , messageData , messages);
  try {
    const res = await axiosService.post(`/messages/send/${selectedUser._id}`, messageData);
    set({ messages: [...messages, res.data] });
  } catch (error) {
    toast.error(error.message);
  }
},


  subscribeToMessages: async () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = await useAuth.getState().socket;
    if (!socket || !socket.connected) {
      console.warn("Socket not connected yet, cannot subscribe to messages.");
      return;
    } else {
      console.log("Socket  connected ");
    }

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages } = get();
      const isFromSelectedChat =
        newMessage.senderId === selectedUser?._id ||
        newMessage.receiverId === selectedUser?._id;

      if (!isFromSelectedChat) return;

      set({ messages: [...messages, newMessage] });
    });
  },

  unsubscribeFromMessages: async () => {
    const socket = await useAuth.getState().socket;
    if (!socket || !socket.connected) {
      console.warn("Socket not connected yet, cannot subscribe to messages.");
      return;
    }
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
