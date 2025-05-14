
import type { Category, Frequency, BudgetPeriod } from '@/types';

export const DEFAULT_CATEGORIES: Category[] = [
  // Expenses
  { id: 'cat_expense_groceries', name: 'Groceries', icon: 'ShoppingCart', type: 'expense', color: 'hsl(30, 80%, 60%)' },
  { id: 'cat_expense_utilities', name: 'Utilities', icon: 'Lightbulb', type: 'expense', color: 'hsl(200, 80%, 60%)' },
  { id: 'cat_expense_rent', name: 'Rent/Mortgage', icon: 'Home', type: 'expense', color: 'hsl(240, 80%, 60%)' },
  { id: 'cat_expense_transport', name: 'Transport', icon: 'Car', type: 'expense', color: 'hsl(0, 80%, 60%)' },
  { id: 'cat_expense_entertainment', name: 'Entertainment', icon: 'Gamepad2', type: 'expense', color: 'hsl(300, 80%, 60%)' },
  { id: 'cat_expense_health', name: 'Healthcare', icon: 'HeartPulse', type: 'expense', color: 'hsl(0, 100%, 70%)' },
  { id: 'cat_expense_education', name: 'Education', icon: 'BookOpen', type: 'expense', color: 'hsl(50, 80%, 60%)' },
  // Income
  { id: 'cat_income_salary', name: 'Salary', icon: 'Briefcase', type: 'income', color: 'hsl(120, 60%, 50%)' },
  { id: 'cat_income_freelance', name: 'Freelance', icon: 'Laptop', type: 'income', color: 'hsl(150, 60%, 50%)' },
  { id: 'cat_income_investment', name: 'Investment', icon: 'TrendingUp', type: 'income', color: 'hsl(180, 60%, 50%)' },
  { id: 'cat_income_other', name: 'Other Income', icon: 'Gift', type: 'income', color: 'hsl(90, 60%, 50%)' },
];

export const TRANSACTION_FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'once', label: 'Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export const BUDGET_PERIODS: { value: BudgetPeriod; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'custom', label: 'Custom' },
];

export const LUCIDE_ICON_NAMES = [
  "Activity", "Airplay", "AlarmClock", "AlertCircle", "AlignCenter", "Archive", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp",
  "Award", "Banknote", "BarChart", "Bell", "Bike", "Book", "Bookmark", "Briefcase", "Building", "Bus", "Calculator", "Calendar",
  "Camera", "Car", "CheckCircle", "ChevronDown", "ChevronLeft", "ChevronRight", "ChevronUp", "Clipboard", "Clock", "Cloud",
  "Code", "Coffee", "Coins", "Compass", "Computer", "CreditCard", "DollarSign", "Download", "Edit", "ExternalLink", "Eye",
  "File", "Film", "Filter", "Flag", "Folder", "Gift", "Globe", "Gamepad2", "Grab", "Grid", "Heart", "HeartPulse", "HelpCircle", "Home", "Image",
  "Inbox", "Info", "Key", "Landmark", "Laptop", "LayoutDashboard", "Lightbulb", "Link", "List", "Loader", "Lock", "LogIn", "LogOut",
  "Mail", "Map", "MapPin", "Maximize", "Menu", "MessageCircle", "Mic", "Minimize", "MinusCircle", "Monitor", "Moon", "MoreHorizontal",
  "MousePointer", "Move", "Music", "Navigation", "Package", "Paperclip", "PauseCircle", "Percent", "Phone", "PieChart",
  "PiggyBank", "PlayCircle", "PlusCircle", "Pocket", "Printer", "Puzzle", "ReceiptText", "RefreshCcw", "Repeat", "Rocket", "Save", "Scale",
  "Scissors", "Search", "Send", "Server", "Settings", "Share2", "Shield", "ShoppingBag", "ShoppingCart", "Shapes", "Smartphone", "Smile",
  "Sparkles", "Speaker", "Star", "Sun", "Table", "Tag", "Target", "Terminal", "ThumbsDown", "ThumbsUp", "Ticket", "Trash2",
  "TrendingDown", "TrendingUp", "Truck", "Tv", "Type", "Umbrella", "Upload", "User", "Users", "Video", "Voicemail", "Volume2",
  "Wallet", "WalletMinimal", "Watch", "Wifi", "Wind", "XCircle", "Youtube", "Zap", "ZoomIn", "ZoomOut"
];
