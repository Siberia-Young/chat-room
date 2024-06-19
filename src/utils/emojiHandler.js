function emojiEncode(e) {
    let n = /[\ud800-\udbff][\udc00-\udfff]/g;
    return (e = e.replace(n, function (e) {
        var n, r;
        return 2 === e.length ?
            ((n = e.charCodeAt(0)),
                (r = e.charCodeAt(1)),
                "&#" + (1024 * (n - 55296) + 65536 + r - 56320) + ";") :
            e;
    }));
}

function emojiDecode(e) {
    var n = /&#.*?;/g; //获取数据库种16进制的数据
    //然后进行解码操作
    return e.replace(n, function (e) {
        var n, r, t;
        return 9 == e.length ?
            ((t = parseInt(e.match(/[0-9]+/g))),
                (n = Math.floor((t - 65536) / 1024) + 55296),
                (r = ((t - 65536) % 1024) + 56320),
                unescape("%u" + n.toString(16) + "%u" + r.toString(16))) :
            e;
    });
}

class EmojiHandler {
    constructor() {
        this.emojiEncode = emojiEncode;
        this.emojiDecode = emojiDecode;
    }
}
export default EmojiHandler