function calc() {
    let result = getCalc();
    drawGridFromResult(result);
}

function getCalc() {
    let numbers = getNumbers();
    let lines = getResultLines();
    let combinations = combo(numbers);

    for(let c = 0; c < combinations.length; c++) {
        let combo = combinations[c];
        let isValid = true;
        let pointsFilledIn = [];
        for(let l = 0; l < lines.length; l++) {
            let line = lines[l];
            let res = 0;
            for(let p = 0; p < line.points.length; p++) {

                // Check if point already has a value.
                let val;
                for(let i = 0; i < pointsFilledIn.length; i++) {
                    var pointFilledIn = pointsFilledIn[i];
                    if(line.points[p].x == pointsFilledIn.x && line.points[p].y == pointsFilledIn.y) {
                        val = pointsFilledIn.value;
                        break;
                    }
                }
                
                // Gets new value from the combination if value for x/y hasn't already been set.
                if(!val) {
                    val = combo.pop();
                }
                line.points[p].value = val;
                
                pointsFilledIn.push(line.points[p]);
                res += val;
            }
            if(res != line.result.value) {
                isValid = false;
                break;
            }
        }

        if(isValid) {
           let result = { lines: lines, combo: combo };
           return result;
        }
    }
    return undefined;
}

function combo(c) {
  var r = [],
      len = c.length;
      tmp = [];
  function nodup() {
    var got = {};
    for (var l = 0; l < tmp.length; l++) {
      if (got[tmp[l]]) return false;
      got[tmp[l]] = true;
    }
    return true;
  }
  function iter(col,done) {    
    var l, rr;
    if (col === len) {      
      if (nodup()) {
        rr = [];
        for (l = 0; l < tmp.length; l++) 
          rr.push(c[tmp[l]]);        
        r.push(rr);
      }
    } else {
      for (l = 0; l < len; l ++) {            
        tmp[col] = l;
        iter(col +1);
      }
    }
  }
  iter(0);
  return r;
}