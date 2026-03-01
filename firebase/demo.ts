import { getSkills } from "./utils";

async function main() {
  const skills = await getSkills();
  console.log(skills);
}

main();