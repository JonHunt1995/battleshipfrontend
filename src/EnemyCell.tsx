type EnemyCellProps = {
  isHit: boolean;
  isMiss: boolean;
  idx: number;
  style?: React.CSSProperties;
  onClick: (idx: number) => void;
};

function EnemyCell({ style, isHit, isMiss, idx, onClick }: EnemyCellProps) {
  const startingRowCharCode = "A".charCodeAt(0);
  const coordinate = `${String.fromCharCode(startingRowCharCode + Math.floor(idx / 10))}${(idx % 10) + 1}`;
  let styleClass = "water cell";
  if (isHit) {
    styleClass = "hit cell";
  } else if (isMiss) {
    styleClass = "miss cell";
  }
  return (
    <div style={style} className={styleClass} onClick={() => onClick(idx)}>
      {coordinate}
    </div>
  );
}

export default EnemyCell;
