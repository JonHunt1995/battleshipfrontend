import { useState } from 'react';
import { useEffect } from 'react';
import './App.css';
import ShipPlacementCell from './ShipPlacementCell';

type shipName = "Carrier" | "Battleship" | "Cruiser" | "Submarine" | "Destroyer";

type ShipsState = Record<shipName, number[]>;

type shipPosition = {
  idx: number;
  vert: boolean;
  name: shipName;
};

type cellData = {
  selected: boolean;
  idx: number;
}

const SHIP_SIZES: Record<shipName, number> = {
  Carrier: 5,
  Battleship: 4,
  Cruiser: 3,
  Submarine: 3,
  Destroyer: 2,
};

const getIndicesWithShips = (ships: ShipsState) => {
  return Object.values(ships).flat();
}

const getIndices = (curr: shipPosition) => {
  const rowSize = 10;
  const shipSize = SHIP_SIZES[curr.name];
  const increment = curr.vert ? rowSize : 1;
  let indices: number[] = [];

  for (let i = 0; i < shipSize; i++) {
    indices.push(curr.idx + i * increment);
  }

  return indices;
};

const inBounds = (curr: shipPosition) => {
  const indices = getIndices(curr);
  const boardSize = 100;
  const rowSize = 10;
  if (curr.vert) {
    return indices.every((idx) => 0 <= idx && idx < boardSize);
  }

  const rowNumber = Math.floor(indices[0] / rowSize);

  return indices.every((idx) => Math.floor(idx / rowSize) === rowNumber);
};

const noOverlaps = (curr: shipPosition, ships: ShipsState) => {
  const shipIndices = getIndicesWithShips(ships)
  return getIndices(curr).every((idx) => !shipIndices.includes(idx));
}

const isValid = (curr: shipPosition, ships: ShipsState) => {
  return inBounds(curr) && noOverlaps(curr, ships);
}

function ShipPlacementModal() {
  const defaultData: cellData[] = Array.from({length: 100}, (_, i )=> ({hovered: false, selected: false, idx: i}));
  const defaultShipsState: ShipsState = {
    "Carrier": [],
    "Battleship": [],
    "Cruiser": [],
    "Submarine": [],
    "Destroyer": []
  };
  const [shipsToUpload, setShipsToUpload]= useState(defaultShipsState);
  const [cellData, setCellData] = useState(defaultData);
  const [currShipPosition, setCurrShipPosition] = useState<shipPosition>({
    idx: 0,
    vert: false,
    name: "Carrier",
  });

  // Needs index to reset candidate squares for ship
  const handleMouseOver = (index: number) => {
    setCurrShipPosition({ ...currShipPosition, idx: index });
  };

  // Doesn't need input because the index was changed with handleMouseOver
  const handleClick = () => {
    if (!isValid(currShipPosition, shipsToUpload)) return
    setCellData(cellData.map((datum) => {
      if (getIndices(currShipPosition).includes(datum.idx)) {
        datum.selected = true;
      }
      return datum;
    }))
    setShipsToUpload({
      ...shipsToUpload,
      [currShipPosition.name]: getIndices(currShipPosition)
    })
  }

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault(); 
      
      setCurrShipPosition((prev) => ({
        ...prev,
        vert: !prev.vert,
      }));
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => window.removeEventListener('keydown', handleKeyDown);
}, []); 

  type buttonName = shipName | "Reset" | "Reset All";

  const buttonNames: buttonName[] = ["Carrier", "Battleship", "Cruiser", "Submarine", "Destroyer", "Reset All"];

  const blowItUp = () => {
    setShipsToUpload(defaultShipsState);
    setCellData(defaultData);
  };

  const uploadShips = () => {
    console.log(shipsToUpload);
  }

  const buttons = buttonNames.map((name) => {
    const handleClick = () => {
      if (name === "Reset") return 
      if (name === "Reset All") {
        blowItUp();
      } else if (shipsToUpload[name].length === 0) {
        setCurrShipPosition({
          ...currShipPosition,
          name: name
        })
      } else {
        setShipsToUpload({
          ...shipsToUpload,
          [name]: []
        });
      }
    }
    let buttonName: buttonName = name;
    const isShipType = name !== 'Reset' && name !== 'Reset All';
    if (isShipType && shipsToUpload[name].length !== 0) {
      buttonName = "Reset"
    }
    return <button className="add-button" onClick={handleClick}>{buttonName}</button>
  })

  const cells = cellData.map((datum) => (
    <ShipPlacementCell
      key={datum.idx}
      //selected={datum.selected}
      selected={getIndicesWithShips(shipsToUpload).includes(datum.idx)}
      hovered={getIndices(currShipPosition).includes(datum.idx) && isValid(currShipPosition, shipsToUpload)}
      idx={datum.idx}
      onMouseOver={() => handleMouseOver(datum.idx)}
      onClick={handleClick}
    />
  ));

  const notAllShipsAdded = Object.values(shipsToUpload).some((value) => value.length === 0);
  

  return (
    <main>
      <section className="add-buttons">
        {notAllShipsAdded ? buttons : 
        <>
          <button onClick={uploadShips}>Submit</button>
          <button onClick={blowItUp}>Reset</button>
        </>
        }
        </section>
      <section className="board">{cells}</section>
    </main>
  );
}

export default ShipPlacementModal;