import React from "react";
import Link from "next/link";

const AffiliateItemLink = ({
  link,
  children,
}: {
  link: string;
  children: React.ReactNode;
}) => {
  return (
    <Link href={link} className="text-main">
      {children}
    </Link>
  );
};
export default AffiliateItemLink;
