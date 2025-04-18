var at = Object.defineProperty;
var ft = (e, t) => {
  for (var n in t) at(e, n, { get: t[n], enumerable: !0 });
};
var se = {};
ft(se, {
  arrow: () => Nt,
  autoPlacement: () => kt,
  autoUpdate: () => It,
  computePosition: () => Vt,
  detectOverflow: () => oe,
  flip: () => Bt,
  getOverflowAncestors: () => re,
  hide: () => Ht,
  inline: () => Wt,
  limitShift: () => jt,
  offset: () => Ye,
  platform: () => ct,
  shift: () => Ft,
  size: () => $t,
});
var Te = ["top", "right", "bottom", "left"],
  Me = ["start", "end"],
  Ee = Te.reduce((e, t) => e.concat(t, t + "-" + Me[0], t + "-" + Me[1]), []),
  j = Math.min,
  M = Math.max,
  ge = Math.round,
  pe = Math.floor,
  J = (e) => ({ x: e, y: e }),
  ut = { left: "right", right: "left", bottom: "top", top: "bottom" },
  mt = { start: "end", end: "start" };
function ye(e, t, n) {
  return M(e, j(t, n));
}
function Y(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function H(e) {
  return e.split("-")[0];
}
function X(e) {
  return e.split("-")[1];
}
function xe(e) {
  return e === "x" ? "y" : "x";
}
function be(e) {
  return e === "y" ? "height" : "width";
}
function ie(e) {
  return ["top", "bottom"].includes(H(e)) ? "y" : "x";
}
function Re(e) {
  return xe(ie(e));
}
function Le(e, t, n) {
  n === void 0 && (n = !1);
  let i = X(e),
    o = Re(e),
    r = be(o),
    s = o === "x"
      ? i === (n ? "end" : "start") ? "right" : "left"
      : i === "start"
      ? "bottom"
      : "top";
  return t.reference[r] > t.floating[r] && (s = he(s)), [s, he(s)];
}
function De(e) {
  let t = he(e);
  return [de(e), t, de(t)];
}
function de(e) {
  return e.replace(/start|end/g, (t) => mt[t]);
}
function dt(e, t, n) {
  let i = ["left", "right"],
    o = ["right", "left"],
    r = ["top", "bottom"],
    s = ["bottom", "top"];
  switch (e) {
    case "top":
    case "bottom":
      return n ? t ? o : i : t ? i : o;
    case "left":
    case "right":
      return t ? r : s;
    default:
      return [];
  }
}
function Ie(e, t, n, i) {
  let o = X(e), r = dt(H(e), n === "start", i);
  return o && (r = r.map((s) => s + "-" + o), t && (r = r.concat(r.map(de)))),
    r;
}
function he(e) {
  return e.replace(/left|right|bottom|top/g, (t) => ut[t]);
}
function ht(e) {
  return { top: 0, right: 0, bottom: 0, left: 0, ...e };
}
function Ae(e) {
  return typeof e != "number"
    ? ht(e)
    : { top: e, right: e, bottom: e, left: e };
}
function Q(e) {
  return {
    ...e,
    top: e.y,
    left: e.x,
    right: e.x + e.width,
    bottom: e.y + e.height,
  };
}
function ke(e, t, n) {
  let { reference: i, floating: o } = e,
    r = ie(t),
    s = Re(t),
    a = be(s),
    l = H(t),
    u = r === "y",
    h = i.x + i.width / 2 - o.width / 2,
    m = i.y + i.height / 2 - o.height / 2,
    g = i[a] / 2 - o[a] / 2,
    d;
  switch (l) {
    case "top":
      d = { x: h, y: i.y - o.height };
      break;
    case "bottom":
      d = { x: h, y: i.y + i.height };
      break;
    case "right":
      d = { x: i.x + i.width, y: m };
      break;
    case "left":
      d = { x: i.x - o.width, y: m };
      break;
    default:
      d = { x: i.x, y: i.y };
  }
  switch (X(t)) {
    case "start":
      d[s] -= g * (n && u ? -1 : 1);
      break;
    case "end":
      d[s] += g * (n && u ? -1 : 1);
      break;
  }
  return d;
}
var $e = async (e, t, n) => {
  let {
      placement: i = "bottom",
      strategy: o = "absolute",
      middleware: r = [],
      platform: s,
    } = n,
    a = r.filter(Boolean),
    l = await (s.isRTL == null ? void 0 : s.isRTL(t)),
    u = await s.getElementRects({ reference: e, floating: t, strategy: o }),
    { x: h, y: m } = ke(u, i, l),
    g = i,
    d = {},
    w = 0;
  for (let p = 0; p < a.length; p++) {
    let { name: c, fn: f } = a[p],
      { x: v, y: x, data: b, reset: R } = await f({
        x: h,
        y: m,
        initialPlacement: i,
        placement: g,
        strategy: o,
        middlewareData: d,
        rects: u,
        platform: s,
        elements: { reference: e, floating: t },
      });
    h = v ?? h,
      m = x ?? m,
      d = { ...d, [c]: { ...d[c], ...b } },
      R && w <= 50 && (w++,
        typeof R == "object" &&
        (R.placement && (g = R.placement),
          R.rects && (u = R.rects === !0
            ? await s.getElementRects({
              reference: e,
              floating: t,
              strategy: o,
            })
            : R.rects),
          { x: h, y: m } = ke(u, g, l)),
        p = -1);
  }
  return { x: h, y: m, placement: g, strategy: o, middlewareData: d };
};
async function oe(e, t) {
  var n;
  t === void 0 && (t = {});
  let { x: i, y: o, platform: r, rects: s, elements: a, strategy: l } = e,
    {
      boundary: u = "clippingAncestors",
      rootBoundary: h = "viewport",
      elementContext: m = "floating",
      altBoundary: g = !1,
      padding: d = 0,
    } = Y(t, e),
    w = Ae(d),
    c = a[g ? m === "floating" ? "reference" : "floating" : m],
    f = Q(
      await r.getClippingRect({
        element:
          (n = await (r.isElement == null ? void 0 : r.isElement(c))) == null ||
            n
            ? c
            : c.contextElement ||
              await (r.getDocumentElement == null
                ? void 0
                : r.getDocumentElement(a.floating)),
        boundary: u,
        rootBoundary: h,
        strategy: l,
      }),
    ),
    v = m === "floating" ? { ...s.floating, x: i, y: o } : s.reference,
    x =
      await (r.getOffsetParent == null
        ? void 0
        : r.getOffsetParent(a.floating)),
    b = await (r.isElement == null ? void 0 : r.isElement(x))
      ? await (r.getScale == null ? void 0 : r.getScale(x)) || { x: 1, y: 1 }
      : { x: 1, y: 1 },
    R = Q(
      r.convertOffsetParentRelativeRectToViewportRelativeRect
        ? await r.convertOffsetParentRelativeRectToViewportRelativeRect({
          elements: a,
          rect: v,
          offsetParent: x,
          strategy: l,
        })
        : v,
    );
  return {
    top: (f.top - R.top + w.top) / b.y,
    bottom: (R.bottom - f.bottom + w.bottom) / b.y,
    left: (f.left - R.left + w.left) / b.x,
    right: (R.right - f.right + w.right) / b.x,
  };
}
var He = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    let {
        x: n,
        y: i,
        placement: o,
        rects: r,
        platform: s,
        elements: a,
        middlewareData: l,
      } = t,
      { element: u, padding: h = 0 } = Y(e, t) || {};
    if (u == null) return {};
    let m = Ae(h),
      g = { x: n, y: i },
      d = Re(o),
      w = be(d),
      p = await s.getDimensions(u),
      c = d === "y",
      f = c ? "top" : "left",
      v = c ? "bottom" : "right",
      x = c ? "clientHeight" : "clientWidth",
      b = r.reference[w] + r.reference[d] - g[d] - r.floating[w],
      R = g[d] - r.reference[d],
      y = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(u)),
      P = y ? y[x] : 0;
    (!P || !await (s.isElement == null ? void 0 : s.isElement(y))) &&
      (P = a.floating[x] || r.floating[w]);
    let I = b / 2 - R / 2,
      B = P / 2 - p[w] / 2 - 1,
      C = j(m[f], B),
      S = j(m[v], B),
      E = C,
      D = P - p[w] - S,
      T = P / 2 - p[w] / 2 + I,
      k = ye(E, T, D),
      F = !l.arrow && X(o) != null && T !== k &&
        r.reference[w] / 2 - (T < E ? C : S) - p[w] / 2 < 0,
      W = F ? T < E ? T - E : T - D : 0;
    return {
      [d]: g[d] + W,
      data: { [d]: k, centerOffset: T - k - W, ...F && { alignmentOffset: W } },
      reset: F,
    };
  },
});
function gt(e, t, n) {
  return (e
    ? [...n.filter((o) => X(o) === e), ...n.filter((o) => X(o) !== e)]
    : n.filter((o) => H(o) === o)).filter((o) =>
      e ? X(o) === e || (t ? de(o) !== o : !1) : !0
    );
}
var Ne = function (e) {
    return e === void 0 && (e = {}), {
      name: "autoPlacement",
      options: e,
      async fn(t) {
        var n, i, o;
        let {
            rects: r,
            middlewareData: s,
            placement: a,
            platform: l,
            elements: u,
          } = t,
          {
            crossAxis: h = !1,
            alignment: m,
            allowedPlacements: g = Ee,
            autoAlignment: d = !0,
            ...w
          } = Y(e, t),
          p = m !== void 0 || g === Ee ? gt(m || null, d, g) : g,
          c = await oe(t, w),
          f = ((n = s.autoPlacement) == null ? void 0 : n.index) || 0,
          v = p[f];
        if (v == null) return {};
        let x = Le(
          v,
          r,
          await (l.isRTL == null ? void 0 : l.isRTL(u.floating)),
        );
        if (a !== v) return { reset: { placement: p[0] } };
        let b = [c[H(v)], c[x[0]], c[x[1]]],
          R = [
            ...((i = s.autoPlacement) == null ? void 0 : i.overflows) || [],
            { placement: v, overflows: b },
          ],
          y = p[f + 1];
        if (y) {
          return {
            data: { index: f + 1, overflows: R },
            reset: { placement: y },
          };
        }
        let P = R.map((C) => {
            let S = X(C.placement);
            return [
              C.placement,
              S && h
                ? C.overflows.slice(0, 2).reduce((E, D) => E + D, 0)
                : C.overflows[0],
              C.overflows,
            ];
          }).sort((C, S) => C[1] - S[1]),
          B = ((o = P.filter((C) =>
              C[2].slice(0, X(C[0]) ? 2 : 3).every((S) =>
                S <= 0
              )
            )[0]) == null
            ? void 0
            : o[0]) || P[0][0];
        return B !== a
          ? { data: { index: f + 1, overflows: R }, reset: { placement: B } }
          : {};
      },
    };
  },
  We = function (e) {
    return e === void 0 && (e = {}), {
      name: "flip",
      options: e,
      async fn(t) {
        var n, i;
        let {
            placement: o,
            middlewareData: r,
            rects: s,
            initialPlacement: a,
            platform: l,
            elements: u,
          } = t,
          {
            mainAxis: h = !0,
            crossAxis: m = !0,
            fallbackPlacements: g,
            fallbackStrategy: d = "bestFit",
            fallbackAxisSideDirection: w = "none",
            flipAlignment: p = !0,
            ...c
          } = Y(e, t);
        if ((n = r.arrow) != null && n.alignmentOffset) return {};
        let f = H(o),
          v = H(a) === a,
          x = await (l.isRTL == null ? void 0 : l.isRTL(u.floating)),
          b = g || (v || !p ? [he(a)] : De(a));
        !g && w !== "none" && b.push(...Ie(a, p, w, x));
        let R = [a, ...b],
          y = await oe(t, c),
          P = [],
          I = ((i = r.flip) == null ? void 0 : i.overflows) || [];
        if (h && P.push(y[f]), m) {
          let E = Le(o, s, x);
          P.push(y[E[0]], y[E[1]]);
        }
        if (
          I = [...I, { placement: o, overflows: P }], !P.every((E) => E <= 0)
        ) {
          var B, C;
          let E = (((B = r.flip) == null ? void 0 : B.index) || 0) + 1,
            D = R[E];
          if (D) {
            return {
              data: { index: E, overflows: I },
              reset: { placement: D },
            };
          }
          let T = (C = I.filter((k) =>
              k.overflows[0] <= 0
            ).sort((k, F) =>
              k.overflows[1] - F.overflows[1]
            )[0]) == null
            ? void 0
            : C.placement;
          if (!T) {
            switch (d) {
              case "bestFit": {
                var S;
                let k = (S = I.map((F) => [
                    F.placement,
                    F.overflows.filter((W) => W > 0).reduce(
                      (W, me) => W + me,
                      0,
                    ),
                  ]
                  ).sort((F, W) => F[1] - W[1])[0]) == null
                  ? void 0
                  : S[0];
                k && (T = k);
                break;
              }
              case "initialPlacement":
                T = a;
                break;
            }
          }
          if (o !== T) return { reset: { placement: T } };
        }
        return {};
      },
    };
  };
