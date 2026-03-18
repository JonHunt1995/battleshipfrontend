type EnemyCellProps = {
  isShip: boolean;
  isHit: boolean;
  isMiss: boolean;
  idx: number;
  style?: React.CSSProperties;
};

function EnemyCell({ style, isHit, isMiss, idx }: EnemyCellProps) {
  const startingRowCharCode = "A".charCodeAt(0);
  const coordinate = `${String.fromCharCode(startingRowCharCode + Math.floor(idx / 10))}${(idx % 10) + 1}`;
  let styleClass = "water cell";
  if (isHit) {
    styleClass = "hit cell";
  } else if (isMiss) {
    styleClass = "miss cell";
  }
  return (
    <div style={style} className={styleClass}>
      {coordinate}
    </div>
  );
}

export default EnemyCell;
