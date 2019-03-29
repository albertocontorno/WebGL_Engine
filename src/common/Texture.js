/**
 * @author Alberto Contorno
 * @class
 * Class that represents a single Texture of a Mesh.
 */
export class Texture{
    static nextId = 0;

    id;
    textureUnit = 0;
    imagePath;
    textureSource;
    texture;
    s_texelType;
    texelType;
    params;
    /**
    *
    * @param {number} textureUnit The texture unit associated to the Texture
    * @param {GL_ENUM} type The texture type (e.g. TEXTURE_2D)
    * @param {vec3} up The up vector of the camera
    * @param {GL_ENUM} s_texelType The texel's type of the source data of the texture.
    * @param {GL_ENUM} texelType The texel's type of the data of the texture stored into the GPU.
    * @param {Array} params Array of params objects {key[GL_ENUM]:value} where the key is a GL_ENUM that specifies the texture parameter and the value is the value to apply.
    */
    constructor(textureUnit, type, imagePath, s_texelType, texelType, params){
        Texture.nextId++;
        this.id = Texture.nextId;
        this.textureUnit = textureUnit;
        this.type = type;
        this.imagePath = imagePath;
        this.s_texelType = s_texelType;
        this.texelType = texelType;
        this.params = params;
    }

    LoadTexture(gl){
        this.textureSource = new Image();
        this.textureSource.crossOrigin = "";
        this.textureSource.src = this.imagePath;
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        //set texture params
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.texelType, 1, 1,
            0, this.s_texelType, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
        let _loaded = () => {
            console.log("TEXTURE LOADED", this.textureSource.width);
            gl.texImage2D(gl.TEXTURE_2D, 0, this.texelType, this.textureSource.width, this.textureSource.height,
                0, this.s_texelType, gl.UNSIGNED_BYTE, this.textureSource);
            gl.generateMipmap(gl.TEXTURE_2D);
            this.textureSource.removeEventListener('load', _loaded);
            this.textureSource = null;
        }
        this.textureSource.addEventListener('load', _loaded);  
    }

    UseTexture(gl){
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }


}