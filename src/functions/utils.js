function getMousePosition(canvas, e) {
  const position = canvas.getBoundingClientRect();
  const x = e.clientX - position.x;
  const y = e.clientY - position.y;
  return { x, y };
}

function getRGB(color) {
  //convert #ffffff to rgb
  const red = parseInt(color.substr(1, 2), 16);
  const green = parseInt(color.substr(3, 2), 16);
  const blue = parseInt(color.substr(5, 2), 16);

  //convert rgb to 0 to 1
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  return { r, g, b };
}

function resizeCanvas(canvas) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    canvas.width = width;
    canvas.height = height;
  }

  return needResize;
}

function transformCoordinate(canvas, x, y) {
  const position = canvas.getBoundingClientRect();
  const [width, height] = [position.width, position.height];

  /* Converts from coordinate to zero to one */
  /* converts zero to one to zero to two */
  /* Converts zero to two to -1 to 1 */
  const realWidth = (x / width) * 2 - 1;
  const realHeight = (y / height) * -2 + 1;

  return [realWidth, realHeight];
}

function centroid(matrix) {
  let x = 0;
  let y = 0;
  let vertexCount = matrix.length;
  for (i = 0; i < vertexCount; i++) {
    x += matrix[i][0];
    y += matrix[i][1];
  }

  x = x / vertexCount;
  y = y / vertexCount;

  return [x, y];
}

/* flatten 2d array to 1d */
function flatten(matrix) {
  let len = matrix.length;
  let n = len;
  let isArr = false;

  if (Array.isArray(matrix[0])) {
    isArr = true;
    n *= matrix[0].length;
  }

  let result = new Float32Array(n);
  let cur = 0;

  if (isArr) {
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        result[cur++] = matrix[i][j];
      }
    }
  } else {
    for (let i = 0; i < len; i++) {
      result[cur++] = matrix[i];
    }
  }

  return result;
}

function orientationOf3Points(pointA, pointB, pointC) {
  let val = (pointB[1] - pointA[1]) * (pointC[0] - pointB[0]) - 
            (pointB[0] - pointA[0]) * (pointC[1] - pointB[1]);

  // 0 = pointA, pointB dan pointC colinear
  // 1 = clockwise
  // 2 = counterclockwise
  if (val == 0) {
    return 0;
  }
  return (val > 0)? 1:2;
}

function leftMostPointIndex(positions, vertexCount) {
  let leftMostPtIndex = 0;
  for (let i = 1; i < vertexCount; i ++) {
    if (positions[i][0] < positions[leftMostPtIndex][0]){
      leftMostPtIndex = i;
    }
  }
  return leftMostPtIndex;
}

function convexHull(positions, vertexCount) {
  if (vertexCount < 3) {
    return;
  }

  let finalConvexHull = [];
  let leftMostPtIndex = leftMostPointIndex(positions, vertexCount)

  let firstPointIndex = leftMostPtIndex;
  let secondPointIndex;
  do {
    finalConvexHull.push(positions[firstPointIndex]);
    
    secondPointIndex = (firstPointIndex + 1) % vertexCount;

    for (let i = 0; i < vertexCount; i ++) {
      if (orientationOf3Points(positions[firstPointIndex], positions[i], positions[secondPointIndex]) == 2) {
        secondPointIndex = i;
      }
    }
    firstPointIndex = secondPointIndex
  } while (firstPointIndex != leftMostPtIndex)

  return finalConvexHull;
}