function Fe(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width,
  };
}
function Be(e) {
  return Te.some((t) => e[t] >= 0);
}
var je = function (e) {
  return e === void 0 && (e = {}), {
    name: "hide",
    options: e,
    async fn(t) {
      let { rects: n } = t,
        { strategy: i = "referenceHidden", ...o } = Y(e, t);
      switch (i) {
        case "referenceHidden": {
          let r = await oe(t, { ...o, elementContext: "reference" }),
            s = Fe(r, n.reference);
          return {
            data: { referenceHiddenOffsets: s, referenceHidden: Be(s) },
          };
        }
        case "escaped": {
          let r = await oe(t, { ...o, altBoundary: !0 }),
            s = Fe(r, n.floating);
          return { data: { escapedOffsets: s, escaped: Be(s) } };
        }
        default:
          return {};
      }
    },
  };
};
function Ve(e) {
  let t = j(...e.map((r) => r.left)),
    n = j(...e.map((r) => r.top)),
    i = M(...e.map((r) => r.right)),
    o = M(...e.map((r) => r.bottom));
  return { x: t, y: n, width: i - t, height: o - n };
}
function pt(e) {
  let t = e.slice().sort((o, r) => o.y - r.y), n = [], i = null;
  for (let o = 0; o < t.length; o++) {
    let r = t[o];
    !i || r.y - i.y > i.height / 2 ? n.push([r]) : n[n.length - 1].push(r),
      i = r;
  }
  return n.map((o) => Q(Ve(o)));
}
var ze = function (e) {
  return e === void 0 && (e = {}), {
    name: "inline",
    options: e,
    async fn(t) {
      let { placement: n, elements: i, rects: o, platform: r, strategy: s } = t,
        { padding: a = 2, x: l, y: u } = Y(e, t),
        h = Array.from(
          await (r.getClientRects == null
            ? void 0
            : r.getClientRects(i.reference)) || [],
        ),
        m = pt(h),
        g = Q(Ve(h)),
        d = Ae(a);
      function w() {
        if (
          m.length === 2 && m[0].left > m[1].right && l != null && u != null
        ) {
          return m.find((c) =>
            l > c.left - d.left && l < c.right + d.right &&
            u > c.top - d.top && u < c.bottom + d.bottom
          ) || g;
        }
        if (m.length >= 2) {
          if (ie(n) === "y") {
            let C = m[0],
              S = m[m.length - 1],
              E = H(n) === "top",
              D = C.top,
              T = S.bottom,
              k = E ? C.left : S.left,
              F = E ? C.right : S.right,
              W = F - k,
              me = T - D;
            return {
              top: D,
              bottom: T,
              left: k,
              right: F,
              width: W,
              height: me,
              x: k,
              y: D,
            };
          }
          let c = H(n) === "left",
            f = M(...m.map((C) => C.right)),
            v = j(...m.map((C) => C.left)),
            x = m.filter((C) => c ? C.left === v : C.right === f),
            b = x[0].top,
            R = x[x.length - 1].bottom,
            y = v,
            P = f,
            I = P - y,
            B = R - b;
          return {
            top: b,
            bottom: R,
            left: y,
            right: P,
            width: I,
            height: B,
            x: y,
            y: b,
          };
        }
        return g;
      }
      let p = await r.getElementRects({
        reference: { getBoundingClientRect: w },
        floating: i.floating,
        strategy: s,
      });
      return o.reference.x !== p.reference.x ||
          o.reference.y !== p.reference.y ||
          o.reference.width !== p.reference.width ||
          o.reference.height !== p.reference.height
        ? { reset: { rects: p } }
        : {};
    },
  };
};
async function wt(e, t) {
  let { placement: n, platform: i, elements: o } = e,
    r = await (i.isRTL == null ? void 0 : i.isRTL(o.floating)),
    s = H(n),
    a = X(n),
    l = ie(n) === "y",
    u = ["left", "top"].includes(s) ? -1 : 1,
    h = r && l ? -1 : 1,
    m = Y(t, e),
    { mainAxis: g, crossAxis: d, alignmentAxis: w } = typeof m == "number"
      ? { mainAxis: m, crossAxis: 0, alignmentAxis: null }
      : { mainAxis: 0, crossAxis: 0, alignmentAxis: null, ...m };
  return a && typeof w == "number" && (d = a === "end" ? w * -1 : w),
    l ? { x: d * h, y: g * u } : { x: g * u, y: d * h };
}
var Ye = function (e) {
    return e === void 0 && (e = 0), {
      name: "offset",
      options: e,
      async fn(t) {
        var n, i;
        let { x: o, y: r, placement: s, middlewareData: a } = t,
          l = await wt(t, e);
        return s === ((n = a.offset) == null ? void 0 : n.placement) &&
            (i = a.arrow) != null && i.alignmentOffset
          ? {}
          : { x: o + l.x, y: r + l.y, data: { ...l, placement: s } };
      },
    };
  },
  Xe = function (e) {
    return e === void 0 && (e = {}), {
      name: "shift",
      options: e,
      async fn(t) {
        let { x: n, y: i, placement: o } = t,
          {
            mainAxis: r = !0,
            crossAxis: s = !1,
            limiter: a = {
              fn: (c) => {
                let { x: f, y: v } = c;
                return { x: f, y: v };
              },
            },
            ...l
          } = Y(e, t),
          u = { x: n, y: i },
          h = await oe(t, l),
          m = ie(H(o)),
          g = xe(m),
          d = u[g],
          w = u[m];
        if (r) {
          let c = g === "y" ? "top" : "left",
            f = g === "y" ? "bottom" : "right",
            v = d + h[c],
            x = d - h[f];
          d = ye(v, d, x);
        }
        if (s) {
          let c = m === "y" ? "top" : "left",
            f = m === "y" ? "bottom" : "right",
            v = w + h[c],
            x = w - h[f];
          w = ye(v, w, x);
        }
        let p = a.fn({ ...t, [g]: d, [m]: w });
        return { ...p, data: { x: p.x - n, y: p.y - i } };
      },
    };
  },
  _e = function (e) {
    return e === void 0 && (e = {}), {
      options: e,
      fn(t) {
        let { x: n, y: i, placement: o, rects: r, middlewareData: s } = t,
          { offset: a = 0, mainAxis: l = !0, crossAxis: u = !0 } = Y(e, t),
          h = { x: n, y: i },
          m = ie(o),
          g = xe(m),
          d = h[g],
          w = h[m],
          p = Y(a, t),
          c = typeof p == "number"
            ? { mainAxis: p, crossAxis: 0 }
            : { mainAxis: 0, crossAxis: 0, ...p };
        if (l) {
          let x = g === "y" ? "height" : "width",
            b = r.reference[g] - r.floating[x] + c.mainAxis,
            R = r.reference[g] + r.reference[x] - c.mainAxis;
          d < b ? d = b : d > R && (d = R);
        }
        if (u) {
          var f, v;
          let x = g === "y" ? "width" : "height",
            b = ["top", "left"].includes(H(o)),
            R = r.reference[m] - r.floating[x] +
              (b && ((f = s.offset) == null ? void 0 : f[m]) || 0) +
              (b ? 0 : c.crossAxis),
            y = r.reference[m] + r.reference[x] +
              (b ? 0 : ((v = s.offset) == null ? void 0 : v[m]) || 0) -
              (b ? c.crossAxis : 0);
          w < R ? w = R : w > y && (w = y);
        }
        return { [g]: d, [m]: w };
      },
    };
  },
  Ue = function (e) {
    return e === void 0 && (e = {}), {
      name: "size",
      options: e,
      async fn(t) {
        let { placement: n, rects: i, platform: o, elements: r } = t,
          { apply: s = () => {}, ...a } = Y(e, t),
          l = await oe(t, a),
          u = H(n),
          h = X(n),
          m = ie(n) === "y",
          { width: g, height: d } = i.floating,
          w,
          p;
        u === "top" || u === "bottom"
          ? (w = u,
            p = h === (await (o.isRTL == null ? void 0 : o.isRTL(r.floating))
                ? "start"
                : "end")
              ? "left"
              : "right")
          : (p = u, w = h === "end" ? "top" : "bottom");
        let c = d - l[w],
          f = g - l[p],
          v = !t.middlewareData.shift,
          x = c,
          b = f;
        if (m) {
          let y = g - l.left - l.right;
          b = h || v ? j(f, y) : y;
        } else {
          let y = d - l.top - l.bottom;
          x = h || v ? j(c, y) : y;
        }
        if (v && !h) {
          let y = M(l.left, 0),
            P = M(l.right, 0),
            I = M(l.top, 0),
            B = M(l.bottom, 0);
          m
            ? b = g - 2 * (y !== 0 || P !== 0 ? y + P : M(l.left, l.right))
            : x = d - 2 * (I !== 0 || B !== 0 ? I + B : M(l.top, l.bottom));
        }
        await s({ ...t, availableWidth: b, availableHeight: x });
        let R = await o.getDimensions(r.floating);
        return g !== R.width || d !== R.height ? { reset: { rects: !0 } } : {};
      },
    };
  };
