import crypto from "crypto"
export default (v) => crypto.createHash('sha256').update(v).digest('hex')