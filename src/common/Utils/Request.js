export const HTTP_METHOD = {
    HEAD: 'HEAD',
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
}

export const HTTP_RESPONSE_STATUS = {
    OK: 200,
    CREATED: 201,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
}

/**
 * @author Alberto Contorno
 * @class
 * Wrapper to make http requests
 */
export class Request{

    constructor( url, method, options, data ){
        this.url = url;
        this.method = method || 'GET';
        this.options = options;
        this.data = data;
    }

    send(){
        return new Promise( async (resolve, reject) => {
            if(!this.url){ return; }
            const _options = {
                methods: this.method,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
    
            if(this.method == 'GET' || this.method == 'DELETE' || this.method == 'HEAD'){
    
            } else {
                _options.body = JSON.stringify(data); // TODO DEPENDS ON MYME-TYPE
            }
            
            fetch(this.url, _options).then( async (res) => {
                let body = await res.json();
                resolve(body);
            }).catch( err => reject(err));

        });
        /* {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },  redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header)*/
        
            
    }
}

