import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV_LINK } from "../constants";

const NavBar = () => {
  return (
    <div className="w-full h-32 border-b border-gray-300 items-center flex flex-row bg-white z-50">
      <div className="w-2/3 mx-auto items-center flex flex-row">
        <div className="flex flex-row p-4">
          <Link href="/">
            <Image src="/logo.png" width="250" height="100" alt="logo" />
          </Link>
        </div>
        <div className="ml-auto items-center flex flex-row"></div>
        <div className="flex flex-row">
          {NAV_LINK.map((link, idx) => (
            <div key={idx} className="flex  p-2">
              <Link href={link.href} key={idx}>
                {link.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default NavBar;
