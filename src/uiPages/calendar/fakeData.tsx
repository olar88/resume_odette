import { AddCircle } from "@mui/icons-material";
import { eventType, GCCalenderColor } from "./Calender";

export const fakeCalendarData = [
    {
        eventId: "test001",
        title: "1",
        eventType: eventType.CHIPBAR,
        startTime: "20250626151500",
        endTime: "20250626191500",
        status: GCCalenderColor.ERROR,
    },
    {
        eventId: "test002",
        title: "2",
        eventType: eventType.CHIPBAR,
        startTime: "20250625151500",
        endTime: "20250625191500",
        status: GCCalenderColor.INFO,
    },
    {
        eventId: "test003",
        title: "3",
        eventType: eventType.CHIPBAR,
        startTime: "20250626111500",
        endTime: "20250626150500",
        status: GCCalenderColor.SECONDARY,
    },
    {
        eventId: "test004",
        title: "4",
        eventType: eventType.CHIPBAR,
        startTime: "20250627091500",
        endTime: "20250627101500",
        status: GCCalenderColor.WARNING,
    },
]