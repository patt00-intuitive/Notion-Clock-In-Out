import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import QRCode from 'qrcode';
import moment from 'moment';

const generate = async (qrData: any) => {
    return await QRCode.toDataURL(qrData);
}

export async function GET(request: NextRequest) {
    const staffNo = request.nextUrl.searchParams.get('staffNo');
    const staffName = request.nextUrl.searchParams.get('staffName');
    // Set the expiry time (1 minute from the current time)
    const expiryTime = moment().add(1, 'minute');

    const hostname = `${request.headers.get("referer")}`;
    console.log("hostname ", hostname);
    console.log("staffName ", staffName);
    // Generate the QR code with the staff number and expiry time as data
    const qrData = JSON.stringify({ url: `${hostname}api/vendor?staffNo=${staffNo}&staffName=${staffName}`, expiryTime });

    //console.log("qrData", qrData);

    //let result = "";
    // @ts-ignore
    const result = await generate(qrData);

    return NextResponse.json({ qrCode: result });
}
