import { NextRequest, NextResponse } from 'next/server';
import { Client } from "@notionhq/client";
import moment from 'moment';

const notion = new Client({ auth: process.env.NOTION_KEY });
const databaseId = process.env.NOTION_DATABASE_ID || "";

async function getAllTimeStamp(staffNo: string, staffName: string) {
    let allTimestamps: any = [];
    //current Date
    const filter = {
        "and": [
            {
                "property": "Staff No",
                "rich_text": {
                    "contains": staffNo
                }
            },
            {
                "property": "Staff Name",
                "rich_text": {
                    "contains": staffName
                }
            },
            {
                "property": "Entry Time",
                "date": {
                    "equals": moment().format("YYYY-MM-DD")
                }
            }
        ]
    };

    console.log("filter = ", filter);

    const response = await notion.databases.query({
        database_id: databaseId,
        filter: filter
    });

    if (response) {
        response.results.forEach((r: any) => {
            if (r.properties["Entry Time"])
                allTimestamps.push(new Date(r.properties["Entry Time"]["created_time"]));
        })
    }

    return allTimestamps;
}

async function addItem(text: string, staffNo: any, staffName: any) {
    try {
        const allTimeStamps = await getAllTimeStamp(staffNo, staffName);
        const currentTimeStamps = moment().format("YYYY-MM-DD HH:mm:ss");

        let hoursSpent: number = 0;

        if (allTimeStamps.length > 0) {
            const latestTimeStamps = new Date(Math.max.apply(null, allTimeStamps.map(function (datetime: any) {
                return datetime.getTime();
            })));
            hoursSpent = moment(currentTimeStamps).diff(latestTimeStamps, 'hours', true);
            hoursSpent = parseFloat(hoursSpent.toFixed(1));
        }


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
                },
                "Date": {
                    "type": "date",
                    "date": { "start": moment(currentTimeStamps).format("YYYY-MM-DD") }
                },
                "Time": {
                    type: "rich_text",
                    rich_text: [
                        {
                            type: "text",
                            text: {
                                content: moment(currentTimeStamps).format("HH:mm")
                            }
                        }
                    ]
                },
                "Hours Spent": {
                    "type": "number",
                    "number": hoursSpent
                }
            }
        });

        console.log(response);
        console.log("Success! Entry added.");

        return response;
    } catch (error: any) {
        console.error(error.body);

        return null;
    }
}


export async function GET(request: NextRequest) {
    const staffNo = request.nextUrl.searchParams.get('staffNo');
    const staffName = request.nextUrl.searchParams.get('staffName');
    console.log("staffNo", staffNo);
    console.log("staffName", staffName);

    const hostname = `https://${request.headers.get("host")}`;
    //console.log(request.headers);
    //console.log("hostname ", hostname);
    //console.log("hostname", new URL('/', `https://${hostname}`));
    const result = await addItem((new Date()).getTime().toString(), staffNo, staffName);
    //return NextResponse.json({ result: '' });
    return NextResponse.redirect(new URL(result ? '/?success=1' : '/', hostname));
}