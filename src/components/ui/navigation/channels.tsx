import { FullUser } from "@/lib/types";
import { Server } from "@/lib/types";
import { ChannelType } from "@/lib/channel";
import { DoorClosedIcon, HashIcon, Link, Mail, MegaphoneIcon, MoveRight, Plus, PlusCircle, PlusCircleIcon, PlusIcon, Search, Settings, User, UserPlus } from "lucide-react";
import Section from "./section";
import { Separator } from "../separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@/lib/members";

export default function ({
    server,
    user
}: { server: Server | null, user: FullUser }) {
    if (!server) return null;
    const role = server.members?.find((member) => member.profileId === user.profile.id)?.role as MemberRole;

    const isAdmin = role >= MemberRole.admin;
    const isModerator = isAdmin || role === MemberRole.moderator;

    const serverInvites = server.invites;

    return (
        <div className="mt-5">
            <div>
                {isAdmin && (
                    <div className="mb-1 relative flex items-center overflow-hidden text-muted-foreground cursor-pointer transition-all duration-150 rounded-sm hover:bg-zinc-900 px-3 py-2 my-1">
                        <Settings className="mr-3 w-4 h-4" />
                        <div className="!p-0 truncate text-sm font-semibold">Server configuration</div>
                    </div>
                )}
                <div className="mb-1 relative flex items-center overflow-hidden text-muted-foreground cursor-pointer transition-all duration-150 rounded-sm hover:bg-zinc-900 px-3 py-2 my-1">
                    <Search className="mr-3 w-4 h-4" />
                    <div className="!p-0 truncate text-sm font-semibold ">Search messages</div>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-black px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto"><span className="text-xs pt-0.5">⌘</span> + K</kbd>
                </div>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="mb-3 relative flex items-center overflow-hidden text-muted-foreground cursor-pointer transition-all duration-150 rounded-sm hover:bg-zinc-900 px-3 py-2 my-1">
                        <PlusIcon className="mr-3 w-4 h-4" />
                        <div className="!p-0 truncate text-sm font-semibold ">More actions</div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[250px]">
                    <DropdownMenuLabel>Server actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isModerator && (
                        <>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                                    <span>Create new channel</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </>
                    )}
                    <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Invite users</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            {serverInvites.map((invite) => (
                                <DropdownMenuItem>
                                    <Link className="mr-2 h-4 w-4" />
                                    <span>invite with code "{invite.code}"</span>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                            <PlusCircle className="mr-2 h-4 w-4" />
                                <span>Create new invite</span>
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    </DropdownMenuGroup>
                    {isAdmin && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Manage members</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </>
                    )}
                    {!isAdmin && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="text-red-500">
                                    <DoorClosedIcon className="mr-2 h-4 w-4" />
                                    <span>Leave server</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500">
                                    <Mail className="mr-2 h-4 w-4" />
                                    <span>Report server</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </>
                    )}
                </DropdownMenuContent>
                </DropdownMenu>
                <Separator className="mt-2 mb-2" />
                <Section text="Server channels" className="mt-5" />
                {server.channels.map((channel) => (
                    <div className="relative flex items-center overflow-hidden cursor-pointer transition-all duration-150 rounded-sm hover:bg-zinc-900 px-3 py-2 my-1 text-muted-foreground" key={channel.id}>
                        {channel.type == ChannelType.text ? (<HashIcon className="mr-3 w-4 h-4" />) : (<MegaphoneIcon className="mr-3 w-4 h-4" />)}
                        <div className="!p-0 truncate text-sm font-semibold">{channel.name}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
