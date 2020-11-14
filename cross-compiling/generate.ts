import * as fs from "fs";
import {generateKotlinApi} from "./generate-kotlin"
import { generateSwiftApi } from "./generate-swift";
for (const dirName of [
  "./cross-compiling-out",
]) {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
}

generateKotlinApi();
generateSwiftApi();