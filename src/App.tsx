import "./App.css";
import ShipPlacementModal, { uploadShipsAction } from "./ShipPlacementModal";
import GameBoard, { gameBoardLoader } from "./GameBoard";
import { createHashRouter, RouterProvider } from "react-router-dom";

const router = createHashRouter([
  {
    path: "/:gameid",
    element: <ShipPlacementModal />,
    action: uploadShipsAction,
  },
  {
    path: "/play/:gameid",
    element: <GameBoard />,
    loader: gameBoardLoader,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
