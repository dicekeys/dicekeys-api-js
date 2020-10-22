import * as fs from "fs";
import {generateKotlinApi} from "./generate-kotlin"
for (const dirName of [
  "./cross-compiling-out",
]) {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
}

generateKotlinApi();
