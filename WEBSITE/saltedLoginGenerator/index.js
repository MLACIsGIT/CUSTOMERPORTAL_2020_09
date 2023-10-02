async function getSalted() {
    const pass = document.getElementById("pass").value;
    const labelSalt = document.getElementById("salt");
    const labelSaltedPassword = document.getElementById("saltedPassword");

    let salt = this.getSalt();
    let passwordHash = await this.getPasswordHash(pass, salt);
    labelSalt.innerText = `Salt:  ${salt}`;
    labelSaltedPassword.innerText = `Salted Password: ${passwordHash}`;
    console.log('+++', passwordHash)
}

function getSalt() {
    //return Math.floor(Math.random() * 8999999) + 1000000;
    const cDate = new Date();
    const yearStr = `${cDate.getUTCFullYear()}`;
    const monthStr = `0${cDate.getUTCMonth() + 1}`.substr(-2);
    const dateStr = `0${cDate.getUTCDate()}`.substr(-2);
    const hoursStr = `0${cDate.getUTCHours()}`.substr(-2);
    const minutesStr = `0${cDate.getUTCMinutes()}`.substr(-2);

    return yearStr + monthStr + dateStr + hoursStr + minutesStr;
}

async function sha512(str) {
    const sha512Bytes = await crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
        return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
    });

    return sha512Bytes.toUpperCase()
}

async function getPasswordHash(pass, salt) {
    const passwordHash = await sha512(pass)

    if (!salt) {
        return passwordHash;
    }

    return await sha512(`${passwordHash}${salt}`);
}
