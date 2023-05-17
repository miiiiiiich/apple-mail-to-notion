import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import { createDatabasePage, updatePage } from "./func/notion";
import { deleteTxtFiles, executeAppleScript, getFilePaths, textFileToMail } from "./func/mail";

dotenv.config();

async function main() {
  const notion_token = process.env.NOTION_TOKEN;
  const notion_database_id = process.env.NOTION_DATABASE_ID;
  const sender = process.env.MAIL_MAGAZINE_SENDER;
  const savePath = process.env.MAIL_PATH;
  if (!sender || !savePath || !notion_token || !notion_database_id) {
    throw new Error("Please set environment variables");
  }
  await executeAppleScript(sender, savePath);
  const txtFiles = getFilePaths(savePath);
  const notion = new Client({
    auth: notion_token
  });
  for (const txtFile of txtFiles) {
    const mail = textFileToMail(txtFile);
    const createdPage = await createDatabasePage(
      notion,
      notion_database_id,
      mail,
    );
    await updatePage(notion, createdPage.id, mail);
  }
  // await deleteTxtFiles(savePath);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
