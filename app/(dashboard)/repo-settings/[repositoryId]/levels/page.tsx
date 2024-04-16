import LevelsFormContainer from "@/components/level-form-container";
import { authOptions } from "@/lib/auth";
import { getLevels } from "@/lib/levels/service";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Level settings",
  description: "Set up levels for your repository.",
};

// const LevelDummyData: LevelsFormProps[] = [
//   {
//     levelName: "Level 1",
//     description: "Description for level 1",
//     iconUrl: "https://via.placeholder.com/150",
//     canHuntBounties: true,
//     canReportBugs: true,
//     limitIssues: true,
//     topics: [
//       {
//         id: "1",
//         text: "topic1",
//       },
//       {
//         id: "2",
//         text: "topic2",
//       },
//     ],
//     pointThreshold: 200,
//   },
//   {
//     levelName: "Level 2",
//     description: "Description for level 2",
//     iconUrl: "https://via.placeholder.com/150",
//     canHuntBounties: true,
//     canReportBugs: false,
//     limitIssues: false,
//     topics: [
//       {
//         id: "3",
//         text: "topic3",
//       },
//       {
//         id: "4",
//         text: "topic4",
//       },
//     ],
//     pointThreshold: 500,
//   },
//   {
//     levelName: "Level 3",
//     description: "Description for level 3",
//     iconUrl: "https://via.placeholder.com/150",
//     canHuntBounties: false,
//     canReportBugs: true,
//     limitIssues: true,
//     topics: [
//       {
//         id: "5",
//         text: "topic5",
//       },
//       {
//         id: "6",
//         text: "topic6",
//       },
//     ],
//     pointThreshold: 1000,
//   },
//   {
//     levelName: "Level 4",
//     description: "Description for level 4",
//     iconUrl: "https://via.placeholder.com/150",
//     canHuntBounties: true,
//     canReportBugs: true,
//     limitIssues: false,
//     topics: [
//       {
//         id: "7",
//         text: "topic7",
//       },
//       {
//         id: "8",
//         text: "topic8",
//       },
//     ],
//     pointThreshold: 2000,
//   },
//   {
//     levelName: "Level 5",
//     description: "Description for level 5",
//     iconUrl: "https://via.placeholder.com/150",
//     canHuntBounties: false,
//     canReportBugs: false,
//     limitIssues: true,
//     topics: [
//       {
//         id: "9",
//         text: "topic9",
//       },
//       {
//         id: "10",
//         text: "topic10",
//       },
//     ],
//     pointThreshold: 5000,
//   },
// ];

export default async function Levels({ params: { repositoryId } }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const levelsData = await getLevels(repositoryId);

  return (
    <>
      <LevelsFormContainer data={levelsData} />
    </>
  );
}
