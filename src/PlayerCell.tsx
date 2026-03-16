type PlayerCellProps = {
  isShip: boolean;
  isHit: boolean;
  isMiss: boolean;
  idx: number;
  style?: React.CSSProperties;
};

function PlayerCell({ style, isShip, isHit, isMiss, idx }: PlayerCellProps) {
  const startingRowCharCode = "A".charCodeAt(0);
  const coordinate = `${String.fromCharCode(startingRowCharCode + Math.floor(idx / 10))}${(idx % 10) + 1}`;
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
      {coordinate}
    </div>
  );
}

export default PlayerCell;