function Z(e) {
  return Ke(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function N(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null
    ? void 0
    : t.defaultView) || window;
}
function q(e) {
  var t;
  return (t = (Ke(e) ? e.ownerDocument : e.document) || window.document) == null
    ? void 0
    : t.documentElement;
}
function Ke(e) {
  return e instanceof Node || e instanceof N(e).Node;
}
function K(e) {
  return e instanceof Element || e instanceof N(e).Element;
}
function U(e) {
  return e instanceof HTMLElement || e instanceof N(e).HTMLElement;
}
function qe(e) {
  return typeof ShadowRoot > "u"
    ? !1
    : e instanceof ShadowRoot || e instanceof N(e).ShadowRoot;
}
function ae(e) {
  let { overflow: t, overflowX: n, overflowY: i, display: o } = V(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + i + n) &&
    !["inline", "contents"].includes(o);
}
function Ge(e) {
  return ["table", "td", "th"].includes(Z(e));
}
function Oe(e) {
  let t = Ce(), n = V(e);
  return n.transform !== "none" || n.perspective !== "none" ||
    (n.containerType ? n.containerType !== "normal" : !1) ||
    !t && (n.backdropFilter ? n.backdropFilter !== "none" : !1) ||
    !t && (n.filter ? n.filter !== "none" : !1) ||
    ["transform", "perspective", "filter"].some((i) =>
      (n.willChange || "").includes(i)
    ) ||
    ["paint", "layout", "strict", "content"].some((i) =>
      (n.contain || "").includes(i)
    );
}
function Je(e) {
  let t = ce(e);
  for (; U(t) && !we(t);) {
    if (Oe(t)) return t;
    t = ce(t);
  }
  return null;
}
function Ce() {
  return typeof CSS > "u" || !CSS.supports
    ? !1
    : CSS.supports("-webkit-backdrop-filter", "none");
}
function we(e) {
  return ["html", "body", "#document"].includes(Z(e));
}
function V(e) {
  return N(e).getComputedStyle(e);
}
function ve(e) {
  return K(e)
    ? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
    : { scrollLeft: e.pageXOffset, scrollTop: e.pageYOffset };
}
function ce(e) {
  if (Z(e) === "html") return e;
  let t = e.assignedSlot || e.parentNode || qe(e) && e.host || q(e);
  return qe(t) ? t.host : t;
}
function Qe(e) {
  let t = ce(e);
  return we(t)
    ? e.ownerDocument ? e.ownerDocument.body : e.body
    : U(t) && ae(t)
    ? t
    : Qe(t);
}
function re(e, t, n) {
  var i;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  let o = Qe(e),
    r = o === ((i = e.ownerDocument) == null ? void 0 : i.body),
    s = N(o);
  return r
    ? t.concat(
      s,
      s.visualViewport || [],
      ae(o) ? o : [],
      s.frameElement && n ? re(s.frameElement) : [],
    )
    : t.concat(o, re(o, [], n));
}
function tt(e) {
  let t = V(e),
    n = parseFloat(t.width) || 0,
    i = parseFloat(t.height) || 0,
    o = U(e),
    r = o ? e.offsetWidth : n,
    s = o ? e.offsetHeight : i,
    a = ge(n) !== r || ge(i) !== s;
  return a && (n = r, i = s), { width: n, height: i, $: a };
}
function Se(e) {
  return K(e) ? e : e.contextElement;
}
function fe(e) {
  let t = Se(e);
  if (!U(t)) return J(1);
  let n = t.getBoundingClientRect(),
    { width: i, height: o, $: r } = tt(t),
    s = (r ? ge(n.width) : n.width) / i,
    a = (r ? ge(n.height) : n.height) / o;
  return (!s || !Number.isFinite(s)) && (s = 1),
    (!a || !Number.isFinite(a)) && (a = 1),
    { x: s, y: a };
}
var vt = J(0);
function nt(e) {
  let t = N(e);
  return !Ce() || !t.visualViewport
    ? vt
    : { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop };
}
function yt(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== N(e) ? !1 : t;
}
function le(e, t, n, i) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  let o = e.getBoundingClientRect(), r = Se(e), s = J(1);
  t && (i ? K(i) && (s = fe(i)) : s = fe(e));
  let a = yt(r, n, i) ? nt(r) : J(0),
    l = (o.left + a.x) / s.x,
    u = (o.top + a.y) / s.y,
    h = o.width / s.x,
    m = o.height / s.y;
  if (r) {
    let g = N(r), d = i && K(i) ? N(i) : i, w = g, p = w.frameElement;
    for (; p && i && d !== w;) {
      let c = fe(p),
        f = p.getBoundingClientRect(),
        v = V(p),
        x = f.left + (p.clientLeft + parseFloat(v.paddingLeft)) * c.x,
        b = f.top + (p.clientTop + parseFloat(v.paddingTop)) * c.y;
      l *= c.x,
        u *= c.y,
        h *= c.x,
        m *= c.y,
        l += x,
        u += b,
        w = N(p),
        p = w.frameElement;
    }
  }
  return Q({ width: h, height: m, x: l, y: u });
}
var xt = [":popover-open", ":modal"];
function it(e) {
  return xt.some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
function bt(e) {
  let { elements: t, rect: n, offsetParent: i, strategy: o } = e,
    r = o === "fixed",
    s = q(i),
    a = t ? it(t.floating) : !1;
  if (i === s || a && r) return n;
  let l = { scrollLeft: 0, scrollTop: 0 }, u = J(1), h = J(0), m = U(i);
  if ((m || !m && !r) && ((Z(i) !== "body" || ae(s)) && (l = ve(i)), U(i))) {
    let g = le(i);
    u = fe(i), h.x = g.x + i.clientLeft, h.y = g.y + i.clientTop;
  }
  return {
    width: n.width * u.x,
    height: n.height * u.y,
    x: n.x * u.x - l.scrollLeft * u.x + h.x,
    y: n.y * u.y - l.scrollTop * u.y + h.y,
  };
}
function Rt(e) {
  return Array.from(e.getClientRects());
}
function ot(e) {
  return le(q(e)).left + ve(e).scrollLeft;
}
function At(e) {
  let t = q(e),
    n = ve(e),
    i = e.ownerDocument.body,
    o = M(t.scrollWidth, t.clientWidth, i.scrollWidth, i.clientWidth),
    r = M(t.scrollHeight, t.clientHeight, i.scrollHeight, i.clientHeight),
    s = -n.scrollLeft + ot(e),
    a = -n.scrollTop;
  return V(i).direction === "rtl" && (s += M(t.clientWidth, i.clientWidth) - o),
    { width: o, height: r, x: s, y: a };
}
function Ot(e, t) {
  let n = N(e),
    i = q(e),
    o = n.visualViewport,
    r = i.clientWidth,
    s = i.clientHeight,
    a = 0,
    l = 0;
  if (o) {
    r = o.width, s = o.height;
    let u = Ce();
    (!u || u && t === "fixed") && (a = o.offsetLeft, l = o.offsetTop);
  }
  return { width: r, height: s, x: a, y: l };
}
function Ct(e, t) {
  let n = le(e, !0, t === "fixed"),
    i = n.top + e.clientTop,
    o = n.left + e.clientLeft,
    r = U(e) ? fe(e) : J(1),
    s = e.clientWidth * r.x,
    a = e.clientHeight * r.y,
    l = o * r.x,
    u = i * r.y;
  return { width: s, height: a, x: l, y: u };
}
function Ze(e, t, n) {
  let i;
  if (t === "viewport") i = Ot(e, n);
  else if (t === "document") i = At(q(e));
  else if (K(t)) i = Ct(t, n);
  else {
    let o = nt(e);
    i = { ...t, x: t.x - o.x, y: t.y - o.y };
  }
  return Q(i);
}
function rt(e, t) {
  let n = ce(e);
  return n === t || !K(n) || we(n) ? !1 : V(n).position === "fixed" || rt(n, t);
}
function Pt(e, t) {
  let n = t.get(e);
  if (n) return n;
  let i = re(e, [], !1).filter((a) => K(a) && Z(a) !== "body"),
    o = null,
    r = V(e).position === "fixed",
    s = r ? ce(e) : e;
  for (; K(s) && !we(s);) {
    let a = V(s), l = Oe(s);
    !l && a.position === "fixed" && (o = null),
      (r ? !l && !o : !l && a.position === "static" && !!o &&
            ["absolute", "fixed"].includes(o.position) ||
          ae(s) && !l && rt(e, s))
        ? i = i.filter((h) => h !== s)
        : o = a,
      s = ce(s);
  }
  return t.set(e, i), i;
}
function Tt(e) {
  let { element: t, boundary: n, rootBoundary: i, strategy: o } = e,
    s = [...n === "clippingAncestors" ? Pt(t, this._c) : [].concat(n), i],
    a = s[0],
    l = s.reduce((u, h) => {
      let m = Ze(t, h, o);
      return u.top = M(m.top, u.top),
        u.right = j(m.right, u.right),
        u.bottom = j(m.bottom, u.bottom),
        u.left = M(m.left, u.left),
        u;
    }, Ze(t, a, o));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top,
  };
}
function Et(e) {
  let { width: t, height: n } = tt(e);
  return { width: t, height: n };
}
function Lt(e, t, n) {
  let i = U(t),
    o = q(t),
    r = n === "fixed",
    s = le(e, !0, r, t),
    a = { scrollLeft: 0, scrollTop: 0 },
    l = J(0);
  if (i || !i && !r) {
    if ((Z(t) !== "body" || ae(o)) && (a = ve(t)), i) {
      let m = le(t, !0, r, t);
      l.x = m.x + t.clientLeft, l.y = m.y + t.clientTop;
    } else o && (l.x = ot(o));
  }
  let u = s.left + a.scrollLeft - l.x, h = s.top + a.scrollTop - l.y;
  return { x: u, y: h, width: s.width, height: s.height };
}
function et(e, t) {
  return !U(e) || V(e).position === "fixed" ? null : t ? t(e) : e.offsetParent;
}
function st(e, t) {
  let n = N(e);
  if (!U(e) || it(e)) return n;
  let i = et(e, t);
  for (; i && Ge(i) && V(i).position === "static";) i = et(i, t);
  return i &&
      (Z(i) === "html" ||
        Z(i) === "body" && V(i).position === "static" && !Oe(i))
    ? n
    : i || Je(e) || n;
}
var St = async function (e) {
  let t = this.getOffsetParent || st, n = this.getDimensions;
  return {
    reference: Lt(e.reference, await t(e.floating), e.strategy),
    floating: { x: 0, y: 0, ...await n(e.floating) },
  };
};
function Mt(e) {
  return V(e).direction === "rtl";
}
var ct = {
  convertOffsetParentRelativeRectToViewportRelativeRect: bt,
  getDocumentElement: q,
  getClippingRect: Tt,
  getOffsetParent: st,
  getElementRects: St,
  getClientRects: Rt,
  getDimensions: Et,
  getScale: fe,
  isElement: K,
  isRTL: Mt,
};
function Dt(e, t) {
  let n = null, i, o = q(e);
  function r() {
    var a;
    clearTimeout(i), (a = n) == null || a.disconnect(), n = null;
  }
  function s(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), r();
    let { left: u, top: h, width: m, height: g } = e.getBoundingClientRect();
    if (a || t(), !m || !g) return;
    let d = pe(h),
      w = pe(o.clientWidth - (u + m)),
      p = pe(o.clientHeight - (h + g)),
      c = pe(u),
      v = {
        rootMargin: -d + "px " + -w + "px " + -p + "px " + -c + "px",
        threshold: M(0, j(1, l)) || 1,
      },
      x = !0;
    function b(R) {
      let y = R[0].intersectionRatio;
      if (y !== l) {
        if (!x) return s();
        y ? s(!1, y) : i = setTimeout(() => {
          s(!1, 1e-7);
        }, 100);
      }
      x = !1;
    }
    try {
      n = new IntersectionObserver(b, { ...v, root: o.ownerDocument });
    } catch {
      n = new IntersectionObserver(b, v);
    }
    n.observe(e);
  }
  return s(!0), r;
}
function It(e, t, n, i) {
  i === void 0 && (i = {});
  let {
      ancestorScroll: o = !0,
      ancestorResize: r = !0,
      elementResize: s = typeof ResizeObserver == "function",
      layoutShift: a = typeof IntersectionObserver == "function",
      animationFrame: l = !1,
    } = i,
    u = Se(e),
    h = o || r ? [...u ? re(u) : [], ...re(t)] : [];
  h.forEach((f) => {
    o && f.addEventListener("scroll", n, { passive: !0 }),
      r && f.addEventListener("resize", n);
  });
  let m = u && a ? Dt(u, n) : null, g = -1, d = null;
  s && (d = new ResizeObserver((f) => {
    let [v] = f;
    v && v.target === u && d &&
    (d.unobserve(t),
      cancelAnimationFrame(g),
      g = requestAnimationFrame(() => {
        var x;
        (x = d) == null || x.observe(t);
      })), n();
  }),
    u && !l && d.observe(u),
    d.observe(t));
  let w, p = l ? le(e) : null;
  l && c();
  function c() {
    let f = le(e);
    p &&
    (f.x !== p.x || f.y !== p.y || f.width !== p.width ||
      f.height !== p.height) &&
    n(),
      p = f,
      w = requestAnimationFrame(c);
  }
  return n(), () => {
    var f;
    h.forEach((v) => {
      o && v.removeEventListener("scroll", n),
        r && v.removeEventListener("resize", n);
    }),
      m?.(),
      (f = d) == null || f.disconnect(),
      d = null,
      l && cancelAnimationFrame(w);
  };
}
var kt = Ne,
  Ft = Xe,
  Bt = We,
  $t = Ue,
  Ht = je,
  Nt = He,
  Wt = ze,
  jt = _e,
  Vt = (e, t, n) => {
    let i = new Map(), o = { platform: ct, ...n }, r = { ...o.platform, _c: i };
    return $e(e, t, { ...o, platform: r });
  };
