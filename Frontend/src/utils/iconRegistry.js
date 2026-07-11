import { createElement } from "react";
import {
  Airplane,
  ArrowsClockwise,
  Barbell,
  Car,
  DotsThreeCircle,
  FilmSlate,
  ForkKnife,
  GameController,
  GasPump,
  Gift,
  GraduationCap,
  Heartbeat,
  House,
  Key,
  PawPrint,
  PiggyBank,
  Receipt,
  ShoppingBag,
  TrendUp,
  Wallet,
} from "@phosphor-icons/react";

const withFill = (IconComponent) => {
  const FilledIcon = (props) =>
    createElement(IconComponent, {
      weight: "fill",
      ...props,
    });

  return FilledIcon;
};

export const iconRegistry = {
  // Daily Life

  food: {
    label: "Food",
    icon: withFill(ForkKnife),
  },

  shopping: {
    label: "Shopping",
    icon: withFill(ShoppingBag),
  },

  transport: {
    label: "Transport",
    icon: withFill(Car),
  },

  fuel: {
    label: "Fuel",
    icon: withFill(GasPump),
  },

  // Money

  salary: {
    label: "Salary",
    icon: withFill(Wallet),
  },

  investment: {
    label: "Investment",
    icon: withFill(TrendUp),
  },

  savings: {
    label: "Savings",
    icon: withFill(PiggyBank),
  },

  bills: {
    label: "Bills",
    icon: withFill(Receipt),
  },

  // Home

  home: {
    label: "Home",
    icon: withFill(House),
  },

  rent: {
    label: "Rent",
    icon: withFill(Key),
  },

  pets: {
    label: "Pets",
    icon: withFill(PawPrint),
  },

  // Lifestyle

  travel: {
    label: "Travel",
    icon: withFill(Airplane),
  },

  entertainment: {
    label: "Entertainment",
    icon: withFill(FilmSlate),
  },

  gaming: {
    label: "Gaming",
    icon: withFill(GameController),
  },

  gift: {
    label: "Gift",
    icon: withFill(Gift),
  },

  // Personal

  education: {
    label: "Education",
    icon: withFill(GraduationCap),
  },

  fitness: {
    label: "Fitness",
    icon: withFill(Barbell),
  },

  health: {
    label: "Health",
    icon: withFill(Heartbeat),
  },

  // Miscellaneous

  subscription: {
    label: "Subscription",
    icon: withFill(ArrowsClockwise),
  },

  other: {
    label: "Other",
    icon: withFill(DotsThreeCircle),
  },
};

export default iconRegistry;
