import { useState } from "react";
import { useEffect } from "react";
import "./App.css";
import ShipPlacementCell from "./ShipPlacementCell";

type shipName =
  | "Carrier"
  | "Battleship"
  | "Cruiser"
  | "Submarine"
  | "Destroyer";

type ShipsState = Record<shipName, number[]>;

type shipPosition = {
  idx: number;
  vert: boolean;
  name: shipName;
};

const SHIP_SIZES: Record<shipName, number> = {
  Carrier: 5,
  Battleship: 4,
  Cruiser: 3,
  Submarine: 3,
  Destroyer: 2,
};

const getIndicesWithShips = (ships: ShipsState) => {
  return Object.values(ships).flat();
};

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
  const shipIndices = getIndicesWithShips(ships);
  return getIndices(curr).every((idx) => !shipIndices.includes(idx));
};

const isValid = (curr: shipPosition, ships: ShipsState) => {
  return inBounds(curr) && noOverlaps(curr, ships);
};

const ShipPlacementModal = () => {
  const defaultShipsState: ShipsState = {
    Carrier: [],
    Battleship: [],
    Cruiser: [],
    Submarine: [],
    Destroyer: [],
  };
  const [shipsToUpload, setShipsToUpload] = useState(defaultShipsState);
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
    if (!isValid(currShipPosition, shipsToUpload)) return;
    setShipsToUpload({
      ...shipsToUpload,
      [currShipPosition.name]: getIndices(currShipPosition),
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();

        setCurrShipPosition((prev) => ({
          ...prev,
          vert: !prev.vert,
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  type buttonName = shipName | "Reset All";

  const buttonNames: buttonName[] = [
    "Carrier",
    "Battleship",
    "Cruiser",
    "Submarine",
    "Destroyer",
    "Reset All",
  ];

  const uploadShips = () => {
    console.log(shipsToUpload);
  };

  const buttons = buttonNames.map((name) => {
    const handleClick = () => {
      if (name === "Reset All") {
        setShipsToUpload(defaultShipsState);
      } else if (shipsToUpload[name].length === 0) {
        setCurrShipPosition({
          ...currShipPosition,
          name: name,
        });
      } else {
        setShipsToUpload({
          ...shipsToUpload,
          [name]: [],
        });
      }
    };
    let buttonName: buttonName = name;
    const isShipType = name !== "Reset All";

    return (
      <button className={name === currShipPosition.name ? "highlighted" : "add-button"} onClick={handleClick}>
        {isShipType && shipsToUpload[name].length > 0 ? "Reset" : buttonName}
      </button>
    );
  });

  const cells = Array.from({ length: 100 }, (_, idx) => (
    <ShipPlacementCell
      key={idx}
      //selected={datum.selected}
      selected={getIndicesWithShips(shipsToUpload).includes(idx)}
      hovered={
        getIndices(currShipPosition).includes(idx) &&
        isValid(currShipPosition, shipsToUpload)
      }
      idx={idx}
      onMouseOver={() => handleMouseOver(idx)}
      onClick={handleClick}
    />
  ));

  const notAllShipsAdded = Object.values(shipsToUpload).some(
    (value) => value.length === 0,
  );

  return (
    <section className="ShipPlaceModal">
      <section className="add-buttons">
        {notAllShipsAdded ? (
          buttons
        ) : (
          <>
            <button onClick={uploadShips}>Submit</button>
            <button onClick={() => setShipsToUpload(defaultShipsState)}>
              Reset
            </button>
          </>
        )}
      </section>
      <section className="board">{cells}</section>
      <button 
        className="mobile-only-vert-toggle"
        onClick={() => setCurrShipPosition((prev) => ({
          ...prev,
          vert: !prev.vert,
        }))}>
          Switch to {currShipPosition.vert ? "Horizontal" : "Vertical"}
       </button>
    </section>
  );
};

export default ShipPlacementModal;
