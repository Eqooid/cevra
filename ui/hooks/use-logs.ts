import useSWR from "swr";
import { create } from "zustand";

/**
 * LogEntry type representing a single activity log entry.
 * Includes details such as type, action, description, timestamp, status, and optional details.
 * @return {LogEntry} The LogEntry type definition.
 * @author Cristono Wijaya
 */
export type LogEntry = {
  id: string;
  type: "chat" | "storage";
  action: "create" | "delete" | "update" | "send_message";
  description: string;
  timestamp: Date;
  status: "success" | "failed" | "in_progress";
  details?: string;
};

/**
 * Dummy data for logs to simulate fetched data.
 * This data includes various log entries for chat and storage activities.
 * @return {LogEntry[]} An array of dummy LogEntry objects.
 * @author Cristono Wijaya
 */
const dummyData: LogEntry[] = [
  {
    "id": "1",
    "type": "chat",
    "action": "send_message",
    "description": "User sent a message to support chat",
    "timestamp": new Date("2025-11-05T10:01:23.000Z"),
    "status": "success",
    "details": "Message delivered to server"
  },
  {
    "id": "2",
    "type": "storage",
    "action": "create",
    "description": "Created a new storage bucket 'images-prod'",
    "timestamp": new Date("2025-11-05T10:02:11.000Z"),
    "status": "success",
    "details": "Bucket ID: img-prod-42"
  },
  {
    "id": "3",
    "type": "storage",
    "action": "delete",
    "description": "Deleted file 'backup-2025.zip'",
    "timestamp": new Date("2025-11-05T10:03:40.000Z"),
    "status": "in_progress"
  },
  {
    "id": "4",
    "type": "chat",
    "action": "update",
    "description": "Edited message in group chat",
    "timestamp": new Date("2025-11-05T10:05:15.000Z"),
    "status": "success",
    "details": "Message ID: 8429"
  },
  {
    "id": "5",
    "type": "storage",
    "action": "create",
    "description": "Uploaded file 'invoice.pdf'",
    "timestamp": new Date("2025-11-05T10:06:55.000Z"),
    "status": "success",
    "details": "File size: 235KB"
  },
  {
    "id": "6",
    "type": "chat",
    "action": "send_message",
    "description": "Sent announcement to all users",
    "timestamp": new Date("2025-11-05T10:08:32.000Z"),
    "status": "failed",
    "details": "Network timeout"
  },
  {
    "id": "7",
    "type": "storage",
    "action": "update",
    "description": "Renamed folder '2024_reports' to '2025_reports'",
    "timestamp": new Date("2025-11-05T10:09:18.000Z"),
    "status": "success"
  },
  {
    "id": "8",
    "type": "chat",
    "action": "create",
    "description": "Created new group 'Developers'",
    "timestamp": new Date("2025-11-05T10:10:44.000Z"),
    "status": "success",
    "details": "Group ID: dev-102"
  },
  {
    "id": "9",
    "type": "storage",
    "action": "delete",
    "description": "Deleted temporary cache files",
    "timestamp": new Date("2025-11-05T10:11:51.000Z"),
    "status": "success"
  },
  {
    "id": "10",
    "type": "chat",
    "action": "update",
    "description": "Changed chat topic to 'Release v3.2'",
    "timestamp": new Date("2025-11-05T10:12:34.000Z"),
    "status": "success"
  },
  {
    "id": "11",
    "type": "storage",
    "action": "create",
    "description": "Uploaded document 'proposal.docx'",
    "timestamp": new Date("2025-11-05T10:13:28.000Z"),
    "status": "in_progress"
  },
  {
    "id": "12",
    "type": "chat",
    "action": "send_message",
    "description": "User mentioned @admin in #general",
    "timestamp": new Date("2025-11-05T10:14:42.000Z"),
    "status": "success"
  },
  {
    "id": "13",
    "type": "storage",
    "action": "delete",
    "description": "Removed old log files from archive",
    "timestamp": new Date("2025-11-05T10:15:25.000Z"),
    "status": "success"
  },
  {
    "id": "14",
    "type": "chat",
    "action": "create",
    "description": "Created a new direct message channel",
    "timestamp": new Date("2025-11-05T10:16:31.000Z"),
    "status": "success"
  },
  {
    "id": "15",
    "type": "storage",
    "action": "update",
    "description": "Updated metadata for file 'design.psd'",
    "timestamp": new Date("2025-11-05T10:17:19.000Z"),
    "status": "failed",
    "details": "Permission denied"
  },
  {
    "id": "16",
    "type": "chat",
    "action": "send_message",
    "description": "Bot responded to user input",
    "timestamp": new Date("2025-11-05T10:18:12.000Z"),
    "status": "success"
  },
  {
    "id": "17",
    "type": "storage",
    "action": "delete",
    "description": "Deleted unused thumbnails",
    "timestamp": new Date("2025-11-05T10:19:07.000Z"),
    "status": "success"
  },
  {
    "id": "18",
    "type": "chat",
    "action": "update",
    "description": "Edited pinned message in announcements",
    "timestamp": new Date("2025-11-05T10:20:42.000Z"),
    "status": "in_progress"
  },
  {
    "id": "19",
    "type": "storage",
    "action": "create",
    "description": "Uploaded image 'banner.png'",
    "timestamp": new Date("2025-11-05T10:21:59.000Z"),
    "status": "success"
  },
  {
    "id": "20",
    "type": "chat",
    "action": "create",
    "description": "Created new support thread",
    "timestamp": new Date("2025-11-05T10:23:16.000Z"),
    "status": "success"
  },
  {
    "id": "21",
    "type": "storage",
    "action": "update",
    "description": "Changed file permissions for 'config.json'",
    "timestamp": new Date("2025-11-05T10:24:32.000Z"),
    "status": "success"
  },
  {
    "id": "22",
    "type": "chat",
    "action": "send_message",
    "description": "System sent daily summary",
    "timestamp": new Date("2025-11-05T10:25:55.000Z"),
    "status": "success"
  },
  {
    "id": "23",
    "type": "storage",
    "action": "create",
    "description": "Generated report 'usage-2025.csv'",
    "timestamp": new Date("2025-11-05T10:27:12.000Z"),
    "status": "success"
  },
  {
    "id": "24",
    "type": "chat",
    "action": "delete",
    "description": "Removed old system messages",
    "timestamp": new Date("2025-11-05T10:28:37.000Z"),
    "status": "success"
  },
  {
    "id": "25",
    "type": "storage",
    "action": "delete",
    "description": "Removed deprecated folder 'logs-old'",
    "timestamp": new Date("2025-11-05T10:30:00.000Z"),
    "status": "in_progress"
  },
  {
    "id": "26",
    "type": "chat",
    "action": "create",
    "description": "Opened chat with customer #4532",
    "timestamp": new Date("2025-11-05T10:31:22.000Z"),
    "status": "success"
  },
  {
    "id": "27",
    "type": "storage",
    "action": "update",
    "description": "Updated backup schedule to weekly",
    "timestamp": new Date("2025-11-05T10:32:10.000Z"),
    "status": "success"
  },
  {
    "id": "28",
    "type": "chat",
    "action": "send_message",
    "description": "Sent quick reply template to customer",
    "timestamp": new Date("2025-11-05T10:33:41.000Z"),
    "status": "failed"
  },
  {
    "id": "29",
    "type": "storage",
    "action": "create",
    "description": "Generated user export file 'users_2025.csv'",
    "timestamp": new Date("2025-11-05T10:34:20.000Z"),
    "status": "success"
  },
  {
    "id": "30",
    "type": "chat",
    "action": "delete",
    "description": "Removed chat history older than 90 days",
    "timestamp": new Date("2025-11-05T10:35:39.000Z"),
    "status": "success"
  },
  {
    "id": "31",
    "type": "storage",
    "action": "delete",
    "description": "Deleted expired tokens from storage",
    "timestamp": new Date("2025-11-05T10:36:18.000Z"),
    "status": "success"
  },
  {
    "id": "32",
    "type": "chat",
    "action": "create",
    "description": "Created project chat room 'Alpha'",
    "timestamp": new Date("2025-11-05T10:37:02.000Z"),
    "status": "success"
  },
  {
    "id": "33",
    "type": "storage",
    "action": "update",
    "description": "Modified file retention policy",
    "timestamp": new Date("2025-11-05T10:38:28.000Z"),
    "status": "success"
  },
  {
    "id": "34",
    "type": "chat",
    "action": "update",
    "description": "Changed chat settings to private",
    "timestamp": new Date("2025-11-05T10:39:14.000Z"),
    "status": "success"
  },
  {
    "id": "35",
    "type": "storage",
    "action": "create",
    "description": "Added storage key 'backup-key-01'",
    "timestamp": new Date("2025-11-05T10:40:56.000Z"),
    "status": "success"
  },
  {
    "id": "36",
    "type": "chat",
    "action": "send_message",
    "description": "Broadcast message to marketing team",
    "timestamp": new Date("2025-11-05T10:41:44.000Z"),
    "status": "success"
  },
  {
    "id": "37",
    "type": "storage",
    "action": "update",
    "description": "Optimized data indexing",
    "timestamp": new Date("2025-11-05T10:42:33.000Z"),
    "status": "in_progress"
  },
  {
    "id": "38",
    "type": "chat",
    "action": "delete",
    "description": "Cleared conversation with inactive user",
    "timestamp": new Date("2025-11-05T10:43:27.000Z"),
    "status": "success"
  },
  {
    "id": "39",
    "type": "storage",
    "action": "create",
    "description": "Uploaded project documentation",
    "timestamp": new Date("2025-11-05T10:44:12.000Z"),
    "status": "success"
  },
  {
    "id": "40",
    "type": "chat",
    "action": "create",
    "description": "Created meeting chat for 'Sprint Review'",
    "timestamp": new Date("2025-11-05T10:45:21.000Z"),
    "status": "success"
  },
  {
    "id": "41",
    "type": "storage",
    "action": "delete",
    "description": "Removed temporary debug files",
    "timestamp": new Date("2025-11-05T10:46:39.000Z"),
    "status": "success"
  },
  {
    "id": "42",
    "type": "chat",
    "action": "update",
    "description": "Updated chat permissions for team leads",
    "timestamp": new Date("2025-11-05T10:47:56.000Z"),
    "status": "success"
  },
  {
    "id": "43",
    "type": "storage",
    "action": "create",
    "description": "Created folder 'reports-Q4'",
    "timestamp": new Date("2025-11-05T10:48:42.000Z"),
    "status": "success"
  },
  {
    "id": "44",
    "type": "chat",
    "action": "send_message",
    "description": "Automated bot greeting triggered",
    "timestamp": new Date("2025-11-05T10:49:38.000Z"),
    "status": "success"
  },
  {
    "id": "45",
    "type": "storage",
    "action": "update",
    "description": "Updated checksum for 'config.yaml'",
    "timestamp": new Date("2025-11-05T10:50:59.000Z"),
    "status": "success"
  },
  {
    "id": "46",
    "type": "chat",
    "action": "delete",
    "description": "Deleted outdated group chat 'Testing'",
    "timestamp": new Date("2025-11-05T10:52:14.000Z"),
    "status": "success"
  },
  {
    "id": "47",
    "type": "storage",
    "action": "create",
    "description": "Initialized storage volume 'data-vol-3'",
    "timestamp": new Date("2025-11-05T10:53:39.000Z"),
    "status": "in_progress"
  },
  {
    "id": "48",
    "type": "chat",
    "action": "send_message",
    "description": "Sent file attachment in private chat",
    "timestamp": new Date("2025-11-05T10:54:23.000Z"),
    "status": "success"
  },
  {
    "id": "49",
    "type": "storage",
    "action": "delete",
    "description": "Purged inactive user directories",
    "timestamp": new Date("2025-11-05T10:55:48.000Z"),
    "status": "success"
  },
  {
    "id": "50",
    "type": "chat",
    "action": "create",
    "description": "Opened chat channel for 'QA Team'",
    "timestamp": new Date("2025-11-05T10:56:34.000Z"),
    "status": "success"
  }
];

