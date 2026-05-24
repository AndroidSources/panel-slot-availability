"use client";

import { Fragment, useState, useMemo } from "react";
import {
  LayoutDashboard, Calendar, Users, BookOpen, BarChart2, Bell,
  Search, Settings, ChevronDown, ChevronRight, Clock, CheckCircle2,
  AlertCircle, XCircle, Plus, Filter, Download, RefreshCw,
  ArrowUpRight, ArrowDownRight, TrendingUp, Award, Zap, Shield,
  Mail, Phone, Star, MoreHorizontal, X, Check, AlertTriangle,
  UserCheck, CalendarCheck, Target, Activity, Layers, FileText
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend
} from "recharts";

/* ─── Types ─── */
type NavItem = { id: string; label: string; icon: React.ReactNode; badge?: number };
type Status = "available" | "booked" | "partial" | "unavailable";
type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed";
type OutlookSurface = "inbox" | "calendar" | "plugin";
type MockRole = "HR / Talent Acquisition" | "Leadership Team" | "Panelist" | "Manager";
type MockUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: MockRole;
  title: string;
  initials: string;
  team: string;
  mobile: string;
  skills: string[];
  panelLevel: "L1" | "L2";
};

/* ─── Data ─── */
const aziroLogoUrl = "https://www.aziro.com/_next/image?url=https%3A%2F%2Fcdn.aziro.com%2Fmedia%2FAziro_Logo_White_Version_41f269014b.png&w=256&q=75";

const mockUsers: MockUser[] = [
  {
    id: "hr-ta-001",
    name: "Maya Iyer",
    email: "hr.ta.demo@aziro.com",
    password: "Talent@123",
    role: "HR / Talent Acquisition",
    title: "Talent Acquisition Partner",
    initials: "MI",
    team: "Talent Acquisition",
    mobile: "+91 98765 41021",
    skills: ["Stakeholder Management", "Recruiting Operations", "Interview Scheduling"],
    panelLevel: "L1",
  },
  {
    id: "leadership-001",
    name: "Arjun Mehta",
    email: "leadership.demo@aziro.com",
    password: "Leader@123",
    role: "Leadership Team",
    title: "Engineering Director",
    initials: "AM",
    team: "Technology Leadership",
    mobile: "+91 98765 41022",
    skills: ["Leadership", "System Design", "Hiring Strategy"],
    panelLevel: "L2",
  },
  {
    id: "panelist-001",
    name: "Sanjana Rao",
    email: "panelist.demo@aziro.com",
    password: "Panel@123",
    role: "Panelist",
    title: "Principal Engineer",
    initials: "SR",
    team: "Interview Panel",
    mobile: "+91 98765 41023",
    skills: ["System Design", "Distributed Systems", "Go", "React"],
    panelLevel: "L2",
  },
  {
    id: "manager-001",
    name: "Priya Sharma",
    email: "manager.demo@aziro.com",
    password: "Manager@123",
    role: "Manager",
    title: "Engineering Manager",
    initials: "PS",
    team: "Data Platform",
    mobile: "+91 98765 41024",
    skills: ["Data Engineering", "Leadership", "Python", "React"],
    panelLevel: "L2",
  },
];

const coreSkillOptions = [
  "Recruiting Operations",
  "Interview Scheduling",
  "Stakeholder Management",
  "Hiring Strategy",
  "Leadership",
  "System Design",
  "Distributed Systems",
  "React",
  "TypeScript",
  "Data Engineering",
  "Python",
  "Security",
  "Cloud Architecture",
  "Go",
  "Kubernetes",
  "Mobile UX",
];

const editableSkillOptions = Array.from(
  new Set([
    ...coreSkillOptions,
    ...Array.from({ length: 500 - coreSkillOptions.length }, (_, index) => `Enterprise Skill ${String(index + 1).padStart(3, "0")}`),
  ])
);

const panelists = [
  { id: 1, name: "Sanjana Rao", role: "Principal Engineer", dept: "Platform", avatar: "SR", skills: ["System Design", "Distributed Systems", "Go", "React"], utilization: 78, slotsThisWeek: 6, totalInterviews: 142, rating: 4.8, status: "available" as Status },
  { id: 2, name: "Rohan Kulkarni", role: "Staff Engineer", dept: "Frontend", avatar: "RK", skills: ["React", "TypeScript", "Performance"], utilization: 62, slotsThisWeek: 4, totalInterviews: 98, rating: 4.7, status: "partial" as Status },
  { id: 3, name: "Priya Sharma", role: "Engineering Manager", dept: "Data", avatar: "PS", skills: ["Data Engineering", "Leadership", "Python", "React"], utilization: 91, slotsThisWeek: 3, totalInterviews: 187, rating: 4.9, status: "booked" as Status },
  { id: 4, name: "Vikram Nair", role: "Senior Engineer", dept: "Security", avatar: "VN", skills: ["Security", "Cryptography", "Rust", "Python"], utilization: 45, slotsThisWeek: 8, totalInterviews: 73, rating: 4.6, status: "available" as Status },
  { id: 5, name: "Meera Krishnan", role: "Principal Architect", dept: "Infrastructure", avatar: "MK", skills: ["Cloud Architecture", "Kubernetes", "Terraform", "System Design"], utilization: 85, slotsThisWeek: 5, totalInterviews: 201, rating: 4.9, status: "partial" as Status },
  { id: 6, name: "Karthik Menon", role: "Senior Engineer", dept: "Mobile", avatar: "KM", skills: ["iOS", "Swift", "Mobile UX", "React"], utilization: 33, slotsThisWeek: 2, totalInterviews: 54, rating: 4.5, status: "available" as Status },
  { id: 7, name: "Ananya Desai", role: "Frontend Lead", dept: "Frontend", avatar: "AD", skills: ["React", "TypeScript", "System Design"], utilization: 57, slotsThisWeek: 7, totalInterviews: 121, rating: 4.8, status: "available" as Status },
  { id: 8, name: "Nikhil Bhat", role: "Senior Frontend Engineer", dept: "Frontend", avatar: "NB", skills: ["React", "Performance", "TypeScript"], utilization: 74, slotsThisWeek: 5, totalInterviews: 89, rating: 4.6, status: "partial" as Status },
];

const bookings = [
  { id: "BK-2847", candidate: "Aarav Iyer", role: "Staff Engineer", panel: ["Sanjana Rao", "Rohan Kulkarni"], date: "Tue, May 26", time: "10:00 AM", duration: 60, status: "confirmed" as BookingStatus, round: "Technical", skills: ["System Design", "Go"] },
  { id: "BK-2848", candidate: "Neha Reddy", role: "Senior Data Engineer", panel: ["Priya Sharma", "Vikram Nair"], date: "Tue, May 26", time: "2:00 PM", duration: 45, status: "pending" as BookingStatus, round: "Final", skills: ["Python", "Data Engineering"] },
  { id: "BK-2849", candidate: "Rahul Patel", role: "Frontend Engineer", panel: ["Rohan Kulkarni"], date: "Wed, May 27", time: "11:00 AM", duration: 60, status: "confirmed" as BookingStatus, round: "Technical", skills: ["React", "TypeScript"] },
  { id: "BK-2850", candidate: "Kavya Menon", role: "Cloud Architect", panel: ["Meera Krishnan", "Sanjana Rao"], date: "Thu, May 28", time: "3:00 PM", duration: 90, status: "confirmed" as BookingStatus, round: "Architecture Review", skills: ["Cloud Architecture", "Terraform"] },
  { id: "BK-2851", candidate: "Aditya Rao", role: "iOS Engineer", panel: ["Karthik Menon"], date: "Fri, May 29", time: "9:30 AM", duration: 45, status: "pending" as BookingStatus, round: "Technical", skills: ["Swift", "iOS"] },
  { id: "BK-2852", candidate: "Ishita Bose", role: "Security Engineer", panel: ["Vikram Nair"], date: "Mon, Jun 1", time: "1:00 PM", duration: 60, status: "cancelled" as BookingStatus, round: "Technical", skills: ["Security", "Cryptography"] },
];

const utilizationData = [
  { week: "Apr W1", platform: 71, frontend: 58, data: 89, security: 42 },
  { week: "Apr W2", platform: 68, frontend: 61, data: 85, security: 38 },
  { week: "Apr W3", platform: 74, frontend: 55, data: 92, security: 51 },
  { week: "Apr W4", platform: 79, frontend: 63, data: 88, security: 45 },
  { week: "May W1", platform: 75, frontend: 67, data: 94, security: 49 },
  { week: "May W2", platform: 82, frontend: 72, data: 91, security: 44 },
  { week: "May W3", platform: 78, frontend: 62, data: 93, security: 47 },
];

const skillCoverageData = [
  { skill: "System Design", coverage: 92, demand: 100, panelists: 8 },
  { skill: "Frontend/React", coverage: 71, demand: 95, panelists: 5 },
  { skill: "Data Engineering", coverage: 85, demand: 88, panelists: 6 },
  { skill: "Security", coverage: 48, demand: 82, panelists: 3 },
  { skill: "Mobile iOS", coverage: 35, demand: 75, panelists: 2 },
  { skill: "Cloud Architecture", coverage: 62, demand: 90, panelists: 4 },
  { skill: "ML/AI", coverage: 28, demand: 98, panelists: 2 },
  { skill: "Rust/Systems", coverage: 41, demand: 65, panelists: 3 },
];

const interviewVolumeData = [
  { month: "Nov", completed: 34, scheduled: 38, cancelled: 4 },
  { month: "Dec", completed: 28, scheduled: 31, cancelled: 3 },
  { month: "Jan", completed: 42, scheduled: 47, cancelled: 5 },
  { month: "Feb", completed: 51, scheduled: 55, cancelled: 4 },
  { month: "Mar", completed: 58, scheduled: 63, cancelled: 5 },
  { month: "Apr", completed: 67, scheduled: 71, cancelled: 4 },
  { month: "May", completed: 49, scheduled: 58, cancelled: 3 },
];

const weekDays = ["Mon 26", "Tue 27", "Wed 28", "Thu 29", "Fri 30"];
const timeSlots = ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const panelistWeekDays = ["Mon May 25", "Tue May 26", "Wed May 27", "Thu May 28", "Fri May 29"];
const panelistSlotTimes = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const panelistInitialSlots: string[] = [];

const panelistContributionData = [
  { period: "Dec", slots: 18, interviews: 7 },
  { period: "Jan", slots: 22, interviews: 9 },
  { period: "Feb", slots: 20, interviews: 8 },
  { period: "Mar", slots: 26, interviews: 11 },
  { period: "Apr", slots: 24, interviews: 10 },
  { period: "May", slots: 31, interviews: 13 },
];

const managerTeamSlotData = [
  { team: "Data Platform", slots: 18, target: 44, panelists: 8, active: 3 },
  { team: "Platform", slots: 42, target: 48, panelists: 9, active: 7 },
  { team: "Frontend", slots: 36, target: 40, panelists: 7, active: 6 },
  { team: "Infrastructure", slots: 31, target: 38, panelists: 6, active: 5 },
  { team: "Security", slots: 24, target: 32, panelists: 5, active: 4 },
];

const managerReportees = [
  { name: "Anika Rao", role: "Senior Data Engineer", initials: "AR", slots: 0, lastSubmitted: "Not submitted", status: "Critical" },
  { name: "Bharat Chandra", role: "Staff Data Engineer", initials: "BC", slots: 2, lastSubmitted: "Yesterday", status: "Low" },
  { name: "Charu Lingam", role: "ML Platform Engineer", initials: "CL", slots: 0, lastSubmitted: "2 weeks ago", status: "Critical" },
  { name: "Dev Santoshi", role: "Analytics Engineer", initials: "DS", slots: 6, lastSubmitted: "Today", status: "Healthy" },
  { name: "Esha Pillai", role: "Principal Data Engineer", initials: "EP", slots: 10, lastSubmitted: "Today", status: "Healthy" },
  { name: "Farhan Khan", role: "Data Architect", initials: "FK", slots: 0, lastSubmitted: "Not submitted", status: "Critical" },
  { name: "Naveen Walia", role: "Data Engineer", initials: "NW", slots: 0, lastSubmitted: "Last month", status: "Critical" },
  { name: "Rhea Menon", role: "Spark Engineer", initials: "RM", slots: 0, lastSubmitted: "Not submitted", status: "Critical" },
];

