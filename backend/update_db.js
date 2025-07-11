/**
 * This script populates our database from the data stored locally in various
 * ways.
 * I've stored the different hairstyle-name to face-shape mapping is stored
 * in a JSON file (./stylesheet/shape_hairstyle_map.json) in stylesheet
 * directory. The hairstyles are stored in inventory folder holds all images
 * in corresponding hairstyle-named folders.
 *
 * There are two collections in mongodb database.
 *  1. hairstyles : contains hairstyles from inventory
 *  2. stylesheet : contains informations related to shapes including hairstyles.
 *
 * This script will delete the contents of these two collections and rebuild
 * it from local machine, and update it to the database.
 *
 * USAGE: node update_db.js <stylesheet | hairstyles>
 *
 * updates corresponding collections. Stylesheet cannot be updated if hairstyles
 * collection isn't present in the db, since the list of hairstyle in each shape
 * refer to the objectId of hairstyle in hairstyles collection.
 *
 */

import fs from "fs";
import * as database from "./connect.js";

await database.connectToDb();
const db = database.getDb();

const Root = "./stylesheet";
const ShapeDesc = {
  oval: "You’ve got an oval shaped face, congratulations; you’ve hit the genetic jackpot of head shapes. Seriously, it’s the Swiss Army knife of face shapes, which means the world of grooming is your oyster.",
  round:
    "You've got a round shaped face, the key to choosing a flattering hairstyle for round face is to create the illusion of length and angles. This can be achieved by adding height on top and keeping the sides shorter and more streamlined. Avoid hairstyles that add width to the sides or create a fringe that falls across the forehead.",
  oblong:
    "You've got an oblong shaped face. Choose hairstyles that minimize the length and add width to the face. Avoid hairstyles that add height or make the face appear narrower. Focus on styles that create a more balanced and oval-like appearance.",
  triangle:
    "You've got a triangle shaped face. For men with a triangle face shape, the goal is to balance the wider jawline by adding volume and width to the forehead and crown area while minimizing volume on the sides and jawline. Popular choices include styles with volume on top like quiffs or pompadours, and longer styles with side parts.",
  square:
    "You've got a square shaped face. For men with square faces, the goal is often to soften the strong jawline while maintaining a masculine look. Hairstyles that add height and volume on top, with shorter, tapered sides, are generally a good choice.",
  diamond:
    "You've got a diamond shaped face. For men with diamond-shaped faces, the goal is to soften the angles and create more balance by adding width to the forehead and chin, while minimizing the prominence of the cheekbones. Longer hairstyles with layers, side-swept bangs, or textured tops are good options. Avoid styles that emphasize the cheekbones, like very short sides or slicked-back styles with little volume.",
  heart:
    "You've got a heart shaped face. For a heart-shaped face, hairstyles that add width to the jawline and soften the forehead are ideal. Men with heart-shaped faces can consider styles like textured crops with side bangs, or longer styles with loose waves and a side part to balance the wider forehead and narrower chin.",
};

// lists the contents of specified path except for . and ..
// (readdirSync method won't return . and ..)
function listDirectory(path) {
  try {
    return fs.readdirSync(path);
  } catch (err) {
    console.error(`error reading  dir ${path}: ${err}`);
    process.exit(1);
  }
}

// returns the files in given dirPath as a base64 string array.
function readFilesAsBase64(dirPath) {
  try {
    const files = new Array();
    for (let file of listDirectory(dirPath)) {
      files.push(fs.readFileSync(`${dirPath}/${file}`).toString("base64"));
    }
    return files;
  } catch (err) {
    console.error(`error reading  file ${dirPath}: ${err}`);
    process.exit(1);
  }
}

// writes data to specified collection after erasing all its contents.
async function writeToDb(data, collectionName) {
  try {
    await db.collection(collectionName).deleteMany({});
    console.log(`writing ${collectionName} collection to database...`);
    await db.collection(collectionName).insertMany(data);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

// this function will fetch the image ids from hairstyles collection
// and replace the image names in the stylesheet with the corresponding ids
// it's like a foreign key relationship between hairstyles and stylesheet collections
async function fetchImageIdsFromImagesCollectionAsync(images) {
  for (let i = 0; i < images.length; i++) {
    const obj = await db
      .collection("hairstyles")
      .findOne({ name: images[i] }, { projection: { _id: 1 } });
    if (obj) {
      images[i] = obj._id;
    } else {
      throw new Error(`Update hairstyles collection first, image ${images[i]} not found.`);
    }
  }
}

// reads the json file, replace hairstyles with corresponding objectId's from hairstyles
// collection and insert shape descriptions.
async function generateStylesheetAsync() {
  const styleSheet = JSON.parse(fs.readFileSync(`${Root}/shape_hairstyle_map.json`));
  if (styleSheet) {
    for (let faceShape of styleSheet) {
      faceShape.description = ShapeDesc[faceShape.shape];
    }
    for (let i = 0; i < styleSheet.length; i++) {
      await fetchImageIdsFromImagesCollectionAsync(styleSheet[i].hairstyles);
      console.log(`fetched image ids for stylesheet ${i + 1}/${styleSheet.length}`);
    }
    return styleSheet;
  } else {
    throw new Error("failed to read local json document");
  }
}

/**
 * this function reads the file structure of inventory folder,
 * assign folder name to { name:  } and images in it to images:
 * @returns [
 *  {
 *    name: string,
 *    images: string[],       // contains base64 encoded image files.
 *  }
 * ]
 */
function generateHairstyles() {
  const HairStyles = new Array();
  const inventory = `${Root}/inventory`;
  for (let hairStyle of listDirectory(inventory)) {
    HairStyles.push({
      name: hairStyle,
      images: readFilesAsBase64(`${inventory}/${hairStyle}`),
    });
  }
  return HairStyles;
}

// this block handles cli arguments of this small tool
if (process.argv.length === 3 && process.argv.includes("stylesheet")) {
  await writeToDb(await generateStylesheetAsync(), "stylesheet");
} else if (process.argv.length === 3 && process.argv.includes("hairstyles")) {
  await writeToDb(generateHairstyles(), "hairstyles");
} else {
  console.log(
    "err: invalid or no input argument recieved.\nUSAGE: node update_db.js <stylesheet | hairstyles>"
  );
  await database.closeDb();
  process.exit(1);
}

console.log("Database update complete.");
await database.closeDb();