/**
 * LogState interface defining the shape of the logs state in Zustand store.
 * Includes an array of LogEntry objects and a method to set the logs.
 * @return {LogState} The LogState interface definition.
 * @author Cristono Wijaya
 */
export interface LogState {
  logs: LogEntry[];
  isLoading: boolean;
  setLogs: (logs: LogEntry[]) => void;
}

/**
 * Zustand store for managing logs state.
 * Provides methods to set and retrieve logs.
 * @return {UseLogs} The Zustand store for logs.
 * @author Cristono Wijaya
 */
const useLogs = create<LogState>((set) => ({
  logs: [],
  isLoading: true,
  setLogs: (logs: LogEntry[]) => set({ logs, isLoading: false }),
}));

/**
 * Fetch logs function simulating an API call to retrieve log entries.
 * Returns a promise that resolves with dummy log data after a delay.
 * @return {Promise<LogEntry[]>} A promise resolving to an array of LogEntry objects.
 * @author Cristono Wijaya
 */
const fetchLogs = async (): Promise<LogEntry[]> => {  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyData);
    }, 1000);
  });
}

/**
 * Custom hook to fetch logs using SWR and manage them in Zustand store.
 * Utilizes the fetchLogs function to retrieve data and updates the store on success.
 * @return {{ data: LogEntry[] }} An object containing the fetched logs data.
 * @author Cristono Wijaya
 */
export const useFetchLogs = () => {
  const setLogs = useLogs((state) => state.setLogs);
  const logs = useLogs((state) => state.logs);
  const isLoading = useLogs((state) => state.isLoading);

  useSWR<LogEntry[]>('/api/logs', fetchLogs, {
    suspense: true,
    fallbackData: [],
    fallback: [],
    onSuccess: (data) => {
      setLogs(data);
    }
  });

  return {
    data: logs,
    isLoading
  }
};

export default useLogs;