import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'

const items = {
  cube: {
    color: "yellow",
    size: [2,2],
  },
  delete: {
    color: "grey",
    size: [1,1],
  },
  enemy: {
    color: "red",
    size: [1,1]
  },
  fileCabinet: {
    color: "blue",
    size: [1,1],
  },
  player: {
    color: "pink",
    size: [1,1]
  },
  wall: {
    color: "green",
    size: [2,4],
  },
  wall2: {
    color: "brown",
    size: [1,2],
  },
}

const MapMaker = ({ setOption, setMap }) => {
  const [name, setName] = useState("Map 1")
  const [rows, setRows] = useState(48);
  const [columns, setColumns] = useState(48);
  const [grid, setGrid] = useState(initializeGrid());
  const [selectedItem, setSelectedItem] = useState("cube");
  const [hoveredSquare, setHoveredSquare] = useState(null);
  const [rotation, setRotation] = useState(0)

  const generateMap = () => {
    const map = {
      name: name,
      size: [columns, rows],
      gridSize: 0.5,
      grid: grid,
      items: getItemsFromGrid(),
    }
    return map
  }

  const getItemsFromGrid = () => {
    const gridItems = []

    for (let i=0; i < grid.length; i++){
      for (let j=0; j < grid[0].length; j++) {
        const square = grid[i][j]
        if (square.placement != false) {
          //add this square to items
          const item = {
            name: square.name,
            id: square.id,
            pos: [i, j],
            rotation: square.rotation
          }
          gridItems.push(item)
        }
      }
    }

    return gridItems
  }

  const play = () => {
    const map = generateMap()
    setMap(map)
    setOption(1)
  }

  const saveMap = () => {
    console.log("save map to js / json")
    const map = generateMap()
  }

  function initializeGrid() {
    return Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => ({ 
        color: 'grey',
        name: '',
        id: null,
        rotation: 0,
        placement: false,
      }))
    );
  }

  const handleNameChange = (e) => {
    setName(e);
  };
  const handleRowChange = (e) => {
    setRows(parseInt(e.target.value, 10) || 0);
  };
  const handleColumnChange = (e) => {
    setColumns(parseInt(e.target.value, 10) || 0);
  };
  const handleSetGrid = () => {
    setRows(rows);
    setColumns(columns);
    setGrid(initializeGrid());
  };
  const handleItemChange = (event) => {
    setSelectedItem(event.target.value);
  };

  const deleteItem = () => {
    const { rowIndex, colIndex, endRow, endCol } = hoveredSquare;
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    const square = grid[rowIndex][colIndex]
    if (square.id == null) return

    for (let i=0; i < newGrid.length; i++){
      for (let j=0; j < newGrid[0].length; j++) {
        const thisSquare = newGrid[i][j]
        if (thisSquare.id == square.id) {
          //reset this square
          thisSquare.color = "grey"
          thisSquare.name = ''
          thisSquare.id = null,
          thisSquare.rotation = 0
          thisSquare.placement = false
        }
      }
    }

    setGrid(newGrid)
  }

  const handleSquareClick = () => {
    if (!hoveredSquare) return;
    if (selectedItem == "delete") return deleteItem()

    const { rowIndex, colIndex, endRow, endCol } = hoveredSquare;
    const newGrid = grid.map(row => row.map(cell => ({ ...cell }))); // Deep copy

    let squareTaken = false
    let placementSquare = false
    const id = uuidv4()
    const item = items[selectedItem]

    for (let i = rowIndex; i < endRow; i++) {
      for (let j = colIndex; j < endCol; j++) {
        const square = newGrid[i][j]
        if (square.color !== 'grey') squareTaken = true
        if (!placementSquare) {
          //Mark the first square as the one to be used when placing the object
          placementSquare = true
          square.placement = true
        }
        square.color = item.color
        square.id = id
        square.name = selectedItem
        square.rotation = rotation
      }
    }

    if (!squareTaken) {
      setGrid(newGrid);
    } else {
      console.log("Cannot place there")
    }
  };

  const handleSquareHover = (rowIndex, colIndex) => {
    let size = items[selectedItem]?.size;
    if (!size) {
      setHoveredSquare(null);
      return;
    }

    if (rotation === 1 || rotation === 3) {
      //swap width and height
      size = [size[1], size[0]]
    }

    const endRow = Math.min(rowIndex + size[0], rows);
    const endCol = Math.min(colIndex + size[1], columns);

    setHoveredSquare({ rowIndex, colIndex, endRow, endCol });
  };
  const handleSquareLeave = () => {
    setHoveredSquare(null);
  };

  const changeRotation = () => {
    let newRot = rotation +1
    if (newRot > 3) newRot = 0
    setRotation(newRot)
  }

  return (
    <div id="map-maker">
      <div>
        <label>
          Name:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <label>
          Rows:
          <input type="number" value={rows} onChange={handleRowChange} />
        </label>
        <label>
          Columns:
          <input type="number" value={columns} onChange={handleColumnChange} />
        </label>
        <button onClick={handleSetGrid}>Set Grid</button>
      </div>
      <div>
        <label>
            Select Item:
            <select value={selectedItem} onChange={handleItemChange}>
              {Object.keys(items).map((itemName) => (
                <option key={itemName} value={itemName}>
                  {itemName}
                </option>
              ))}
            </select>
          </label>
          <button onClick={changeRotation}>Rotation: {rotation}</button>
          <button onClick={play}>Play</button>
          <button onClick={saveMap}>Save</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${grid[0].length}, 20px)` }}>
        {grid.map((row, rowIndex) =>
          row.map((square, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: square.color,
                border: '1px solid black',
                cursor: 'pointer',
                opacity: hoveredSquare &&
                  rowIndex >= hoveredSquare.rowIndex &&
                  rowIndex < hoveredSquare.endRow &&
                  colIndex >= hoveredSquare.colIndex &&
                  colIndex < hoveredSquare.endCol
                    ? 0.7
                    : 1,
              }}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
              onMouseEnter={() => handleSquareHover(rowIndex, colIndex)}
              onMouseLeave={handleSquareLeave}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MapMaker;
