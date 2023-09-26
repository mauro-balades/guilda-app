'use server';

import { db } from "@/lib/db";
import { Invite, Profile, Server } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { ChannelType } from "./channel";
import { MemberRole } from "./members";
import { PopulatedServer } from "./types";

export async function createNewServer({
    name,
    profileId
}: {
    name: string;
    profileId: string;
}) {
    // 1 to 4
    let randomIcon = Math.floor(Math.random() * 4) + 1;
    const server = await db.server.create({
        data: {
            name,
            profileId,
            imageUri: process.env.BASE_URL + `/default-server-icons/${randomIcon}.png`,
            invites: {
                create: {
                    code: uuidv4().substring(0, 8),
                }
            },
            channels: {
                create: {
                    name: "general",
                    profileId,
                }
            },
            members: {
                create: {
                    profileId,
                    role: MemberRole.owner
                }
            }
        },
    });
    
    return server;
}

export async function getServerFromId(id: string, extraArgs = {}) {
    return await db.server.findUnique({
        where: {
            id
        },
        ...extraArgs
    });
}

export async function getServerFromIdWithVerification(id: string, profileId: string): Promise<PopulatedServer | null> {
    return await db.server.findFirst({
        where: {
            id,
            members: {
                some: {
                    profileId
                }
            }
        },
        include: {
            members: true
        }
    });
}

export async function getInviteFromCode(code: string) {
    try {
        return await db.invite.findUnique({
            where: {
                code
            }
        });
    } catch (e) { return null; }
}

export async function joinServerFromInvite(invite: Invite, profile: Profile) {
    if (await db.server.findFirst({
        where: {
            id: invite.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })){
        return null;// we already joined!
    }
    return await db.server.update({
        where: {
            id: invite.serverId
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    }
                ]
            }
        }
    });
}

export async function createChannelInServer(server: Server, name: string, type: ChannelType, profileId: string) {
    return await db.server.update({
        where: {
            id: server.id,
            members: {
                some: {
                    profileId,
                    role: {
                        in: [MemberRole.owner, MemberRole.admin]
                    }
                }
            }
        },
        data: {
            channels: {
                create: {
                    name,
                    type,
                    profileId
                }
            }
        }
    });
}

export async function getChannelFromId(channelId: string) {
    return await db.channel.findFirst({
        where: {
            id: channelId
        }
    });
}

export async function getChannelFromServer(serverId: string, channelId: string) {
    return await db.channel.findFirst({
        where: {
            id: channelId,
            serverId
        }
    });
}

export async function getServerMember(serverId: string, profileId: string) {
    return await db.member.findFirst({
        where: {
            serverId,
            profileId
        }
    });
}
