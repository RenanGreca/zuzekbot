function parse(args) {
    var parsed = {}
    var remainder = []

    args.forEach(function(arg, index) {
        if (arg.indexOf("=") !== -1) {
            var s = arg.split("=");
            parsed[s[0]] = s[1];
        } else {
            remainder.push(arg);
        }
    });

    parsed['string'] = remainder.join(" ");
    parsed['url'] = encodeURI(remainder.join("+"));

    return parsed;
}

const a = parse(["curr=BRL", "country=BR", "ABC", "def"]);
console.log(a);

module.exports = {
    parse: function(args) {
       return parse(args);
    }
}