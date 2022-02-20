import "dotenv/config";

import { Sprinkler } from "./sprinkler";

async function main() {
  const sprinker = new Sprinkler();

  await sprinker.process();
}

(async () => {
  main();
})();
