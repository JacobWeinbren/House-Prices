! function(t) { if ("object" == typeof exports && "undefined" != typeof module) module.exports = t();
    else if ("function" == typeof define && define.amd) define([], t);
    else { var e;
        e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, e.MapboxInspect = t() } }(function() { var t; return function t(e, n, r) {
        function o(i, s) { if (!n[i]) { if (!e[i]) { var u = "function" == typeof require && require; if (!s && u) return u(i, !0); if (a) return a(i, !0); var c = new Error("Cannot find module '" + i + "'"); throw c.code = "MODULE_NOT_FOUND", c } var l = n[i] = { exports: {} };
                e[i][0].call(l.exports, function(t) { var n = e[i][1][t]; return o(n ? n : t) }, l, l.exports, t, e, n, r) } return n[i].exports } for (var a = "function" == typeof require && require, i = 0; i < r.length; i++) o(r[i]); return o }({ 1: [function(t, e, n) { var r = t("./lib/MapboxInspect");
            e.exports = r }, { "./lib/MapboxInspect": 3 }], 2: [function(t, e, n) {
            function r(t, e) { var n = document.createElement("div"); return n.className = "mapboxgl-ctrl mapboxgl-ctrl-group", n.appendChild(t), e || (n.style.display = "none"), n }

            function o() { var t = document.createElement("button"); return t.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-inspect", t.type = "button", t["aria-label"] = "Inspect", t }

            function a(t) { t = Object.assign({ show: !0, onToggle: function() {} }, t), this._btn = o(), this._btn.onclick = t.onToggle, this.elem = r(this._btn, t.show) } a.prototype.setInspectIcon = function() { this._btn.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-inspect" }, a.prototype.setMapIcon = function() { this._btn.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-map" }, e.exports = a }, {}], 3: [function(t, e, n) {
            function r(t) { return t.metadata && t.metadata.inspect }

            function o(t) { return t.metadata = t.metadata || {}, t.metadata.inspect = !0, t }

            function a(t) { return "raster" === t.type && t.tileSize && t.tiles ? { type: t.type, tileSize: t.tileSize, tiles: t.tiles } : "raster" === t.type && t.url ? { type: t.type, url: t.url } : t }

            function i(t) { return Object.keys(t.sources).forEach(function(e) { t.sources[e] = a(t.sources[e]) }), t }

            function s(t) { var e = t.version.split(".").map(parseFloat);
                e[0] < 1 && e[1] < 29 && console.error("MapboxInspect only supports Mapbox GL JS >= v0.29.0. Please upgrade your Mapbox GL JS version.") }

            function u(t) { if (!(this instanceof u)) throw new Error("MapboxInspect needs to be called with the new keyword"); var e = null;
                window.mapboxgl ? (s(window.mapboxgl), e = new window.mapboxgl.Popup({ closeButton: !1, closeOnClick: !1 })) : t.popup || console.error("Mapbox GL JS can not be found. Make sure to include it or pass an initialized MapboxGL Popup to MapboxInspect if you are using moduleis."), this.options = Object.assign({ showInspectMap: !1, showInspectButton: !0, showInspectMapPopup: !0, showMapPopup: !1, backgroundColor: "#fff", assignLayerColor: h.brightColor, buildInspectStyle: c.generateInspectStyle, renderPopup: f, popup: e }, t), this.sources = {}, this.assignLayerColor = this.options.assignLayerColor, this.toggleInspector = this.toggleInspector.bind(this), this._popup = this.options.popup, this._showInspectMap = this.options.showInspectMap, this._onSourceChange = this._onSourceChange.bind(this), this._onMousemove = this._onMousemove.bind(this), this._onStyleChange = this._onStyleChange.bind(this), this._originalStyle = null, this._toggle = new l({ show: this.options.showInspectButton, onToggle: this.toggleInspector.bind(this) }) } var c = t("./stylegen"),
                l = t("./InspectButton"),
                p = t("lodash.isequal"),
                f = t("./renderPopup"),
                h = t("./colors");
            u.prototype.toggleInspector = function() { this._showInspectMap = !this._showInspectMap, this.render() }, u.prototype._inspectStyle = function() { var t = c.generateColoredLayers(this.sources, this.assignLayerColor); return this.options.buildInspectStyle(this._map.getStyle(), t, { backgroundColor: this.options.backgroundColor }) }, u.prototype.render = function() { this._showInspectMap ? (this._map.setStyle(i(o(this._inspectStyle()))), this._toggle.setMapIcon()) : this._originalStyle && (this._popup && this._popup.remove(), this._map.setStyle(i(this._originalStyle)), this._toggle.setInspectIcon()) }, u.prototype._onSourceChange = function() { var t = this.sources,
                    e = this._map,
                    n = Object.assign({}, t);
                Object.keys(e.style.sourceCaches).forEach(function(n) { var r = e.style.sourceCaches[n]._source.vectorLayerIds;
                    r && (t[n] = r) }), p(n, t) || this.render() }, u.prototype._onStyleChange = function() { var t = this._map.getStyle();
                r(t) || (this._originalStyle = t) }, u.prototype._onMousemove = function(t) { if ((this.options.showInspectMapPopup || !this._showInspectMap) && (this.options.showMapPopup || this._showInspectMap)) { var e = this._map.queryRenderedFeatures(t.point);
                    this._map.getCanvas().style.cursor = e.length ? "pointer" : "", !e.length && this._popup ? this._popup.remove() : this._popup && this._popup.setLngLat(t.lngLat).setHTML(this.options.renderPopup(e)).addTo(this._map) } }, u.prototype.onAdd = function(t) { return this._map = t, t.on("styledata", this._onStyleChange), t.on("load", this._onStyleChange), t.on("tiledata", this._onSourceChange), t.on("sourcedata", this._onSourceChange), t.on("mousemove", this._onMousemove), this._toggle.elem }, u.prototype.onRemove = function() { this._map.off("styledata", this._onStyleChange), this._map.off("load", this._onStyleChange), this._map.off("tiledata", this._onSourceChange), this._map.off("sourcedata", this._onSourceChange), this._map.off("mousemove", this._onMousemove); var t = this._toggle.elem;
                t.parentNode.removeChild(t), this._map = void 0 }, e.exports = u }, { "./InspectButton": 2, "./colors": 4, "./renderPopup": 5, "./stylegen": 6, "lodash.isequal": 7 }], 4: [function(t, e, n) {
            function r(t, e) { var n = "bright",
                    r = null; /water|ocean|lake|sea|river/.test(t) && (r = "blue"), /state|country|place/.test(t) && (r = "pink"), /road|highway|transport/.test(t) && (r = "orange"), /contour|building/.test(t) && (r = "monochrome"), /building/.test(t) && (n = "dark"), /contour|landuse/.test(t) && (r = "yellow"), /wood|forest|park|landcover/.test(t) && (r = "green"); var a = o({ luminosity: n, hue: r, seed: t, format: "rgbArray" }),
                    i = a.concat([e || 1]); return "rgba(" + i.join(", ") + ")" } var o = t("randomcolor");
            n.brightColor = r }, { randomcolor: 8 }], 5: [function(t, e, n) {
            function r(t) { return "undefined" == typeof t || null === t ? t : t instanceof Date ? t.toLocaleString() : "object" == typeof t || "number" == typeof t || "string" == typeof t ? t.toString() : t }

            function o(t, e) { return '<div class="mapbox-gl-inspect_property"><div class="mapbox-gl-inspect_property-name">' + t + '</div><div class="mapbox-gl-inspect_property-value">' + r(e) + "</div></div>" }

            function a(t) { return '<div class="mapbox-gl-inspect_layer">' + t + "</div>" }

            function i(t) { var e = a(t.layer["source-layer"] || t.layer.source),
                    n = o("$type", t.geometry.type),
                    r = Object.keys(t.properties).map(function(e) { return o(e, t.properties[e]) }); return [e, n].concat(r).join("") }

            function s(t) { return t.map(function(t) { return '<div class="mapbox-gl-inspect_feature">' + i(t) + "</div>" }).join("") }

            function u(t) { return '<div class="mapbox-gl-inspect_popup">' + s(t) + "</div>" } e.exports = u }, {}], 6: [function(t, e, n) {
            function r(t, e, n) { var r = { id: [e, n, "circle"].join("_"), source: e, type: "circle", paint: { "circle-color": t, "circle-radius": 2 }, filter: ["==", "$type", "Point"] }; return n && (r["source-layer"] = n), r }

            function o(t, e, n, r) { var o = { id: [n, r, "polygon"].join("_"), source: n, type: "fill", paint: { "fill-color": t, "fill-antialias": !0, "fill-outline-color": t }, filter: ["==", "$type", "Polygon"] }; return r && (o["source-layer"] = r), o }

            function a(t, e, n) { var r = { id: [e, n, "line"].join("_"), source: e, layout: { "line-join": "round", "line-cap": "round" }, type: "line", paint: { "line-color": t }, filter: ["==", "$type", "LineString"] }; return n && (r["source-layer"] = n), r }

            function i(t, e) {
                function n(t) { var n = e.bind(null, t),
                        r = { circle: n(.8), line: n(.6), polygon: n(.3), polygonOutline: n(.6), default: n(1) }; return r } var i = [],
                    s = [],
                    u = []; return Object.keys(t).forEach(function(e) { var c = t[e]; if (c) c.forEach(function(t) { var c = n(t);
                        s.push(r(c.circle, e, t)), u.push(a(c.line, e, t)), i.push(o(c.polygon, c.polygonOutline, e, t)) });
                    else { var l = n(e);
                        s.push(r(l.circle, e)), u.push(a(l.line, e)), i.push(o(l.polygon, l.polygonOutline, e)) } }), i.concat(u).concat(s) }

            function s(t, e, n) { n = Object.assign({ backgroundColor: "#fff" }, n); var r = { id: "background", type: "background", paint: { "background-color": n.backgroundColor } }; return Object.assign(t, { layers: [r].concat(e) }) } n.polygonLayer = o, n.lineLayer = a, n.circleLayer = r, n.generateInspectStyle = s, n.generateColoredLayers = i }, {}], 7: [function(t, e, n) {
            (function(t) {
                function r(t, e) { for (var n = -1, r = t ? t.length : 0; ++n < r;)
                        if (e(t[n], n, t)) return !0; return !1 }

                function o(t, e) { for (var n = -1, r = Array(t); ++n < t;) r[n] = e(n); return r }

                function a(t) { return function(e) { return t(e) } }

                function i(t, e) { return null == t ? void 0 : t[e] }

                function s(t) { var e = !1; if (null != t && "function" != typeof t.toString) try { e = !!(t + "") } catch (t) {}
                    return e }

                function u(t) { var e = -1,
                        n = Array(t.size); return t.forEach(function(t, r) { n[++e] = [r, t] }), n }

                function c(t, e) { return function(n) { return t(e(n)) } }

                function l(t) { var e = -1,
                        n = Array(t.size); return t.forEach(function(t) { n[++e] = t }), n }

                function p(t) { var e = -1,
                        n = t ? t.length : 0; for (this.clear(); ++e < n;) { var r = t[e];
                        this.set(r[0], r[1]) } }

                function f() { this.__data__ = je ? je(null) : {} }

                function h(t) { return this.has(t) && delete this.__data__[t] }

                function d(t) { var e = this.__data__; if (je) { var n = e[t]; return n === ht ? void 0 : n } return ce.call(e, t) ? e[t] : void 0 }

                function y(t) { var e = this.__data__; return je ? void 0 !== e[t] : ce.call(e, t) }

                function g(t, e) { var n = this.__data__; return n[t] = je && void 0 === e ? ht : e, this }

                function _(t) { var e = -1,
                        n = t ? t.length : 0; for (this.clear(); ++e < n;) { var r = t[e];
                        this.set(r[0], r[1]) } }

                function v() { this.__data__ = [] }

                function b(t) { var e = this.__data__,
                        n = N(e, t); if (n < 0) return !1; var r = e.length - 1; return n == r ? e.pop() : ye.call(e, n, 1), !0 }

                function m(t) { var e = this.__data__,
                        n = N(e, t); return n < 0 ? void 0 : e[n][1] }

                function w(t) { return N(this.__data__, t) > -1 }

                function j(t, e) { var n = this.__data__,
                        r = N(n, t); return r < 0 ? n.push([t, e]) : n[r][1] = e, this }

                function S(t) { var e = -1,
                        n = t ? t.length : 0; for (this.clear(); ++e < n;) { var r = t[e];
                        this.set(r[0], r[1]) } }

                function M() { this.__data__ = { hash: new p, map: new(ve || _), string: new p } }

                function I(t) { return X(this, t).delete(t) }

                function x(t) { return X(this, t).get(t) }

                function k(t) { return X(this, t).has(t) }

                function C(t, e) { return X(this, t).set(t, e), this }

                function O(t) { var e = -1,
                        n = t ? t.length : 0; for (this.__data__ = new S; ++e < n;) this.add(t[e]) }

                function A(t) { return this.__data__.set(t, ht), this }

                function L(t) { return this.__data__.has(t) }

                function E(t) { this.__data__ = new _(t) }

                function P() { this.__data__ = new _ }

                function R(t) { return this.__data__.delete(t) }

                function T(t) { return this.__data__.get(t) }

                function $(t) { return this.__data__.has(t) }

                function B(t, e) { var n = this.__data__; if (n instanceof _) { var r = n.__data__; if (!ve || r.length < ft - 1) return r.push([t, e]), this;
                        n = this.__data__ = new S(r) } return n.set(t, e), this }

                function F(t, e) { var n = Le(t) || rt(t) ? o(t.length, String) : [],
                        r = n.length,
                        a = !!r; for (var i in t) !e && !ce.call(t, i) || a && ("length" == i || Q(i, r)) || n.push(i); return n }

                function N(t, e) { for (var n = t.length; n--;)
                        if (nt(t[n][0], e)) return n; return -1 }

                function z(t) { return le.call(t) }

                function q(t, e, n, r, o) { return t === e || (null == t || null == e || !ct(t) && !lt(e) ? t !== t && e !== e : U(t, e, q, n, r, o)) }

                function U(t, e, n, r, o, a) { var i = Le(t),
                        u = Le(e),
                        c = vt,
                        l = vt;
                    i || (c = Ae(t), c = c == _t ? xt : c), u || (l = Ae(e), l = l == _t ? xt : l); var p = c == xt && !s(t),
                        f = l == xt && !s(e),
                        h = c == l; if (h && !p) return a || (a = new E), i || Ee(t) ? V(t, e, n, r, o, a) : W(t, e, c, n, r, o, a); if (!(o & yt)) { var d = p && ce.call(t, "__wrapped__"),
                            y = f && ce.call(e, "__wrapped__"); if (d || y) { var g = d ? t.value() : t,
                                _ = y ? e.value() : e; return a || (a = new E), n(g, _, r, o, a) } } return !!h && (a || (a = new E), H(t, e, n, r, o, a)) }

                function D(t) { if (!ct(t) || Z(t)) return !1; var e = st(t) || s(t) ? pe : Jt; return e.test(et(t)) }

                function G(t) { return lt(t) && ut(t.length) && !!Wt[le.call(t)] }

                function J(t) { if (!tt(t)) return ge(t); var e = []; for (var n in Object(t)) ce.call(t, n) && "constructor" != n && e.push(n); return e }

                function V(t, e, n, o, a, i) { var s = a & yt,
                        u = t.length,
                        c = e.length; if (u != c && !(s && c > u)) return !1; var l = i.get(t); if (l && i.get(e)) return l == e; var p = -1,
                        f = !0,
                        h = a & dt ? new O : void 0; for (i.set(t, e), i.set(e, t); ++p < u;) { var d = t[p],
                            y = e[p]; if (o) var g = s ? o(y, d, p, e, t, i) : o(d, y, p, t, e, i); if (void 0 !== g) { if (g) continue;
                            f = !1; break } if (h) { if (!r(e, function(t, e) { if (!h.has(e) && (d === t || n(d, t, o, a, i))) return h.add(e) })) { f = !1; break } } else if (d !== y && !n(d, y, o, a, i)) { f = !1; break } } return i.delete(t), i.delete(e), f }

                function W(t, e, n, r, o, a, i) { switch (n) {
                        case Rt:
                            if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset) return !1;
                            t = t.buffer, e = e.buffer;
                        case Pt:
                            return !(t.byteLength != e.byteLength || !r(new he(t), new he(e)));
                        case bt:
                        case mt:
                        case It:
                            return nt(+t, +e);
                        case wt:
                            return t.name == e.name && t.message == e.message;
                        case Ct:
                        case At:
                            return t == e + "";
                        case Mt:
                            var s = u;
                        case Ot:
                            var c = a & yt; if (s || (s = l), t.size != e.size && !c) return !1; var p = i.get(t); if (p) return p == e;
                            a |= dt, i.set(t, e); var f = V(s(t), s(e), r, o, a, i); return i.delete(t), f;
                        case Lt:
                            if (Oe) return Oe.call(t) == Oe.call(e) } return !1 }

                function H(t, e, n, r, o, a) { var i = o & yt,
                        s = pt(t),
                        u = s.length,
                        c = pt(e),
                        l = c.length; if (u != l && !i) return !1; for (var p = u; p--;) { var f = s[p]; if (!(i ? f in e : ce.call(e, f))) return !1 } var h = a.get(t); if (h && a.get(e)) return h == e; var d = !0;
                    a.set(t, e), a.set(e, t); for (var y = i; ++p < u;) { f = s[p]; var g = t[f],
                            _ = e[f]; if (r) var v = i ? r(_, g, f, e, t, a) : r(g, _, f, t, e, a); if (!(void 0 === v ? g === _ || n(g, _, r, o, a) : v)) { d = !1; break } y || (y = "constructor" == f) } if (d && !y) { var b = t.constructor,
                            m = e.constructor;
                        b != m && "constructor" in t && "constructor" in e && !("function" == typeof b && b instanceof b && "function" == typeof m && m instanceof m) && (d = !1) } return a.delete(t), a.delete(e), d }

                function X(t, e) { var n = t.__data__; return Y(e) ? n["string" == typeof e ? "string" : "hash"] : n.map }

                function K(t, e) { var n = i(t, e); return D(n) ? n : void 0 }

                function Q(t, e) { return e = null == e ? gt : e, !!e && ("number" == typeof t || Vt.test(t)) && t > -1 && t % 1 == 0 && t < e }

                function Y(t) { var e = typeof t; return "string" == e || "number" == e || "symbol" == e || "boolean" == e ? "__proto__" !== t : null === t }

                function Z(t) { return !!se && se in t }

                function tt(t) { var e = t && t.constructor,
                        n = "function" == typeof e && e.prototype || ae; return t === n }

                function et(t) { if (null != t) { try { return ue.call(t) } catch (t) {} try { return t + "" } catch (t) {} } return "" }

                function nt(t, e) { return t === e || t !== t && e !== e }

                function rt(t) { return at(t) && ce.call(t, "callee") && (!de.call(t, "callee") || le.call(t) == _t) }

                function ot(t) { return null != t && ut(t.length) && !st(t) }

                function at(t) { return lt(t) && ot(t) }

                function it(t, e) { return q(t, e) }

                function st(t) { var e = ct(t) ? le.call(t) : ""; return e == jt || e == St }

                function ut(t) { return "number" == typeof t && t > -1 && t % 1 == 0 && t <= gt }

                function ct(t) { var e = typeof t; return !!t && ("object" == e || "function" == e) }

                function lt(t) { return !!t && "object" == typeof t }

                function pt(t) { return ot(t) ? F(t) : J(t) } var ft = 200,
                    ht = "__lodash_hash_undefined__",
                    dt = 1,
                    yt = 2,
                    gt = 9007199254740991,
                    _t = "[object Arguments]",
                    vt = "[object Array]",
                    bt = "[object Boolean]",
                    mt = "[object Date]",
                    wt = "[object Error]",
                    jt = "[object Function]",
                    St = "[object GeneratorFunction]",
                    Mt = "[object Map]",
                    It = "[object Number]",
                    xt = "[object Object]",
                    kt = "[object Promise]",
                    Ct = "[object RegExp]",
                    Ot = "[object Set]",
                    At = "[object String]",
                    Lt = "[object Symbol]",
                    Et = "[object WeakMap]",
                    Pt = "[object ArrayBuffer]",
                    Rt = "[object DataView]",
                    Tt = "[object Float32Array]",
                    $t = "[object Float64Array]",
                    Bt = "[object Int8Array]",
                    Ft = "[object Int16Array]",
                    Nt = "[object Int32Array]",
                    zt = "[object Uint8Array]",
                    qt = "[object Uint8ClampedArray]",
                    Ut = "[object Uint16Array]",
                    Dt = "[object Uint32Array]",
                    Gt = /[\\^$.*+?()[\]{}|]/g,
                    Jt = /^\[object .+?Constructor\]$/,
                    Vt = /^(?:0|[1-9]\d*)$/,
                    Wt = {};
                Wt[Tt] = Wt[$t] = Wt[Bt] = Wt[Ft] = Wt[Nt] = Wt[zt] = Wt[qt] = Wt[Ut] = Wt[Dt] = !0, Wt[_t] = Wt[vt] = Wt[Pt] = Wt[bt] = Wt[Rt] = Wt[mt] = Wt[wt] = Wt[jt] = Wt[Mt] = Wt[It] = Wt[xt] = Wt[Ct] = Wt[Ot] = Wt[At] = Wt[Et] = !1; var Ht = "object" == typeof t && t && t.Object === Object && t,
                    Xt = "object" == typeof self && self && self.Object === Object && self,
                    Kt = Ht || Xt || Function("return this")(),
                    Qt = "object" == typeof n && n && !n.nodeType && n,
                    Yt = Qt && "object" == typeof e && e && !e.nodeType && e,
                    Zt = Yt && Yt.exports === Qt,
                    te = Zt && Ht.process,
                    ee = function() { try { return te && te.binding("util") } catch (t) {} }(),
                    ne = ee && ee.isTypedArray,
                    re = Array.prototype,
                    oe = Function.prototype,
                    ae = Object.prototype,
                    ie = Kt["__core-js_shared__"],
                    se = function() { var t = /[^.]+$/.exec(ie && ie.keys && ie.keys.IE_PROTO || ""); return t ? "Symbol(src)_1." + t : "" }(),
                    ue = oe.toString,
                    ce = ae.hasOwnProperty,
                    le = ae.toString,
                    pe = RegExp("^" + ue.call(ce).replace(Gt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
                    fe = Kt.Symbol,
                    he = Kt.Uint8Array,
                    de = ae.propertyIsEnumerable,
                    ye = re.splice,
                    ge = c(Object.keys, Object),
                    _e = K(Kt, "DataView"),
                    ve = K(Kt, "Map"),
                    be = K(Kt, "Promise"),
                    me = K(Kt, "Set"),
                    we = K(Kt, "WeakMap"),
                    je = K(Object, "create"),
                    Se = et(_e),
                    Me = et(ve),
                    Ie = et(be),
                    xe = et(me),
                    ke = et(we),
                    Ce = fe ? fe.prototype : void 0,
                    Oe = Ce ? Ce.valueOf : void 0;
                p.prototype.clear = f, p.prototype.delete = h, p.prototype.get = d, p.prototype.has = y, p.prototype.set = g, _.prototype.clear = v, _.prototype.delete = b, _.prototype.get = m, _.prototype.has = w, _.prototype.set = j, S.prototype.clear = M, S.prototype.delete = I, S.prototype.get = x, S.prototype.has = k, S.prototype.set = C, O.prototype.add = O.prototype.push = A, O.prototype.has = L, E.prototype.clear = P, E.prototype.delete = R, E.prototype.get = T, E.prototype.has = $, E.prototype.set = B; var Ae = z;
                (_e && Ae(new _e(new ArrayBuffer(1))) != Rt || ve && Ae(new ve) != Mt || be && Ae(be.resolve()) != kt || me && Ae(new me) != Ot || we && Ae(new we) != Et) && (Ae = function(t) { var e = le.call(t),
                        n = e == xt ? t.constructor : void 0,
                        r = n ? et(n) : void 0; if (r) switch (r) {
                        case Se:
                            return Rt;
                        case Me:
                            return Mt;
                        case Ie:
                            return kt;
                        case xe:
                            return Ot;
                        case ke:
                            return Et }
                    return e }); var Le = Array.isArray,
                    Ee = ne ? a(ne) : G;
                e.exports = it }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}) }, {}], 8: [function(e, n, r) {! function(e, o) { if ("function" == typeof t && t.amd) t([], o);
                else if ("object" == typeof r) { var a = o(); "object" == typeof n && n && n.exports && (r = n.exports = a), r.randomColor = a } else e.randomColor = o() }(this, function() {
                function t(t) { var e = a(t.hue),
                        n = u(e); return n < 0 && (n = 360 + n), n }

                function e(t, e) { if ("random" === e.luminosity) return u([0, 100]); if ("monochrome" === e.hue) return 0; var n = i(t),
                        r = n[0],
                        o = n[1]; switch (e.luminosity) {
                        case "bright":
                            r = 55; break;
                        case "dark":
                            r = o - 10; break;
                        case "light":
                            o = 55 } return u([r, o]) }

                function n(t, e, n) { var r = o(t, e),
                        a = 100; switch (n.luminosity) {
                        case "dark":
                            a = r + 20; break;
                        case "light":
                            r = (a + r) / 2; break;
                        case "random":
                            r = 0, a = 100 } return u([r, a]) }

                function r(t, e) { switch (e.format) {
                        case "hsvArray":
                            return t;
                        case "hslArray":
                            return h(t);
                        case "hsl":
                            var n = h(t); return "hsl(" + n[0] + ", " + n[1] + "%, " + n[2] + "%)";
                        case "hsla":
                            var r = h(t); return "hsla(" + r[0] + ", " + r[1] + "%, " + r[2] + "%, " + Math.random() + ")";
                        case "rgbArray":
                            return f(t);
                        case "rgb":
                            var o = f(t); return "rgb(" + o.join(", ") + ")";
                        case "rgba":
                            var a = f(t); return "rgba(" + a.join(", ") + ", " + Math.random() + ")";
                        default:
                            return c(t) } }

                function o(t, e) { for (var n = s(t).lowerBounds, r = 0; r < n.length - 1; r++) { var o = n[r][0],
                            a = n[r][1],
                            i = n[r + 1][0],
                            u = n[r + 1][1]; if (e >= o && e <= i) { var c = (u - a) / (i - o),
                                l = a - c * o; return c * e + l } } return 0 }

                function a(t) { if ("number" == typeof parseInt(t)) { var e = parseInt(t); if (e < 360 && e > 0) return [e, e] } if ("string" == typeof t && g[t]) { var n = g[t]; if (n.hueRange) return n.hueRange } return [0, 360] }

                function i(t) { return s(t).saturationRange }

                function s(t) { t >= 334 && t <= 360 && (t -= 360); for (var e in g) { var n = g[e]; if (n.hueRange && t >= n.hueRange[0] && t <= n.hueRange[1]) return g[e] } return "Color not found" }

                function u(t) { if (null === y) return Math.floor(t[0] + Math.random() * (t[1] + 1 - t[0])); var e = t[1] || 1,
                        n = t[0] || 0;
                    y = (9301 * y + 49297) % 233280; var r = y / 233280; return Math.floor(n + r * (e - n)) }

                function c(t) {
                    function e(t) { var e = t.toString(16); return 1 == e.length ? "0" + e : e } var n = f(t),
                        r = "#" + e(n[0]) + e(n[1]) + e(n[2]); return r }

                function l(t, e, n) { var r = n[0][0],
                        o = n[n.length - 1][0],
                        a = n[n.length - 1][1],
                        i = n[0][1];
                    g[t] = { hueRange: e, lowerBounds: n, saturationRange: [r, o], brightnessRange: [a, i] } }

                function p() { l("monochrome", null, [
                        [0, 0],
                        [100, 0]
                    ]), l("red", [-26, 18], [
                        [20, 100],
                        [30, 92],
                        [40, 89],
                        [50, 85],
                        [60, 78],
                        [70, 70],
                        [80, 60],
                        [90, 55],
                        [100, 50]
                    ]), l("orange", [19, 46], [
                        [20, 100],
                        [30, 93],
                        [40, 88],
                        [50, 86],
                        [60, 85],
                        [70, 70],
                        [100, 70]
                    ]), l("yellow", [47, 62], [
                        [25, 100],
                        [40, 94],
                        [50, 89],
                        [60, 86],
                        [70, 84],
                        [80, 82],
                        [90, 80],
                        [100, 75]
                    ]), l("green", [63, 178], [
                        [30, 100],
                        [40, 90],
                        [50, 85],
                        [60, 81],
                        [70, 74],
                        [80, 64],
                        [90, 50],
                        [100, 40]
                    ]), l("blue", [179, 257], [
                        [20, 100],
                        [30, 86],
                        [40, 80],
                        [50, 74],
                        [60, 60],
                        [70, 52],
                        [80, 44],
                        [90, 39],
                        [100, 35]
                    ]), l("purple", [258, 282], [
                        [20, 100],
                        [30, 87],
                        [40, 79],
                        [50, 70],
                        [60, 65],
                        [70, 59],
                        [80, 52],
                        [90, 45],
                        [100, 42]
                    ]), l("pink", [283, 334], [
                        [20, 100],
                        [30, 90],
                        [40, 86],
                        [60, 84],
                        [80, 80],
                        [90, 75],
                        [100, 73]
                    ]) }

                function f(t) { var e = t[0];
                    0 === e && (e = 1), 360 === e && (e = 359), e /= 360; var n = t[1] / 100,
                        r = t[2] / 100,
                        o = Math.floor(6 * e),
                        a = 6 * e - o,
                        i = r * (1 - n),
                        s = r * (1 - a * n),
                        u = r * (1 - (1 - a) * n),
                        c = 256,
                        l = 256,
                        p = 256; switch (o) {
                        case 0:
                            c = r, l = u, p = i; break;
                        case 1:
                            c = s, l = r, p = i; break;
                        case 2:
                            c = i, l = r, p = u; break;
                        case 3:
                            c = i, l = s, p = r; break;
                        case 4:
                            c = u, l = i, p = r; break;
                        case 5:
                            c = r, l = i, p = s } var f = [Math.floor(255 * c), Math.floor(255 * l), Math.floor(255 * p)]; return f }

                function h(t) { var e = t[0],
                        n = t[1] / 100,
                        r = t[2] / 100,
                        o = (2 - n) * r; return [e, Math.round(n * r / (o < 1 ? o : 2 - o) * 1e4) / 100, o / 2 * 100] }

                function d(t) { for (var e = 0, n = 0; n !== t.length && !(e >= Number.MAX_SAFE_INTEGER); n++) e += t.charCodeAt(n); return e } var y = null,
                    g = {};
                p(); var _ = function(o) { if (o = o || {}, o.seed && o.seed === parseInt(o.seed, 10)) y = o.seed;
                    else if ("string" == typeof o.seed) y = d(o.seed);
                    else { if (void 0 !== o.seed && null !== o.seed) throw new TypeError("The seed value must be an integer or string");
                        y = null } var a, i, s; if (null !== o.count && void 0 !== o.count) { var u = o.count,
                            c = []; for (o.count = null; u > c.length;) y && o.seed && (o.seed += 1), c.push(_(o)); return o.count = u, c } return a = t(o), i = e(a, o), s = n(a, i, o), r([a, i, s], o) }; return _ }) }, {}] }, {}, [1])(1) });