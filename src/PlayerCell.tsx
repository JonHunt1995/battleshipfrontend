type PlayerCellProps = {
  isShip: boolean;
  isHit: boolean;
  isMiss: boolean;
  style?: React.CSSProperties;
};

function PlayerCell({ style, isShip, isHit, isMiss }: PlayerCellProps) {
  let styleClass = "water cell";
  if (isHit) {
    styleClass = "hit cell";
  } else if (isShip) {
    styleClass = "ship cell";
  } else if (isHit) {
    styleClass = "invalid cell";
  } else if (isMiss) {
    styleClass = "miss cell";
  }
  return (
    <div style={style} className={styleClass}>
    </div>
  );
}

export default PlayerCell;
