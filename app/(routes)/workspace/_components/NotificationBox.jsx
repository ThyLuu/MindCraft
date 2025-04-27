import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { 
    useInboxNotifications, 
    useUnreadInboxNotificationsCount, 
    useMarkAllInboxNotificationsAsRead 
} from "@liveblocks/react/suspense";
import {
    InboxNotification,
    InboxNotificationList,
} from "@liveblocks/react-ui";

function NotificationBox({ children }) {
    const { inboxNotifications } = useInboxNotifications();
    const { count } = useUnreadInboxNotificationsCount();
    const markAllAsRead = useMarkAllInboxNotificationsAsRead();

    return (
        <Popover onOpenChange={(open) => open && markAllAsRead()}>
            <PopoverTrigger>
                <div className="relative flex items-center">
                    {children}
                    {count > 0 && (
                        <span className="absolute top-0 right-1 transform translate-x-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[8px] font-semibold text-white bg-red-500 rounded-full shadow-md">
                            {count}
                        </span>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[500px]">
                <InboxNotificationList>
                    {inboxNotifications.map((inboxNotification) => (
                        <InboxNotification
                            key={inboxNotification.id}
                            inboxNotification={inboxNotification}
                        />
                    ))}
                </InboxNotificationList>
            </PopoverContent>
        </Popover>
    )
}

export default NotificationBox;
