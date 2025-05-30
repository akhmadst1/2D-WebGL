let checked = [];
let modelList = [];
let pointList = [];
let tempX = 0;
let tempY = 0;
let tempScale = 1;
let tempShear = 0;
let tempShearY = 0;
let tempRotation = 0;

function filterSelectedObject(array) {
  let selectedModel = [];
  let selectedPoint = [];
  let modelInserted = [];
  let pointIndex = [];

  for (let i = 0; i < array.length; i++) {
    let m = array[i][0];
    if (array[i].length < 5) {
      if (m == "l") {
        selectedModel.push(models.line[array[i][1] - 1]);
        modelInserted.push(array[i]);
      } else if (m == "s") {
        selectedModel.push(models.square[array[i][1] - 1]);
        modelInserted.push(array[i]);
      } else if (m == "r") {
        selectedModel.push(models.rectangle[array[i][1] - 1]);
        modelInserted.push(array[i]);
      } else if (m == "p") {
        selectedModel.push(models.polygon[array[i][1] - 1]);
        modelInserted.push(array[i]);
      }
    } else {
      let point = array[i].split("point");
      if (!modelInserted.includes(point[0])) {
        if (m == "l") {
          selectedPoint.push(models.line[array[i][1] - 1]);
          modelInserted.push(array[i]);
          pointIndex.push(point[1]);
        } else if (m == "s") {
          selectedPoint.push(models.square[array[i][1] - 1]);
          modelInserted.push(array[i]);
          pointIndex.push(point[1]);
        } else if (m == "r") {
          selectedPoint.push(models.rectangle[array[i][1] - 1]);
          modelInserted.push(array[i]);
          pointIndex.push(point[1]);
        } else if (m == "p") {
          selectedPoint.push(models.polygon[array[i][1] - 1]);
          modelInserted.push(array[i]);
          pointIndex.push(point[1]);
        }
      }
    }
  }
  return [selectedModel, selectedPoint, pointIndex];
}

