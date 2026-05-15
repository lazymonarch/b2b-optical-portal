interface ColorSwatchProps {
  colorName: string;
  colorHex: string | null;
  selected?: boolean;
  onClick?: () => void;
}

export default function ColorSwatch({
  colorName,
  colorHex,
  selected = false,
  onClick,
}: ColorSwatchProps) {
  return (
    <button
      onClick={onClick}
      title={colorName}
      aria-label={colorName}
      className={`size-4 rounded-full border transition-all ${
        selected ? "scale-110 ring-2 ring-neutral-400 ring-offset-1" : "hover:scale-110"
      }`}
      style={{
        backgroundColor: colorHex ?? "#e5e5e5",
        borderColor:
          colorHex === "#ffffff" || colorHex === "#FFFFFF" ? "#d4d4d4" : "transparent",
      }}
    />
  );
}
