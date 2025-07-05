import {MD5} from "crypto-js"

const getMD5String = (input:string) => {
    return MD5(input).toString()
}

export default getMD5String;