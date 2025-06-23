import { Link, useNavigate } from "react-router-dom";
import useAuth from "../store/auth-context.js";
import { LogOut, MessageSquare, Settings, User, UserPlus } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuth();
  console.log("authUser", authUser);
  const navigate = useNavigate();
  return (
    <header
      className="border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container  mx-auto px-4 h-16">
        <div className="flex mx-auto max-w-7xl  items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">चर्चा Verse</h1>
            </Link>
          </div>



          <div className="flex items-center gap-2">
            {!authUser && (
              <div className="flex items-center gap-2">
                <Link
                  to={"user/login"}
                  className={`
              btn btn-sm gap-2 transition-colors
              
              `}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden text-sm sm:inline">Login</span>
                </Link>
                <Link
                  to={"user/signup"}
                  className={`
              btn btn-sm gap-2 transition-colors
              
              `}
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden text-sm sm:inline">Sign up</span>
                </Link>
              </div>
            )}
            <Link
              to={"user/profile/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden text-sm sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/user/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden text-sm sm:inline">Profile</span>
                </Link>

                <button
                  className="flex gap-2 cursor-pointer items-center"
                  onClick={() => {
                    logout(navigate);
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden text-sm font-semibold sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
