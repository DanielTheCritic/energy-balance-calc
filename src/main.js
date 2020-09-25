var cells = [];
var gridWidth = 9;
var gridHeight = 7;

function init() {
    setWarning();
    drawGrid();
}

function reset() {
    cells = [];
    document.getElementById("txtInput").value = "";
    init();
}

function getNumbers() {
    let text = document.getElementById("txtInput").value;
    
    if(!text) {
        setWarning("No input provided");
        return undefined;
    }

    let splits = text.split(',');
    let numbers = splits.map(s => parseInt(s));
    for(let n = 0; n < numbers.length; n++) {
        if(isNaN(numbers[n])) {
            setWarning("Invalid format provided.");
            return undefined;
        }
    }
    return numbers;
}

function getResultLines() {
    let resultCells = [];
    for (let n = 0; n < cells.length; n++) {
        let cell = cells[n];
        if(cell.state == "solution") {
            resultCells.push({ x: cell.x, y: cell.y, value: parseInt(cell.value) });
        }
    }

    let resultLines = [];
    for (let r = 0; r < resultCells.length; r++) {
        let rCell = resultCells[r];
        let pX = rCell.x;
        let pY = rCell.y;
        let line = { direction: "", result: resultCells[r], points: [] };
        while(true) {
            if(line.direction == "") {
                if(getCellIndex(pX - 1, pY) != -1) {
                    line.direction = "hleft";
                    continue;
                }
                else if(getCellIndex(pX + 1, pY) != -1) {
                    line.direction = "hright";
                    continue;
                }
                else if(getCellIndex(pX, pY - 1) != -1) {
                    line.direction = "vup";
                    continue;
                }
                else if(getCellIndex(pX, pY + 1) != -1) {
                    line.direction = "vdown";
                    continue;
                }
                else
                {
                    setWarning("Formatting error detected in grid.");
                    break;
                }
            }
            else if(line.direction == "hleft") {
                pX = pX - 1;
            }
            else if(line.direction == "hright") {
                pX = pX + 1;
            }
            else if(line.direction == "vup") {
                pY = pY - 1;
            }
            else if(line.direction == "vdown") {
                pY = pY + 1;
            }

            let index = getCellIndex(pX, pY);
            if(index != -1) {
                let cell = cells[index];
                line.points.push({x: pX, y: pY});
                continue;
            }
            
            resultLines.push(line);
            break;
        }
    }
    return resultLines;
}

function setWarning(message) {
    var el = document.getElementById("divWarning");
    el.innerText = message;
    el.style.display = message ? "block" : "none";
}

function getCellTag(id, x, y, state, value) {
    let tag = '<button cell-x="' + x + '" + cell-y="' + y + '" id="'+ id + '" type="button" class="btn btn-outline-primary grid-cell" onclick="onCellClick(this);">' + value + '</button>';
    if(state == "solution") {
        tag = '<input autocomplete="off" cell-x="' + x + '" + cell-y="' + y + '" id="' + id + '" class="form-control grid-cell bg-success text-white" onclick="onCellClick(this);" value="' + value + '" onblur="onTextBlur(this);">' 
    }
    else if (state != "none") {
        tag = '<button cell-x="' + x + '" + cell-y="' + y + '" id="'+ id + '" type="button" class="btn btn-primary grid-cell" onclick="onCellClick(this);">' + value + '</button>';
    }
    return tag;
}

function drawGrid() {

    let html = '';
    for(let y = 0; y < gridHeight; y++){
        html += '<div class="row">';
        for(let x = 0; x < gridWidth; x++) {
            let id = getCellId(x, y);
            html += getCellTag(id, x, y, getState(x, y), getCellValue(x, y));
        }
        html += '</div>'
    }
    document.getElementById("divGrid").innerHTML = html;
}

function drawGridFromResult(result) {
    for (let r = 0; r < result.lines.length; r++) {
        let line = result.lines[r];
        for (let p = 0; p < line.points.length; p++) {
            let point = line.points[p];
            let index = getCellIndex(point.x, point.y);
            console.log(index);
            console.log(cells);
            cells[index].value = point.value;
        }
    }
    drawGrid();
}

function toggleCell(x, y) {
    var index = getCellIndex(x, y);
    if(index != -1) {
        if(cells[index].state == "solution") {
            cells.splice(index, 1);
        }
        else {
            cells[index].state = "solution";
        }
        
    }
    else {
        cells.push({ name: name, x: x, y: y, state: "on" });
    }
}

function onTextBlur(element) {
    let x = getX(element);
    let y = getY(element);
    let index = getCellIndex(x, y);
    cells[index].value = element.value;
}

function onCellClick(element) {
    let x = getX(element);
    let y = getY(element);
    toggleCell(x, y);
    drawGrid();
    element = getCell(x, y);
    element.focus();
}

function getState(x, y) {
    var index = getCellIndex(x, y);
    if(index == -1) {
        return "none";
    }
    return cells[index].state;
}

function getCellIndex(x, y) {
    for (let n = 0; n < cells.length; n++) {
        if(cells[n].x == x && cells[n].y == y) {
            return n;
        }
    }
    return -1;
}

function getCellValue(x, y) {
    var index = getCellIndex(x, y);
    if(index != -1) {
        return cells[index].value ?? "";
    }
    return "";
}

function getX(element) {
    return parseInt(element.getAttribute("cell-x"));
}

function getY(element) {
    return parseInt(element.getAttribute("cell-y"));
}

function getCell(x, y) {
    return document.getElementById(getCellId(x, y));
}

function getCellId(x, y) {
    return "cell-" + x + "-" + y;
}