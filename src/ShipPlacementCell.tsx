type ShipPlacementCellProps = {
  selected: boolean;
  hovered: boolean;
  idx: number;
  onMouseOver: () => void;
  onClick: () => void;
}

function ShipPlacementCell({ selected, hovered, idx, onMouseOver, onClick }: ShipPlacementCellProps) {
  let styleClass = "water cell"
  if (selected) {
    styleClass = "selected cell"
  } else if (hovered) {
    styleClass = "hovered cell"
  }
  return (
    <div className={styleClass} onMouseOver={onMouseOver} onClick={onClick}>{idx}</div>
  )
}

export default ShipPlacementCell