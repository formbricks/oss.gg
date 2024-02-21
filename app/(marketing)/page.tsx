import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { GITHUB_APP_ACCESS_TOKEN } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

import Auto1 from "../../public/automations-1.webp";
import Auto2 from "../../public/automations-2.webp";
import Levels2 from "../../public/levels-2.webp";
import Levels1 from "../../public/levels.webp";
import MergeCeleb from "../../public/merge-celeb.webp";
import ProblemsSolved from "../../public/problems-solved.webp";
import Problems from "../../public/problems-with-contributions.webp";

async function getGitHubStars(): Promise<string | null> {
  try {
    const response = await fetch("https://api.github.com/repos/formbricks/oss.gg", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${GITHUB_APP_ACCESS_TOKEN}`,
      },
      next: {
        revalidate: 60,
      },
    });

    if (!response?.ok) {
      return null;
    }

    const json = await response.json();

    return parseInt(json["stargazers_count"]).toLocaleString();
  } catch (error) {
    return null;
  }
}

export default async function IndexPage() {
  const stars = await getGitHubStars();

  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Gamified Open Source Contributions
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            More quality community contributions with less work. Join the fun!
          </p>
          <div className="space-x-4">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              GitHub
            </Link>
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto flex max-w-4xl space-x-2 rounded-t-lg bg-slate-200 px-6 py-3">
          <div className="h-4 w-4 rounded-full bg-white"></div>
          <div className="h-4 w-4 rounded-full bg-white"></div>
          <div className="h-4 w-4 rounded-full bg-white"></div>
        </div>
        <div className="mx-auto max-w-4xl rounded-b-lg bg-slate-50 p-12 text-slate-800">
          <h2 className="mb-4 text-3xl font-medium">
            What&apos;s oss.gg, why we need it and how you can become a part of it 🕹️
          </h2>
          <p className="pb-3">
            <i>
              The concept of oss.gg emerged from a common challenge faced by many open source founders and
              maintainers: the struggle to balance community contributions while fully focusing on developing
              the core product. In this write-up, we&apos;ll walk you through the most common problems around
              community contributions, what has been tried to solve them, what worked well and how oss.gg
              tries to innovate in this space. Let&apos;s dive in!
            </i>
          </p>

          <p className="pb-3">
            Around 18 months ago, we released snoopForms - the Open Source Typeform alternative. Within days,
            we had people request features and offer contributions to make snoopForms better. While we loved
            the spirit, we quickly experienced the challenges that come along with running an open source
            community.
          </p>
          <p className="pb-3">
            Our experience isn&apos;t unique. As we are building Formnbricks, we got to know many more open
            source founders and all of them made a similar experience. These are 8 problems we all face, in
            some variation:
          </p>
          <Image src={Problems} alt="Problems" className="mb-6 mt-4 rounded-lg" />
          <p className="pb-3">
            This is a slide from a talk Johannes gave at the Open Core Summit in San Francisco:
          </p>

          <div className="relative mb-8 mt-4" style={{ paddingTop: "56.25%" }}>
            <iframe
              className="absolute inset-0 h-full w-full rounded-lg"
              src="https://www.youtube-nocookie.com/embed/uMkMS7x79Vk?si=SnYMqaZKRKPnCLaX&amp;start=35"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen></iframe>
          </div>

          <p className="pb-3">
            Before we dive in, let&apos;s have a look at what you can expect from the rest of this article:
          </p>
          <ol className="list-decimal p-4">
            <li>
              <Link
                className="underline underline-offset-4"
                href="#the-open-source-renaissance-and-what-it-did-to-communities">
                Open source communities have changed and need new tools
              </Link>
            </li>
            <li>
              <Link className="underline underline-offset-4" href="#the-problems">
                The problem(s) of open source communities
              </Link>
            </li>
            <li>
              <Link className="underline underline-offset-4" href="#what-has-been-tried-so-far">
                What&apos;s been tried (and what we&apos;ve learned)
              </Link>
            </li>
            <li>
              <Link className="underline underline-offset-4" href="#what-is-oss-gg">
                oss.gg - the concept
              </Link>
            </li>
            <li>
              <Link className="underline underline-offset-4" href="#oss-gg-the-tech">
                oss.gg - the tech
              </Link>
            </li>
            <li>
              <Link className="underline underline-offset-4" href="#status-quo">
                How can you become a part of it?
              </Link>
            </li>
          </ol>

          <h3 className="mb-4 mt-3 text-2xl font-medium" id="-what-s-the-purpose-of-this-blog-post-">
            What&apos;s the purpose of this blog post?
          </h3>
          <p className="pb-3">We want to catalyse the conversation. </p>
          <p className="pb-3">
            There is something in the air right now, lots of people work on different ideas to one or several
            of these problems. Most do it as a side project, which likely won&apos;t work out, because
            community stuff is hard. The idea is to bring everyone onto the same page so we can move forward
            with a joint understanding and build something that works together. So everything laid out in this
            article is up for discussion, it&apos;s supposed to get you involved 😉
          </p>
          <h3
            className="mb-4 mt-3 text-2xl font-medium"
            id="the-open-source-renaissance-and-what-it-did-to-communities">
            The Open Source Renaissance and what it did to communities
          </h3>
          <p className="pb-3">
            With the rise of hugely popular open source tools like Supabase, Appflowy, cal.com (and Formbricks
            obviously 😋) open source experiences something like a Renaissance. And it seems that this also
            has a significant impact on the composition of open source communities:
          </p>
          <p className="pb-3">
            Five years ago, open source contributions were mostly done by experienced engineers with domain
            expertise who wanted to bring a new technology to the world.
          </p>
          <p className="pb-3">
            Today, this cohort is outnumbered by young, aspiring engineers predominantly from India, Pakistan,
            Nigeria, Kenia and several other countries throughout Africa. They are mostly interested in
            working on a product with real users, learn new technologies, learn from more experienced product
            people and engineers and build a portfolio of contributions to land a job in tech.
          </p>
          <p className="pb-3">
            When the community changes, a new set of issues arises. These issues call for a new set of tools,
            one of which is oss.gg - but let&apos;s look at what we&apos;re solving first:
          </p>
          <h3 className="mb-4 mt-3 text-2xl font-medium" id="the-problems">
            The problem(s)
          </h3>
          <p className="pb-3">
            With a new set of community members contributing to open source, we see a new problems:
          </p>
          <ol className="list-decimal space-y-3 p-4">
            <li>
              <strong>Handholding required: </strong>
              Many of the engineers wanting to contribute have little experience in software engineering or
              web development. They ask a lot of questions, get stuck, need help. While maintainers are
              usually happy to help the first set of contributors, it quickly gets out of hand. We&apos;ve
              referred juniors to ChatGPT a lot, but some things need to be explained. While it&apos;s fun to
              teach, we have to make sure the efforts are not in vain because the contributor does not stick
              around.
            </li>
            <li>
              <strong>Seniors leaving: </strong>
              Every now and then, a more senior engineer gets excited by a project and contributes.
              That&apos;s obviously really cool and valuable. The issue? They usually don&apos;t stick around.
              While it&apos;s not an issue that a company with a commercialisation interest maintains a
              project (vs. a completely free and community-run project) these seniors make 1, 2, 3
              contributions and then ask themselves, why they are spending their evenings and weekends
              creating value which will be harvest by someone else. Curiosity and altruism only go so far. So
              why not pay them?{" "}
            </li>
            <li>
              <strong>Incentive dilemma: </strong>
              Incentives are a funny thing because they can shift the mental model for looking at something.
              There is lots of research proving that a financial incentive can lower the motivation for a
              specific task, because it takes the aspects of reciprocity and signalling out of the picture: If
              I receive money for it, I won&apos;t get a favour back nor can I tell myself I worked for the
              greater good and feel good about it. This, and the short-term thinking attached to doing the
              minimum to get the financial reward make it difficult to just hang a price tag to an issue and
              wait for someone to fix it properly. In most cases, it&apos;s a quick and dirty patch.
            </li>
            <li>
              <strong>Review overhead: </strong>
              Most tools of the Open Source Renaissance are maintained by small teams. These teams are busy
              shipping features requested by their design partners or large clients because after all, they
              are who keep the project alive. Reviewing community contributions generally and submitted by
              junior devs unfamiliar with the code base is verrry time-consuming. We have to minimize the
              effort reviews take to make the whole effort worthwhile.
            </li>
            <li>
              <strong>Manual recognition: </strong>
              People keep coming back when they feel recognized. It not only feels good to be appreciated for
              the time invested but is also an important signal, for both side: Contributors can showcase
              their work publicly (and share it) and projects show that their project is actively contributed
              to. Win win. The only issue? It&apos;s time-consuming to keep track, write content and find the
              social handles of contributors to tag them. This can be semi-automated.
            </li>
            <li>
              <strong>Hard to flex: </strong>
              Along with the projects effort to recognize contributors, these contributors have a hard time
              flexing with their contributions. There isn&apos;t really a good plaform to do that. Important
              contributions on GitHub profiles get lost in other activity. CVs are outdated. Contributors want
              a publicly accessible page where they can collect contributions like stickers.
            </li>
            <li>
              <strong>Assignment overhead &amp; redundant work: </strong>
              Keeping track of who works on which issue can get messy with an active community. We ran a
              hackathon with a Macbook prize and for every issue we released we had 5 people who wanted to
              work on it. First come, first assigned works well, until people claim issues and don&apos;t
              deliver. This can be solved by automating the enforcement of rules such as “If you don&apos;t
              open a draft PR within 48h, we will assign the issue to the next developer in line”.
            </li>
            <li>
              <strong>Unfinished PRs</strong>
              Along the lines of the previous problem: If contributors drop out, maintainers have to notice.
              To be able to do that we have to monitor all issues manually. It&apos;d be much easier if a
              GitHub app would do that for us.
            </li>
          </ol>
          <h2 className="mb-4 mt-6 text-3xl font-medium" id="what-has-been-tried-so-far">
            What has been tried so far
          </h2>
          <h3 className="mb-4 mt-3 text-2xl font-medium" id="the-formtribe-hackathon">
            The FormTribe hackathon
          </h3>
          <p className="pb-3">
            The idea of building a large-scale distributed learning game is already a couple of months old. In
            October, we (the <Link href="https://formbricks.com">Formbricks</Link> team) ran a month-long
            gamified hackathon. It was great fun and worked really well! We gained:
          </p>
          <ul className="list-disc space-y-1.5 p-4">
            <li>100 contributors 👩‍💻</li>
            <li>Shipped 12 relevant features</li>
            <li>2.000 GitHub stars ⭐</li>
            <li>500 new Twitter followers 🐓</li>
            <li>400 new Discord members 🤖</li>
            <li>5 engineers became core contributors 🤍</li>
            <li>YouTuber with 60k followers reported due to Hackathon</li>
          </ul>
          <p className="pb-3">
            <strong>What have we learned?</strong>
          </p>
          <p className="pb-3">Having so many developers pull on our repo led to a few great insights:</p>
          <ul className="list-disc space-y-1.5 p-4">
            <li>It crystallised our understanding of the problems in the space, as laid out above</li>
            <li>
              Points work (if they have a value). People really made sure to collect all points they earned
            </li>
            <li>Non-code contributions are picked up and appreciated</li>
            <li>Manual overhead was unsustainable</li>
            <li>There is enough excitement for it to be worth building a system</li>
          </ul>
          <h3 className="mb-4 mt-3 text-2xl font-medium" id="novu-s-hero-directory">
            Novu&apos;s Hero Directory
          </h3>
          <p className="pb-3">
            Novu built a pretty cool directory of their{" "}
            <Link href="https://novu.co/contributors/" target="_blank" className="underline">
              community heroes.
            </Link>
          </p>
          <p className="pb-3">
            Each contributor automatically gets a page with their contributions with data being pulled from
            the GitHub API. People really appreciate that, both contributors and other OSS founders - well
            done 😎
          </p>
          <h3 className="mb-4 mt-3 text-2xl font-medium" id="algora-s-bounty-system">
            Algora&apos;s Bounty System
          </h3>
          <p className="pb-3">
            The Algora team did a great job building a well-functioning GitHub app as well as attracting a
            community of bounty-hungry contributors. However, tying back to what I wrote above about
            incentives, I don&apos;t think it solve the right problem. In our experience (and what I&apos;ve
            heard from other projects) it&apos;s not hard to find people who want to contribute. It&apos;s
            much harder to handle the contributions and keep people familiar with the code base engaged over
            longer periods of time. To some extent, bounties make the situation worse by sending engineers our
            way who are only looking for a quick buck. They tend to be more spammy and push for a quick review
            of their half-baked code. This might sound harsh but it has been exactly our experience.
          </p>
          <p className="pb-3">
            We strongly believe in bounties and they are an essential element of oss.gg but they have to be
            wrapped in a bigger picture (see below).
          </p>
          <p className="pb-3">
            <strong>Please note:</strong> I&apos;m fully aware that many projects are happy with Algora and
            their success justifies their approach :)
          </p>
          <h2 className="mb-4 mt-6 text-3xl font-medium" id="what-is-oss-gg">
            What is oss.gg?
          </h2>
          <p className="pb-3">
            So far we looked at the problems and what has been tried to solve some of them. Let&apos;s now
            have a closer look at how we imagine oss.gg solve for all of the problems above.
          </p>
          <h2 className="mb-4 mt-6 text-2xl font-medium" id="-oss-gg-http-oss-gg-the-concept">
            oss.gg - the concept
          </h2>
          <p className="pb-3">
            To address all of the issues above, we leverage two things:{" "}
            <strong>Levels and Automations.</strong>
          </p>
          <h4 className="mb-4 mt-3 text-xl font-medium" id="-levels-">
            Levels
          </h4>
          <p className="pb-3">
            Levels usually come with a set of abilities and limitations, which comes in really handy. Here are
            the levels we came up with at Formbricks, but each project will be able to come up with their own
            levels which align with their brand voice and ideas:
          </p>
          <Image src={Levels1} alt="Levels are fun" className="mb-6 mt-4 rounded-lg" />
          <p className="pb-3">
            The beauty of levels is that they make it very easy to communicate and understand who is allowed
            to do what. Here is an overview:
          </p>
          <Image src={Levels2} alt="so much fun" className="mb-6 mt-4 rounded-lg" />
          <p className="pb-3">How does this help us? Let&apos;s look at the problems:</p>
          <ul className="list-disc space-y-1.5 p-4">
            <li>
              <strong>Handholding</strong>: By limiting who can get assigned to e.g. issues for end-to-end
              features, we limit the requests for handholding significantly. We know that every “Deploy
              Deputy” already went through a set of DevRel related tasks so is somewhat familiar with the code
              base and tech stack. Secondly, we can filter out a lot of the “I can quickly ship this”
              engineers. Additionally, we as a team don&apos;t have to help dozens of engineers set up their
              development environment by limiting support to GitPod when contributors are getting started.
            </li>
            <li>
              <strong>Seniors leaving + incentive dilemma:</strong> Earning the right to be paid for
              contributions has a lot of positive side effects. We exclude the “quick-buck-engineers” and
              reward sticking around our community. Everyone in the Pushmaster Prime level has merged several
              PRs in our repo so we know they are familiar with the code style and capable. This allows us to
              pay out high bounties without having to fear a lot of spam in out repo and Discord.
            </li>
          </ul>
          <p className="pb-3">
            These are only a handful of very basic ideas of what you can do with levels. Super excited to see
            what other projects will invent and implement 🤓
          </p>
          <Image src={ProblemsSolved} alt="Problems" className="mb-6 mt-4 rounded-lg" />
          <h4 className="mb-4 mt-3 text-xl font-medium" id="leveling-up-merch-and-moments-of-celebration">
            Leveling up, merch and moments of celebration
          </h4>
          <p className="pb-3">
            A core aspect of building a community people love is sharing moments of celebration with others.
            As an aspiring open source contributor, there are a few moments we want to celebrate together: The
            first PR getting merged, the first bounty earned, etc.
          </p>
          <p className="pb-3">
            Secondly, handling merch is kinda annoying: You have to determine who gets merch, when and why. We
            decided to just tie it to leveling up, so that we can semi-automate it. If a user levels up, we
            check if their address is added and if not, we ask them to update it. Once this is done, we can
            order their merch (or even automate that as well).
          </p>
          <h4 className="mb-4 mt-3 text-xl font-medium" id="automations">
            Automations
          </h4>
          <p className="pb-3">
            The second big advantage of oss.gg is that you can automate many of the tedious tasks - while
            making sure that the personal touch is not getting lost. The key here is to strike the right
            balance.
          </p>
          <p className="pb-3">
            Here is an example for what happens when a new issue is released which is flagged as a community
            issue:
          </p>
          <Image src={Auto1} alt="Automations 2" className="mb-6 mt-4 rounded-lg" />
          <Image src={Auto2} alt="Automations" className="mb-6 mt-4 rounded-lg" />
          <p className="pb-3">
            As you can see, most of the overhead is automated away. We go from Issue → Review without anyone
            in our team having to touch the issue on GitHub. Especially when the number of issues grows, this
            will come in super handy.
          </p>
          <p className="pb-3">Here is another one:</p>
          <Image src={MergeCeleb} alt="Automations" className="mb-6 mt-4 rounded-lg" />
          <p className="pb-3">
            The <strong>Merge Celebration Flow.</strong> It nicely shows how the community management side can
            get automated without losing the personal touch.
          </p>
          <p className="pb-3">You get the idea!</p>
          <h2 className="mb-4 mt-6 text-3xl font-medium" id="oss-gg-tech">
            oss.gg - the tech
          </h2>
          <p className="pb-3">
            Now that we have an understanding of what we want to build and why, let&apos;s talk about the how.
            oss.gg consists of 5 different parts:
          </p>
          <ol className="list-decimal p-4">
            <li>A web app +</li>
            <li>An API +</li>
            <li>A GitHub app +</li>
            <li>A bounty system +</li>
            <li>An automations interface</li>
          </ol>
          <p className="pb-3">Let&apos;s go through them one by one:</p>
          <h3 className="mb-4 mt-3 text-xl font-medium" id="1-a-web-app-">
            1. A Web App
          </h3>
          <p className="pb-3">
            The heart of oss.gg is a web app. Both contributors and projects can sign up to preform a set of
            actions. Here is a preliminary overview of what people can do with the web app:
          </p>
          <p className="pb-3">
            <strong>Contributors</strong>
          </p>
          <ul className="list-disc space-y-1.5 p-4">
            <li>Sign up</li>
            <li>Add their social handles (to be tagged in shoutouts)</li>
            <li>Add their address (to receive merch)</li>
            <li>View a feed of issues they can work on</li>
            <li>Manage notification settings (alerts for issues they are eligible to work on)</li>
          </ul>
          <p className="pb-3">
            <strong>Projects</strong>
          </p>
          <ul className="list-disc space-y-1.5 p-4">
            <li>Manage API keys</li>
            <li>Manage rights for different levels contributors can reach</li>
          </ul>
          <h3 className="mb-4 mt-3 text-xl font-medium" id="2-an-api-">
            2. An API
          </h3>
          <p className="pb-3">
            The API provides all oss.gg related info so that the projects can display them on their community
            pages. Think of it as an enrichment layer over the GitHub API. It serves:
          </p>
          <ul className="list-disc space-y-1.5 p-4">
            <li>Points per contributor</li>
            <li>Contributor Level</li>
            <li>Contributor Rank</li>
            <li>Contributor social handles and addresses to build automations</li>
          </ul>
          <h3 className="mb-4 mt-3 text-xl font-medium" id="3-a-github-app-">
            3. A GitHub App
          </h3>
          <p className="pb-3">
            The GitHub app takes over many of the tasks which currently require manual work. It makes the
            following things easy:
          </p>
          <ul className="list-disc space-y-1.5 p-4">
            <li>
              Assign first contributor to issue, if eligible (has enough points / level required for this
              issue)
            </li>
            <li>Unassign and reassign if contributor doesn&apos;t ship</li>
            <li>Follows up with dormant PRs</li>
            <li>Makes awarding points easy “/award 500 points”</li>
            <li>Makes tipping easy “/tip 10$”</li>
            <li>Create new bounty “/bounty $50”</li>
          </ul>
          <h3 className="mb-4 mt-3 text-xl font-medium" id="4-a-bounty-system-">
            4. A Bounty System
          </h3>
          <p className="pb-3">
            Shoutout to Bailey who built a low-fee bounty system for the OSSHack in NYC. It&apos;s a very
            convenient and inexpensive way to pay out bounties worldwide. We&apos;ll leverage that for anyone
            who wants to open a bounty for an issue.
          </p>
          <h3 className="mb-4 mt-3 text-xl font-medium" id="5-an-automations-interface-later-on-">
            5. An Automations Interface (later on)
          </h3>
          <p className="pb-3">
            Create automations based on triggers like “Contributor reaches new Level” or “Contributor reaches
            X points” or “First contribution” etc. These automations help us provide a personalized community
            experience at scale, because we can e.g. create a new Linear ticket for the Marketing team
            containing all info needed to write a tweet and send a personal message to the contributor within
            60 seconds.
          </p>
          <h3 className="mb-4 mt-3 text-2xl font-medium" id="the-oss-gg-http-oss-gg-stack">
            The oss.gg stack
          </h3>
          <ul className="list-disc space-y-1.5 p-4">
            <li>Next.js (React) + Typescript</li>
            <li>
              TailwindCss + <Link href="http://ui.shadcn.com">ui.shadcn.com</Link>
            </li>
            <li>PostgreSQL + Prisma</li>
            <li>Unkey? Anything to make building APIs easy?</li>
            <li>
              <Link href="http://trigger.dev">trigger.dev</Link> for automations
            </li>
          </ul>
          <h2 className="mb-4 mt-6 text-3xl font-medium" id="status-quo">
            What is the status quo?
          </h2>
          <p className="pb-3">
            We&apos;ve shipped the core for this launch so that we as a community can pick up the fun stuff
            right away. Here is a broad plan forward:
          </p>
          <p className="pb-3">
            <strong>Phase 1:</strong> To keep iteration cycles short, we limit the number of projects who can
            participate to 2. This allows us to build a solution which is somewhat generalizable (vs.
            Formbricks-specific). And less people involved = faster shipping speed! Once we have figured what
            works well we move to Phase 2.
          </p>
          <p className="pb-3">
            <strong>Phase 2:</strong> We open oss.gg up to a total of 5 select projects. These projects commit
            to work closely with the community by providing sufficient open issues for the community members
            to work on.
          </p>
          <p className="pb-3">
            <strong>Phase 3:</strong> Opening up to more and more projects. When and how will be determined in
            the future.
          </p>
          <h3 className="mb-4 mt-3 text-2xl font-medium" id="call-for-contributions-">
            Call for Contributions!
          </h3>
          <p className="pb-3">
            <strong>Interested</strong>? Sign up on our waitlist to stay in the loop
          </p>
          <p className="pb-3">
            <strong>Have something to share?</strong>{" "}
            <Link href="https://cal.com/johannes/30">Schedule a call</Link> with me to share your experiences
            and ideas to make oss.gg better!
          </p>
          <p className="pb-3">
            <strong>Wanna help build?</strong> Join the oss.gg Discord!
          </p>
        </div>
      </section>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-24">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h2 className="font-heading mb-3 text-3xl sm:text-4xl md:text-5xl lg:text-7xl">🕹️</h2>
          <div>
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Let&apos;s play
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
