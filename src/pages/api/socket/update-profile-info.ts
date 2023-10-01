
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/lib/types";
import getCurrentProfilePages from "@/lib/get-current-profile.pages";
import { getChannelFromServer, getServerFromIdWithVerification } from "@/lib/servers";
import { db } from "@/lib/db";
import { MemberRole } from "@/lib/members";
import { FULL_SERVER_INCLUDES } from "@/lib/constants";
import { PROFILE_UPDATE } from "@/lib/socket";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method != 'PATCH') return res.status(405).end();

    try {
        const user = await getCurrentProfilePages(req, true);
        const { profileId } = req.body;

        if (!user) return res.status(401).json({ message: "You are not logged in." });
        if (!profileId) return res.status(400).json({ message: "Missing profileId." });

        if (profileId != user.profile.id) return res.status(403).json({ message: "You can only update your own profile." });

        res?.socket?.server?.io?.emit(PROFILE_UPDATE(profileId), user.profile);
        return res.status(200).json({ message: "ok, boss!" });
    } catch (e) {
        console.error("[MESSAGE_POST]", e);
        return res.status(500).end();
    }
}