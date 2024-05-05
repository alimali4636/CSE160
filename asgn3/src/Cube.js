class Cube{ 
    // Constructor
    constructor(){
        this.type = 'cube';
        // this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        // this.size = 5.0;
        // this.segments = 10;
        this.matrix = new Matrix4();
        this.textureNum=-2;
        }
        
    render(){
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;

        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front
        drawTriangle3DUV( [0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]);
        drawTriangle3DUV( [0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]);

        //Back
        drawTriangle3DUV( [0,0,1, 1,1,1, 1,0,1], [0,0, 1,1, 1,0]);
        drawTriangle3DUV( [0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);

        // Make next sides different color
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

        //Bottom
        drawTriangle3DUV( [0,0,0, 1,0,0, 0,0,1], [0,0, 1,0, 0,1]);
        drawTriangle3DUV( [0,0,1, 1,0,0, 1,0,1], [0,1, 1,0, 1,1]);
        
        // Top
        drawTriangle3DUV( [0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);
        drawTriangle3DUV( [0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0]);

        // Make next sides different color
        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);

        // Left
        drawTriangle3DUV( [0,0,0, 0,0,1, 0,1,1], [1,0, 0,0, 0,1]);
        drawTriangle3DUV( [0,0,0, 0,1,1, 0,1,0], [1,0, 0,1, 1,1]);

        // Right
        drawTriangle3DUV( [1,0,0, 1,1,1, 1,1,0], [1,0, 0,1, 1,1]);
        drawTriangle3DUV( [1,0,0, 1,0,1, 1,1,1], [1,0, 0,0, 0,1]);
    }
}