import { defineStore } from "pinia";

export interface Email {
    id: number;
    avatar: string;
    sender: string;
    recipient: string;
    email: string;
    subject: string;
    content: string;
    isRead: boolean;
    isPinned: boolean;
    date: string;
    department: string;
    history: EmailHistory[];
    tag: string;
    attachments: number;
    priority: "High" | "Medium" | "Low";
    span: "today" | "this week" | "this month";
    interactionCount: number;
}

export interface EmailHistory {
    id: number;
    date: string;
    action: "sent" | "received" | "read" | "replied";
    description: string;
}

export const useEmailStore = defineStore("email", {
    state: () => ({
        receivedEmails: [
            {
                id: 1,
                avatar: "~/public/img/profile.png",
                sender: "Alice",
                email: "alice@example.com",
                subject: "Meeting Reminder",
                content: "Just a reminder about our meeting at 3 PM.",
                isRead: false,
                isPinned: false,
                date: "2020-09-29T10:55:14",
                department: "HR",
                recipient: "Bob",
                tag: "Follow-up",
                attachments: 2,
                priority: "Medium",
                span: "today",
                interactionCount: 2,
                history: [
                    {
                        id: 101,
                        date: "2020-09-29T10:55:14",
                        action: "received",
                        description: "Email received from Alice to Bob",
                    },
                    {
                        id: 102,
                        date: "2020-09-30T09:00:00",
                        action: "read",
                        description: "Bob read the email",
                    },
                ],
            },
            {
                id: 2,
                avatar: "~/public/img/logo.png",
                sender: "Bob",
                email: "bob@example.com",
                subject: "Project Update",
                content: "Here is the latest update on the project...",
                isRead: true,
                isPinned: false,
                date: "2020-09-28T10:00:00",
                department: "IT",
                recipient: "",
                tag: "Important",
                attachments: 1,
                priority: "High",
                span: "this week",
                interactionCount: 2,
                history: [
                    {
                        id: 201,
                        date: "2020-09-28T08:30:00",
                        action: "sent",
                        description: "Bob sent a project update email",
                    },
                    {
                        id: 202,
                        date: "2020-09-28T12:00:00",
                        action: "read",
                        description: "Recipient read the email",
                    },
                ],
            },
            {
                id: 3,
                avatar: "public/img/logo.png",
                sender: "Charlie",
                email: "charlie@example.com",
                subject: "Invoice",
                content: "Please find attached the invoice for last month...",
                isRead: false,
                isPinned: true,
                date: "2020-09-29T10:55:14",
                department: "Finance",
                recipient: "",
                tag: "Billing",
                attachments: 3,
                priority: "Medium",
                span: "this week",
                interactionCount: 3,
                history: [
                    {
                        id: 301,
                        date: "2020-09-28T14:15:00",
                        action: "sent",
                        description: "Charlie sent the invoice email",
                    },
                    {
                        id: 302,
                        date: "2020-09-28T16:20:00",
                        action: "received",
                        description: "Recipient received the invoice email",
                    },
                ],
            },
            {
                id: 4,
                avatar: "public/img/logo.png",
                sender: "David",
                email: "david@example.com",
                subject: "Feedback Request",
                content: "We would like to hear your feedback on the new...",
                isRead: true,
                isPinned: false,
                date: "2020-09-29T10:55:14",
                department: "Marketing",
                recipient: "",
                tag: "Customer Feedback",
                attachments: 0,
                priority: "Low",
                span: "this month",
                interactionCount: 2,
                history: [
                    {
                        id: 401,
                        date: "2020-09-27T10:00:00",
                        action: "sent",
                        description:
                            "David requested feedback from the recipient",
                    },
                    {
                        id: 402,
                        date: "2020-09-27T12:30:00",
                        action: "replied",
                        description: "Recipient replied with feedback",
                    },
                ],
            },
            {
                id: 5,
                avatar: "public/img/logo.png",
                sender: "Eve",
                email: "eve@example.com",
                subject: "New Job Opening",
                content: "We have a new job opening in our department...",
                isRead: false,
                isPinned: false,
                date: "2020-09-29T10:55:14",
                department: "HR",
                recipient: "",
                tag: "Job Posting",
                attachments: 0,
                priority: "High",
                span: "this month",
                interactionCount: 1,
                history: [
                    {
                        id: 501,
                        date: "2020-09-25T15:00:00",
                        action: "sent",
                        description:
                            "Eve sent an email about the new job opening",
                    },
                ],
            },
            {
                id: 6,
                avatar: "public/img/logo.png",
                sender: "Frank",
                email: "frank@example.com",
                subject: "Meeting Cancellation",
                content: "The meeting scheduled for tomorrow has been...",
                isRead: false,
                isPinned: false,
                date: "2020-09-29T10:55:14",
                department: "IT",
                recipient: "",
                tag: "Cancellation",
                attachments: 0,
                priority: "Medium",
                span: "this week",
                interactionCount: 2,
                history: [
                    {
                        id: 601,
                        date: "2020-09-26T09:45:00",
                        action: "sent",
                        description: "Frank sent a meeting cancellation email",
                    },
                    {
                        id: 602,
                        date: "2020-09-26T10:00:00",
                        action: "read",
                        description:
                            "Recipient read the meeting cancellation email",
                    },
                ],
            },
            {
                id: 7,
                avatar: "public/img/logo.png",
                sender: "Grace",
                email: "grace@example.com",
                subject: "New Policy",
                content: "We have a new policy regarding...",
                isRead: true,
                isPinned: false,
                date: "2020-09-29T10:55:14",
                department: "Finance",
                recipient: "",
                tag: "Policy Update",
                attachments: 0,
                priority: "Low",
                span: "this month",
                interactionCount: 1,
                history: [
                    {
                        id: 701,
                        date: "2020-09-24T11:00:00",
                        action: "sent",
                        description: "Grace sent an email about the new policy",
                    },
                ],
            },
            {
                id: 8,
                avatar: "public/img/logo.png",
                sender: "Hank",
                email: "hank@example.com",
                subject: "Product Launch",
                content: "We are excited to announce the launch of our new...",
                isRead: false,
                isPinned: false,
                date: "2020-09-29T10:55:14",
                department: "Marketing",
                recipient: "",
                tag: "Policy Update",
                attachments: 0,
                priority: "Low",
                span: "this month",
                interactionCount: 1,
                history: [
                    {
                        id: 801,
                        date: "2020-09-23T14:00:00",
                        action: "sent",
                        description:
                            "Hank sent an email about the product launch",
                    },
                ],
            },
            {
                id: 9,
                avatar: "public/img/logo.png",
                sender: "Ivy",
                email: "ivy@example.com",
                subject: "Training Session",
                content: "There will be a training session on...",
                isRead: true,
                isPinned: false,
                date: "2020-09-29T10:55:14",
                department: "HR",
                recipient: "",
                tag: "Policy Update",
                attachments: 0,
                priority: "Low",
                span: "this month",
                interactionCount: 1,
                history: [
                    {
                        id: 901,
                        date: "2020-09-22T08:15:00",
                        action: "sent",
                        description:
                            "Ivy sent an email about the training session",
                    },
                ],
            },
            {
                id: 10,
                avatar: "public/img/logo.png",
                sender: "Jack",
                email: "jack@example.com",
                subject: "New Feature",
                content: "We have added a new feature to our...",
                isRead: false,
                isPinned: false,
                date: "2020-09-29T10:55:14",
                department: "IT",
                recipient: "",
                tag: "Policy Update",
                attachments: 0,
                priority: "Low",
                span: "this month",
                interactionCount: 1,
                history: [
                    {
                        id: 1001,
                        date: "2020-09-21T12:00:00",
                        action: "sent",
                        description: "Jack sent an email about the new feature",
                    },
                ],
            },
            {
                id: 11,
                avatar: "public/img/logo.png",
                sender: "Kathy",
                email: "kathy@example.com",
                subject: "Feedback Received",
                content: "Thank you for your feedback on the new...",
                isRead: true,
                isPinned: false,
                date: "2020-09-29T10:55:14",
                department: "Finance",
                recipient: "",
                tag: "Policy Update",
                attachments: 0,
                priority: "Low",
                span: "this month",
                interactionCount: 1,
                history: [
                    {
                        id: 1101,
                        date: "2020-09-20T16:30:00",
                        action: "replied",
                        description: "Kathy replied with feedback",
                    },
                ],
            },
            {
                id: 12,
                avatar: "public/img/logo.png",
                sender: "Lance",
                email: "lance@example.com",
                subject: "Meeting Request",
                content: "I would like to request a meeting to discuss...",
                isRead: false,
                isPinned: false,
                date: "2020-09-29T10:55:14",
                department: "Finance",
                recipient: "",
                tag: "Policy Update",
                attachments: 0,
                priority: "Low",
                span: "this month",
                interactionCount: 1,
                history: [
                    {
                        id: 1201,
                        date: "2020-09-19T10:00:00",
                        action: "sent",
                        description: "Lance sent a meeting request",
                    },
                    {
                        id: 1202,
                        date: "2020-09-19T12:00:00",
                        action: "read",
                        description: "Recipient read the meeting request",
                    },
                ],
            },
        ] as Email[],
        sentEmails: [
            {
                id: 1001,
                avatar: "~/public/img/logo.png",
                sender: "Me",
                email: "example@example.com",
                subject: "Project Update",
                content: "Here is the latest update on the project...",
                isRead: false,
                isPinned: false,
                date: "2020-09-28T10:00:00",
                department: "IT",
                recipient: "alice@example.com",
                tag: "Important",
                attachments: 1,
                priority: "High",
                span: "this week",
                interactionCount: 2,
                history: [
                    {
                        id: 100201,
                        date: "2020-09-28T08:30:00",
                        action: "sent",
                        description: "Bob sent a project update email",
                    },
                    {
                        id: 100202,
                        date: "2020-09-28T12:00:00",
                        action: "read",
                        description: "Recipient read the email",
                    },
                ],
            },
            {
                id: 1002,
                avatar: "~/public/img/logo.png",
                sender: "Me",
                email: "example@example.com",
                subject: "Project Update",
                content: "Here is the latest update on the project...",
                isRead: true,
                isPinned: true,
                date: "2020-09-28T10:00:00",
                department: "IT",
                recipient: "alice@example.com",
                tag: "Important",
                attachments: 1,
                priority: "High",
                span: "this week",
                interactionCount: 2,
                history: [
                    {
                        id: 100203,
                        date: "2020-09-28T08:30:00",
                        action: "sent",
                        description: "Bob sent a project update email",
                    },
                    {
                        id: 100204,
                        date: "2020-09-28T12:00:00",
                        action: "read",
                        description: "Recipient read the email",
                    },
                ],
            },
            {
                id: 1003,
                avatar: "~/public/img/logo.png",
                sender: "Me",
                email: "example@example.com",
                subject: "Project Update",
                content: "Here is the latest update on the project...",
                isRead: true,
                isPinned: true,
                date: "2020-09-28T10:00:00",
                department: "IT",
                recipient: "alice@example.com",
                tag: "Important",
                attachments: 1,
                priority: "High",
                span: "this week",
                interactionCount: 2,
                history: [
                    {
                        id: 100205,
                        date: "2020-09-28T08:30:00",
                        action: "sent",
                        description: "Bob sent a project update email",
                    },
                    {
                        id: 100206,
                        date: "2020-09-28T12:00:00",
                        action: "read",
                        description: "Recipient read the email",
                    },
                ],
            },
            {
                id: 1004,
                avatar: "~/public/img/logo.png",
                sender: "Me",
                email: "example@example.com",
                subject: "Project Update",
                content: "Here is the latest update on the project...",
                isRead: true,
                isPinned: true,
                date: "2020-09-28T10:00:00",
                department: "IT",
                recipient: "alice@example.com",
                tag: "Important",
                attachments: 1,
                priority: "High",
                span: "this week",
                interactionCount: 2,
                history: [
                    {
                        id: 100207,
                        date: "2020-09-28T08:30:00",
                        action: "sent",
                        description: "Bob sent a project update email",
                    },
                    {
                        id: 100208,
                        date: "2020-09-28T12:00:00",
                        action: "read",
                        description: "Recipient read the email",
                    },
                ],
            },
            {
                id: 1005,
                avatar: "~/public/img/logo.png",
                sender: "Me",
                email: "example@example.com",
                subject: "Project Update",
                content: "Here is the latest update on the project...",
                isRead: false,
                isPinned: false,
                date: "2020-09-28T10:00:00",
                department: "IT",
                recipient: "alice@example.com",
                tag: "Important",
                attachments: 1,
                priority: "High",
                span: "this week",
                interactionCount: 2,
                history: [
                    {
                        id: 100209,
                        date: "2020-09-28T08:30:00",
                        action: "sent",
                        description: "Bob sent a project update email",
                    },
                    {
                        id: 100210,
                        date: "2020-09-28T12:00:00",
                        action: "read",
                        description: "Recipient read the email",
                    },
                ],
            },
            {
                id: 1006,
                avatar: "~/public/img/logo.png",
                sender: "Me",
                email: "example@example.com",
                subject: "Project Update",
                content: "Here is the latest update on the project...",
                isRead: true,
                isPinned: false,
                date: "2020-09-28T10:00:00",
                department: "IT",
                recipient: "alice@example.com",
                tag: "Important",
                attachments: 1,
                priority: "High",
                span: "this week",
                interactionCount: 2,
                history: [
                    {
                        id: 100211,
                        date: "2020-09-28T08:30:00",
                        action: "sent",
                        description: "Bob sent a project update email",
                    },
                    {
                        id: 100212,
                        date: "2020-09-28T12:00:00",
                        action: "read",
                        description: "Recipient read the email",
                    },
                ],
            },
            {
                id: 1007,
                avatar: "~/public/img/logo.png",
                sender: "Me",
                email: "example@example.com",
                subject: "Project Update",
                content: "Here is the latest update on the project...",
                isRead: false,
                isPinned: false,
                date: "2020-09-28T10:00:00",
                department: "IT",
                recipient: "alice@example.com",
                tag: "Important",
                attachments: 1,
                priority: "High",
                span: "this week",
                interactionCount: 2,
                history: [
                    {
                        id: 100213,
                        date: "2020-09-28T08:30:00",
                        action: "sent",
                        description: "Bob sent a project update email",
                    },
                    {
                        id: 100214,
                        date: "2020-09-28T12:00:00",
                        action: "read",
                        description: "Recipient read the email",
                    },
                ],
            },
        ] as Email[],
        draftEmails: [
            {
                id: 5001,
                avatar: "~/public/img/logo.png",
                sender: "Me",
                email: "example@example.com",
                subject: "Project Update",
                content: "Here is the latest update on the project...",
                isRead: false,
                isPinned: false,
                date: "2020-09-28T10:00:00",
                department: "IT",
                recipient: "alice@example.com",
                tag: "Important",
                attachments: 1,
                priority: "High",
                span: "this week",
                interactionCount: 2,
                history: [
                    {
                        id: 500201,
                        date: "2020-09-28T08:30:00",
                        action: "sent",
                        description: "Bob sent a project update email",
                    },
                    {
                        id: 5100202,
                        date: "2020-09-28T12:00:00",
                        action: "read",
                        description: "Recipient read the email",
                    },
                ],
            },
            {
                id: 5002,
                avatar: "~/public/img/logo.png",
                sender: "Me",
                email: "example@example.com",
                subject: "Project Update",
                content: "Here is the latest update on the project...",
                isRead: true,
                isPinned: true,
                date: "2020-09-28T10:00:00",
                department: "IT",
                recipient: "alice@example.com",
                tag: "Important",
                attachments: 1,
                priority: "High",
                span: "this week",
                interactionCount: 2,
                history: [
                    {
                        id: 500203,
                        date: "2020-09-28T08:30:00",
                        action: "sent",
                        description: "Bob sent a project update email",
                    },
                    {
                        id: 500204,
                        date: "2020-09-28T12:00:00",
                        action: "read",
                        description: "Recipient read the email",
                    },
                ],
            },
        ] as Email[],
        selectedEmailId: null as number | null,
    }),
    actions: {
        selectEmail(id: number | null) {
            this.selectedEmailId = id;
        },
        markAsRead(id: number, activeView: string) {
            let email;
            switch (activeView) {
                case "inbox":
                    email = this.receivedEmails.find(
                        (email) => email.id === id
                    );
                    break;
                case "sent":
                    email = this.sentEmails.find((email) => email.id === id);
                    break;
                // Add cases for other views like drafts, garbage, etc., if needed.
                default:
                    email = null;
            }
            if (email) email.isRead = true;
        },
    },
    getters: {
        selectedEmail: (state) => {
            return (activeView: string) => {
                switch (activeView) {
                    case "inbox":
                        return state.receivedEmails.find(
                            (email) => email.id === state.selectedEmailId
                        );
                    case "sent":
                        return state.sentEmails.find(
                            (email) => email.id === state.selectedEmailId
                        );
                    case "draft":
                        return state.draftEmails.find(
                            (email) => email.id === state.selectedEmailId
                        );

                    default:
                        return null;
                }
            };
        },
        unreadEmailsCount: (state) =>
            state.receivedEmails.filter((email) => !email.isRead).length,
    },
});
