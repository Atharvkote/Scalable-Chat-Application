import { create } from "zustand";
import { axiosService } from "../services/axios.service.js";
import { toast } from "sonner";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5000";

const useAuth = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosService.get("/v1/auth/check-auth");
      set({ authUser: response.user }); 
      get().connectSocket();
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data, navigate) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosService.post("/v1/auth/signup", data);
      set({ authUser: res.user });
      toast.success("Account created successfully");
      navigate("/user/login", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data, navigate) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosService.post("/v1/auth/login", data);
      set({ authUser: res.user });
      toast.success("Logged in successfully");
      get().connectSocket();
      navigate("/chat", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async (navigate) => {
    try {
      await axiosService.post("/v1/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
      navigate("/user/login", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosService.put("/v1/auth/update-profile", data);
      set({ authUser: res.user });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

 connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });
    if(socket){
      console.log("Connected Socket : " + socket);
    }

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
      console.log("Socket disconnected");
    }
  },
}));

export default useAuth;