function editObject() {
  hidePointPolyButtons();
  editablePolygonPointIndex = [];

  let checkbox = document.querySelectorAll("input[type=checkbox]");
  checked = [];
  modelList = [];
  pointList = [];
  pointIndex = [];
  for (let i = 0; i < checkbox.length; i++) {
    if (checkbox[i].checked) {
      checked.push(checkbox[i].value);
    }
  }
  let list = filterSelectedObject(checked);
  modelList = list[0];
  pointList = list[1];
  pointIndex = list[2];

  const xSlider = document.getElementById("x-translation");
  tempX = 0;

// Change color of selected shape to yellow
for (let p = 0; p < modelList.length; p++) {
  let model = modelList[p];
  for (let i = 0; i < model.colors.length; i++) {
    // Set RGB values to represent yellow
    model.colors[i][0] = 1.0; // Red component
    model.colors[i][1] = 1.0; // Green component
    model.colors[i][2] = 0;   // Blue component
  }
}

// Change color of selected point to yellow
for (let p = 0; p < pointList.length; p++) {
  let model = pointList[p];
  model.colors[pointIndex[p] - 1][0] = 1.0; // Red component
  model.colors[pointIndex[p] - 1][1] = 1.0; // Green component
  model.colors[pointIndex[p] - 1][2] = 0;   // Blue component
}

  //horizontal translation
  xSlider.addEventListener("input", function () {
    let xTranslation = xSlider.value;
    for (let p = 0; p < modelList.length; p++) {
      let model = modelList[p];
      for (let i = 0; i < model.positions.length; i++) {
        model.positions[i][0] += xTranslation - tempX;
      }
    }

    for (let p = 0; p < pointList.length; p++) {
      let model = pointList[p];
      if (model.constructor.name == "Square") {
        let squarePointIndex = pointIndex[p] - 1;
        if (squarePointIndex == 0) {
          model.positions[squarePointIndex][0] += xTranslation - tempX;
          model.positions[squarePointIndex][1] -= xTranslation - tempX;

          model.positions[squarePointIndex + 1][1] -= xTranslation - tempX;
          model.positions[squarePointIndex + 2][0] += xTranslation - tempX;
        } else if (squarePointIndex == 1) {
          model.positions[squarePointIndex][0] += xTranslation - tempX;
          model.positions[squarePointIndex][1] += xTranslation - tempX;

          model.positions[squarePointIndex + 2][0] += xTranslation - tempX;
          model.positions[squarePointIndex - 1][1] += xTranslation - tempX;
        } else if (squarePointIndex == 2) {
          model.positions[squarePointIndex][0] += xTranslation - tempX;
          model.positions[squarePointIndex][1] += xTranslation - tempX;

          model.positions[squarePointIndex - 2][0] += xTranslation - tempX;
          model.positions[squarePointIndex + 1][1] += xTranslation - tempX;
        } else {
          //squarePointIndex == 3
          model.positions[squarePointIndex][0] += xTranslation - tempX;
          model.positions[squarePointIndex][1] -= xTranslation - tempX;

          model.positions[squarePointIndex - 1][1] -= xTranslation - tempX;
          model.positions[squarePointIndex - 2][0] += xTranslation - tempX;
        }
      } else if (model.constructor.name == "Rectangle") {
        let widthHeightRatio =
          (model.positions[0][0] - model.positions[1][0]) /
          (model.positions[0][1] - model.positions[2][1]);
        if (widthHeightRatio < 0) {
          widthHeightRatio *= -1;
        }
        let widthTranslation = xTranslation - tempX;
        let heightTranslation = widthTranslation / widthHeightRatio;

        let squarePointIndex = pointIndex[p] - 1;
        if (squarePointIndex == 0) {
          model.positions[squarePointIndex][0] += widthTranslation;
          model.positions[squarePointIndex][1] -= heightTranslation;

          model.positions[squarePointIndex + 1][1] -= heightTranslation;
          model.positions[squarePointIndex + 2][0] += widthTranslation;
        } else if (squarePointIndex == 1) {
          model.positions[squarePointIndex][0] += widthTranslation;
          model.positions[squarePointIndex][1] += heightTranslation;

          model.positions[squarePointIndex + 2][0] += widthTranslation;
          model.positions[squarePointIndex - 1][1] += heightTranslation;
        } else if (squarePointIndex == 2) {
          model.positions[squarePointIndex][0] += widthTranslation;
          model.positions[squarePointIndex][1] += heightTranslation;

          model.positions[squarePointIndex - 2][0] += widthTranslation;
          model.positions[squarePointIndex + 1][1] += heightTranslation;
        } else {
          //squarePointIndex == 3
          model.positions[squarePointIndex][0] += widthTranslation;
          model.positions[squarePointIndex][1] -= heightTranslation;

          model.positions[squarePointIndex - 1][1] -= heightTranslation;
          model.positions[squarePointIndex - 2][0] += widthTranslation;
        }
      } else {
        //line and polygon
        model.positions[pointIndex[p] - 1][0] += xTranslation - tempX;
      }
    }

    tempX = xTranslation;
  });

  //vertical translation
  const ySlider = document.getElementById("y-translation");
  tempY = 0;

  ySlider.addEventListener("input", function () {
    let yTranslation = ySlider.value;
    for (let p = 0; p < modelList.length; p++) {
      let model = modelList[p];
      for (let i = 0; i < model.positions.length; i++) {
        model.positions[i][1] += yTranslation - tempY;
      }
    }

    for (let p = 0; p < pointList.length; p++) {
      let model = pointList[p];
      if (model.constructor.name == "Square") {
        let squarePointIndex = pointIndex[p] - 1;
        if (squarePointIndex == 0) {
          model.positions[squarePointIndex][0] += yTranslation - tempY;
          model.positions[squarePointIndex][1] -= yTranslation - tempY;

          model.positions[squarePointIndex + 1][1] -= yTranslation - tempY;
          model.positions[squarePointIndex + 2][0] += yTranslation - tempY;
        } else if (squarePointIndex == 1) {
          model.positions[squarePointIndex][0] -= yTranslation - tempY;
          model.positions[squarePointIndex][1] -= yTranslation - tempY;

          model.positions[squarePointIndex + 2][0] -= yTranslation - tempY;
          model.positions[squarePointIndex - 1][1] -= yTranslation - tempY;
        } else if (squarePointIndex == 2) {
          model.positions[squarePointIndex][0] -= yTranslation - tempY;
          model.positions[squarePointIndex][1] -= yTranslation - tempY;

          model.positions[squarePointIndex - 2][0] -= yTranslation - tempY;
          model.positions[squarePointIndex + 1][1] -= yTranslation - tempY;
        } else {
          //squarePointIndex == 3
          model.positions[squarePointIndex][0] += yTranslation - tempY;
          model.positions[squarePointIndex][1] -= yTranslation - tempY;

          model.positions[squarePointIndex - 1][1] -= yTranslation - tempY;
          model.positions[squarePointIndex - 2][0] += yTranslation - tempY;
        }
      } else if (model.constructor.name == "Rectangle") {
        let widthHeightRatio =
          (model.positions[0][0] - model.positions[1][0]) /
          (model.positions[0][1] - model.positions[2][1]);
        if (widthHeightRatio < 0) {
          widthHeightRatio *= -1;
        }
        let widthTranslation = yTranslation - tempY;
        let heightTranslation = widthTranslation / widthHeightRatio;

        let squarePointIndex = pointIndex[p] - 1;
        if (squarePointIndex == 0) {
          model.positions[squarePointIndex][0] += widthTranslation;
          model.positions[squarePointIndex][1] -= heightTranslation;

          model.positions[squarePointIndex + 1][1] -= heightTranslation;
          model.positions[squarePointIndex + 2][0] += widthTranslation;
        } else if (squarePointIndex == 1) {
          model.positions[squarePointIndex][0] -= widthTranslation;
          model.positions[squarePointIndex][1] -= heightTranslation;

          model.positions[squarePointIndex + 2][0] -= widthTranslation;
          model.positions[squarePointIndex - 1][1] -= heightTranslation;
        } else if (squarePointIndex == 2) {
          model.positions[squarePointIndex][0] -= widthTranslation;
          model.positions[squarePointIndex][1] -= heightTranslation;

          model.positions[squarePointIndex - 2][0] -= widthTranslation;
          model.positions[squarePointIndex + 1][1] -= heightTranslation;
        } else {
          //squarePointIndex == 3
          model.positions[squarePointIndex][0] += widthTranslation;
          model.positions[squarePointIndex][1] -= heightTranslation;

          model.positions[squarePointIndex - 1][1] -= heightTranslation;
          model.positions[squarePointIndex - 2][0] += widthTranslation;
        }
      } else {
        //line and polygon
        model.positions[pointIndex[p] - 1][1] += yTranslation - tempY;
      }
    }

    tempY = yTranslation;
  });

  //dilatation
  const scaleSlider = document.getElementById("dilation");
  tempScale = 1;

  scaleSlider.addEventListener("input", function () {
    let scale = scaleSlider.value;
    for (let p = 0; p < modelList.length; p++) {
      let model = modelList[p];
      let center = centroid(model.positions);
      for (let i = 0; i < model.positions.length; i++) {
        model.positions[i][0] =
          center[0] + ((model.positions[i][0] - center[0]) * scale) / tempScale;
        model.positions[i][1] =
          center[1] + ((model.positions[i][1] - center[1]) * scale) / tempScale;
      }
    }
    tempScale = scale;
  });

  //rotation
  const rotationSlider = document.getElementById("rotation");
  tempRotation = 0;

  rotationSlider.addEventListener("input", function () {
    let rotation = (rotationSlider.value * Math.PI) / 180;
    for (let p = 0; p < modelList.length; p++) {
      let model = modelList[p];
      let center = centroid(model.positions);
      //rotation on coordinate
      for (let i = 0; i < model.positions.length; i += 1) {
        const x = model.positions[i][0] - center[0];
        const y = model.positions[i][1] - center[1];
        model.positions[i][0] =
          x * Math.cos(rotation - tempRotation) -
          y * Math.sin(rotation - tempRotation) +
          center[0];
        model.positions[i][1] =
          x * Math.sin(rotation - tempRotation) +
          y * Math.cos(rotation - tempRotation) +
          center[1];
      }
    }
    tempRotation = rotation;
  });

  //shearX
  const shearSlider = document.getElementById("shear");
  tempShear = 0;

  shearSlider.addEventListener("input", function () {
    let shear = shearSlider.value;
    for (let p = 0; p < modelList.length; p++) {
      let model = modelList[p];
      let center = centroid(model.positions);
      for (let i = 0; i < model.positions.length / 2; i += 1) {
        model.positions[i][0] +=
          (model.positions[i][1] - center[1]) * (shear - tempShear);
      }
    }
    tempShear = shear;
  });

  //shearY
  const shearSliderY = document.getElementById("shearY");
  tempShearY = 0;

  shearSliderY.addEventListener("input", function () {
    let shear = shearSliderY.value;
    for (let p = 0; p < modelList.length; p++) {
      let model = modelList[p];
      let center = centroid(model.positions);
      for (let i = 1; i < model.positions.length; i += 2) {
        model.positions[i][1] +=
          (model.positions[i][0] - center[0]) * (shear - tempShearY);
      }
    }
    tempShearY = shear;
  });

  //change color
  const colorSlider = document.getElementById("color");
  colorSlider.addEventListener("input", function () {
    let color = getRGB(colorSlider.value);
    for (let p = 0; p < modelList.length; p++) {
      let model = modelList[p];
      for (let i = 0; i < model.positions.length; i += 1) {
        model.colors[i][0] = color.r;
        model.colors[i][1] = color.g;
        model.colors[i][2] = color.b;
      }
    }
    for (let p = 0; p < pointList.length; p++) {
      let model = pointList[p];
      model.colors[pointIndex[p] - 1][0] = color.r;
      model.colors[pointIndex[p] - 1][1] = color.g;
      model.colors[pointIndex[p] - 1][2] = color.b;
    }
  });

  //add and delete polygon points
  for (let i = 0; i < modelList.length; i++) {
    if (modelList[i].constructor.name == "Polygon") {
      showPointPolyButtons();
      isPolygon = true;
      drawType = "polygon";
      editablePolygon = modelList[i];
    }
  }

  for (let i = 0; i < pointList.length; i++) {
    if (pointList[i].constructor.name == "Polygon") {
      showPointPolyButtons();
      editablePolygon = pointList[i];
      editablePolygonPointIndex.push(pointIndex[i] - 1);
    }
  }

  for (let i = 0; i < editablePolygonPointIndex.length; i++) {
    editablePolygon.colors[editablePolygonPointIndex[i]] = [1, 1, 1, 1];
  }
}
