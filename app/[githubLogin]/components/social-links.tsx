import Link from "next/link";
import { FaGithub, FaTwitter } from "react-icons/fa";

interface SocialLinksProps {
  twitterUsername?: string;
  githubUrl: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ twitterUsername, githubUrl }) => {
  return (
    <>
      {twitterUsername && <SocialLink href={`https://twitter.com/${twitterUsername}`} Icon={FaTwitter} />}
      <SocialLink href={githubUrl} Icon={FaGithub} />
    </>
  );
};

interface SocialLinkProps {
  href: string;
  Icon: React.ElementType;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, Icon }) => (
  <Link href={href} target="_blank" className="hidden md:block">
    <Icon className="h-8 w-8 transition-all duration-150 ease-in-out hover:scale-110" strokeWidth="1px" />
  </Link>
);

export default SocialLinks;
