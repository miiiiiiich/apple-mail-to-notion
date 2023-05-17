import * as fs from "fs";
import { exec } from "child_process";
import path from "path";

export interface Mail {
  title: string;
  tag: string;
  date: string;
  contents: string[];
}

export const textFileToMail = (filePath: string): Mail => {
  const text = fs.readFileSync(filePath, "utf-8");
  const lines = text.split("\n");
  const subject = lines[0].replace("Subject: ", "");
  const issueNumberMatch = subject.match(/《(.+?)通目》/);
  const tag = issueNumberMatch ? issueNumberMatch[1].replace(" ", "") : "extra";
  const mailSubjectMatch = cleanTitle(subject);
  const title = mailSubjectMatch ? mailSubjectMatch : subject;
  const dateString = lines[1].replace("Date: ", "");
  const date = formatDate(dateString);
  const contents = lines.slice(3);
  return { title, tag, date, contents };
};

export const executeAppleScript = async (
  senderInfo: string,
  savePath: string,
) => {
  fs.mkdirSync(savePath, { recursive: true });
  return new Promise((resolve, reject) => {
    const command = `osascript mail.scpt "${savePath}" "${senderInfo}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
};

export const getFilePaths = (dir: string): string[] => {
  const fileNames = fs.readdirSync(dir);
  return fileNames
    .filter((fileName) => path.extname(fileName) === ".txt")
    .map((fileName) => path.join(dir, fileName));
};

function cleanTitle(input: string): string {
  // 「【】」や「《》」内の文字を削除
  return input
    .replace(/【.*?】/g, "")
    .replace(/《.*?》/g, "")
    .trim();
}

export const deleteTxtFiles = async (dirPath: string) => {
  const fileNames = await fs.promises.readdir(dirPath);
  const txtFileNames = fileNames.filter(
    (fileName) => path.extname(fileName) === ".txt",
  );
  const deletePromises = txtFileNames.map((fileName) =>
    fs.promises.unlink(path.join(dirPath, fileName)),
  );
  await Promise.all(deletePromises);
};

const formatDate = (datetimeString: string) => {
  const japDateString = datetimeString.split(" ")[0];
  const dateString = japDateString
    .replace(/年|月/g, "/")
    .replace(/日/, "")
    .replace(/\//g, "-");
  const date = new Date(dateString);
  // NOTE: If you do it in Japan time, the date will be off by one day, so you can add one day.
  //  I wanted to make good use of my time zone, but I didn't because I only plan to run it locally.
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};
