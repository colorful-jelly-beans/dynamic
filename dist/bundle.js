
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
const addEffectToElementContent = (elem, cont, propertyToChange) => {
    if (cont === null)
        return;
    switch (typeof cont) {
        case "string":
            elem[propertyToChange] = cont;
            break;
        case "object":
            watchEffect(() => {
                elem[propertyToChange] = cont.value;
            });
            break;
        case "function":
            const comp = computed(cont);
            watchEffect(() => {
                elem[propertyToChange] = comp.value;
            });
            break;
    }
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const e = (tag, cont, options) => {
    if (tag === "textNode") {
        const node = document.createTextNode("");
        addEffectToElementContent(node, cont, "textContent");
        return node;
    }
    let elem = document.createElement(tag);
    const propertyToChange = tag === "input" ? "value" : "innerHTML";
    addEffectToElementContent(elem, cont, propertyToChange);
    if (options) {
        elem = addOptionsToElem(elem, options);
    }
    return elem;
};
const replaceComponentWithComment = (componentID, commentNode) => {
    document.querySelectorAll(`[data-d-${componentID}]`).forEach((el, ind) => {
        if (ind === 0) {
            el.replaceWith(commentNode);
        }
        else {
            el.remove();
        }
    });
};
let ctx;
const mount = (setup, render, props, options, hooks, css, componentID = crypto.randomUUID()) => {
    createScopedStyle(css, componentID);
    if (options && "_if" in options) {
        const commentNode = document.createComment("_if");
        const { _if } = options, optionsWithoutIf = __rest(options, ["_if"]);
        const remount = () => mount(setup, render, props, optionsWithoutIf, hooks, css, componentID);
        let node = commentNode;
        watch([() => options["_if"].value], (newValue) => {
            if (newValue) {
                let docFragm = remount();
                node.replaceWith(docFragm);
            }
            else {
                if ('unmounted' in hooks) {
                    hooks.unmounted.call(ctx);
                }
                replaceComponentWithComment(componentID, node);
            }
        }, false);
        if (!options["_if"].value)
            return node;
    }
    if ('created' in hooks)
        hooks.created();
    ctx = Object.assign(Object.assign({}, props), setup(props));
    let doc = render
        .call(ctx)
        .filter(el => el !== null);
    doc.forEach(el => {
        if (el instanceof HTMLElement) {
            el.setAttribute("data-d-" + componentID, "");
        }
    });
    const docFragm = document.createDocumentFragment();
    docFragm.replaceChildren(...doc);
    if (options) {
        for (let child of docFragm.children) {
            addOptionsToElem(child, options);
        }
    }
    if ('beforeMount' in hooks) {
        hooks.beforeMount.call(ctx);
    }
    return docFragm;
};
const mounter = (setup, render, hooks, css) => {
    return (props, options) => mount(setup, render, props, options, hooks, css);
};

const addOptionsToElem = (elem, options) => {
    let out = elem;
    Object.keys(options).forEach((o) => {
        if (o.startsWith("@")) {
            elem.addEventListener(o.slice(1), options[o]);
            out = elem;
            return;
        }
        if (o.startsWith("_")) {
            const directive = o.slice(1);
            if (directive === "if") {
                const commentNode = document.createComment("_if");
                let node = commentNode;
                watch([() => options[o].value], (newValue) => {
                    if (newValue) {
                        node.replaceWith(elem);
                        node = elem;
                    }
                    else {
                        node.replaceWith(commentNode);
                        node = commentNode;
                    }
                }, true);
                out = node;
                return;
            }
        }
        if (o === "class") {
            out.classList.add(options[o]);
        }
    });
    return out;
};

let activeEffect = null;
const setActiveEffect = (value) => {
    activeEffect = value;
};

const watchEffect = (callback) => {
    const effect = () => {
        setActiveEffect(effect);
        callback();
        setActiveEffect(null);
    };
    effect();
};
const watch = (dependencyList, callback, immediate = false) => {
    dependencyList.forEach(dep => {
        let isFirstRun = true;
        let previousValue, currentValue;
        watchEffect(() => {
            currentValue = dep();
            if ((immediate || !isFirstRun) && (previousValue !== currentValue)) {
                callback(currentValue, previousValue);
            }
            isFirstRun = false;
            previousValue = currentValue;
        });
    });
};

const ref = (val) => {
    let innerValue = val;
    const dependentEffects = new Set();
    const refObj = {
        get value() {
            if (activeEffect) {
                dependentEffects.add(activeEffect);
            }
            return innerValue;
        },
        set value(newVal) {
            innerValue = newVal;
            for (const dependentEffect of dependentEffects) {
                dependentEffect();
            }
        }
    };
    return refObj;
};
const computed = (callback) => {
    const state = ref();
    watchEffect(() => {
        state.value = callback();
    });
    return state;
};

const route = ref(window.location.pathname);
const router = {
    push(location) {
        route.value = location;
        history.pushState({}, '', location);
    }
};
window.addEventListener("popstate", () => {
    route.value = document.location.pathname;
});

const createScopedStyle = (css, componentID) => {
    if (!css)
        return;
    const style = document.createElement('style');
    style.textContent = getScopedCss(css, componentID);
    style.setAttribute('data-d-' + componentID, '');
    document.body.appendChild(style);
};
const getScopedCss = (cssString, componentID) => {
    const selectorPattern = /([^},\n]+?(?=({|,)))/g;
    return cssString.replaceAll(selectorPattern, `[data-d-${componentID}]$1`);
};

const setup$1 = () => { };
function render$1() {
    const m = e("p", "hi", {
        "class": "yo"
    });
    const t = e("p", () => this.counter.value, {
        "class": "hey"
    });
    return [m, t];
}
const hooks$1 = {
    created() {
        console.log('msg created');
    },
    beforeMount() {
        console.log('msg beforeMount', this.counter.value);
    },
    unmounted() {
        console.log('msg unmounted', this.counter.value);
    }
};
var Message = mounter(setup$1, render$1, hooks$1);

const setup = () => {
    const counter = ref(0);
    const inc = () => {
        counter.value++;
    };
    const msg = ref("");
    watch([() => msg.value], () => console.log('msg val changed ' + counter.value));
    return { counter, inc, msg };
};
function render() {
    const homeBtn = e("button", 'go home', {
        "@click": () => router.push('/home')
    });
    const welcomeBlock = e("div", () => 'Welcome to the Home Page!', {
        "_if": computed(() => route.value === '/home')
    });
    const counter = e("p", () => 'counter: ' + this.counter.value, {
        "_if": computed(() => this.counter.value % 2 === 0),
        "class": 'counter'
    });
    const msgComponent = Message({ counter: this.counter }, {
        "_if": computed(() => this.counter.value % 4 === 0),
        "@click": this.inc,
        "class": "test",
    });
    const btn = e("button", () => "click me to make " + (this.counter.value + 1), {
        "@click": this.inc
    });
    const inp = e("input", null, {
        "@input": (ev) => {
            this.msg.value = ev.target.value;
        }
    });
    const txt = e("p", () => this.msg.value);
    return [homeBtn, welcomeBlock, counter, msgComponent, btn, inp, txt];
}
const hooks = {
    created() {
        console.log('app created');
    },
    beforeMount() {
        console.log('app beforeMount');
    },
};
const css = `
.counter {
    border: 1px solid red;
}
`;
var App = mounter(setup, render, hooks, css);

var _a;
(_a = document.getElementById("app")) === null || _a === void 0 ? void 0 : _a.append(App());
//# sourceMappingURL=bundle.js.map
