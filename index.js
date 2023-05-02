import { Application } from "https://deno.land/x/oak/mod.ts";
import { getPets } from "./pets.js";

const app = new Application();

app.use((ctx) => {
  let res = "";
  getPets().then((pets) => {
    var sorted = pets.slice(0);
    sorted.sort(function (a, b) {
      return a.profitPerExp - b.profitPerExp;
    });
    for (var i = sorted.length - 1; i >= 0; i--) {
      res += sorted[i].item_name + " | " + sorted[i].tier.toLowerCase() + " | " + sorted[i].profitPerExp + "\n";
    }
  });
  ctx.response.body = res;
});

await app.listen({ port: 8000 });