const helperSlotsByPanelist: Record<number, { id: string; date: string; time: string; status: "available" | "booked"; note: string }[]> = {
  1: [
    { id: "sr-1", date: "Tue Jun 2", time: "2:00 PM", status: "booked", note: "Booked for Aarav Iyer" },
    { id: "sr-2", date: "Thu Jun 4", time: "3:00 PM", status: "available", note: "Open from submitted slots" },
    { id: "sr-3", date: "Fri Jun 5", time: "10:00 AM", status: "available", note: "Open from submitted slots" },
  ],
  2: [
    { id: "rk-1", date: "Tue Jun 2", time: "10:00 AM", status: "booked", note: "Booked for Rahul Patel" },
    { id: "rk-2", date: "Wed Jun 3", time: "11:00 AM", status: "available", note: "Open from submitted slots" },
    { id: "rk-3", date: "Thu Jun 4", time: "3:00 PM", status: "available", note: "Open from submitted slots" },
    { id: "rk-4", date: "Fri Jun 5", time: "10:00 AM", status: "booked", note: "Booked for React screen" },
  ],
  3: [
    { id: "ps-1", date: "Tue Jun 2", time: "10:00 AM", status: "available", note: "Open from submitted slots" },
    { id: "ps-2", date: "Tue Jun 2", time: "2:00 PM", status: "booked", note: "Booked for Neha Reddy" },
    { id: "ps-3", date: "Fri Jun 5", time: "10:00 AM", status: "available", note: "Open from submitted slots" },
  ],
  4: [
    { id: "vn-1", date: "Wed Jun 3", time: "11:00 AM", status: "available", note: "Open from submitted slots" },
    { id: "vn-2", date: "Thu Jun 4", time: "9:00 AM", status: "booked", note: "Booked for security round" },
    { id: "vn-3", date: "Fri Jun 5", time: "11:00 AM", status: "available", note: "Open from submitted slots" },
  ],
  5: [
    { id: "mk-1", date: "Thu Jun 4", time: "3:00 PM", status: "booked", note: "Booked for Kavya Menon" },
    { id: "mk-2", date: "Fri Jun 5", time: "2:00 PM", status: "available", note: "Open from submitted slots" },
  ],
  6: [
    { id: "km-1", date: "Fri Jun 5", time: "10:00 AM", status: "available", note: "Open from submitted slots" },
    { id: "km-2", date: "Fri Jun 5", time: "3:00 PM", status: "available", note: "Open from submitted slots" },
  ],
  7: [
    { id: "ad-1", date: "Tue Jun 2", time: "11:00 AM", status: "available", note: "Open from submitted slots" },
    { id: "ad-2", date: "Wed Jun 3", time: "2:00 PM", status: "booked", note: "Booked for frontend round" },
    { id: "ad-3", date: "Thu Jun 4", time: "4:00 PM", status: "available", note: "Open from submitted slots" },
  ],
  8: [
    { id: "nb-1", date: "Mon Jun 1", time: "3:00 PM", status: "available", note: "Open from submitted slots" },
    { id: "nb-2", date: "Wed Jun 3", time: "10:00 AM", status: "booked", note: "Booked for TypeScript round" },
    { id: "nb-3", date: "Fri Jun 5", time: "12:00 PM", status: "available", note: "Open from submitted slots" },
  ],
};

const calendarData: Record<string, Record<string, Status>> = {
  "Sanjana Rao": { "Mon 26-9:00": "available", "Mon 26-10:00": "booked", "Mon 26-11:00": "booked", "Tue 27-10:00": "available", "Tue 27-11:00": "available", "Wed 28-14:00": "booked", "Thu 29-9:00": "available", "Thu 29-10:00": "available", "Fri 30-15:00": "available" },
  "Rohan Kulkarni": { "Mon 26-14:00": "available", "Mon 26-15:00": "available", "Tue 27-11:00": "booked", "Wed 28-9:00": "available", "Wed 28-10:00": "available", "Thu 29-13:00": "available", "Fri 30-10:00": "booked" },
  "Priya Sharma": { "Mon 26-9:00": "booked", "Mon 26-10:00": "booked", "Tue 27-14:00": "booked", "Tue 27-15:00": "booked", "Thu 29-9:00": "booked", "Fri 30-9:00": "available" },
  "Vikram Nair": { "Mon 26-11:00": "available", "Tue 27-9:00": "available", "Tue 27-10:00": "available", "Wed 28-15:00": "available", "Wed 28-16:00": "available", "Thu 29-14:00": "available", "Fri 30-11:00": "available", "Fri 30-12:00": "available" },
};

const notifications = [
  { id: 1, type: "warning", message: "ML/AI skill coverage critically low — only 2 panelists available for 12 pending interviews", time: "2m ago", read: false },
  { id: 2, type: "info", message: "Priya Sharma has reached 91% utilization this week — consider redistributing", time: "15m ago", read: false },
  { id: 3, type: "success", message: "BK-2847 confirmed: Aarav Iyer interview scheduled with Sanjana Rao & Rohan Kulkarni", time: "1h ago", read: false },
  { id: 4, type: "warning", message: "3 panelists haven't submitted slots for week of Jun 1 — auto-reminders sent", time: "2h ago", read: true },
  { id: 5, type: "error", message: "BK-2852 cancelled — Ishita Bose declined interview. Slot released back to pool", time: "3h ago", read: true },
];

const practiceDistribution = [
  { name: "Application Development", value: 30, color: "#0052cc" },
  { name: "Storage and System Development", value: 22, color: "#059669" },
  { name: "Testing", value: 16, color: "#f59e0b" },
  { name: "Infra and Cloud Ops", value: 20, color: "#7c3aed" },
  { name: "Payments", value: 12, color: "#06b6d4" },
];

const inboxMessages = [
  {
    id: "panel-weekly-slots",
    sender: "Aziro IQ",
    senderEmail: "aziro-iq@aziro.com",
    initials: "AI",
    subject: "Action required: share your interview slots for this week",
    preview: "Please provide your availability for May 25-29 so HR can schedule panel interviews.",
    time: "Mon 9:00 AM",
    unread: true,
    focused: true,
    category: "Interview panel",
  },
  {
    id: "candidate-feedback",
    sender: "Maya Iyer",
    senderEmail: "maya.iyer@aziro.com",
    initials: "MI",
    subject: "Feedback notes for Aarav Iyer",
    preview: "Thanks for joining the technical round. Please add final notes before EOD.",
    time: "Fri 4:42 PM",
    unread: false,
    focused: true,
    category: "Recruiting",
  },
  {
    id: "architecture-review",
    sender: "Arjun Mehta",
    senderEmail: "arjun.mehta@aziro.com",
    initials: "AM",
    subject: "Architecture review prep",
    preview: "Sharing the candidate packet and focus areas for next week's system design panel.",
    time: "Fri 2:15 PM",
    unread: false,
    focused: true,
    category: "Leadership",
  },
  {
    id: "it-maintenance",
    sender: "IT Service Desk",
    senderEmail: "it.service@aziro.com",
    initials: "IT",
    subject: "Planned maintenance window",
    preview: "VPN maintenance is scheduled on Saturday from 11:00 PM to 12:30 AM.",
    time: "Thu 6:10 PM",
    unread: false,
    focused: false,
    category: "IT",
  },
  {
    id: "learning-newsletter",
    sender: "Aziro Learning",
    senderEmail: "learning@aziro.com",
    initials: "AL",
    subject: "New learning paths available",
    preview: "Explore refreshed modules on AI engineering, cloud reliability, and secure design.",
    time: "Thu 11:08 AM",
    unread: false,
    focused: false,
    category: "Learning",
  },
];

const outlookCalendarDays = ["Mon 25", "Tue 26", "Wed 27", "Thu 28", "Fri 29"];
const outlookCalendarHours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const mynexthireInterviewSlots = [
  {
    id: "MNH-7210",
    day: "Mon 25",
    start: "10:00",
    end: "11:00",
    candidate: "Aarav Iyer",
    role: "Staff Engineer",
    round: "System Design",
    panel: "Sanjana Rao, Rohan Kulkarni",
    status: "Confirmed",
    color: "bg-[#e5f1fb] border-[#0f6cbd] text-[#0f3a5f]",
  },
  {
    id: "MNH-7211",
    day: "Tue 26",
    start: "14:00",
    end: "15:00",
    candidate: "Neha Reddy",
    role: "Senior Data Engineer",
    round: "Data Deep Dive",
    panel: "Priya Sharma",
    status: "Confirmed",
    color: "bg-[#e9f5ee] border-[#107c41] text-[#0f5132]",
  },
  {
    id: "MNH-7212",
    day: "Wed 27",
    start: "11:00",
    end: "12:00",
    candidate: "Rahul Patel",
    role: "Frontend Engineer",
    round: "React Coding",
    panel: "Rohan Kulkarni",
    status: "Tentative",
    color: "bg-[#fff4ce] border-[#f3a800] text-[#5c3b00]",
  },
  {
    id: "MNH-7213",
    day: "Thu 28",
    start: "15:00",
    end: "16:30",
    candidate: "Kavya Menon",
    role: "Cloud Architect",
    round: "Architecture Review",
    panel: "Meera Krishnan, Sanjana Rao",
    status: "Confirmed",
    color: "bg-[#f3edfb] border-[#8661c5] text-[#3b2b63]",
  },
  {
    id: "MNH-7214",
    day: "Fri 29",
    start: "09:00",
    end: "09:45",
    candidate: "Aditya Rao",
    role: "iOS Engineer",
    round: "Mobile Technical",
    panel: "Karthik Menon",
    status: "Confirmed",
    color: "bg-[#fde7e9] border-[#d13438] text-[#5c1a1c]",
  },
];

/* ─── Utils ─── */
function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

function formatSlotWindow(time: string): string {
  const hour = Number(time.split(":")[0]);
  const endHour = hour + 1;
  const toDisplayHour = (value: number) => {
    if (value === 0) return 12;
    return value > 12 ? value - 12 : value;
  };
  const suffix = hour >= 13 ? " PM" : "";
  return `${toDisplayHour(hour)}-${toDisplayHour(endHour)}${suffix}`;
}

function StatusBadge({ status }: { status: Status | BookingStatus }) {
  const map: Record<string, string> = {
    available: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    booked: "bg-blue-50 text-blue-700 border border-blue-200",
    partial: "bg-amber-50 text-amber-700 border border-amber-200",
    unavailable: "bg-red-50 text-red-700 border border-red-200",
    confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border border-amber-200",
    cancelled: "bg-red-50 text-red-700 border border-red-200",
    completed: "bg-slate-50 text-slate-600 border border-slate-200",
  };
  const labels: Record<string, string> = {
    available: "Available", booked: "Fully Booked", partial: "Partial",
    unavailable: "Unavailable", confirmed: "Confirmed", pending: "Pending",
    cancelled: "Cancelled", completed: "Completed",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium", map[status])}>
      {labels[status]}
    </span>
  );
}

function Avatar({ initials, size = "md", color }: { initials: string; size?: "sm" | "md" | "lg"; color?: string }) {
  const colors = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500", "bg-cyan-500", "bg-rose-500"];
  const bg = color || colors[initials.charCodeAt(0) % colors.length];
  const sz = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-11 h-11 text-base" }[size];
  return (
    <div className={cn(sz, bg, "rounded-full flex items-center justify-center text-white font-semibold shrink-0 select-none")}>
      {initials}
    </div>
  );
}

