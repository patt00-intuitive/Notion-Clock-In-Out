import { NextResponse } from 'next/server';
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_KEY });
const databaseId = process.env.NOTION_DATABASE_ID || "";

async function addItem(text: string, staffNo: string, staffName: string): Promise<void> {
    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                title: {
                    title: [
                        {
                            text: {
                                content: text
                            }
                        }
                    ]
                },
                "Staff No": {
                    type: "rich_text",
                    rich_text: [
                        {
                            type: "text",
                            text: {
                                content: staffNo,
                                link: null
                            }
                        }
                    ]
                },
                "Staff Name": {
                    type: "rich_text",
                    rich_text: [
                        {
                            type: "text",
                            text: {
                                content: staffName,
                                link: null
                            }
                        }
                    ]
                }
            }
        });
        console.log(response);
        console.log("Success! Entry added.");
    } catch (error: any) {
        console.error(error.body);
    }
}


export async function GET(request: Request) {
    addItem((new Date()).getTime().toString(), "MB12233", "Jenie W")
    return NextResponse.json({ name: "Hello World" });
}