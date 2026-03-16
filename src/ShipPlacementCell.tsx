type ShipPlacementCellProps = {
  selected: boolean;
  hovered: boolean;
  invalid: boolean;
  idx: number;
  style?: React.CSSProperties;
  onMouseOver: () => void;
  onClick: () => void;
};

function ShipPlacementCell({
  style,
  selected,
  hovered,
  invalid,
  idx,
  onMouseOver,
  onClick,
}: ShipPlacementCellProps) {
  const startingRowCharCode = "A".charCodeAt(0);
  const coordinate = `${String.fromCharCode(startingRowCharCode + Math.floor(idx / 10))}${(idx % 10) + 1}`;
  let styleClass = "water cell";
  if (selected) {
    styleClass = "ship cell";
  } else if (hovered) {
    styleClass = "highlighted cell";
  } else if (invalid) {
    styleClass = "invalid cell";
  }
  return (
    <div
      style={style}
      className={styleClass}
      onMouseOver={onMouseOver}
      onClick={onClick}
    >
      {coordinate}
    </div>
  );
}

export default ShipPlacementCell;
