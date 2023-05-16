import { NextRequest, NextResponse } from 'next/server';
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_KEY });
const databaseId = process.env.NOTION_DATABASE_ID || "";

async function addItem(text: string, staffNo: any, staffName: any): Promise<void> {
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


export async function GET(request: NextRequest) {
    const staffNo = request.nextUrl.searchParams.get('staffNo');
    const staffName = request.nextUrl.searchParams.get('staffName');
    console.log("staffNo", staffNo);
    console.log("staffName", staffName);
    addItem((new Date()).getTime().toString(), staffNo, staffName);
    return NextResponse.json({ name: "Hello World" });
}