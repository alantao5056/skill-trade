import { getSkills, getUser } from "./utils";

async function main() {
  const user = await getUser("uid1");
  console.log(user);
}

main();