import "./App.css";
import ShipPlacementModal, { uploadShipsAction } from "./ShipPlacementModal";
import GameBoard, { gameBoardLoader, gameBoardAction } from "./GameBoard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/setup/:gameid",
    element: <ShipPlacementModal />,
    action: uploadShipsAction,
  },
  {
    path: "/play/:gameid",
    element: <GameBoard />,
    loader: gameBoardLoader,
    action: gameBoardAction,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
