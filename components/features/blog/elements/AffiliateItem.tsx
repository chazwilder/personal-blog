import AffiliateItemText from "@/components/features/blog/elements/AffiliateItemText";
import AffiliateItemLink from "@/components/features/blog/elements/AffiliateItemLink";

const AffiliateItem = ({ text, link }: { text: string; link: string }) => {
  return (
    <div className="w-full flex flex-row">
      <AffiliateItemLink link={link}>
        <AffiliateItemText text={text} />
      </AffiliateItemLink>
    </div>
  );
};
export default AffiliateItem;
