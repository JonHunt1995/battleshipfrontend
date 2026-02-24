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
  const highlighted = getIndices(currShipPosition);
  const sameRowHighlighted = currShipPosition.vert
    ? highlighted
    : highlighted.filter(
        (idx) => Math.floor(idx / 10) === Math.floor(highlighted[0] / 10),
      );
  const ships = getIndicesWithShips(shipsToUpload);
  const shipNames: shipName[] = [
    "Carrier",
    "Battleship",
    "Cruiser",
    "Submarine",
    "Destroyer",
  ];

  // Needs index to reset candidate squares for ship
  const handleMouseOver = (index: number) => {
    setCurrShipPosition({ ...currShipPosition, idx: index });
  };

  // Doesn't need input because the index was changed with handleMouseOver
  const handleClick = () => {
    if (!isValid(currShipPosition, shipsToUpload)) return;
    setShipsToUpload({
      ...shipsToUpload,
      [currShipPosition.name]: highlighted,
    });
    const nextShip =
      shipNames[(shipNames.indexOf(currShipPosition.name) % 5) + 1];

    setCurrShipPosition({ ...currShipPosition, name: nextShip });
  };

  const handleMouseLeave = () => {
    setCurrShipPosition({
      ...currShipPosition,
      idx: 100,
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

  const resetShips = () => {
    setShipsToUpload(defaultShipsState);
    setCurrShipPosition({
      ...currShipPosition,
      name: "Carrier",
    });
  };
  const buttons = buttonNames.map((name) => {
    const handleClick = () => {
      if (name === "Reset All") {
        resetShips();
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
      <button
        className={
          name === currShipPosition.name ? "highlighted" : "add-button"
        }
        onClick={handleClick}
      >
        {isShipType && shipsToUpload[name].length > 0 ? "Reset" : buttonName}
      </button>
    );
  });

  const cells = Array.from({ length: 100 }, (_, idx) => (
    <ShipPlacementCell
      key={idx}
      selected={ships.includes(idx)}
      invalid={
        !isValid(currShipPosition, shipsToUpload) &&
        sameRowHighlighted.includes(idx)
      }
      hovered={
        isValid(currShipPosition, shipsToUpload) && highlighted.includes(idx)
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
            <button onClick={resetShips}>Reset</button>
          </>
        )}
      </section>
      <section className="board" onMouseLeave={handleMouseLeave}>
        {cells}
      </section>
      <button
        className="mobile-only-vert-toggle"
        onClick={() =>
          setCurrShipPosition((prev) => ({
            ...prev,
            vert: !prev.vert,
          }))
        }
      >
        Switch to {currShipPosition.vert ? "Horizontal" : "Vertical"}
      </button>
      <div className="instructions">
        <h2>Instructions</h2>
        <p>
          Choose which ships to place by first clicking one of the buttons in
          the top row for the ship type (the button should then be highlighted
          to indicate that it's selected) and then click on the button to add
          that ship type to the board. You can hover over a cell to preview a
          location and if it's highlighted, means it's a valid location to place
          that ship. You can either use the space bar or the vertical toggle
          button on mobile that says "Switch to `Other Position`" to flip the
          ship position from vertical or horizontal. Once adding a ship, it
          should move to the next smallest ship to add. After adding all the
          ships where you want them, the buttons should then transition to 2
          options: either to submit your ship placements for the game to start
          or to reset your ship positions if you want to rearrange them.
        </p>
      </div>
    </section>
  );
};

export default ShipPlacementModal;
