class CCC {
    enc = ["С", "C", "Ⲥ", "ꓚ"]
    // U+0421 U+0043 U+2ca4 U+a4da
    dec = {
        "С": "0",
        "C": "1",
        "Ⲥ": "2",
        "ꓚ": "3",
    }

    ver = {
        "cccc": true
    }

    currVer = "cccc"

    removeAndCheckVersion(ccc) {
        if (this.ver[ccc.substring(0, 4)]) {
            return ccc.substring(4)
        } else {
            return null
        }
    }

    addVersion(ccc) {
        return this.currVer + ccc
    }

    encodeUrl(url) {
        // get utf8 array
        let unversioned = this.toUTF8Array(url)
            // convert to string with base 4
            // padstart very important! otherwise missing leading 0s
            .map(n => n.toString(4).padStart(4, "0"))
            // convert to array of characters
            .join("").split("")
            // map to the c's
            .map(x => this.enc[parseInt(x)])
            // join into single string
            .join("")

        return this.addVersion(unversioned)
    }

    decodeUrl(ccc) {

        ccc = this.removeAndCheckVersion(ccc)
        if (ccc === null) return

        // get the base 4 string representation of the url
        let b9str = ccc.split("").map(x => this.dec[x]).join("")

        let utf8arr = []

        // parse 4 characters at a time (255 in b10 = 3333 in b4)
        // remember adding leading 0s padding
        for (let i = 0; i < b9str.length; i += 4)
            utf8arr.push(parseInt(b9str.substring(i, i + 4), 4))

        return this.Utf8ArrayToStr(utf8arr)
    }


    // from https://gist.github.com/joni/3760795
    toUTF8Array(str) {
        var utf8 = [];
        for (var i = 0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6),
                    0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
            // surrogate pair
            else {
                i++;
                charcode = ((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff)
                utf8.push(0xf0 | (charcode >> 18),
                    0x80 | ((charcode >> 12) & 0x3f),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
        }
        return utf8;
    }

    // from https://gist.github.com/wumingdan/759564f6cb887a55bceb
    Utf8ArrayToStr(array) {
        var out, i, len, c;
        var char2, char3;

        out = "";
        len = array.length;
        i = 0;
        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c);
                    break;
                case 12: case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }

        return out;
    }

}
