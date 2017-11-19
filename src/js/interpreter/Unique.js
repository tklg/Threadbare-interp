var last = null, repeat = 0, length = undefined;
if (typeof length == 'undefined') length = 15;
export default class Unique {
    static get() {
        var now = Math.pow(10, 2) * +new Date()
        if (now == last) {
            repeat++;
        } else {
            repeat = 0;
            last = now;
        }
        var s = (now + repeat).toString();
        return +(s.substr(s.length - length));
    }
}