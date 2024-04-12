// DrawRectangle.js 
var ctx

function main() {
// Retrieve the <canvas> element
var canvas = document.getElementById('example'); 
if (!canvas) {
    console.log('Failed to retrieve the <canvas> element ');
    return false; 
}
    // Get the rendering context for 2DCG 
    ctx = canvas.getContext('2d');
    resetCanvas();
    // Draw a blue rectangle
    // ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set a blue color 
    // ctx.fillRect(120, 10, 150, 150); // Fill a rectangle with the color
    // var v1 = new Vector3([2.25, 2.25, 0]);

    // drawVector(v1, "red");

    
}

function drawVector(v, color) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(200, 200);
        ctx.lineTo(200 + v.elements[0] * 20, 200 - v.elements[1] * 20);
        ctx.stroke();
    }

function handleDrawEvent() {
    resetCanvas();
    let xval = document.getElementById("xval").value;
    let yval = document.getElementById("yval").value;
    let xval2 = document.getElementById("xval2").value;
    let yval2 = document.getElementById("yval2").value;
    let v1 = new Vector3([xval, yval, 0]);
    let v2 = new Vector3([xval2, yval2, 0]);
    drawVector(v1, "red");
    drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
    resetCanvas();
    let xval = document.getElementById("xval").value;
    let yval = document.getElementById("yval").value;
    let xval2 = document.getElementById("xval2").value;
    let yval2 = document.getElementById("yval2").value;
    let v1 = new Vector3([xval, yval, 0]);
    let v2 = new Vector3([xval2, yval2, 0]);
    let operation = document.getElementById("operation").value;
    let scalar = parseFloat(document.getElementById("scalar").value);

    drawVector(v1, "red");
    drawVector(v2, "blue");

    switch(operation) {
        case "add":
            let v3 = v1.add(v2);
            drawVector(v3, "green");
            break;
        case "sub":
            let v4 = v1.sub(v2);
            drawVector(v4, "green");
            break;
        case "mul":
            let v5 = v1.mul(scalar);
            let v6 = v2.mul(scalar);
            drawVector(v5, "green");
            drawVector(v6, "green");
            break;
        case "div":
            if (scalar != 0) {
                let v7 = v1.div(scalar);
                let v8 = v2.div(scalar);
                drawVector(v7, "green");
                drawVector(v8, "green");
            }  else {
                console.error("Please enter a scalar greater than 0.");
            }
            break;
        case "magnitude":
            let m1 = v1.magnitude();
            let m2 = v2.magnitude();
            console.log("Magnitude v1: " + m1)
            console.log("Magnitude v2: " + m2)
            break;
        case "normalize":
            let v9 = v1.normalize();
            let v10 = v2.normalize();
            drawVector(v9, "green");
            drawVector(v10, "green");
            break;
        case "anglebtwn":
            let d = Vector3.dot(v1, v2);
            let m3 = v1.magnitude();
            let m4 = v2.magnitude();
            let cosRadians = Math.acos(d / (m3 * m4));
            let angle = cosRadians * (180 / Math.PI);
            console.log("Angle: " + angle);
            break;
        case "area":
            let v11 = Vector3.cross(v1, v2);
            let area = v11.magnitude() / 2;
            console.log("Area of the trinagle: " + area);
            break;
    }
}

function resetCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 400);
}