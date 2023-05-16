import { NextRequest, NextResponse } from 'next/server';
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_KEY });

const readData = async (staffNo: string | null) => {
    const databaseId = process.env.NOTION_STAFF_DATABASE_ID;

    if (!staffNo) return null;  

    console.log("databaseId ", databaseId);

    const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
            "property": "Staff No",
            "rich_text": {
                "contains": staffNo
            }
        }
    });

    let staff = { "name": "", "no": "" }

    console.log("staffNo ", staffNo);
    console.log("HELLO");

    if (response.results && response.results.length == 1) {
        response.results.forEach((r: any) => {
            //console.log(r.properties);
            //console.log(r.properties["Staff Name"]?.rich_text[0].text.content);
            //console.log(r.properties["Staff No"]?.title[0].text.content);
            staff["name"] = r.properties["Staff Name"]?.rich_text[0].text.content;
            staff["no"] = r.properties["Staff No"]?.title[0].text.content;
        })
        return staff;
    } else {
        return null;
    }
};


export async function GET(request: NextRequest) {
    const staffNo = request.nextUrl.searchParams.get('staffNo');
    const staff = await readData(staffNo);
    return NextResponse.json({ staff: staff });
}