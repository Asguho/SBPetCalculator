import * as constants from "./constants.js";

async function getActions() {
  try {
    return (await (await fetch("https://api.slothpixel.me/api/skyblock/auctions?bin=true")).json()).auctions;
  } catch (error) {
    console.error("error:" + error);
  }
}

async function getPrices() {
  try {
    return await (await fetch("https://raw.githubusercontent.com/SkyHelperBot/Prices/main/prices.json")).json();
  } catch (error) {
    console.error("error:" + error);
  }
}

export async function getPets() {
  const actions = await getActions();
  const prices = await getPrices();
  const pets = [];
  for (const action of actions) {
    if (action.item?.attributes?.id == "PET") {
      action.maxLevel = constants.PET_DATA[action.item_name.split(" ")[2].toUpperCase()]?.maxLevel;
      action.maxPrice =
        prices[
          "lvl_" +
            action.maxLevel +
            "_" +
            action.tier.toLowerCase() +
            "_" +
            action.item_name.split(" ")[2].toLowerCase()
        ];
      action.lvl = action.item_name.split(" ")[1].slice(0, -1);
      action.ExpToMaxLvl = getExpToMaxLvl(action.lvl, action.tier.toLowerCase(), action.maxLevel);
      action.profit = action.maxPrice - action.starting_bid;
      action.profitPerExp = action.profit / action.ExpToMaxLvl;
      if (
        action.profitPerExp > 0 &&
        action.profit > 0 &&
        action.ExpToMaxLvl > 0 &&
        !hasUsedPetCandy(action.item.lore)
      ) {
        pets.push(action);
      }
    }
  }
  return pets;
}

function getExpToMaxLvl(level, offsetRarity, maxLevel) {
  const rarityOffset = constants.PET_RARITY_OFFSET[offsetRarity];
  const levels = constants.PET_LEVELS.slice(rarityOffset, rarityOffset + maxLevel - 1);
  const xpMaxLevel = levels.reduce((a, b) => a + b, 0);
  let petExp = 0;

  for (let i = 0; i < level - 1; i++) {
    petExp += levels[i];
  }

  return xpMaxLevel - petExp;
}

function hasUsedPetCandy(array) {
  for (const item of array) {
    if (item.includes("Pet Candy Used")) {
      return true;
    }
  }
  return false;
}
