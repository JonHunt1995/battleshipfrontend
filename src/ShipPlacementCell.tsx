type ShipPlacementCellProps = {
  selected: boolean;
  hovered: boolean;
  invalid: boolean;
  style?: React.CSSProperties;
  onMouseOver: () => void;
  onClick: () => void;
};

function ShipPlacementCell({
  style,
  selected,
  hovered,
  invalid,
  onMouseOver,
  onClick,
}: ShipPlacementCellProps) {
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
    </div>
  );
}

export default ShipPlacementCell;
