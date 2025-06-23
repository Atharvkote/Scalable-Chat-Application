import  useAuth  from "../store/auth-context.js";
import { useChat } from "../store/chat-context.js";
import Sidebar from "../components/online-user-sidebar.jsx";
import NoChatSelected from "../components/no-chat-selected.jsx";
import ChatContainer from "../components/chat-container.jsx";

const HomePage = () => {
  const { selectedUser } = useChat();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;