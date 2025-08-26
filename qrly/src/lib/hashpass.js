import crypto from "crypto"
export function hashpass(pw) {
    return crypto.createHash("sha256").update(pw).digest("hex");
}

export function verifypass(pw,hash){
    return hashpass(pw)===hash;
}