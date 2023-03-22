import { Client } from "@notionhq/client";
import { Mail } from "./mail";

export const createDatabasePage = async (
  client: Client,
  databaseId: string,
  mail: Mail,
) => {
  return await client.pages.create({
    parent: {
      database_id: databaseId,
    },
    properties: {
      title: {
        title: [{ text: { content: mail.title } }],
      },
      date: {
        date: {
          start: mail.date,
        },
      },
      letter: {
        select: {
          name: mail.tag,
        },
      },
      status: {
        status: {
          name: "todo",
        },
      },
    },
  });
};

export const updatePage = async (
  client: Client,
  pageId: string,
  mail: Mail,
) => {
  const chunkedContents = chunk(mail.contents, 100);
  for (const chunkedContent of chunkedContents) {
    await client.blocks.children.append({
      block_id: pageId,
      children: chunkedContent.map((content) => {
        // NOTE: Function It's pretty long because it's a type error when you define it, but I'll write it here
        // NOTE: If you want to change the text format depending on the conditions when saving to notation, you can change the following:
        const regex = /(https?:\/\/[^\s]+)/g;
        if (content.startsWith("■")) {
          return {
            type: "heading_2",
            heading_2: {
              rich_text: [
                {
                  type: "text",
                  text: { content: content.slice(1).trim() },
                },
              ],
            },
          };
        } else if (content.match(regex)) {
          return {
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: { content: content, link: { url: content } },
                },
              ],
            },
          };
        } else {
          return {
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: { content: content },
                },
              ],
            },
          };
        }
      }),
    });
  }
};

const chunk = <T>(array: T[], size: number): T[][] => {
  const chunkedArray: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size));
  }

  return chunkedArray;
};