function KpiCard({ label, value, delta, deltaUp, icon, color, sub }: {
  label: string; value: string; delta?: string; deltaUp?: boolean; icon: React.ReactNode; color: string; sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-black/[0.07] p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", color)}>
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {delta && (
          <span className={cn("inline-flex items-center gap-0.5 text-xs font-semibold", deltaUp ? "text-emerald-600" : "text-red-500")}>
            {deltaUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {delta}
          </span>
        )}
        {sub && <span className="text-xs text-slate-400">{sub}</span>}
      </div>
    </div>
  );
}

/* ─── Views ─── */
function DashboardView({ onNavigate, user }: { onNavigate: (v: string) => void; user: MockUser }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Good morning, {user.name.split(" ")[0]}</h1>
          <p className="text-sm text-slate-500 mt-0.5">Friday, May 22, 2026 · {user.role} workspace · 14 interviews scheduled this week</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-sm text-slate-600 border border-slate-200 bg-white px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
            <RefreshCw size={13} /> Sync Calendar
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Active Panelists" value="24" delta="+3 this month" deltaUp icon={<Users size={18} className="text-blue-600" />} color="bg-blue-50" sub="vs last month" />
        <KpiCard label="Slots Available" value="187" delta="+12%" deltaUp icon={<CalendarCheck size={18} className="text-emerald-600" />} color="bg-emerald-50" sub="this week" />
        <KpiCard label="Interviews Booked" value="58" delta="-4%" deltaUp={false} icon={<BookOpen size={18} className="text-violet-600" />} color="bg-violet-50" sub="this month" />
        <KpiCard label="Panel Utilization" value="73%" delta="+8pp" deltaUp icon={<Activity size={18} className="text-amber-600" />} color="bg-amber-50" sub="avg across teams" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Interview Volume Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-black/[0.07] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Interview Volume</h3>
              <p className="text-xs text-slate-400 mt-0.5">Completed vs scheduled over 7 months</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /> Completed</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-200 inline-block" /> Scheduled</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={interviewVolumeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0052cc" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0052cc" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bfdbfe" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#bfdbfe" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
              <Area type="monotone" dataKey="scheduled" stroke="#bfdbfe" strokeWidth={2} fill="url(#gradLight)" />
              <Area type="monotone" dataKey="completed" stroke="#0052cc" strokeWidth={2} fill="url(#gradBlue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Practice Distribution */}
        <div className="bg-white rounded-xl border border-black/[0.07] p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 text-sm">Panel by Practice</h3>
            <p className="text-xs text-slate-400 mt-0.5">Interview slot distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={practiceDistribution} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                {practiceDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {practiceDistribution.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="text-xs text-slate-600 truncate">{d.name}</span>
                <span className="ml-auto text-xs font-semibold text-slate-700" style={{ fontFamily: "JetBrains Mono, monospace" }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings + Top Panelists */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-white rounded-xl border border-black/[0.07] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 text-sm">Upcoming Interviews</h3>
            <button onClick={() => onNavigate("bookings")} className="text-xs text-blue-600 font-medium hover:text-blue-800">View all →</button>
          </div>
          <div className="divide-y divide-slate-50">
            {bookings.slice(0, 4).map(b => (
              <div key={b.id} className="px-5 py-3.5 hover:bg-slate-50/50 transition-colors flex items-center gap-4">
                <div className="w-1.5 h-10 rounded-full shrink-0" style={{ background: b.status === "confirmed" ? "#059669" : b.status === "pending" ? "#f59e0b" : "#dc2626" }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800 truncate">{b.candidate}</span>
                    <span className="text-xs text-slate-400 font-mono">{b.id}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{b.role} · {b.round} · {b.panel.join(", ")}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-slate-700">{b.date}</p>
                  <p className="text-xs text-slate-400">{b.time} · {b.duration}m</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Top Contributors */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-black/[0.07] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 text-sm">Top Contributors</h3>
            <Award size={14} className="text-amber-500" />
          </div>
          <div className="divide-y divide-slate-50">
            {panelists.sort((a, b) => b.totalInterviews - a.totalInterviews).slice(0, 5).map((p, i) => (
              <div key={p.id} className="px-5 py-3 hover:bg-slate-50/50 transition-colors flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300 w-4 text-right" style={{ fontFamily: "JetBrains Mono, monospace" }}>#{i + 1}</span>
                <Avatar initials={p.avatar} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                  <p className="text-xs text-slate-400 truncate">{p.dept}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-700" style={{ fontFamily: "JetBrains Mono, monospace" }}>{p.totalInterviews}</p>
                  <div className="flex items-center gap-0.5 justify-end">
                    <Star size={9} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs text-slate-500">{p.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarView() {
  const [selectedPanelist, setSelectedPanelist] = useState("Sanjana Rao");
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const slotColor: Record<Status, string> = {
    available: "bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200 cursor-pointer",
    booked: "bg-blue-100 border-blue-300 text-blue-800 cursor-default",
    partial: "bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200 cursor-pointer",
    unavailable: "bg-slate-100 border-slate-200 text-slate-400 cursor-default",
  };

  const matrix = calendarData[selectedPanelist] || {};

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Panel Availability Calendar</h1>
          <p className="text-sm text-slate-500 mt-0.5">Week of May 26–30, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm border border-slate-200 bg-white px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5">
            <Filter size={13} /> Filter
          </button>
          <button className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 font-medium">
            <Plus size={13} /> Add Slots
          </button>
        </div>
      </div>

      {/* Panelist selector */}
      <div className="bg-white rounded-xl border border-black/[0.07] p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Select Panelist</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(calendarData).map(name => {
            const p = panelists.find(x => x.name === name)!;
            return (
              <button
                key={name}
                onClick={() => setSelectedPanelist(name)}
                className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all duration-150",
                  selectedPanelist === name
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", p?.status === "available" ? "bg-emerald-400" : p?.status === "booked" ? "bg-red-400" : "bg-amber-400")} />
                {name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
        <div className="grid" style={{ gridTemplateColumns: "80px repeat(5, 1fr)" }}>
          {/* Header */}
          <div className="px-3 py-3 border-b border-r border-slate-100 bg-slate-50" />
          {weekDays.map(d => (
            <div key={d} className="px-3 py-3 border-b border-r border-slate-100 bg-slate-50 text-center">
              <p className="text-xs font-bold text-slate-700">{d.split(" ")[0]}</p>
              <p className="text-lg font-bold text-slate-900 leading-tight">{d.split(" ")[1]}</p>
            </div>
          ))}

          {/* Slots */}
          {timeSlots.map(time => (
            <Fragment key={`row-${time}`}>
              <div className="px-3 py-2 border-b border-r border-slate-100 bg-slate-50/50 flex items-center">
                <span className="text-xs text-slate-400 font-medium" style={{ fontFamily: "JetBrains Mono, monospace" }}>{time}</span>
              </div>
              {weekDays.map(day => {
                const key = `${day}-${time}`;
                const status: Status = matrix[key] || "unavailable";
                const isHovered = hoveredSlot === key;
                return (
                  <div
                    key={key}
                    className="border-b border-r border-slate-100 p-1"
                    onMouseEnter={() => setHoveredSlot(key)}
                    onMouseLeave={() => setHoveredSlot(null)}
                  >
                    {status !== "unavailable" && (
                      <div className={cn("h-full min-h-[36px] rounded border text-xs flex items-center justify-center font-medium transition-all", slotColor[status], isHovered && "shadow-sm")}>
                        {status === "booked" ? "Booked" : status === "available" ? "Open" : "Partial"}
                      </div>
                    )}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 bg-white rounded-xl border border-black/[0.07] px-5 py-3">
        {([["available", "bg-emerald-300", "Available"], ["booked", "bg-blue-400", "Booked"], ["partial", "bg-amber-300", "Partial"]] as const).map(([, bg, label]) => (
          <div key={label} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded", bg)} />
            <span className="text-xs text-slate-600 font-medium">{label}</span>
          </div>
        ))}
        <div className="ml-auto text-xs text-slate-400">
          Click available slots to book an interview
        </div>
      </div>
    </div>
  );
}

function PanelistsView() {
  const [showForm, setShowForm] = useState(false);
  const [selectedPanelist, setSelectedPanelist] = useState<number | null>(null);

  const utilizationColor = (u: number) => u >= 85 ? "text-red-600 bg-red-50" : u >= 70 ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Panelists</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage panel members, skills, and availability</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-sm border border-slate-200 bg-white px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50">
            <Download size={13} /> Export
          </button>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-medium">
            <Plus size={13} /> Add Panelist
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Panelists", value: "24", icon: <Users size={15} />, color: "text-blue-600 bg-blue-50" },
          { label: "Active This Week", value: "18", icon: <UserCheck size={15} />, color: "text-emerald-600 bg-emerald-50" },
          { label: "Overutilized (>85%)", value: "3", icon: <AlertCircle size={15} />, color: "text-red-600 bg-red-50" },
          { label: "Slots Unsubmitted", value: "6", icon: <Clock size={15} />, color: "text-amber-600 bg-amber-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-black/[0.07] px-4 py-3 flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", s.color)}>{s.icon}</div>
            <div>
              <p className="text-xl font-bold text-slate-900 leading-none">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Panelist Table */}
      <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" placeholder="Search panelists, skills, departments…" />
          </div>
          <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            <option>All Departments</option>
            <option>Platform</option>
            <option>Frontend</option>
            <option>Data</option>
            <option>Security</option>
          </select>
          <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
            <option>All Statuses</option>
            <option>Available</option>
            <option>Booked</option>
            <option>Partial</option>
          </select>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              {["Panelist", "Department", "Skills", "This Week", "Utilization", "Interviews", "Rating", "Status", ""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {panelists.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedPanelist(p.id === selectedPanelist ? null : p.id)}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar initials={p.avatar} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-600">{p.dept}</td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {p.skills.slice(0, 2).map(s => (
                      <span key={s} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded font-medium">{s}</span>
                    ))}
                    {p.skills.length > 2 && <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 text-xs rounded">+{p.skills.length - 2}</span>}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm font-medium text-slate-700" style={{ fontFamily: "JetBrains Mono, monospace" }}>{p.slotsThisWeek} slots</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${p.utilization}%`, background: p.utilization >= 85 ? "#dc2626" : p.utilization >= 70 ? "#f59e0b" : "#059669" }} />
                    </div>
                    <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded", utilizationColor(p.utilization))} style={{ fontFamily: "JetBrains Mono, monospace" }}>{p.utilization}%</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm font-semibold text-slate-700" style={{ fontFamily: "JetBrains Mono, monospace" }}>{p.totalInterviews}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-slate-700">{p.rating}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                <td className="px-5 py-3.5">
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slot Submission Panel */}
      {showForm && (
        <div className="bg-white rounded-xl border border-black/[0.07] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800">Submit Availability Slots</h3>
              <p className="text-xs text-slate-500 mt-0.5">Select your available time slots for the week of Jun 1–5, 2026</p>
            </div>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-5 gap-3 mb-5">
            {["Mon Jun 1", "Tue Jun 2", "Wed Jun 3", "Thu Jun 4", "Fri Jun 5"].map((day, di) => (
              <div key={day}>
                <p className="text-xs font-bold text-slate-600 mb-2 text-center">{day}</p>
                <div className="space-y-1">
                  {["9:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map(t => {
                    const [checked, setChecked] = useState(di < 2 && ["10:00", "11:00"].includes(t));
                    return (
                      <button key={t} onClick={() => setChecked(!checked)} className={cn("w-full text-xs py-1.5 rounded border transition-all", checked ? "bg-blue-600 border-blue-600 text-white font-semibold" : "bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50")} style={{ fontFamily: "JetBrains Mono, monospace" }}>
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">Slots auto-sync to Outlook calendar upon submission</p>
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="text-sm border border-slate-200 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => setShowForm(false)} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-1.5">
                <Check size={13} /> Submit Slots
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingsView() {
  const [activeStep, setActiveStep] = useState(0);
  const [candidateName, setCandidateName] = useState("Arjun Nair");
  const [selectedSkill, setSelectedSkill] = useState("React");
  const [selectedPanelistId, setSelectedPanelistId] = useState<number | null>(2);
  const [selectedSlot, setSelectedSlot] = useState("Wed Jun 3|11:00 AM");
  const steps = ["Candidate & Skill", "Panelist & Slot", "Confirm"];
  const skillOptions = ["System Design", "React", "TypeScript", "Data Engineering", "Python", "Security", "Cloud Architecture", "Swift", "iOS"];
  const matchingPanelists = panelists.filter(p => p.skills.includes(selectedSkill));
  const selectedPanelist = panelists.find(p => p.id === selectedPanelistId) || null;
  const slotsByPanelist: Record<number, { id: string; date: string; time: string; strength: string; booked?: boolean }[]> = {
    1: [
      { id: "Tue Jun 2|2:00 PM", date: "Tue Jun 2", time: "2:00 PM", strength: "Booked", booked: true },
      { id: "Thu Jun 4|3:00 PM", date: "Thu Jun 4", time: "3:00 PM", strength: "Available" },
      { id: "Fri Jun 5|10:00 AM", date: "Fri Jun 5", time: "10:00 AM", strength: "Available" },
    ],
    2: [
      { id: "Tue Jun 2|10:00 AM", date: "Tue Jun 2", time: "10:00 AM", strength: "Booked", booked: true },
      { id: "Wed Jun 3|11:00 AM", date: "Wed Jun 3", time: "11:00 AM", strength: "Available" },
      { id: "Thu Jun 4|3:00 PM", date: "Thu Jun 4", time: "3:00 PM", strength: "Available" },
      { id: "Fri Jun 5|10:00 AM", date: "Fri Jun 5", time: "10:00 AM", strength: "Booked", booked: true },
    ],
    3: [
      { id: "Tue Jun 2|10:00 AM", date: "Tue Jun 2", time: "10:00 AM", strength: "Best match" },
      { id: "Tue Jun 2|2:00 PM", date: "Tue Jun 2", time: "2:00 PM", strength: "Booked", booked: true },
      { id: "Fri Jun 5|10:00 AM", date: "Fri Jun 5", time: "10:00 AM", strength: "Available" },
    ],
    4: [
      { id: "Wed Jun 3|11:00 AM", date: "Wed Jun 3", time: "11:00 AM", strength: "Best match" },
      { id: "Thu Jun 4|9:00 AM", date: "Thu Jun 4", time: "9:00 AM", strength: "Booked", booked: true },
      { id: "Fri Jun 5|11:00 AM", date: "Fri Jun 5", time: "11:00 AM", strength: "Available" },
    ],
    5: [
      { id: "Thu Jun 4|3:00 PM", date: "Thu Jun 4", time: "3:00 PM", strength: "Booked", booked: true },
      { id: "Fri Jun 5|2:00 PM", date: "Fri Jun 5", time: "2:00 PM", strength: "Available" },
    ],
    6: [
      { id: "Fri Jun 5|10:00 AM", date: "Fri Jun 5", time: "10:00 AM", strength: "Best match" },
      { id: "Fri Jun 5|3:00 PM", date: "Fri Jun 5", time: "3:00 PM", strength: "Available" },
    ],
    7: [
      { id: "Tue Jun 2|11:00 AM", date: "Tue Jun 2", time: "11:00 AM", strength: "Best match" },
      { id: "Wed Jun 3|2:00 PM", date: "Wed Jun 3", time: "2:00 PM", strength: "Booked", booked: true },
      { id: "Thu Jun 4|4:00 PM", date: "Thu Jun 4", time: "4:00 PM", strength: "Available" },
    ],
    8: [
      { id: "Mon Jun 1|3:00 PM", date: "Mon Jun 1", time: "3:00 PM", strength: "Available" },
      { id: "Wed Jun 3|10:00 AM", date: "Wed Jun 3", time: "10:00 AM", strength: "Booked", booked: true },
      { id: "Fri Jun 5|12:00 PM", date: "Fri Jun 5", time: "12:00 PM", strength: "Available" },
    ],
  };
  const availableSlots = selectedPanelistId ? slotsByPanelist[selectedPanelistId] || [] : [];
  const selectedSlotInfo = availableSlots.find(slot => slot.id === selectedSlot) || availableSlots[0];

  const selectPanelist = (id: number) => {
    const slots = slotsByPanelist[id] || [];
    setSelectedPanelistId(id);
    setSelectedSlot(slots.find(slot => !slot.booked)?.id || "");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Interview Bookings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and schedule all interview sessions</p>
        </div>
        <button className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-medium">
          <Plus size={13} /> New Booking
        </button>
      </div>

      {/* Booking Wizard */}
      <div className="bg-white rounded-xl border border-black/[0.07] p-5">
        <h3 className="font-bold text-slate-800 mb-4">New Interview Booking</h3>
        <div className="flex items-center gap-0 mb-6">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <button onClick={() => setActiveStep(i)} className="flex flex-col items-center gap-1.5 flex-1">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all", i < activeStep ? "bg-blue-600 text-white" : i === activeStep ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-slate-100 text-slate-400")}>
                  {i < activeStep ? <Check size={14} /> : i + 1}
                </div>
                <span className={cn("text-xs font-medium whitespace-nowrap", i === activeStep ? "text-blue-600" : i < activeStep ? "text-slate-600" : "text-slate-400")}>{step}</span>
              </button>
              {i < steps.length - 1 && <div className={cn("h-0.5 flex-1 -mt-5 mx-2", i < activeStep ? "bg-blue-600" : "bg-slate-200")} />}
            </div>
          ))}
        </div>

        {activeStep === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Candidate Name</label>
                <input value={candidateName} onChange={event => setCandidateName(event.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" placeholder="Enter candidate name" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Required Skill</label>
                <select
                  value={selectedSkill}
                  onChange={event => {
                    setSelectedSkill(event.target.value);
                    setSelectedPanelistId(null);
                    setSelectedSlot("");
                  }}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  {skillOptions.map(skill => <option key={skill}>{skill}</option>)}
                </select>
              </div>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-sm font-medium text-blue-900">Next step shows matching panelists for <span className="font-bold">{selectedSkill}</span> and available time slots in the same screen.</p>
            </div>
            <div className="flex justify-end">
              <button disabled={!candidateName.trim() || !selectedSkill} onClick={() => setActiveStep(1)} className={cn("text-sm px-5 py-2 rounded-lg font-medium flex items-center gap-1.5", candidateName.trim() && selectedSkill ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-100 text-slate-400 cursor-not-allowed")}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Showing panelists with <strong>{selectedSkill}</strong>. Select one panelist to load their available slots.</p>
            <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-4">
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">Matching panelists</h4>
                  <span className="text-xs font-semibold text-slate-500">{selectedPanelistId ? "1 selected" : "None selected"}</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {matchingPanelists.map(p => {
                    const selected = selectedPanelistId === p.id;
                    return (
                      <button key={p.id} onClick={() => selectPanelist(p.id)} className={cn("w-full text-left flex items-center gap-4 p-3 transition-all", selected ? "bg-blue-50" : "bg-white hover:bg-slate-50")}>
                        <div className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0", selected ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300")}>
                          {selected && <Check size={11} className="text-white" />}
                        </div>
                        <Avatar initials={p.avatar} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.role} · {p.skills.join(", ")}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={cn("text-xs font-bold px-2 py-0.5 rounded", p.utilization >= 85 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600")}>{p.utilization}% utilized</span>
                          <StatusBadge status={p.status} />
                        </div>
                      </button>
                    );
                  })}
                  {matchingPanelists.length === 0 && (
                    <div className="p-5 text-sm text-slate-500">No panelists currently match this skill.</div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800">Available time slots</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedPanelist ? `Loaded slots for ${selectedPanelist.name}.` : "Select one panelist to load their slots."}</p>
                </div>
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2">
                  {availableSlots.map(slot => {
                    const selected = selectedSlot === slot.id;
                    const disabled = !selectedPanelist || slot.booked;
                    return (
                      <button key={slot.id} disabled={disabled} onClick={() => setSelectedSlot(slot.id)} className={cn("p-3 rounded-lg border text-left transition-all", slot.booked ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-80" : disabled ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed" : selected ? "bg-blue-600 border-blue-600 text-white shadow-sm" : "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700")}>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold">{slot.date}</p>
                          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", slot.booked ? "bg-red-50 text-red-600" : selected ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500")}>{slot.strength}</span>
                        </div>
                        <p className="text-base font-bold mt-0.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>{slot.time}</p>
                        <p className={cn("text-xs mt-1 truncate", selected ? "text-blue-100" : slot.booked ? "text-red-400" : "text-slate-400")}>{slot.booked ? "Already booked for another interview" : "Open from submitted weekly slots"}</p>
                      </button>
                    );
                  })}
                  {!selectedPanelist && (
                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                      <CalendarCheck size={18} className="mx-auto text-slate-300" />
                      <p className="mt-2 text-sm font-medium text-slate-500">Select a panelist to view slots</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 flex items-center gap-2">
              <CalendarCheck size={14} className="text-blue-600 shrink-0" />
              <p className="text-xs text-slate-600">
                Selected: <span className="font-bold text-slate-800">{selectedPanelist?.name || "No panelist selected"}</span>
                {selectedPanelist && selectedSlotInfo && <> · <span className="font-bold text-slate-800">{selectedSlotInfo.date}, {selectedSlotInfo.time}</span></>}
              </p>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setActiveStep(0)} className="text-sm border border-slate-200 px-5 py-2 rounded-lg text-slate-600 hover:bg-slate-50">Back</button>
              <button disabled={!selectedPanelist || !selectedSlot} onClick={() => setActiveStep(2)} className={cn("text-sm px-5 py-2 rounded-lg font-medium flex items-center gap-1.5", selectedPanelist && selectedSlot ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-100 text-slate-400 cursor-not-allowed")}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
              {[
                ["Candidate", candidateName],
                ["Required Skill", selectedSkill],
                ["Panel", selectedPanelist?.name || ""],
                ["Date & Time", selectedSlotInfo ? `${selectedSlotInfo.date} at ${selectedSlotInfo.time}` : ""],
                ["Duration", "60 minutes"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500 w-28 shrink-0">{label}</span>
                  <span className="text-sm font-semibold text-slate-800">{value}</span>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <CheckCircle2 size={15} className="text-emerald-600 mt-0.5 shrink-0" />
              <p className="text-sm text-emerald-800">Panelists are available from submitted weekly slots. Confirming will create the booking and send calendar invites.</p>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setActiveStep(1)} className="text-sm border border-slate-200 px-5 py-2 rounded-lg text-slate-600 hover:bg-slate-50">Back</button>
              <button onClick={() => setActiveStep(0)} className="text-sm bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 font-medium flex items-center gap-1.5">
                <CalendarCheck size={14} /> Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">All Bookings</h3>
          <div className="flex items-center gap-2">
            <button className="text-xs text-slate-500 border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-1">
              <Filter size={11} /> Filter
            </button>
            <button className="text-xs text-slate-500 border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-1">
              <Download size={11} /> Export
            </button>
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {bookings.map(b => (
            <div key={b.id} className="px-5 py-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-center w-14 shrink-0 bg-slate-50 rounded-lg px-2 py-2 border border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">{b.date.split(",")[0]}</p>
                  <p className="text-lg font-bold text-slate-800 leading-tight">{b.date.split(" ")[2]}</p>
                  <p className="text-xs font-semibold text-slate-500">{b.date.split(" ")[1]}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-900">{b.candidate}</span>
                    <span className="text-xs text-slate-400 font-mono">{b.id}</span>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{b.role} · {b.round} · {b.duration} min</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} className="text-slate-400" />
                      <span className="text-xs text-slate-500">{b.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={11} className="text-slate-400" />
                      <span className="text-xs text-slate-500">{b.panel.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="text-xs border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Reschedule</button>
                  <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded hover:bg-slate-100 transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlotHelperView() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["React"]);
  const [skillSearch, setSkillSearch] = useState("");
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [panelLevelFilter, setPanelLevelFilter] = useState<"All" | "L1" | "L2">("All");
  const filteredSkillOptions = useMemo(() => {
    const query = skillSearch.trim().toLowerCase();
    return (query ? editableSkillOptions.filter(skill => skill.toLowerCase().includes(query)) : editableSkillOptions).slice(0, 80);
  }, [skillSearch]);
  const matchingPanelists = panelists.filter(panelist =>
    (selectedSkills.length === 0 || selectedSkills.some(selectedSkill => panelist.skills.includes(selectedSkill))) &&
    (panelLevelFilter === "All" || (panelist.id % 2 === 0 ? "L1" : "L2") === panelLevelFilter)
  );
  const [selectedPanelistId, setSelectedPanelistId] = useState<number | null>(2);
  const selectedPanelist = matchingPanelists.find(panelist => panelist.id === selectedPanelistId) || matchingPanelists[0] || null;
  const selectedSlots = selectedPanelist ? helperSlotsByPanelist[selectedPanelist.id] || [] : [];
  const helperWeekDays = ["Mon Jun 1", "Tue Jun 2", "Wed Jun 3", "Thu Jun 4", "Fri Jun 5"];
  const helperTimeSlots = ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  const toGridTime = (time: string) => {
    const [rawHour, minutePart] = time.split(":");
    const minutes = minutePart.slice(0, 2);
    const meridiem = minutePart.slice(3);
    let hour = Number(rawHour);
    if (meridiem === "PM" && hour !== 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;
    return `${hour}:${minutes}`;
  };
  const toggleSkillFilter = (skill: string) => {
    setSelectedSkills(current => current.includes(skill) ? current.filter(item => item !== skill) : [...current, skill]);
    setSelectedPanelistId(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Slot Helper</h1>
        <p className="text-sm text-slate-500 mt-0.5">Search by skill, review matching panelists, and inspect submitted slot status.</p>
      </div>

      <div className="bg-white rounded-xl border border-black/[0.07] p-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Skills</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSkillsOpen(open => !open)}
                className="w-full min-h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left flex items-center gap-2 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <Search size={15} className="text-slate-400 shrink-0" />
                <span className={cn("text-sm flex-1", selectedSkills.length ? "text-slate-800 font-medium" : "text-slate-400")}>
                  {selectedSkills.length ? `${selectedSkills.length} skills selected` : "Search and select skills"}
                </span>
                <ChevronDown size={15} className="text-slate-400 shrink-0" />
              </button>

              {skillsOpen && (
                <div className="absolute z-40 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                  <div className="p-3 border-b border-slate-100">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={skillSearch}
                        onChange={event => setSkillSearch(event.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Search skills..."
                      />
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {filteredSkillOptions.map(skill => {
                      const selected = selectedSkills.includes(skill);
                      return (
                        <button key={skill} type="button" onClick={() => toggleSkillFilter(skill)} className={cn("w-full px-3 py-2.5 text-left flex items-center gap-3 text-sm hover:bg-blue-50", selected && "bg-blue-50")}>
                          <span className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0", selected ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300")}>
                            {selected && <Check size={11} className="text-white" />}
                          </span>
                          <span className="font-medium text-slate-700">{skill}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="px-3 py-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Showing {filteredSkillOptions.length} skills</span>
                    <button type="button" onClick={() => setSkillsOpen(false)} className="text-xs font-semibold text-blue-600 hover:text-blue-800">Done</button>
                  </div>
                </div>
              )}
            </div>
            {selectedSkills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedSkills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700">
                    {skill}
                    <button type="button" onClick={() => toggleSkillFilter(skill)} className="text-blue-400 hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Panel Level</label>
            <select
              value={panelLevelFilter}
              onChange={event => {
                setPanelLevelFilter(event.target.value as "All" | "L1" | "L2");
                setSelectedPanelistId(null);
              }}
              className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Levels</option>
              <option value="L1">L1</option>
              <option value="L2">L2</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-black/[0.07] p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Select Panelist</h3>
            <p className="text-xs text-slate-500 mt-0.5">{matchingPanelists.length} panelists match the selected skills and level.</p>
          </div>
          {selectedPanelist && (
            <span className="text-xs font-semibold text-slate-500">{selectedPanelist.name} · {selectedPanelist.id % 2 === 0 ? "L1" : "L2"}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {matchingPanelists.map(panelist => {
            const selected = selectedPanelist?.id === panelist.id;
            const panelLevel = panelist.id % 2 === 0 ? "L1" : "L2";
            const slots = helperSlotsByPanelist[panelist.id] || [];
            const availableCount = slots.filter(slot => slot.status === "available").length;
            return (
              <button
                key={panelist.id}
                onClick={() => setSelectedPanelistId(panelist.id)}
                className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all", selected ? "bg-blue-600 border-blue-600 text-white shadow-sm" : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50")}
              >
                <span className={cn("w-2 h-2 rounded-full", panelist.status === "available" ? "bg-emerald-400" : panelist.status === "booked" ? "bg-red-400" : "bg-amber-400")} />
                <span className="font-semibold">{panelist.name}</span>
                <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", selected ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500")}>{panelLevel}</span>
                <span className={cn("text-[10px]", selected ? "text-blue-100" : "text-slate-400")}>{availableCount} open</span>
              </button>
            );
          })}
          {matchingPanelists.length === 0 && (
            <div className="px-3 py-2 text-sm text-slate-500">No panelists found for these filters.</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Weekly Slot Availability</h3>
            <p className="text-xs text-slate-500 mt-0.5">Week of Jun 1-5, 2026 · {selectedPanelist ? selectedPanelist.name : "Select a panelist"}</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-300" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-300" /> Booked</span>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "82px repeat(5, minmax(118px, 1fr))" }}>
          <div className="px-3 py-3 border-b border-r border-slate-100 bg-slate-50" />
          {helperWeekDays.map(day => {
            const [weekday, month, date] = day.split(" ");
            return (
              <div key={day} className="px-3 py-3 border-b border-r border-slate-100 bg-slate-50 text-center">
                <p className="text-xs font-bold text-slate-700">{weekday}</p>
                <p className="text-lg font-bold text-slate-900 leading-tight">{date}</p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">{month}</p>
              </div>
            );
          })}

          {helperTimeSlots.map(time => (
            <Fragment key={`helper-row-${time}`}>
              <div className="px-3 py-2 border-b border-r border-slate-100 bg-slate-50/50 flex items-center">
                <span className="text-xs text-slate-400 font-medium" style={{ fontFamily: "JetBrains Mono, monospace" }}>{time}</span>
              </div>
              {helperWeekDays.map(day => {
                const slot = selectedSlots.find(item => item.date === day && toGridTime(item.time) === time);
                return (
                  <div key={`${day}-${time}`} className="border-b border-r border-slate-100 p-1.5 min-h-[52px]">
                    {slot && (
                      <button className={cn("h-full min-h-10 w-full rounded border text-xs font-bold transition-all", slot.status === "available" ? "bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200" : "bg-blue-100 border-blue-300 text-blue-800 cursor-default")}>
                        {slot.status === "available" ? "Open" : "Booked"}
                      </button>
                    )}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Analytics & Insights</h1>
          <p className="text-sm text-slate-500 mt-0.5">Utilization trends, skill coverage, and panel health metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="text-sm border border-slate-200 bg-white px-3 py-1.5 rounded-lg text-slate-600 focus:outline-none">
            <option>Last 7 weeks</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
          </select>
          <button className="flex items-center gap-1.5 text-sm border border-slate-200 bg-white px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50">
            <Download size={13} /> Export Report
          </button>
        </div>
      </div>

      {/* Utilization Chart */}
      <div className="bg-white rounded-xl border border-black/[0.07] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Panel Utilization by Department</h3>
            <p className="text-xs text-slate-400 mt-0.5">Weekly utilization % over 7 weeks</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {[{ label: "Platform", color: "#0052cc" }, { label: "Frontend", color: "#059669" }, { label: "Data", color: "#f59e0b" }, { label: "Security", color: "#7c3aed" }].map(d => (
              <span key={d.label} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: d.color }} />{d.label}</span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={utilizationData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[20, 100]} />
            <Tooltip contentStyle={{ fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8 }} formatter={(v: number) => `${v}%`} />
            <Line type="monotone" dataKey="platform" stroke="#0052cc" strokeWidth={2.5} dot={{ r: 3, fill: "#0052cc" }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="frontend" stroke="#059669" strokeWidth={2.5} dot={{ r: 3, fill: "#059669" }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="data" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3, fill: "#f59e0b" }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="security" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3, fill: "#7c3aed" }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Skill Coverage Gap Analysis */}
      <div className="bg-white rounded-xl border border-black/[0.07] p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Skill Coverage vs Demand</h3>
            <p className="text-xs text-slate-400 mt-0.5">Panel coverage gap analysis — red indicates critical shortage</p>
          </div>
          <button className="text-xs text-blue-600 font-medium border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-50">Escalate Gaps</button>
        </div>
        <div className="space-y-3">
          {skillCoverageData.map(s => {
            const gap = s.demand - s.coverage;
            const critical = gap > 40;
            const moderate = gap > 20 && gap <= 40;
            return (
              <div key={s.skill} className="grid grid-cols-12 items-center gap-4">
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    {critical && <AlertCircle size={12} className="text-red-500 shrink-0" />}
                    {moderate && <AlertTriangle size={12} className="text-amber-500 shrink-0" />}
                    {!critical && !moderate && <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />}
                    <span className="text-sm font-medium text-slate-700 truncate">{s.skill}</span>
                  </div>
                </div>
                <div className="col-span-7">
                  <div className="relative h-5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="absolute left-0 top-0 h-full rounded-full opacity-30" style={{ width: `${s.demand}%`, background: critical ? "#dc2626" : moderate ? "#f59e0b" : "#059669" }} />
                    <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${s.coverage}%`, background: critical ? "#dc2626" : moderate ? "#f59e0b" : "#059669" }} />
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-3">
                  <span className="text-xs text-slate-400" style={{ fontFamily: "JetBrains Mono, monospace" }}>{s.panelists}p</span>
                  <span className={cn("text-xs font-bold", critical ? "text-red-600" : moderate ? "text-amber-600" : "text-emerald-600")} style={{ fontFamily: "JetBrains Mono, monospace" }}>{s.coverage}%</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-slate-200" /> Demand</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-emerald-500" /> Coverage</span>
          <AlertCircle size={11} className="text-red-500 ml-2" /><span className="text-red-500">Critical gap (&gt;40%)</span>
          <AlertTriangle size={11} className="text-amber-500" /><span className="text-amber-600">Moderate gap (20–40%)</span>
        </div>
      </div>

      {/* Contribution Leaderboard + Escalations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-black/[0.07] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Contribution Leaderboard</h3>
            <span className="text-xs text-slate-400">MTD · May 2026</span>
          </div>
          <div className="space-y-3">
            {panelists.sort((a, b) => b.totalInterviews - a.totalInterviews).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300 w-4" style={{ fontFamily: "JetBrains Mono, monospace" }}>#{i + 1}</span>
                <Avatar initials={p.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                    <span className="text-sm font-bold text-slate-700 ml-2" style={{ fontFamily: "JetBrains Mono, monospace" }}>{p.totalInterviews}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${(p.totalInterviews / 201) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/[0.07] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Escalation Queue</h3>
            <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-bold rounded border border-red-200">3 critical</span>
          </div>
          <div className="space-y-3">
            {[
              { issue: "ML/AI panel shortage", dept: "All Teams", severity: "critical", age: "5 days", action: "Recruit external panelists" },
              { issue: "iOS coverage below SLA", dept: "Mobile", severity: "critical", age: "3 days", action: "Onboard 2 new panelists" },
              { issue: "Security team at 91% util.", dept: "Security", severity: "warning", age: "2 days", action: "Redistribute workload" },
              { issue: "3 slots unsubmitted — Jun W1", dept: "Platform", severity: "info", age: "1 day", action: "Send reminders" },
            ].map((e, i) => (
              <div key={i} className={cn("p-3 rounded-lg border", e.severity === "critical" ? "border-red-200 bg-red-50" : e.severity === "warning" ? "border-amber-200 bg-amber-50" : "border-blue-200 bg-blue-50")}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-slate-800">{e.issue}</p>
                  <span className="text-xs text-slate-400 shrink-0" style={{ fontFamily: "JetBrains Mono, monospace" }}>{e.age}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">{e.dept} · {e.action}</p>
                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">Resolve →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsView() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Reports & Leadership Insights</h1>
          <p className="text-sm text-slate-500 mt-0.5">Executive summaries, trend analysis, and downloadable reports</p>
        </div>
        <button className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-medium">
          <FileText size={13} /> Generate Report
        </button>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Avg Time to Schedule" value="1.4d" delta="-18%" deltaUp icon={<Zap size={18} className="text-blue-600" />} color="bg-blue-50" sub="vs last quarter" />
        <KpiCard label="Panel SLA Adherence" value="94%" delta="+3pp" deltaUp icon={<Shield size={18} className="text-emerald-600" />} color="bg-emerald-50" sub="target: 95%" />
        <KpiCard label="Cancellation Rate" value="6.2%" delta="-1.1pp" deltaUp icon={<XCircle size={18} className="text-violet-600" />} color="bg-violet-50" sub="vs 7.3% last month" />
        <KpiCard label="Panelist Satisfaction" value="4.7/5" delta="+0.2" deltaUp icon={<Star size={18} className="text-amber-600" />} color="bg-amber-50" sub="from feedback survey" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Available Reports */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-black/[0.07] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">Available Reports</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { name: "Weekly Panel Utilization Report", desc: "Dept-wise utilization, slot fill rates, overutilization flags", date: "Updated daily", type: "Operations", format: "XLSX / PDF" },
              { name: "Skill Coverage Gap Analysis", desc: "Current coverage vs demand by skill and team", date: "Updated weekly", type: "Talent", format: "PDF" },
              { name: "Panelist Contribution Summary", desc: "Interview counts, ratings, and recognition eligibility", date: "Monthly", type: "HR", format: "XLSX" },
              { name: "Booking & Scheduling Efficiency", desc: "Lead time, rescheduling rate, cancellation analysis", date: "Monthly", type: "Operations", format: "XLSX / PDF" },
              { name: "Leadership Dashboard Export", desc: "Executive summary: KPIs, trends, and escalations", date: "On demand", type: "Executive", format: "PPT / PDF" },
              { name: "Reminder & Compliance Log", desc: "Slot submission compliance, reminder history, SLA tracking", date: "Updated daily", type: "Compliance", format: "CSV" },
            ].map((r, i) => (
              <div key={i} className="px-5 py-4 hover:bg-slate-50/50 transition-colors flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <FileText size={15} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{r.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{r.desc}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-slate-400">{r.date}</span>
                    <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">{r.type}</span>
                    <span className="text-xs text-slate-400">{r.format}</span>
                  </div>
                </div>
                <button className="text-xs text-blue-600 font-medium border border-blue-200 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1 shrink-0">
                  <Download size={11} /> Download
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Reminders & Notifications */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Reminder System</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: "Weekly slot reminder", desc: "Every Monday 9:00 AM", active: true },
                { label: "48h before deadline", desc: "If slots not submitted", active: true },
                { label: "Interview day reminder", desc: "1 hour before session", active: true },
                { label: "Utilization alert (>85%)", desc: "Real-time trigger", active: false },
              ].map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5", r.active ? "border-emerald-500 bg-emerald-50" : "border-slate-300 bg-white")}>
                    {r.active && <Check size={10} className="text-emerald-600" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{r.label}</p>
                    <p className="text-xs text-slate-400">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-black/[0.07] p-4">
            <h3 className="font-bold text-slate-800 text-sm mb-3">This Week at a Glance</h3>
            <div className="space-y-2">
              {[
                { label: "Slots collected", value: "187 / 210", pct: 89 },
                { label: "Interviews booked", value: "14 / 18", pct: 78 },
                { label: "SLA compliance", value: "94%", pct: 94 },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600 font-medium">{m.label}</span>
                    <span className="text-xs font-bold text-slate-700" style={{ fontFamily: "JetBrains Mono, monospace" }}>{m.value}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelistAvailabilityView({ user }: { user: MockUser }) {
  const [selectedSlots, setSelectedSlots] = useState(() => new Set(panelistInitialSlots));
  const [savedSlots, setSavedSlots] = useState(() => new Set(panelistInitialSlots));
  const [leaveDays, setLeaveDays] = useState(() => new Set<string>());
  const [savedLeaveDays, setSavedLeaveDays] = useState(() => new Set<string>());

  const toggleSlot = (slotKey: string) => {
    const day = slotKey.split("-").slice(0, 3).join("-");
    if (leaveDays.has(day)) return;

    setSelectedSlots(current => {
      const next = new Set(current);
      if (next.has(slotKey)) {
        next.delete(slotKey);
      } else {
        next.add(slotKey);
      }
      return next;
    });
  };

  const toggleLeaveDay = (day: string) => {
    setLeaveDays(current => {
      const nextLeaveDays = new Set(current);
      if (nextLeaveDays.has(day)) {
        nextLeaveDays.delete(day);
      } else {
        nextLeaveDays.add(day);
        setSelectedSlots(slots => {
          const nextSlots = new Set(slots);
          panelistSlotTimes.forEach(time => nextSlots.delete(`${day}-${time}`));
          return nextSlots;
        });
      }
      return nextLeaveDays;
    });
  };

  const selectedCount = selectedSlots.size;
  const hasChanges = selectedCount !== savedSlots.size || leaveDays.size !== savedLeaveDays.size || [...selectedSlots].some(slot => !savedSlots.has(slot)) || [...leaveDays].some(day => !savedLeaveDays.has(day));
  const dayTotals = panelistWeekDays.map(day => ({
    day,
    onLeave: leaveDays.has(day),
    count: panelistSlotTimes.filter(time => selectedSlots.has(`${day}-${time}`)).length,
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Weekly Availability</h1>
          <p className="text-sm text-slate-500 mt-0.5">Week of May 25-29, 2026 · {user.name} · select multiple slots per day</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <KpiCard label="Current Week Slots" value={`${selectedCount}`} icon={<CalendarCheck size={18} className="text-blue-600" />} color="bg-blue-50" sub={hasChanges ? "unsaved changes" : "saved availability"} />
        <KpiCard label="Leave Days" value={`${leaveDays.size}`} icon={<XCircle size={18} className="text-red-600" />} color="bg-red-50" sub="marked this week" />
        <KpiCard label="Past Week" value="8" delta="+2 slots" deltaUp icon={<Clock size={18} className="text-emerald-600" />} color="bg-emerald-50" sub="submitted" />
        <KpiCard label="Past Month" value="31" delta="+18%" deltaUp icon={<TrendingUp size={18} className="text-violet-600" />} color="bg-violet-50" sub="availability slots" />
      </div>

      <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Slots for this week</h3>
            <p className="text-xs text-slate-500 mt-0.5">These saved slots become visible to HR/Talent Acquisition for interview booking.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-4 text-xs text-slate-500 mr-2">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-600" /> Selected</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-100 border border-red-200" /> On leave</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border border-slate-200 bg-slate-50" /> Not available</span>
            </div>
            <button
              onClick={() => {
                setSelectedSlots(new Set(savedSlots));
                setLeaveDays(new Set(savedLeaveDays));
              }}
              disabled={!hasChanges}
              className={cn("text-sm border px-3 py-1.5 rounded-lg transition-colors", hasChanges ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50" : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed")}
            >
              Reset
            </button>
            <button
              onClick={() => {
                setSavedSlots(new Set(selectedSlots));
                setSavedLeaveDays(new Set(leaveDays));
              }}
              className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-1.5"
            >
              <Check size={13} /> Save Availability
            </button>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "82px repeat(5, minmax(118px, 1fr))" }}>
          <div className="px-3 py-3 border-b border-r border-slate-100 bg-slate-50" />
          {panelistWeekDays.map(day => {
            const [weekday, month, date] = day.split(" ");
            const onLeave = leaveDays.has(day);
            return (
              <div key={day} className={cn("px-3 py-3 border-b border-r border-slate-100 text-center", onLeave ? "bg-red-50" : "bg-slate-50")}>
                <p className="text-xs font-bold text-slate-700">{weekday}</p>
                <p className="text-lg font-bold text-slate-900 leading-tight">{date}</p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">{month}</p>
                <button
                  onClick={() => toggleLeaveDay(day)}
                  className={cn("mt-2 w-full rounded border px-2 py-1 text-[10px] font-bold transition-colors", onLeave ? "bg-red-600 border-red-600 text-white hover:bg-red-700" : "bg-white border-slate-200 text-slate-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600")}
                >
                  {onLeave ? "On Leave" : "Mark Leave"}
                </button>
              </div>
            );
          })}

          {panelistSlotTimes.map(time => (
            <Fragment key={time}>
              <div className="px-3 py-2 border-b border-r border-slate-100 bg-slate-50/50 flex items-center">
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap" style={{ fontFamily: "JetBrains Mono, monospace" }}>{formatSlotWindow(time)}</span>
              </div>
              {panelistWeekDays.map(day => {
                const slotKey = `${day}-${time}`;
                const selected = selectedSlots.has(slotKey);
                const saved = savedSlots.has(slotKey);
                const onLeave = leaveDays.has(day);
                return (
                  <div key={slotKey} className={cn("border-b border-r border-slate-100 p-1.5", onLeave && "bg-red-50/50")}>
                    <button
                      onClick={() => toggleSlot(slotKey)}
                      disabled={onLeave}
                      className={cn(
                        "h-10 w-full rounded border text-xs font-semibold transition-all",
                        onLeave
                          ? "bg-red-50 border-red-200 text-red-500 cursor-not-allowed"
                          : selected
                          ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                      )}
                    >
                      {onLeave ? "Leave" : selected ? "Available" : "Add"}
                      {selected && !saved && <span className="ml-1 text-blue-100">*</span>}
                    </button>
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-black/[0.07] p-5">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Daily slot summary</h3>
          <div className="space-y-3">
            {dayTotals.map(({ day, count, onLeave }) => (
              <div key={day}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-600">{day}</span>
                  <span className={cn("text-xs font-bold", onLeave ? "text-red-600" : "text-slate-800")} style={{ fontFamily: "JetBrains Mono, monospace" }}>{onLeave ? "On leave" : `${count} slots`}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", onLeave ? "bg-red-400" : "bg-blue-500")} style={{ width: onLeave ? "100%" : `${Math.min(100, (count / panelistSlotTimes.length) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-black/[0.07] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Contribution trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">Slots provided and interviews completed over the last 6 months</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600" /> Slots</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Interviews</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={panelistContributionData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Bar dataKey="slots" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="interviews" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ManagerInsightsView({ user }: { user: MockUser }) {
  const ownTeam = managerTeamSlotData[0];
  const participationPct = Math.round((ownTeam.active / ownTeam.panelists) * 100);
  const targetPct = Math.round((ownTeam.slots / ownTeam.target) * 100);
  const criticalReportees = managerReportees.filter(person => person.status === "Critical").length;

  const statusStyles: Record<string, string> = {
    Critical: "bg-red-50 text-red-700 border-red-200",
    Low: "bg-amber-50 text-amber-700 border-amber-200",
    Healthy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Manager Insights</h1>
          <p className="text-sm text-slate-500 mt-0.5">{user.team} · reportee availability and cross-team contribution</p>
        </div>
        <button className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-1.5">
          <Mail size={13} /> Send Reminder
        </button>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-bold text-red-800">High importance: only {ownTeam.active} of {ownTeam.panelists} reporting panelists have given slots this week.</p>
          <p className="text-sm text-red-700 mt-1">Your team has submitted {ownTeam.slots} of {ownTeam.target} target slots. HR booking capacity is constrained until more reportees submit availability.</p>
        </div>
        <span className="text-xs font-bold text-red-700 bg-white border border-red-200 px-2.5 py-1 rounded-full">{participationPct}% participating</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <KpiCard label="Reportees Submitted" value={`${ownTeam.active}/${ownTeam.panelists}`} icon={<Users size={18} className="text-red-600" />} color="bg-red-50" sub="this week" />
        <KpiCard label="Slot Target Met" value={`${targetPct}%`} delta="-27pp vs org avg" deltaUp={false} icon={<Target size={18} className="text-amber-600" />} color="bg-amber-50" sub={`${ownTeam.slots}/${ownTeam.target} slots`} />
        <KpiCard label="No Slots Given" value={`${criticalReportees}`} icon={<AlertCircle size={18} className="text-red-600" />} color="bg-red-50" sub="needs follow-up" />
        <KpiCard label="Other Teams Avg" value="84%" delta="+43pp" deltaUp icon={<BarChart2 size={18} className="text-emerald-600" />} color="bg-emerald-50" sub="participation" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-white rounded-xl border border-black/[0.07] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Team slot contribution vs target</h3>
              <p className="text-xs text-slate-400 mt-0.5">Your reporting team compared with other teams feeding HR bookings</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600" /> Submitted</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300" /> Target</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={285}>
            <BarChart data={managerTeamSlotData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="team" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Bar dataKey="target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="slots" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-black/[0.07] p-5">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Participation by team</h3>
          <div className="space-y-4">
            {managerTeamSlotData.map(team => {
              const pct = Math.round((team.active / team.panelists) * 100);
              return (
                <div key={team.team}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-700">{team.team}</span>
                    <span className={cn("text-xs font-bold", team.team === user.team ? "text-red-600" : "text-slate-700")} style={{ fontFamily: "JetBrains Mono, monospace" }}>{team.active}/{team.panelists}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", team.team === user.team ? "bg-red-500" : "bg-emerald-500")} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Reportee slot status</h3>
          <span className="text-xs text-slate-400">Week of May 25-29, 2026</span>
        </div>
        <div className="divide-y divide-slate-50">
          {managerReportees.map(person => (
            <div key={person.name} className="px-5 py-3.5 hover:bg-slate-50/50 transition-colors flex items-center gap-4">
              <Avatar initials={person.initials} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">{person.name}</p>
                <p className="text-xs text-slate-500">{person.role} · last submitted: {person.lastSubmitted}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800" style={{ fontFamily: "JetBrains Mono, monospace" }}>{person.slots}</p>
                <p className="text-xs text-slate-400">slots</p>
              </div>
              <span className={cn("text-xs font-bold px-2 py-1 rounded border", statusStyles[person.status])}>{person.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileView({ user, onUpdateSkills }: { user: MockUser; onUpdateSkills: (skills: string[]) => void }) {
  const [draftSkills, setDraftSkills] = useState(user.skills);
  const [skillSearch, setSkillSearch] = useState("");
  const [skillsOpen, setSkillsOpen] = useState(false);
  const hasChanges = draftSkills.length !== user.skills.length || draftSkills.some(skill => !user.skills.includes(skill));
  const filteredSkills = useMemo(() => {
    const query = skillSearch.trim().toLowerCase();
    const results = query
      ? editableSkillOptions.filter(skill => skill.toLowerCase().includes(query))
      : editableSkillOptions;

    return results.slice(0, 80);
  }, [skillSearch]);

  const toggleSkill = (skill: string) => {
    setDraftSkills(current => current.includes(skill) ? current.filter(item => item !== skill) : [...current, skill]);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">Profile details from Outlook identity. Skills are editable for panel matching.</p>
      </div>

      <div className="bg-white rounded-xl border border-black/[0.07] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar initials={user.initials} size="lg" />
            <div>
              <h3 className="font-bold text-slate-900">{user.name}</h3>
              <p className="text-sm text-slate-500">{user.title}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg border border-blue-200 bg-blue-50 text-xs font-bold text-blue-700">{user.role}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          <div className="p-5">
            <h4 className="text-sm font-bold text-slate-800 mb-4">Profile details</h4>
            <div className="space-y-3">
              {[
                ["Name", user.name],
                ["Designation", user.title],
                ["Mobile Number", user.mobile],
                ["Panel Level", user.panelLevel],
                ["Email", user.email],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[140px_1fr] items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500">{label}</span>
                  <span className="text-sm font-semibold text-slate-800">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs text-slate-500">Name, designation, mobile number, and panel level are read-only because they come from Outlook/HR identity data.</p>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Skills</h4>
                <p className="text-xs text-slate-500 mt-0.5">Select skills used for interview panel matching.</p>
              </div>
              <button
                onClick={() => onUpdateSkills(draftSkills)}
                disabled={!hasChanges}
                className={cn("text-sm px-3 py-1.5 rounded-lg font-medium transition-colors", hasChanges ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-100 text-slate-400 cursor-not-allowed")}
              >
                Update Skills
              </button>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setSkillsOpen(open => !open)}
                className="w-full min-h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left flex items-center gap-2 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <Search size={15} className="text-slate-400 shrink-0" />
                <span className={cn("text-sm flex-1", draftSkills.length ? "text-slate-800 font-medium" : "text-slate-400")}>
                  {draftSkills.length ? `${draftSkills.length} skills selected` : "Search and select skills"}
                </span>
                <span className="text-xs text-slate-400">{editableSkillOptions.length} skills</span>
                <ChevronDown size={15} className="text-slate-400 shrink-0" />
              </button>

            </div>

            {skillsOpen && (
              <div className="fixed inset-0 z-50 bg-slate-900/35 p-6 flex items-center justify-center">
                <div className="w-full max-w-5xl h-[82vh] rounded-xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Select Skills</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{draftSkills.length} selected from {editableSkillOptions.length} available skills</p>
                    </div>
                    <button type="button" onClick={() => setSkillsOpen(false)} className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={skillSearch}
                        onChange={event => setSkillSearch(event.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Search skills..."
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_320px]">
                    <div className="overflow-y-auto divide-y divide-slate-50">
                      {filteredSkills.map(skill => {
                        const selected = draftSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={cn("w-full px-5 py-3 text-left flex items-center gap-3 text-sm hover:bg-blue-50", selected && "bg-blue-50")}
                          >
                            <span className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0", selected ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300")}>
                              {selected && <Check size={11} className="text-white" />}
                            </span>
                            <span className="font-medium text-slate-700">{skill}</span>
                          </button>
                        );
                      })}
                      {filteredSkills.length === 0 && (
                        <div className="px-5 py-10 text-center text-sm text-slate-500">No skills found</div>
                      )}
                    </div>

                    <div className="border-t lg:border-t-0 lg:border-l border-slate-100 bg-slate-50 p-4 overflow-y-auto">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Selected skills</p>
                      <div className="flex flex-wrap gap-2">
                        {draftSkills.map(skill => (
                          <span key={skill} className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white border border-slate-200 text-xs font-medium text-slate-700">
                            {skill}
                            <button type="button" onClick={() => toggleSkill(skill)} className="text-slate-400 hover:text-red-500">
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center justify-between">
                    <span className="text-xs text-slate-500">Showing {filteredSkills.length} matching skills</span>
                    <button type="button" onClick={() => setSkillsOpen(false)} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">Done</button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5">
              <p className="text-xs font-semibold text-slate-500 mb-2">Current selected skills</p>
              <div className="flex flex-wrap gap-2">
                {draftSkills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 text-xs font-medium text-slate-700">
                    {skill}
                    <button type="button" onClick={() => toggleSkill(skill)} className="text-slate-400 hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginView({ onLogin }: { onLogin: (user: MockUser) => void }) {
  const [email, setEmail] = useState(mockUsers[0].email);
  const [password, setPassword] = useState(mockUsers[0].password);
  const [error, setError] = useState("");

  const selectedUser = useMemo(
    () => mockUsers.find(user => user.email === email),
    [email]
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const user = mockUsers.find(account => account.email === email.trim() && account.password === password);

    if (!user) {
      setError("Use one of the demo credentials listed on this page.");
      return;
    }

    setError("");
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-[#eef2f7] flex items-center justify-center p-5" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] bg-white border border-black/[0.08] rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-[#0f1c36] p-8 lg:p-10 text-white flex flex-col justify-between gap-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-10 flex items-center">
                <img src={aziroLogoUrl} alt="Aziro logo" className="max-h-9 w-auto object-contain" />
              </div>
              <div>
                <p className="text-lg font-bold leading-tight">Aziro IQ</p>
                <p className="text-xs text-blue-100/60">Interview Panel Booking Platform</p>
              </div>
            </div>
            <div className="mt-10">
              <h1 className="text-3xl font-bold tracking-tight">Demo access</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300 max-w-md">
                Sign in as HR/Talent Acquisition, Leadership Team, or Panelist. All data is local demo data.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {mockUsers.map(user => (
              <button
                type="button"
                key={user.id}
                onClick={() => {
                  setEmail(user.email);
                  setPassword(user.password);
                  setError("");
                }}
                className={cn(
                  "w-full text-left rounded-xl border px-4 py-3 transition-colors",
                  selectedUser?.id === user.id
                    ? "bg-white text-slate-900 border-white"
                    : "bg-white/5 text-slate-200 border-white/10 hover:bg-white/10"
                )}
              >
                <div className="flex items-center gap-3">
                  <Avatar initials={user.initials} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold truncate">{user.role}</p>
                    <p className={cn("text-xs truncate", selectedUser?.id === user.id ? "text-slate-500" : "text-slate-400")}>{user.email}</p>
                  </div>
                  <ChevronRight size={15} className={selectedUser?.id === user.id ? "text-slate-400" : "text-slate-500"} />
                </div>
                <p className={cn("mt-2 text-xs", selectedUser?.id === user.id ? "text-slate-500" : "text-slate-400")}>
                  Password: <span className="font-semibold">{user.password}</span>
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Mock Login</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Sign in to workspace</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Email</span>
              <div className="mt-1.5 relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="name@aziro.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600">Password</span>
              <div className="mt-1.5 relative">
                <Shield size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  type="password"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Demo password"
                />
              </div>
            </label>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                {error}
              </div>
            )}

            <button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors">
              Login
            </button>

            <button type="button" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
              <svg aria-hidden="true" viewBox="0 0 23 23" className="w-4 h-4 shrink-0">
                <path fill="#f25022" d="M1 1h10v10H1z" />
                <path fill="#7fba00" d="M12 1h10v10H12z" />
                <path fill="#00a4ef" d="M1 12h10v10H1z" />
                <path fill="#ffb900" d="M12 12h10v10H12z" />
              </svg>
              <span>Login with Microsoft AD</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function InboxView({ user, onFillSlots }: { user: MockUser; onFillSlots: () => void }) {
  const selectedMessage = inboxMessages[0];

  return (
    <div className="h-full min-h-0 grid grid-cols-[300px_1fr] bg-white text-[#242424]">
      <div className="border-r border-[#e1dfdd] bg-white flex flex-col min-h-0">
        <div className="px-4 py-3 border-b border-[#e1dfdd]">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-[#242424]">Inbox</h1>
            <span className="text-xs text-[#605e5c]">Focused</span>
          </div>
          <div className="mt-3 flex rounded border border-[#d1d1d1] overflow-hidden text-sm">
            <button className="flex-1 bg-[#e5f1fb] text-[#0f6cbd] font-semibold py-1.5 border-r border-[#d1d1d1]">Focused</button>
            <button className="flex-1 bg-white text-[#605e5c] py-1.5">Other</button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {inboxMessages.map(message => {
            const selected = message.id === selectedMessage.id;
            return (
              <button
                key={message.id}
                className={cn(
                  "w-full text-left px-3 py-3 border-b border-[#edebe9] flex gap-3 transition-colors",
                  selected ? "bg-[#e5f1fb] border-l-4 border-l-[#0f6cbd]" : "bg-white border-l-4 border-l-transparent hover:bg-[#f3f2f1]"
                )}
              >
                <Avatar initials={message.initials} size="sm" color={message.id === "panel-weekly-slots" ? "bg-blue-600" : undefined} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={cn("text-sm truncate", message.unread ? "font-bold text-[#242424]" : "font-semibold text-[#323130]")}>{message.sender}</p>
                    <span className="ml-auto text-xs text-[#605e5c] shrink-0">{message.time}</span>
                  </div>
                  <p className={cn("mt-0.5 text-sm truncate", message.unread ? "font-bold text-[#242424]" : "font-medium text-[#323130]")}>{message.subject}</p>
                  <p className="mt-0.5 text-xs text-[#605e5c] truncate">{message.preview}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", message.unread ? "bg-[#0f6cbd]" : "bg-transparent")} />
                    <span className="text-[11px] rounded px-1.5 py-0.5 bg-[#f3f2f1] text-[#605e5c]">{message.category}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-w-0 bg-white flex flex-col">
        <div className="px-8 py-5 border-b border-[#e1dfdd]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-[#242424]">{selectedMessage.subject}</h2>
              <div className="mt-4 flex items-center gap-3">
                <Avatar initials={selectedMessage.initials} size="md" color="bg-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-[#242424]">{selectedMessage.sender}</p>
                  <p className="text-xs text-[#605e5c]">{selectedMessage.senderEmail} to {user.email}</p>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-[#323130]">Monday, May 25, 2026</p>
              <p className="text-xs text-[#605e5c]">9:00 AM</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-7">
          <div className="max-w-3xl">
            <p className="text-sm text-[#323130]">Hi {user.name.split(" ")[0]},</p>
            <p className="mt-4 text-sm leading-6 text-[#323130]">
              Please provide your interview panel availability for this week, May 25-29. HR is opening candidate booking for multiple engineering rounds and needs your available slots before noon today.
            </p>
            <div className="my-6 rounded border border-[#d1e7dd] bg-[#f0f8f4] px-4 py-3">
              <div className="flex items-start gap-3">
                <CalendarCheck size={18} className="text-emerald-700 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#0f5132]">Weekly slot request</p>
                  <p className="mt-1 text-sm text-[#0f5132]">Week of May 25-29, 2026 · target: at least 6 slots · syncs with Outlook calendar after submission.</p>
                </div>
              </div>
            </div>
            <button
              onClick={onFillSlots}
              className="inline-flex items-center gap-2 rounded bg-[#0f6cbd] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#115ea3] transition-colors shadow-sm"
            >
              <CalendarCheck size={16} /> Fill slots
            </button>
            <p className="mt-5 text-sm leading-6 text-[#323130]">
              Once submitted, your slots will be visible to the Talent Acquisition team for candidate scheduling. You can mark leave days directly from the slot form.
            </p>
            <p className="mt-6 text-sm text-[#323130]">Thanks,<br />Aziro IQ</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutlookCalendarView() {
  const selectedSlot = mynexthireInterviewSlots[0];

  return (
    <div className="h-full min-h-0 grid grid-cols-[260px_1fr] bg-white text-[#242424]">
      <aside className="border-r border-[#e1dfdd] bg-white flex flex-col min-h-0">
        <div className="px-4 py-3 border-b border-[#e1dfdd]">
          <h1 className="text-xl font-semibold text-[#242424]">Calendar</h1>
          <p className="mt-1 text-xs text-[#605e5c]">May 2026</p>
        </div>

        <div className="p-4 border-b border-[#edebe9]">
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-[#605e5c] mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {Array.from({ length: 35 }, (_, index) => {
              const date = index - 4;
              const inMonth = date > 0 && date <= 31;
              const hasInterview = [25, 26, 27, 28, 29].includes(date);
              const isToday = date === 25;
              return (
                <button
                  key={index}
                  className={cn(
                    "h-8 rounded flex items-center justify-center relative",
                    inMonth ? "text-[#242424] hover:bg-[#f3f2f1]" : "text-transparent",
                    isToday && "bg-[#0f6cbd] text-white font-semibold hover:bg-[#0f6cbd]"
                  )}
                >
                  {inMonth ? date : ""}
                  {hasInterview && !isToday && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#0f6cbd]" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#605e5c]">myNextHire scheduled</p>
            <p className="mt-1 text-2xl font-semibold text-[#242424]">{mynexthireInterviewSlots.length}</p>
            <p className="text-xs text-[#605e5c]">candidate interview slots this week</p>
          </div>

          <div className="space-y-2">
            {mynexthireInterviewSlots.map(slot => (
              <button key={slot.id} className="w-full text-left rounded border border-[#edebe9] bg-white px-3 py-2 hover:bg-[#f8f8f8]">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#242424] truncate">{slot.candidate}</p>
                  <span className="text-[10px] font-semibold text-[#605e5c]">{slot.day}</span>
                </div>
                <p className="mt-0.5 text-xs text-[#605e5c] truncate">{slot.start}-{slot.end} · {slot.round}</p>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex flex-col bg-white">
        <div className="px-6 py-4 border-b border-[#e1dfdd] flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#242424]">Work week</h2>
            <p className="mt-1 text-sm text-[#605e5c]">May 25-29, 2026 · interviews scheduled by myNextHire</p>
          </div>
          <div className="flex items-center rounded border border-[#d1d1d1] overflow-hidden text-sm">
            {["Day", "Work week", "Week", "Month"].map(item => (
              <button key={item} className={cn("px-3 py-1.5", item === "Work week" ? "bg-[#e5f1fb] text-[#0f6cbd] font-semibold" : "bg-white text-[#424242] hover:bg-[#f3f2f1]")}>{item}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          <div className="min-w-[860px]">
            <div className="grid sticky top-0 z-10 bg-white" style={{ gridTemplateColumns: "72px repeat(5, minmax(150px, 1fr))" }}>
              <div className="h-14 border-b border-r border-[#edebe9] bg-white" />
              {outlookCalendarDays.map(day => {
                const [weekday, date] = day.split(" ");
                return (
                  <div key={day} className="h-14 border-b border-r border-[#edebe9] bg-white px-3 py-2 text-center">
                    <p className="text-xs font-semibold text-[#605e5c]">{weekday}</p>
                    <p className={cn("mx-auto mt-0.5 h-7 w-7 rounded-full text-sm font-semibold flex items-center justify-center", date === "25" ? "bg-[#0f6cbd] text-white" : "text-[#242424]")}>{date}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid" style={{ gridTemplateColumns: "72px repeat(5, minmax(150px, 1fr))" }}>
              {outlookCalendarHours.map(hour => (
                <Fragment key={hour}>
                  <div className="h-24 border-b border-r border-[#edebe9] bg-white px-2 py-2 text-right">
                    <span className="text-xs text-[#605e5c]">{hour}</span>
                  </div>
                  {outlookCalendarDays.map(day => {
                    const slot = mynexthireInterviewSlots.find(item => item.day === day && item.start === hour);
                    return (
                      <div key={`${day}-${hour}`} className="h-24 border-b border-r border-[#edebe9] bg-white p-1.5">
                        {slot && (
                          <button className={cn("h-full w-full rounded-sm border-l-4 px-2 py-1.5 text-left shadow-sm hover:brightness-[0.98]", slot.color)}>
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-bold truncate">{slot.candidate}</p>
                              <span className="text-[10px] font-bold shrink-0">{slot.status}</span>
                            </div>
                            <p className="mt-0.5 text-[11px] font-semibold truncate">{slot.start}-{slot.end}</p>
                            <p className="mt-1 text-[11px] truncate">{slot.role}</p>
                            <p className="text-[11px] truncate">{slot.round}</p>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#e1dfdd] bg-[#faf9f8] px-6 py-3 flex items-center gap-3">
          <CalendarCheck size={16} className="text-[#0f6cbd] shrink-0" />
          <p className="text-sm text-[#323130]">
            Selected: <span className="font-semibold">{selectedSlot.candidate}</span> · {selectedSlot.round} · {selectedSlot.panel} · source: myNextHire
          </p>
        </div>
      </main>
    </div>
  );
}

function OutlookMockShell({ children, user, users, onUserChange, activeSurface, onOpenInbox, onOpenCalendar, onOpenPlugin }: { children: React.ReactNode; user: MockUser; users: MockUser[]; onUserChange: (user: MockUser) => void; activeSurface: OutlookSurface; onOpenInbox: () => void; onOpenCalendar: () => void; onOpenPlugin: () => void }) {
  return (
    <div className="h-screen bg-[#f3f2f1] overflow-hidden" style={{ fontFamily: "Segoe UI, Inter, system-ui, sans-serif" }}>
      <div className="h-full bg-white overflow-hidden flex flex-col">
        <div className="h-10 bg-[#0f6cbd] flex items-center px-3 gap-4 shrink-0 text-white">
          <div className="flex items-center gap-3 w-56 shrink-0">
            <div className="grid grid-cols-3 gap-0.5 w-4 h-4 opacity-95">
              {Array.from({ length: 9 }).map((_, i) => <span key={i} className="w-1 h-1 rounded-full bg-white" />)}
            </div>
            <span className="text-sm font-semibold">Outlook</span>
          </div>
          <div className="relative w-[520px] max-w-[48vw]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="w-full h-8 rounded-sm border border-[#8bb8df] bg-white pl-9 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-500" placeholder="Search" />
          </div>
          <div className="ml-auto flex items-center gap-4 text-white/90">
            <Users size={17} />
            <FileText size={17} />
            <div className="relative">
              <Bell size={17} />
              <span className="absolute -right-1.5 -top-1.5 min-w-4 h-4 rounded-full bg-red-600 text-[10px] leading-4 text-center font-bold">19</span>
            </div>
            <Settings size={17} />
            <select
              value={user.id}
              onChange={event => {
                const nextUser = users.find(account => account.id === event.target.value);
                if (nextUser) onUserChange(nextUser);
              }}
              className="h-7 rounded border border-white/30 bg-white/15 px-2 text-xs font-semibold text-white outline-none"
              title="Demo user"
            >
              {users.map(account => (
                <option key={account.id} value={account.id} className="text-slate-900">
                  {account.role}
                </option>
              ))}
            </select>
            <div className="w-8 h-8 rounded-full bg-[#d7e3f8] text-[#31425f] text-xs font-bold flex items-center justify-center border border-white/40">{user.initials}</div>
          </div>
        </div>

        <div className="h-9 bg-white border-b border-[#e1dfdd] flex items-center px-12 gap-2 shrink-0">
          <button className="w-8 h-8 rounded hover:bg-[#f3f2f1] flex items-center justify-center text-[#323130]">
            <MoreHorizontal size={18} />
          </button>
          {["Home", "View", "Help"].map(item => (
            <button key={item} className={cn("text-sm px-3 py-1.5", item === "Home" ? "font-semibold text-[#242424] border-b-2 border-[#0f6cbd]" : "text-[#424242] hover:bg-[#f3f2f1]")}>{item}</button>
          ))}
        </div>

        <div className="h-12 bg-white border-b border-[#e1dfdd] flex items-center px-12 gap-2 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <button className="px-3 py-1.5 rounded bg-[#0f6cbd] text-white text-sm font-semibold flex items-center gap-2">
            <Mail size={15} /> New mail
          </button>
          <div className="h-6 w-px bg-slate-200 mx-1" />
          {["Delete", "Archive", "Report", "Sweep", "Move to", "Quick steps", "Mark all as read"].map(item => (
            <button key={item} className="text-sm text-[#424242] px-2.5 py-1.5 rounded hover:bg-[#f3f2f1] disabled:text-slate-300" disabled={["Delete", "Archive", "Report"].includes(item)}>{item}</button>
          ))}
          <button className="ml-auto w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center">
            <img src={aziroLogoUrl} alt="Aziro IQ" className="w-6 h-6 object-contain rounded bg-[#0f1c36] p-1" />
          </button>
        </div>

        <div className="flex-1 min-h-0 flex bg-[#f3f2f1]">
          <div className="w-12 bg-[#f7f7f7] border-r border-[#e1dfdd] flex flex-col items-center py-3 gap-3 shrink-0 text-[#0078d4]">
            <button
              title="Mail"
              aria-label="Open Outlook mail"
              onClick={onOpenInbox}
              className={cn("relative w-9 h-9 rounded flex items-center justify-center hover:bg-white transition-colors", activeSurface === "inbox" && "bg-white shadow-sm")}
            >
              {activeSurface === "inbox" && <span className="absolute left-[-6px] top-0 bottom-0 w-0.5 rounded-full bg-[#0f6cbd]" />}
              <Mail size={19} />
            </button>
            <button
              title="Calendar"
              aria-label="Open Outlook calendar"
              onClick={onOpenCalendar}
              className={cn("relative w-9 h-9 rounded flex items-center justify-center hover:bg-white transition-colors", activeSurface === "calendar" && "bg-white shadow-sm")}
            >
              {activeSurface === "calendar" && <span className="absolute left-[-6px] top-0 bottom-0 w-0.5 rounded-full bg-[#0f6cbd]" />}
              <Calendar size={19} />
            </button>
            <button title="People" aria-label="People" className="relative w-9 h-9 rounded flex items-center justify-center hover:bg-white transition-colors">
              <Users size={19} />
            </button>
            <button title="Aziro IQ" onClick={onOpenPlugin} className={cn("relative w-9 h-9 rounded flex items-center justify-center", activeSurface === "plugin" ? "bg-white shadow-sm" : "hover:bg-white")}>
              {activeSurface === "plugin" && <span className="absolute left-[-6px] top-0 bottom-0 w-0.5 rounded-full bg-[#0f6cbd]" />}
              <img src={aziroLogoUrl} alt="Aziro IQ" className="w-6 h-6 object-contain rounded bg-[#0f1c36] p-1" />
            </button>
            <button title="More apps" className="w-9 h-9 rounded flex items-center justify-center hover:bg-white transition-colors">
              <Layers size={19} />
            </button>
          </div>

          <section className="flex-1 min-w-0 bg-[#f3f2f1] overflow-hidden flex flex-col">
            <div className="flex-1 min-h-0 overflow-hidden bg-white border-l border-[#e1dfdd]">
              {children}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [demoUsers, setDemoUsers] = useState<MockUser[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<MockUser>(mockUsers[2]);
  const [activeView, setActiveView] = useState("my-availability");
  const [activeSurface, setActiveSurface] = useState<OutlookSurface>("inbox");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifList, setNotifList] = useState(notifications);

  const switchDemoUser = (user: MockUser) => {
    setCurrentUser(user);
    setActiveView(user.role === "Panelist" ? "my-availability" : user.role === "Manager" ? "manager-insights" : "dashboard");
    setActiveSurface("plugin");
    setShowNotifications(false);
  };

  const openPanelistSlotFlow = () => {
    const panelistUser = demoUsers.find(user => user.role === "Panelist") || mockUsers[2];
    setCurrentUser(panelistUser);
    setActiveView("my-availability");
    setActiveSurface("plugin");
    setShowNotifications(false);
  };

  const updateCurrentUserSkills = (skills: string[]) => {
    setCurrentUser(current => ({ ...current, skills }));
    setDemoUsers(users => users.map(user => user.id === currentUser.id ? { ...user, skills } : user));
  };

  const unread = notifList.filter(n => !n.read).length;

  const navItems: NavItem[] = currentUser.role === "Panelist"
    ? [
      { id: "my-availability", label: "My Availability", icon: <CalendarCheck size={16} /> },
      { id: "profile", label: "My Profile", icon: <UserCheck size={16} /> },
    ]
    : currentUser.role === "Manager"
    ? [
      { id: "manager-insights", label: "Team Insights", icon: <BarChart2 size={16} />, badge: 5 },
      { id: "my-availability", label: "My Availability", icon: <CalendarCheck size={16} /> },
      { id: "profile", label: "My Profile", icon: <UserCheck size={16} /> },
    ]
    : [
      { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
      { id: "slot-helper", label: "Slot Helper", icon: <Zap size={16} /> },
      { id: "panelists", label: "Panelists", icon: <Users size={16} /> },
      { id: "analytics", label: "Analytics", icon: <BarChart2 size={16} /> },
      { id: "reports", label: "Reports", icon: <FileText size={16} /> },
      { id: "profile", label: "My Profile", icon: <UserCheck size={16} /> },
    ];

  const notifIcon: Record<string, React.ReactNode> = {
    warning: <AlertTriangle size={13} className="text-amber-500" />,
    info: <Bell size={13} className="text-blue-500" />,
    success: <CheckCircle2 size={13} className="text-emerald-500" />,
    error: <XCircle size={13} className="text-red-500" />,
  };

  return (
    <OutlookMockShell
      user={currentUser}
      users={demoUsers}
      onUserChange={switchDemoUser}
      activeSurface={activeSurface}
      onOpenInbox={() => setActiveSurface("inbox")}
      onOpenCalendar={() => setActiveSurface("calendar")}
      onOpenPlugin={() => setActiveSurface("plugin")}
    >
    {activeSurface === "inbox" ? (
      <InboxView user={currentUser} onFillSlots={openPanelistSlotFlow} />
    ) : activeSurface === "calendar" ? (
      <OutlookCalendarView />
    ) : (
    <div className="flex h-full bg-[#f0f2f6] overflow-hidden" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col h-full" style={{ background: "#0f1c36" }}>
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-16 h-8 flex items-center">
              <img src={aziroLogoUrl} alt="Aziro logo" className="max-h-7 w-auto object-contain" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Aziro IQ</p>
              <p className="text-[10px] font-medium" style={{ color: "rgba(200,211,232,0.6)" }}>Enterprise HR Platform</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 mb-1" style={{ color: "rgba(200,211,232,0.4)" }}>Main Menu</p>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left",
                activeView === item.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-[#c8d3e8] hover:bg-white/10 hover:text-white"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-amber-400 text-slate-900 text-[9px] font-extrabold rounded-full px-1.5 py-0.5 leading-none">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeView === "manager-insights" && <ManagerInsightsView user={currentUser} />}
          {activeView === "my-availability" && <PanelistAvailabilityView user={currentUser} />}
          {activeView === "dashboard" && <DashboardView onNavigate={setActiveView} user={currentUser} />}
          {activeView === "outlook-calendar" && <OutlookCalendarView />}
          {activeView === "slot-helper" && <SlotHelperView />}
          {activeView === "panelists" && <PanelistsView />}
          {activeView === "analytics" && <AnalyticsView />}
          {activeView === "reports" && <ReportsView />}
          {activeView === "profile" && <ProfileView key={currentUser.id} user={currentUser} onUpdateSkills={updateCurrentUserSkills} />}
        </main>
      </div>

      {/* Click-outside handler for notifications */}
      {showNotifications && (
        <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
      )}
    </div>
    )}
    </OutlookMockShell>
  );
}
