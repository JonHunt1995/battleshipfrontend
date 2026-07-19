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
  if (invalid) {
    styleClass = "invalid cell";
  } else if (hovered) {
    styleClass = "highlighted cell";
  } else if (selected) {
    styleClass = "ship cell";
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