function ee(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function ue(e, t) {
  return t in e && typeof e[t] == "string";
}
function _(e, t) {
  return t in e && typeof e[t] == "number";
}
(() => {
  function n(c) {
    return ee(c) && Object.hasOwn(c, "anchorOver") ? i(c.anchorOver) : !1;
  }
  function i(c) {
    if (
      !ee(c) || !ue(c, "anchorId") || !Object.hasOwn(c, "clientRect") ||
      !a(c.clientRect)
    ) return !1;
    if (Object.hasOwn(c, "clientRects") && Array.isArray(c.clientRects)) {
      for (let f of c.clientRects) {
        if (!a(f)) return !1;
      }
    } else return !1;
    return !(!ue(c, "url") || !ue(c, "containerClasses"));
  }
  function o(c) {
    return ee(c) && Object.hasOwn(c, "anchorLeave")
      ? ue(c.anchorLeave, "anchorId")
      : !1;
  }
  function r(c) {
    if (!ee(c)) return !1;
    if (Object.hasOwn(c, "mouseMove")) {
      let f = c.mouseMove;
      return !(!ee(f) || !_(f, "clientX") || !_(f, "clientY"));
    } else return !1;
  }
  function s(c) {
    if (!ee(c)) return !1;
    if (Object.hasOwn(c, "previewDimensions")) {
      let f = c.previewDimensions;
      return !(!ee(f) || !_(f, "height") || !ue(f, "frameCount"));
    } else return !1;
  }
  function a(c) {
    return !(!ee(c) || !_(c, "x") || !_(c, "y") || !_(c, "top") ||
      !_(c, "left") || !_(c, "bottom") || !_(c, "right") || !_(c, "width") ||
      !_(c, "height"));
  }
  function l(c, f, v) {
    return {
      x: c.x + f,
      y: c.y + v,
      top: c.top + v,
      left: c.left + f,
      bottom: c.bottom + v,
      right: c.right + f,
      width: c.width,
      height: c.height,
    };
  }
  let u = window.location.search,
    m = new URLSearchParams(u).get("frameCount") ?? "0",
    g = m !== "0",
    d = 0;
  function w() {
    return d += 1, d - 1;
  }
  function p(c) {
    g ? window.parent.postMessage(c, "*") : postMessage(c, "*");
  }
  if (
    document.body.parentElement.addEventListener("mouseover", (c) => {
      if (!(c.target instanceof HTMLElement)) return;
      let f = c.target;
      for (; !f.dataset.previewAnchor && f.parentElement;) f = f.parentElement;
      let v = f.dataset.previewAnchor;
      if (v === void 0) return;
      f.anchorCount || (f.anchorCount = `${w()}`);
      let x = f.anchorCount,
        b = `${m}:${x}`,
        R = {
          anchorOver: {
            anchorId: b,
            url: v,
            clientRect: f.getBoundingClientRect(),
            clientRects: [],
            containerClasses: f.dataset.previewClass
              ? f.dataset.previewClass
              : "",
          },
        },
        y = f.getClientRects();
      for (let P = 0; P < y.length; P++) R.anchorOver.clientRects.push(y[P]);
      p(R),
        f.addEventListener("mouseleave", () => {
          p({ anchorLeave: { anchorId: b } });
        }, { once: !0 });
    }), g
  ) {
    document.body.parentElement.addEventListener("mousemove", (c) => {
      window.parent.postMessage({
        mouseMove: { clientX: c.clientX, clientY: c.clientY },
      }, "*");
    }),
      window.parent.postMessage({
        previewDimensions: {
          height: document.body.scrollHeight,
          frameCount: m,
        },
      }, "*");
  } else {
    let R = function (A) {
        if (c) {
          let O = c.getBoundingClientRect();
          x = O.left + A.mouseMove.clientX, b = O.top + A.mouseMove.clientY;
        }
        E();
      },
      P = function (A) {
        y.push(A);
      },
      I = function () {
        let A = y.pop();
        if (A) {
          A.fadingTimer !== null && clearTimeout(A.fadingTimer);
          let O = A.container;
          O.classList.add("previewFadeout"),
            O.style.pointerEvents = "none",
            setTimeout(() => {
              O.remove();
            }, 200);
        }
      },
      B = function (A) {
        for (let O = 0; O < y.length; O++) if (y[O].anchor === A) return O;
        return null;
      },
      C = function (A) {
        for (; y.length > A;) I();
      },
      S = function (A) {
        for (let O = 0; O <= A; O++) {
          let L = y[O];
          L.active = !0, L.fadingTimer !== null && clearTimeout(L.fadingTimer);
        }
      },
      E = function () {
        for (let A = y.length - 1; A >= 0; A--) {
          let O = y[A];
          if (v !== null && O.anchor === v || f !== null && O.anchor === f) {
            break;
          }
          O.active &&
            (O.active = !1, O.fadingTimer = setTimeout(() => C(A), 200));
        }
      },
      k = function (A) {
        if (D) {
          if (D.anchorId === A.anchorId) return;
          T !== null && clearTimeout(T);
        }
        D = A,
          T = setTimeout(() => {
            for (D = null, T = null; y.length > 0 && !y[y.length - 1].active;) {
              I();
            }
            let O = me(A.containerClasses);
            document.body.appendChild(O);
            let L = W(),
              z = {
                active: !0,
                fadingTimer: null,
                anchor: A.anchorId,
                container: O,
                clientRect: A.clientRect,
                clientRects: A.clientRects,
                frameCount: `${L}`,
              };
            P(z), lt(A, y.length - 1, O, L), O.style.visibility = "hidden";
          }, 200);
      },
      W = function () {
        return F += 1, F - 1;
      },
      me = function (A) {
        let O = document.createElement("div");
        return O.className = `previewContainer${A ? ` ${A}` : ""}`, O;
      },
      lt = function (A, O, L, z) {
        let $ = A.url.replaceAll("\xA7", "="), te = $.split("?");
        if (te.length === 1) $ = `${$}?frameCount=${z}`;
        else {
          let ne = new URLSearchParams(te[1]);
          ne.delete("frameCount"),
            ne.append("frameCount", `${z}`),
            $ = `${te[0]}?${ne.toString()}`;
        }
        let G = document.createElement("iframe");
        G.setAttribute("sandbox", "allow-scripts"),
          G.src = $,
          L.appendChild(G),
          L.addEventListener("mouseleave", () => {
            c = null, f = null;
          }),
          L.addEventListener("mouseenter", () => {
            S(O), c = G, f = A.anchorId;
          });
      },
      c = null,
      f = null,
      v = null,
      x = 0,
      b = 0;
    addEventListener("mousemove", (A) => {
      x = A.clientX, b = A.clientY, E();
    });
    let y = [], D = null, T, F = 1;
    onmessage = (A) => {
      let O = A.data;
      if (r(O)) R(O);
      else if (o(O)) {
        v = null, D = null, T !== null && (clearTimeout(T), T = null);
      } else if (n(O)) {
        let L = O.anchorOver, z = L.anchorId;
        v = z;
        let $ = B(z);
        if ($ === null) {
          if (c !== null) {
            let te = c.getBoundingClientRect(), G = te.x, ne = te.y;
            L.clientRect = l(L.clientRect, G, ne),
              L.clientRects = L.clientRects.map((Pe) => l(Pe, G, ne));
          }
          k(L);
        } else S($);
      } else if (s(O)) {
        let L = O.previewDimensions;
        for (let z = y.length - 1; z >= 0; z--) {
          if (y[z].frameCount === L.frameCount) {
            let $ = y[z], te = $.container.childNodes[0];
            te.style.height = `${L.height}px`;
            let G = {
              getBoundingClientRect: () => $.clientRect,
              getClientRects: () => $.clientRects,
            };
            se.computePosition(G, $.container, {
              middleware: [
                se.offset(6),
                se.flip(),
                se.inline({ x, y: b }),
                se.shift({ padding: 5 }),
              ],
            }).then(({ x: ne, y: Pe }) => {
              Object.assign($.container.style, {
                left: `${ne}px`,
                top: `${Pe}px`,
              });
            }), $.container.style.visibility = "visible";
            break;
          }
        }
      }
    };
  }
})();
