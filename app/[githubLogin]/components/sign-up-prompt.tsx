import { Button } from "@/components/ui/button";
import Rick from "@/public/rick.webp";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";

interface SignUpPromptProps {
  githubLogin: string;
}

const SignUpPrompt: React.FC<SignUpPromptProps> = ({ githubLogin }) => {
  return (
    <div>
      <div className="z-40 -mt-24 grid grid-cols-5 gap-6 text-zinc-50 md:-mt-36">
        <Image
          src={Rick}
          alt="Rick Astley"
          width={180}
          height={180}
          className="z-50 col-span-2 rounded-md md:col-span-1"
          priority
        />
        <div className="col-span-3 flex items-center space-x-6 md:col-span-4">
          <div>
            <h1 className="text-3xl font-bold">Rick Astley</h1>
            <p className="mt-1 text-xs">Never gonna give you up</p>
          </div>
        </div>
      </div>
      <div className="relative col-span-4 mb-12 mt-10">
        <div className="absolute z-20 flex h-full w-full flex-col items-center justify-center">
          <h2 className="mb-6 text-xl font-semibold md:-mt-24 md:text-3xl">
            Unlock your profile, it&apos;s free 😏
          </h2>
          <Button href="/login">
            Sign up with GitHub
            <FaGithub className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <div className="blur-lg">DUMMY CONTENT</div>
      </div>
    </div>
  );
};

export default SignUpPrompt;
