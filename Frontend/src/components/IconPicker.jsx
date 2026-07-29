import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import accentRegistry from "../utils/accentRegistry";
import { iconRegistry } from "../utils/iconRegistry";

const accentNames = Object.keys(accentRegistry);

const getAccentForIndex = (index) => {
  const accentName = accentNames[index % accentNames.length] ?? "blue";
  return accentRegistry[accentName];
};

const IconPicker = ({ selectedIcon, onSelect, variant = "budget" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const entries = Object.entries(iconRegistry);
  const visibleEntries = isExpanded
    ? entries
    : [
        ...entries.slice(0, 9),
        ["more", { label: "More", icon: MoreHorizontal }],
      ];
  const isCircle = variant === "transaction";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(72px, 1fr))",
        gap: "10px",
      }}
    >
      {visibleEntries.map(([key, value], index) => {
        const Icon = value.icon;
        const isSelected = selectedIcon === key;
        const isMoreTile = key === "more";
        const accent = isMoreTile ? null : getAccentForIndex(index);
        const tileRadius = isCircle ? "999px" : "12px";

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
                width: isCircle ? "42px" : "40px",
                height: isCircle ? "42px" : "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: tileRadius,
                border: isSelected
                  ? `2px solid ${accent?.iconColor ?? "var(--primary)"}`
                  : `1px solid color-mix(in srgb, ${accent?.iconColor ?? "var(--border)"} 18%, var(--border))`,
                background: isMoreTile
                  ? "color-mix(in srgb, var(--surface-muted) 88%, var(--card))"
                  : `color-mix(in srgb, ${accent?.iconBackground ?? "var(--primary)"} 78%, var(--card))`,
                color: isMoreTile
                  ? "var(--muted-foreground)"
                  : accent?.iconColor ?? "var(--primary)",
                boxShadow: isSelected
                  ? `0 0 0 1px color-mix(in srgb, ${accent?.iconColor ?? "var(--primary)"} 24%, transparent), 0 10px 22px color-mix(in srgb, ${accent?.iconColor ?? "var(--primary)"} 16%, transparent)`
                  : "none",
                transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
              }}
            >
              <Icon size={isCircle ? 20 : 22} />
            </div>
            <div
              style={{
                fontSize: "0.68rem",
                lineHeight: 1.2,
                textAlign: "center",
                color: isSelected ? "var(--foreground)" : "var(--muted-foreground)",
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
