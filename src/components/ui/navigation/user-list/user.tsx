import { ServerMember } from "@/lib/servers";
import { Avatar } from "../../avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import AvatarWithStatus from "../../avatar-with-status";
import { ActionTooltip } from "../../action-tooltip";
import { roleIcons } from "../../app/chat/item";
import { getRoleName } from "@/lib/roles";

export default function NavigationUser({ user }: {
    user: ServerMember
}) {
    const roleName = getRoleName(user.role);
    return (
        <div className={cn("mb-1 select-none relative flex items-center overflow-hidden text-muted-foreground cursor-pointer transition-all duration-150 rounded-sm hover:bg-zinc-900 px-3 py-2 my-1", user.profile.status == "offline" ? "opacity-60" : "")}>
            <AvatarWithStatus src={user.profile.imageUri} status={user.profile.status} />
            <div className="ml-3">
                <span className="font-semibold text-sm text-muted-foreground capitalize"> 
                    {user.profile.name}
                </span>
                {user.profile.statusMessage && (
                    <span className="text-xs text-muted-foreground ml-1">
                        {user.profile.statusMessage}
                    </span>
                )}
            </div>
            <ActionTooltip label={roleName} side="right">
                {roleIcons[roleName.toLocaleLowerCase() as keyof typeof roleIcons]}
            </ActionTooltip> 
        </div>
    )
}
