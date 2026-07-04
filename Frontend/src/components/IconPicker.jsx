import { iconRegistry } from "../utils/iconRegistry";

const IconPicker = ({ selectedIcon, onSelect }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      {Object.entries(iconRegistry).map(([key, value]) => {
        const Icon = value.icon;

        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            type="button"
            style={{
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              border:
                selectedIcon === key
                  ? "2px solid dodgerblue"
                  : "1px solid gray",

              background: "white",
            }}
          >
            <Icon size={24} />

            <div>{value.label}</div>
          </button>
        );
      })}
    </div>
  );
};

export default IconPicker;
