import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { iconRegistry } from "../utils/iconRegistry";

const IconPicker = ({ selectedIcon, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const entries = Object.entries(iconRegistry);
  const visibleEntries = isExpanded
    ? entries
    : [
        ...entries.slice(0, 9),
        ["more", { label: "More", icon: MoreHorizontal }],
      ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))",
        gap: "10px",
      }}
    >
      {visibleEntries.map(([key, value]) => {
        const Icon = value.icon;
        const isSelected = selectedIcon === key;
        const isMoreTile = key === "more";

        return (
          <button
            key={key}
            onClick={() => {
              if (isMoreTile) {
                setIsExpanded((current) => !current);
                return;
              }

              onSelect(key);
            }}
            type="button"
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "4px",
              width: "100%",
              padding: 0,
              border: 0,
              background: "transparent",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                border: isSelected ? "2px solid #2563eb" : "1px solid #d7e2ee",
                background: "#ffffff",
                boxShadow: isSelected
                  ? "0 8px 18px rgba(37, 99, 235, 0.16)"
                  : "none",
                transition: "transform 180ms ease, box-shadow 180ms ease",
              }}
            >
              <Icon size={22} />
            </div>
            <div
              style={{
                fontSize: "0.68rem",
                lineHeight: 1.2,
                textAlign: "center",
                color: "#475569",
                wordBreak: "break-word",
                maxWidth: "100%",
              }}
            >
              {value.label}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default IconPicker;
