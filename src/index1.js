import {Request} from './common/utils/Request'

const req = new Request('http://localhost:1234/assets/test.json');

req.send().then( res => console.log(res)) 