import { AFFILIATE_LINKS } from "@/constants";
import AffiliateItem from "@/components/features/blog/elements/AffiliateItem";

const AffiliateItems = () => {
  return (
    <div className="bg-slate/10 bg-opacity-25 backdrop-blur-sm rounded-lg border border-white/20 p-4 w-full min-h-32 my-8 flex flex-col space-y-4">
      <div className="text-white text-2xl">Blog Goodie Bag</div>
      {AFFILIATE_LINKS.map((link, index) => (
        <div key={index} className="unordered">
          <AffiliateItem key={index} text={link.text} link={link.link} />
        </div>
      ))}
    </div>
  );
};
export default AffiliateItems;
