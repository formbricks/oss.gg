import Image from "next/image";
import Link from "next/link";

const members = [
  {
    name: "Doreen",
    role: "Community",
    twitterHandle: "@Blackmercii2",
    imageUrl: "https://pbs.twimg.com/profile_images/1741034690096541696/di1obaal_400x400.jpg",
  },
  {
    name: "Chigala",
    role: "Automations",
    twitterHandle: "@chigalakingsley",
    imageUrl: "https://pbs.twimg.com/profile_images/1529825256935788545/uhgCcFFz_400x400.jpg",
  },
  {
    name: "Blessing",
    role: "PM",
    twitterHandle: "@uxfoodie_",
    imageUrl: "https://pbs.twimg.com/profile_images/1728349073898340352/kC1syoNg_400x400.jpg",
  },
  {
    name: "Aryan",
    role: "Design",
    twitterHandle: "@aryanagarwal28",
    imageUrl: "https://pbs.twimg.com/profile_images/1339379000662056962/_5jcc_DU_400x400.jpg",
  },
];

export default function FoundingMembersPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center space-y-16 py-32 text-center">
      <section>
        <h1 className="font-heading mb-8 text-3xl sm:text-3xl md:text-4xl lg:text-5xl">Founding Members</h1>
        <p className="max-w-[42rem] text-center leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          We&apos;re a community of passionate designers, developers, and maintainers who make open source
          contributions better for everyone.
        </p>
      </section>
      <section>
        <div className="mt-16 grid grid-cols-4 gap-12">
          {members.map((member, index) => (
            <MemberCard key={index} {...member} />
          ))}
        </div>
      </section>
    </div>
  );
}

// write a component the returns a single card with an image, a name and a twitter handle we can use for each member

const MemberCard = ({ name, twitterHandle, imageUrl, role }) => {
  return (
    <Link
      className="flex flex-col items-center"
      target="_blank"
      href={`https://twitter.com/${twitterHandle}`}>
      <Image
        src={imageUrl}
        alt={name}
        width={250}
        height={250}
        className="rounded-full transition-all duration-200 ease-in-out hover:scale-105 hover:cursor-pointer "
      />
      <h2 className="mt-4 text-lg font-semibold">{name}</h2>
      <p>{role}</p>
    </Link>
  );
};
