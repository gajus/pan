(function () {
    var style = document.createElement('p').style,
        prefixes = 'O ms Moz webkit'.split(' '),
        hasPrefix = /^(o|ms|moz|webkit)/,
        upper = /([A-Z])/g,
        memo = {};

    function get(key){
        return (key in memo) ? memo[key] : memo[key] = prefix(key);
    }

    function prefix(key){
        var capitalizedKey = key.replace(/-([a-z])/g, function(s, match){
                return match.toUpperCase();
            }),
            i = prefixes.length,
            name;

        if (style[capitalizedKey] !== undefined) return capitalizedKey;

        capitalizedKey = capitalize(key);

        while (i--) {
            name = prefixes[i] + capitalizedKey;
            if (style[name] !== undefined) return name;
        }

        throw new Error('unable to prefix ' + key);
    }

    function capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    window.prefix = get;
} ());