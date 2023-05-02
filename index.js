import { Application } from "https://deno.land/x/oak/mod.ts";
import { getPets } from "./pets.js";

const app = new Application();

app.use(async (ctx) => {
  const date = new Date();
  let res = `Generated at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} \nPet Name | Tier | Profit/Exp | Profit | Starting Bid\n`;
  const sorted = (await getPets()).slice(0);
  sorted.sort(function (a, b) {
    return a.profitPerExp - b.profitPerExp;
  });
  for (let i = sorted.length - 1; i >= 0; i--) {
    res +=
      sorted[i].item_name +
      " | " +
      sorted[i].tier.toLowerCase() +
      " | " +
      Math.round(sorted[i].profitPerExp * 100) / 100 +
      " | " +
      Math.round((sorted[i].profit / 1000000) * 100) / 100 +
      "m | " +
      Math.round((sorted[i].starting_bid / 1000000) * 100) / 100 +
      "m\n";
  }
  ctx.response.body = res;
});

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
