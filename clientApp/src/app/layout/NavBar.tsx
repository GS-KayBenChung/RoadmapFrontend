import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import NavLinks from "./NavLinks";
import { useStore } from "../../store";


export default function NavBar() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { userStore } = useStore(); // Access userStore to get the user's information

    return (
        <nav className="bg-white px-6 py-2 shadow-md top-0 z-10 sticky">

            <div className="w-full flex items-center justify-between">

                <div className="flex items-center space-x-2">
                    <img src="/logoGoSaas.png" alt="GoSaas" className="h-12 w-24"/>
                    <h1 className="text-2xl font-bold pl-24"> {userStore.user?.name || "User"}</h1>
                </div>

                <div className="hidden md:flex items-center space-x-6">
                    <NavLinks/>
                </div>

                <div className="md:hidden flex items-center">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className="text-gray-700 hover:text-black focus:outline-none">
                        {isMenuOpen ? (
                            <span className="h-6 w-6 text-black">
                                <FiX />
                            </span>
                        ) : (
                            <span className="h-6 w-6 text-black">
                                <FiMenu />
                            </span>
                        )}
                    </button>
                </div>

                <div className={`absolute top-16 right-0 w-full bg-white shadow-md flex flex-col space-y-4 text-black px-6 py-4 md:hidden 
                    ${isMenuOpen ? "block" : "hidden"}`}>
                    <NavLinks/>
                </div>
            </div>
        </nav>
    );
}