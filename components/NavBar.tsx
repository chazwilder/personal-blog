import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV_LINK } from "../constants";

const NavBar = () => {
  return (
    <div className="w-full h-32 border-b-2 border-black items-center flex flex-row">
      <div className="w-2/3 mx-auto items-center flex flex-row">
        <div className="flex flex-row p-4">
          <Image src="/logo.png" width="250" height="100" alt="logo" />
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
