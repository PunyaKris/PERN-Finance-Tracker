import {
  Car,
  CircleHelp,
  Dumbbell,
  Film,
  Fuel,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  House,
  KeyRound,
  PawPrint,
  PiggyBank,
  Plane,
  Receipt,
  Repeat,
  ShoppingBag,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

export const iconRegistry = {
  // Daily Life

  food: {
    label: "Food",
    icon: UtensilsCrossed,
  },

  shopping: {
    label: "Shopping",
    icon: ShoppingBag,
  },

  transport: {
    label: "Transport",
    icon: Car,
  },

  fuel: {
    label: "Fuel",
    icon: Fuel,
  },

  // Money

  salary: {
    label: "Salary",
    icon: Wallet,
  },

  investment: {
    label: "Investment",
    icon: TrendingUp,
  },

  savings: {
    label: "Savings",
    icon: PiggyBank,
  },

  bills: {
    label: "Bills",
    icon: Receipt,
  },

  // Home

  home: {
    label: "Home",
    icon: House,
  },

  rent: {
    label: "Rent",
    icon: KeyRound,
  },

  pets: {
    label: "Pets",
    icon: PawPrint,
  },

  // Lifestyle

  travel: {
    label: "Travel",
    icon: Plane,
  },

  entertainment: {
    label: "Entertainment",
    icon: Film,
  },

  gaming: {
    label: "Gaming",
    icon: Gamepad2,
  },

  gift: {
    label: "Gift",
    icon: Gift,
  },

  // Personal

  education: {
    label: "Education",
    icon: GraduationCap,
  },

  fitness: {
    label: "Fitness",
    icon: Dumbbell,
  },

  health: {
    label: "Health",
    icon: HeartPulse,
  },

  // Miscellaneous

  subscription: {
    label: "Subscription",
    icon: Repeat,
  },

  other: {
    label: "Other",
    icon: CircleHelp,
  },
};

export default iconRegistry;
