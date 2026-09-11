// text：文本工具（设计 §9）。语义基准 = src/drpy2.js 同名函数。GBK 编解码走 peer gbkTool。
import {gbkTool} from './peer.js';
import {UA, urlencode} from './utils.js';

export {urlencode};

export function cut(text, start, end, method = '', All = false) {
    // drpy2 cut 的正则裁切语义：start/end 为字符串正则，裁出其间的文本（含 end 串）
    try {
        const lr = new RegExp(String.raw`${start}`.toString());
        const rr = new RegExp(String.raw`${end}`.toString());
        const segments = String(text).split(lr);
        if (segments.length < 2) return '';
        const cutSegments = segments.slice(1)
            .map((segment) => {
                const parts = segment.split(rr);
                return parts.length < 2 ? undefined : parts[0] + end;
            })
            .filter(Boolean);
        return All ? `[${cutSegments.join(',')}]` : (cutSegments[0] || '');
    } catch {
        return '';
    }
}

export function encodeStr(input, encoding = 'gbk') {
    if (String(encoding).startsWith('gb') && gbkTool) return gbkTool.encode(input);
    return input;
}

export function decodeStr(input, encoding = 'gbk') {
    if (String(encoding).startsWith('gb') && gbkTool) return gbkTool.decode(input);
    return input;
}

/** drpy2 stringUtils：给 String 挂 replaceX/parseX（js: 片段老肌肉记忆兼容） */
export function installStringUtils() {
    if (String.prototype.replaceX) return;
    Object.defineProperties(String.prototype, {
        replaceX: {
            value: function (regex, replacement) {
                const hasCaptureGroup = /\$\d/.test(replacement);
                return this.replace(regex, hasCaptureGroup ? replacement : (m, p1) => m.replace(new RegExp(p1), replacement));
            },
            configurable: true,
            enumerable: false,
            writable: true,
        },
        parseX: {
            get() {
                try {
                    return JSON.parse(this.toString());
                } catch {
                    return this.startsWith('[') ? [] : {};
                }
            },
            configurable: true,
            enumerable: false,
        },
    });
}

export function makeText() {
    return {
        UA,
        urlencode,
        cut,
        encodeStr,
        decodeStr,
        stringUtils: installStringUtils,
    };
}
