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
  const tag = issueNumberMatch ? issueNumberMatch[1] : "not found";
  const mailSubjectMatch = subject.match(/》(.+?)【/);
  const title = mailSubjectMatch ? mailSubjectMatch[1] : subject;
  const dateStringMatch = subject.match(/【(.+?)配信号】/);
  const dateString = dateStringMatch
    ? dateStringMatch[1]
        .replace(/年|月/g, "/")
        .replace(/日/, "")
        .replace(/\//g, "-")
    : "";
  const date = formatDate(dateString);
  const contents = lines.slice(2);
  // console.log(text)
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

const formatDate = (dateString: string) => {
  if (dateString === "") {
    return "";
  }
  const date = new Date(dateString);
  // NOTE: If you do it in Japan time, the date will be off by one day, so you can add one day.
  //  I wanted to make good use of my time zone, but I didn't because I only plan to run it locally.
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};
