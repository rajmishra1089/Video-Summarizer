import React from "react";
import Logo from "../images/logo.png";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { loginWithRedirect , isAuthenticated ,logout  } = useAuth0();

  return (
    <div className="border-b-[3px] pl-3 pr-5 p-4 flex items-center gap-5 justify-between border-[#FF5733] ">
      <div className="flex items-center gap-2 md:gap-4">
        <img
          src={Logo}
          alt="logo"
          className="h-[40px] w-[40px] lg:h-[50px] lg:w-[50px] rounded-full  "
        />
        <h1 className="text-4xl lg:text-5xl font-bold text-[#FF5733] hidden md:block">
          
        </h1>
      </div>

      <div>
      
      {isAuthenticated?

        <div className="flex gap-4">
            <a
              href="#"
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="font-medium md:text-md lg:text-lg font-raleway text-[#15213c] p-3 rounded-md bg-[#FF5733] hover:shadow-md hover:shadow-[#3B5594]">
              LogOut
            </a>
            <Link to='/profile'>
              <button
                className="font-medium md:text-md lg:text-lg font-raleway text-[#15213c] p-3 rounded-md bg-[#FF5733] hover:shadow-md hover:shadow-[#3B5594]"
              >
                  Profile
              </button>
            </Link>
          </div>
        :
        <a
          href="#"
          onClick={() => loginWithRedirect()}
          className="font-medium md:text-md lg:text-lg font-raleway text-[#15213c] p-3 rounded-md bg-[#85B1CC] hover:shadow-md hover:shadow-[#3B5594]">
          Login
        </a>
      }

      </div>
    </div>
  );
}
