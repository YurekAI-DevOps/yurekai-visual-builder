// tslint:disable:ordered-imports
import { spawn } from "@/wab/common";
import { appBackendMain } from "./app-backend-real";
import "dotenv/config";

console.log(process.env.NODE_MAILER_USER);
console.log(process.env.NODE_MAILER_FROM);
if (require.main === module) {
  spawn(appBackendMain());
}
