var CodeMirror = (function () {
    function u(aM, aJ) {
        var b1 = {}
          , bj = u.defaults;
        for (var az in bj) {
            if (bj.hasOwnProperty(az)) {
                b1[az] = (aJ && aJ.hasOwnProperty(az) ? aJ : bj)[az]
            }
        }
        var aD = document.createElement("div");
        aD.className = "CodeMirror" + (b1.lineWrapping ? " CodeMirror-wrap" : "");
        aD.innerHTML = '<div style="overflow: hidden; position: relative; width: 3px; height: 0px;"><textarea style="position: absolute; padding: 0; width: 1px; height: 1em" wrap="off" autocorrect="off" autocapitalize="off"></textarea></div><div class="CodeMirror-scroll" tabindex="-1"><div style="position: relative"><div style="position: relative"><div class="CodeMirror-gutter"><div class="CodeMirror-gutter-text"></div></div><div class="CodeMirror-lines"><div style="position: relative; z-index: 0"><div style="position: absolute; width: 100%; height: 0; overflow: hidden; visibility: hidden;"></div><pre class="CodeMirror-cursor">&#160;</pre><div style="position: relative; z-index: -1"></div><div></div></div></div></div></div></div>';
        if (aM.appendChild) {
            aM.appendChild(aD)
        } else {
            aM(aD)
        }
        var bX = aD.firstChild
          , bm = bX.firstChild
          , bk = aD.lastChild
          , bM = bk.firstChild
          , cg = bM.firstChild
          , aH = cg.firstChild
          , aY = aH.firstChild
          , bu = aH.nextSibling.firstChild
          , av = bu.firstChild
          , bc = av.nextSibling
          , bg = bc.nextSibling
          , aq = bg.nextSibling;
        cD();
        if (s) {
            bm.style.width = "0px"
        }
        if (!f) {
            bu.draggable = true
        }
        bu.style.outline = "none";
        if (b1.tabindex != null) {
            bm.tabIndex = b1.tabindex
        }
        if (b1.autofocus) {
            bz()
        }
        if (!b1.gutter && !b1.lineNumbers) {
            aH.style.display = "none"
        }
        if (m) {
            bX.style.height = "1px",
            bX.style.position = "absolute"
        }
        try {
            ct("x")
        } catch (b8) {
            if (b8.message.match(/runtime/i)) {
                b8 = new Error("A CodeMirror inside a P-style element does not work in Internet Explorer. (innerHTML bug)")
            }
            throw b8
        }
        var b7 = new z(), aw = new z(), cP;
        var cb, cy = new i([new ah([new e("")])]), ch, cj;
        bT();
        var cW = {
            from: {
                line: 0,
                ch: 0
            },
            to: {
                line: 0,
                ch: 0
            },
            inverted: false
        };
        var ci, bq, aZ, bF = 0, bb, cn = false, cs = false;
        var cp, b6, aB, cN, aP, bf, aS, cA;
        var bd = 0
          , cQ = 0
          , bL = 0
          , bN = 0;
        var b4;
        var bD = "", aF;
        var ap = {};
        ar(function () {
            aW(b1.value || "");
            cp = false
        })();
        var a8 = new k();
        r(bk, "mousedown", ar(ck));
        r(bk, "dblclick", ar(bW));
        r(bu, "selectstart", T);
        if (!N) {
            r(bk, "contextmenu", a1)
        }
        r(bk, "scroll", function () {
            bF = bk.scrollTop;
            cd([]);
            if (b1.fixedGutter) {
                aH.style.left = bk.scrollLeft + "px"
            }
            if (b1.onScroll) {
                b1.onScroll(b9)
            }
        });
        r(window, "resize", function () {
            cd(true)
        });
        r(bm, "keyup", ar(cl));
        r(bm, "input", aQ);
        r(bm, "keydown", ar(cc));
        r(bm, "keypress", ar(bn));
        r(bm, "focus", cU);
        r(bm, "blur", aE);
        if (b1.dragDrop) {
            r(bu, "dragstart", aI);
            function bC(cZ) {
                if (b1.onDragEvent && b1.onDragEvent(b9, O(cZ))) {
                    return
                }
                w(cZ)
            }
            r(bk, "dragenter", bC);
            r(bk, "dragover", bC);
            r(bk, "drop", ar(an))
        }
        r(bk, "paste", function () {
            bz();
            aQ()
        });
        r(bm, "paste", aQ);
        r(bm, "cut", ar(function () {
            if (!b1.readOnly) {
                bs("")
            }
        }));
        if (m) {
            r(bM, "mouseup", function () {
                if (document.activeElement == bm) {
                    bm.blur()
                }
                bz()
            })
        }
        var cw;
        try {
            cw = (document.activeElement == bm)
        } catch (b8) { }
        if (cw || b1.autofocus) {
            setTimeout(cU, 20)
        } else {
            aE()
        }
        function br(cZ) {
            return cZ >= 0 && cZ < cy.size
        }
        var b9 = aD.CodeMirror = {
            getValue: b2,
            setValue: ar(aW),
            getSelection: b3,
            replaceSelection: ar(bs),
            focus: function () {
                window.focus();
                bz();
                cU();
                aQ()
            },
            setOption: function (c0, c1) {
                var cZ = b1[c0];
                b1[c0] = c1;
                if (c0 == "mode" || c0 == "indentUnit") {
                    bT()
                } else {
                    if (c0 == "readOnly" && c1 == "nocursor") {
                        aE();
                        bm.blur()
                    } else {
                        if (c0 == "readOnly" && !c1) {
                            cC(true)
                        } else {
                            if (c0 == "theme") {
                                cD()
                            } else {
                                if (c0 == "lineWrapping" && cZ != c1) {
                                    ar(cG)()
                                } else {
                                    if (c0 == "tabSize") {
                                        cd(true)
                                    }
                                }
                            }
                        }
                    }
                }
                if (c0 == "lineNumbers" || c0 == "gutter" || c0 == "firstLineNumber" || c0 == "theme") {
                    be();
                    cd(true)
                }
            },
            getOption: function (cZ) {
                return b1[cZ]
            },
            undo: ar(cT),
            redo: ar(cJ),
            indentLine: ar(function (c0, cZ) {
                if (typeof cZ != "string") {
                    if (cZ == null) {
                        cZ = b1.smartIndent ? "smart" : "prev"
                    } else {
                        cZ = cZ ? "add" : "subtract"
                    }
                }
                if (br(c0)) {
                    by(c0, cZ)
                }
            }),
            indentSelection: ar(cB),
            historySize: function () {
                return {
                    undo: a8.done.length,
                    redo: a8.undone.length
                }
            },
            clearHistory: function () {
                a8 = new k()
            },
            matchBrackets: ar(function () {
                ce(true)
            }),
            getTokenAt: ar(function (cZ) {
                cZ = aT(cZ);
                return cF(cZ.line).getTokenAt(cb, cu(cZ.line), cZ.ch)
            }),
            getStateAfter: function (cZ) {
                cZ = bZ(cZ == null ? cy.size - 1 : cZ);
                return cu(cZ + 1)
            },
            cursorCoords: function (c0, cZ) {
                if (c0 == null) {
                    c0 = cW.inverted
                }
                return this.charCoords(c0 ? cW.from : cW.to, cZ)
            },
            charCoords: function (c0, cZ) {
                c0 = aT(c0);
                if (cZ == "local") {
                    return cR(c0, false)
                }
                if (cZ == "div") {
                    return cR(c0, true)
                }
                return ao(c0)
            },
            coordsChar: function (cZ) {
                var c0 = ak(bu);
                return bH(cZ.x - c0.left, cZ.y - c0.top)
            },
            markText: ar(bE),
            setBookmark: aU,
            findMarksAt: bo,
            setMarker: ar(bV),
            clearMarker: ar(au),
            setLineClass: ar(bl),
            hideLine: ar(function (cZ) {
                return cK(cZ, true)
            }),
            showLine: ar(function (cZ) {
                return cK(cZ, false)
            }),
            onDeleteLine: function (cZ, c0) {
                if (typeof cZ == "number") {
                    if (!br(cZ)) {
                        return null
                    }
                    cZ = cF(cZ)
                }
                (cZ.handlers || (cZ.handlers = [])).push(c0);
                return cZ
            },
            lineInfo: aV,
            addWidget: function (c3, c1, c5, c2, c7) {
                c3 = cR(aT(c3));
                var c4 = c3.yBot
                  , c0 = c3.x;
                c1.style.position = "absolute";
                bM.appendChild(c1);
                if (c2 == "over") {
                    c4 = c3.y
                } else {
                    if (c2 == "near") {
                        var cZ = Math.max(bk.offsetHeight, cy.height * bP())
                          , c6 = Math.max(bM.clientWidth, bu.clientWidth) - a5();
                        if (c3.yBot + c1.offsetHeight > cZ && c3.y > c1.offsetHeight) {
                            c4 = c3.y - c1.offsetHeight
                        }
                        if (c0 + c1.offsetWidth > c6) {
                            c0 = c6 - c1.offsetWidth
                        }
                    }
                }
                c1.style.top = (c4 + cr()) + "px";
                c1.style.left = c1.style.right = "";
                if (c7 == "right") {
                    c0 = bM.clientWidth - c1.offsetWidth;
                    c1.style.right = "0px"
                } else {
                    if (c7 == "left") {
                        c0 = 0
                    } else {
                        if (c7 == "middle") {
                            c0 = (bM.clientWidth - c1.offsetWidth) / 2
                        }
                    }
                    c1.style.left = (c0 + a5()) + "px"
                }
                if (c5) {
                    aA(c0, c4, c0 + c1.offsetWidth, c4 + c1.offsetHeight)
                }
            },
            lineCount: function () {
                return cy.size
            },
            clipPos: aT,
            getCursor: function (cZ) {
                if (cZ == null) {
                    cZ = cW.inverted
                }
                return aa(cZ ? cW.from : cW.to)
            },
            somethingSelected: function () {
                return !ad(cW.from, cW.to)
            },
            setCursor: ar(function (cZ, c1, c0) {
                if (c1 == null && typeof cZ.line == "number") {
                    a6(cZ.line, cZ.ch, c0)
                } else {
                    a6(cZ, c1, c0)
                }
            }),
            setSelection: ar(function (c1, c0, cZ) {
                (cZ ? bx : bw)(aT(c1), aT(c0 || c1))
            }),
            getLine: function (cZ) {
                if (br(cZ)) {
                    return cF(cZ).text
                }
            },
            getLineHandle: function (cZ) {
                if (br(cZ)) {
                    return cF(cZ)
                }
            },
            setLine: ar(function (cZ, c0) {
                if (br(cZ)) {
                    bQ(c0, {
                        line: cZ,
                        ch: 0
                    }, {
                        line: cZ,
                        ch: cF(cZ).text.length
                    })
                }
            }),
            removeLine: ar(function (cZ) {
                if (br(cZ)) {
                    bQ("", {
                        line: cZ,
                        ch: 0
                    }, aT({
                        line: cZ + 1,
                        ch: 0
                    }))
                }
            }),
            replaceRange: ar(bQ),
            getRange: function (c0, cZ) {
                return cO(aT(c0), aT(cZ))
            },
            triggerOnKeyDown: ar(cc),
            execCommand: function (cZ) {
                return L[cZ](b9)
            },
            moveH: ar(cE),
            deleteH: ar(cm),
            moveV: ar(cx),
            toggleOverwrite: function () {
                if (cn) {
                    cn = false;
                    bc.className = bc.className.replace(" CodeMirror-overwrite", "")
                } else {
                    cn = true;
                    bc.className += " CodeMirror-overwrite"
                }
            },
            posFromIndex: function (c0) {
                var c1 = 0, cZ;
                cy.iter(0, cy.size, function (c2) {
                    var c3 = c2.text.length + 1;
                    if (c3 > c0) {
                        cZ = c0;
                        return true
                    }
                    c0 -= c3;
                    ++c1
                });
                return aT({
                    line: c1,
                    ch: cZ
                })
            },
            indexFromPos: function (c0) {
                if (c0.line < 0 || c0.ch < 0) {
                    return 0
                }
                var cZ = c0.ch;
                cy.iter(0, c0.line, function (c1) {
                    cZ += c1.text.length + 1
                });
                return cZ
            },
            scrollTo: function (cZ, c0) {
                if (cZ != null) {
                    bk.scrollLeft = cZ
                }
                if (c0 != null) {
                    bk.scrollTop = c0
                }
                cd([])
            },
            operation: function (cZ) {
                return ar(cZ)()
            },
            compoundChange: function (cZ) {
                return bO(cZ)
            },
            refresh: function () {
                cd(true);
                if (bk.scrollHeight > bF) {
                    bk.scrollTop = bF
                }
            },
            getInputField: function () {
                return bm
            },
            getWrapperElement: function () {
                return aD
            },
            getScrollerElement: function () {
                return bk
            },
            getGutterElement: function () {
                return aH
            }
        };
        function cF(cZ) {
            return C(cy, cZ)
        }
        function a3(c0, cZ) {
            aS = true;
            var c1 = cZ - c0.height;
            for (var c2 = c0; c2; c2 = c2.parent) {
                c2.height += c1
            }
        }
        function aW(cZ) {
            var c0 = {
                line: 0,
                ch: 0
            };
            aO(c0, {
                line: cy.size - 1,
                ch: cF(cy.size - 1).text.length
            }, A(cZ), c0, c0);
            cp = true
        }
        function b2() {
            var cZ = [];
            cy.iter(0, cy.size, function (c0) {
                cZ.push(c0.text)
            });
            return cZ.join("\n")
        }
        function ck(c8) {
            a4(y(c8, "shiftKey"));
            for (var c3 = j(c8) ; c3 != aD; c3 = c3.parentNode) {
                if (c3.parentNode == bM && c3 != cg) {
                    return
                }
            }
            for (var c3 = j(c8) ; c3 != aD; c3 = c3.parentNode) {
                if (c3.parentNode == aY) {
                    if (b1.onGutterClick) {
                        b1.onGutterClick(b9, q(aY.childNodes, c3) + cQ, c8)
                    }
                    return T(c8)
                }
            }
            var cZ = a2(c8);
            switch (x(c8)) {
                case 3:
                    if (N && !M) {
                        a1(c8)
                    }
                    return;
                case 2:
                    if (cZ) {
                        a6(cZ.line, cZ.ch, true)
                    }
                    return
            }
            if (!cZ) {
                if (j(c8) == bk) {
                    T(c8)
                }
                return
            }
            if (!cj) {
                cU()
            }
            var c0 = +new Date;
            if (aZ && aZ.time > c0 - 400 && ad(aZ.pos, cZ)) {
                T(c8);
                setTimeout(bz, 20);
                return aK(cZ.line)
            } else {
                if (bq && bq.time > c0 - 400 && ad(bq.pos, cZ)) {
                    aZ = {
                        time: c0,
                        pos: cZ
                    };
                    T(c8);
                    return bI(cZ)
                } else {
                    bq = {
                        time: c0,
                        pos: cZ
                    }
                }
            }
            var da = cZ, c1;
            if (b1.dragDrop && F && !b1.readOnly && !ad(cW.from, cW.to) && !Z(cZ, cW.from) && !Z(cW.to, cZ)) {
                if (f) {
                    bu.draggable = true
                }
                function c4(db) {
                    if (f) {
                        bu.draggable = false
                    }
                    bb = false;
                    c7();
                    c2();
                    if (Math.abs(c8.clientX - db.clientX) + Math.abs(c8.clientY - db.clientY) < 10) {
                        T(db);
                        a6(cZ.line, cZ.ch, true);
                        bz()
                    }
                }
                var c7 = r(document, "mouseup", ar(c4), true);
                var c2 = r(bk, "drop", ar(c4), true);
                bb = true;
                if (bu.dragDrop) {
                    bu.dragDrop()
                }
                return
            }
            T(c8);
            a6(cZ.line, cZ.ch, true);
            function c9(db) {
                var dd = a2(db, true);
                if (dd && !ad(dd, da)) {
                    if (!cj) {
                        cU()
                    }
                    da = dd;
                    bx(cZ, dd);
                    cp = false;
                    var dc = bA();
                    if (dd.line >= dc.to || dd.line < dc.from) {
                        c1 = setTimeout(ar(function () {
                            c9(db)
                        }), 150)
                    }
                }
            }
            function c6(db) {
                clearTimeout(c1);
                var dc = a2(db);
                if (dc) {
                    bx(cZ, dc)
                }
                T(db);
                bz();
                cp = true;
                c5();
                c7()
            }
            var c5 = r(document, "mousemove", ar(function (db) {
                clearTimeout(c1);
                T(db);
                if (!I && !x(db)) {
                    c6(db)
                } else {
                    c9(db)
                }
            }), true);
            var c7 = r(document, "mouseup", ar(c6), true)
        }
        function bW(cZ) {
            for (var c1 = j(cZ) ; c1 != aD; c1 = c1.parentNode) {
                if (c1.parentNode == aY) {
                    return T(cZ)
                }
            }
            var c0 = a2(cZ);
            if (!c0) {
                return
            }
            aZ = {
                time: +new Date,
                pos: c0
            };
            T(cZ);
            bI(c0)
        }
        function an(c3) {
            if (b1.onDragEvent && b1.onDragEvent(b9, O(c3))) {
                return
            }
            c3.preventDefault();
            var c6 = a2(c3, true)
              , c0 = c3.dataTransfer.files;
            if (!c6 || b1.readOnly) {
                return
            }
            if (c0 && c0.length && window.FileReader && window.File) {
                function c2(c9, c8) {
                    var c7 = new FileReader;
                    c7.onload = function () {
                        c4[c8] = c7.result;
                        if (++c1 == c5) {
                            c6 = aT(c6);
                            ar(function () {
                                var da = bQ(c4.join(""), c6, c6);
                                bx(c6, da)
                            })()
                        }
                    }
                    ;
                    c7.readAsText(c9)
                }
                var c5 = c0.length
                  , c4 = Array(c5)
                  , c1 = 0;
                for (var cZ = 0; cZ < c5; ++cZ) {
                    c2(c0[cZ], cZ)
                }
            } else {
                try {
                    var c4 = c3.dataTransfer.getData("Text");
                    if (c4) {
                        bO(function () {
                            var c8 = cW.from
                              , c7 = cW.to;
                            bx(c6, c6);
                            if (bb) {
                                bQ("", c8, c7)
                            }
                            bs(c4);
                            bz()
                        })
                    }
                } catch (c3) { }
            }
        }
        function aI(c1) {
            var cZ = b3();
            c1.dataTransfer.setData("Text", cZ);
            if (N || af) {
                var c0 = document.createElement("img");
                c0.scr = "data:image/gif;base64,R0lGODdhAgACAIAAAAAAAP///ywAAAAAAgACAAACAoRRADs=";
                c1.dataTransfer.setDragImage(c0, 0, 0)
            }
        }
        function bi(c1, cZ) {
            if (typeof c1 == "string") {
                c1 = L[c1];
                if (!c1) {
                    return false
                }
            }
            var c0 = ci;
            try {
                if (b1.readOnly) {
                    cs = true
                }
                if (cZ) {
                    ci = null
                }
                c1(b9)
            } catch (c2) {
                if (c2 != ab) {
                    throw c2
                }
                return false
            } finally {
                ci = c0;
                cs = false
            }
            return true
        }
        function cL(c5) {
            var cZ = c(b1.keyMap)
              , c2 = cZ.auto;
            clearTimeout(bB);
            if (c2 && !Q(c5)) {
                bB = setTimeout(function () {
                    if (c(b1.keyMap) == cZ) {
                        b1.keyMap = (c2.call ? c2.call(null, b9) : c2)
                    }
                }, 50)
            }
            var c0 = R[y(c5, "keyCode")]
              , c4 = false;
            if (c0 == null || c5.altGraphKey) {
                return false
            }
            if (y(c5, "altKey")) {
                c0 = "Alt-" + c0
            }
            if (y(c5, "ctrlKey")) {
                c0 = "Ctrl-" + c0
            }
            if (y(c5, "metaKey")) {
                c0 = "Cmd-" + c0
            }
            var c3 = false;
            function c1() {
                c3 = true
            }
            if (y(c5, "shiftKey")) {
                c4 = l("Shift-" + c0, b1.extraKeys, b1.keyMap, function (c6) {
                    return bi(c6, true)
                }, c1) || l(c0, b1.extraKeys, b1.keyMap, function (c6) {
                    if (typeof c6 == "string" && /^go[A-Z]/.test(c6)) {
                        return bi(c6)
                    }
                }, c1)
            } else {
                c4 = l(c0, b1.extraKeys, b1.keyMap, bi, c1)
            }
            if (c3) {
                c4 = false
            }
            if (c4) {
                T(c5);
                if (I) {
                    c5.oldKeyCode = c5.keyCode;
                    c5.keyCode = 0
                }
            }
            return c4
        }
        function bY(c1, cZ) {
            var c0 = l("'" + cZ + "'", b1.extraKeys, b1.keyMap, function (c2) {
                return bi(c2, true)
            });
            if (c0) {
                T(c1)
            }
            return c0
        }
        var cI = null, bB;
        function cc(c1) {
            if (!cj) {
                cU()
            }
            if (I && c1.keyCode == 27) {
                c1.returnValue = false
            }
            if (bt) {
                if (bK()) {
                    bt = false
                }
            }
            if (b1.onKeyEvent && b1.onKeyEvent(b9, O(c1))) {
                return
            }
            var cZ = y(c1, "keyCode");
            a4(cZ == 16 || y(c1, "shiftKey"));
            var c0 = cL(c1);
            if (window.opera) {
                cI = c0 ? cZ : null;
                if (!c0 && cZ == 88 && y(c1, M ? "metaKey" : "ctrlKey")) {
                    bs("")
                }
            }
        }
        function bn(c2) {
            if (bt) {
                bK()
            }
            if (b1.onKeyEvent && b1.onKeyEvent(b9, O(c2))) {
                return
            }
            var c1 = y(c2, "keyCode")
              , cZ = y(c2, "charCode");
            if (window.opera && c1 == cI) {
                cI = null;
                T(c2);
                return
            }
            if (((window.opera && !c2.which) || m) && cL(c2)) {
                return
            }
            var c0 = String.fromCharCode(cZ == null ? c1 : cZ);
            if (b1.electricChars && cb.electricChars && b1.smartIndent && !b1.readOnly) {
                if (cb.electricChars.indexOf(c0) > -1) {
                    setTimeout(ar(function () {
                        by(cW.to.line, "smart")
                    }), 75)
                }
            }
            if (bY(c2, c0)) {
                return
            }
            aQ()
        }
        function cl(cZ) {
            if (b1.onKeyEvent && b1.onKeyEvent(b9, O(cZ))) {
                return
            }
            if (y(cZ, "keyCode") == 16) {
                ci = null
            }
        }
        function cU() {
            if (b1.readOnly == "nocursor") {
                return
            }
            if (!cj) {
                if (b1.onFocus) {
                    b1.onFocus(b9)
                }
                cj = true;
                if (aD.className.search(/\bCodeMirror-focused\b/) == -1) {
                    aD.className += " CodeMirror-focused"
                }
                if (!bf) {
                    cC(true)
                }
            }
            am();
            cM()
        }
        function aE() {
            if (cj) {
                if (b1.onBlur) {
                    b1.onBlur(b9)
                }
                cj = false;
                if (b4) {
                    ar(function () {
                        if (b4) {
                            b4();
                            b4 = null
                        }
                    })()
                }
                aD.className = aD.className.replace(" CodeMirror-focused", "")
            }
            clearInterval(cP);
            setTimeout(function () {
                if (!cj) {
                    ci = null
                }
            }, 150)
        }
        function aO(c4, c3, c2, c0, cZ) {
            if (cs) {
                return
            }
            if (a8) {
                var c1 = [];
                cy.iter(c4.line, c3.line + 1, function (c5) {
                    c1.push(c5.text)
                });
                a8.addChange(c4.line, c2.length, c1);
                while (a8.done.length > b1.undoDepth) {
                    a8.done.shift()
                }
            }
            at(c4, c3, c2, c0, cZ)
        }
        function ca(c4, c5) {
            if (!c4.length) {
                return
            }
            var c6 = c4.pop()
              , c0 = [];
            for (var c1 = c6.length - 1; c1 >= 0; c1 -= 1) {
                var c3 = c6[c1];
                var c7 = []
                  , cZ = c3.start + c3.added;
                cy.iter(c3.start, cZ, function (c8) {
                    c7.push(c8.text)
                });
                c0.push({
                    start: c3.start,
                    added: c3.old.length,
                    old: c7
                });
                var c2 = aT({
                    line: c3.start + c3.old.length - 1,
                    ch: W(c7[c7.length - 1], c3.old[c3.old.length - 1])
                });
                at({
                    line: c3.start,
                    ch: 0
                }, {
                    line: cZ - 1,
                    ch: cF(cZ - 1).text.length
                }, c3.old, c2, c2)
            }
            cp = true;
            c5.push(c0)
        }
        function cT() {
            ca(a8.done, a8.undone)
        }
        function cJ() {
            ca(a8.undone, a8.done)
        }
        function at(de, c3, dk, cZ, dl) {
            if (cs) {
                return
            }
            var dj = false
              , c2 = bD.length;
            if (!b1.lineWrapping) {
                cy.iter(de.line, c3.line + 1, function (dm) {
                    if (dm.text.length == c2) {
                        dj = true;
                        return true
                    }
                })
            }
            if (de.line != c3.line || dk.length > 1) {
                aS = true
            }
            var db = c3.line - de.line
              , da = cF(de.line)
              , c0 = cF(c3.line);
            if (de.ch == 0 && c3.ch == 0 && dk[dk.length - 1] == "") {
                var c8 = []
                  , c9 = null;
                if (de.line) {
                    c9 = cF(de.line - 1);
                    c9.fixMarkEnds(c0)
                } else {
                    c0.fixMarkStarts()
                }
                for (var dg = 0, di = dk.length - 1; dg < di; ++dg) {
                    c8.push(e.inheritMarks(dk[dg], c9))
                }
                if (db) {
                    cy.remove(de.line, db, cA)
                }
                if (c8.length) {
                    cy.insert(de.line, c8)
                }
            } else {
                if (da == c0) {
                    if (dk.length == 1) {
                        da.replace(de.ch, c3.ch, dk[0])
                    } else {
                        c0 = da.split(c3.ch, dk[dk.length - 1]);
                        da.replace(de.ch, null, dk[0]);
                        da.fixMarkEnds(c0);
                        var c8 = [];
                        for (var dg = 1, di = dk.length - 1; dg < di; ++dg) {
                            c8.push(e.inheritMarks(dk[dg], da))
                        }
                        c8.push(c0);
                        cy.insert(de.line + 1, c8)
                    }
                } else {
                    if (dk.length == 1) {
                        da.replace(de.ch, null, dk[0]);
                        c0.replace(null, c3.ch, "");
                        da.append(c0);
                        cy.remove(de.line + 1, db, cA)
                    } else {
                        var c8 = [];
                        da.replace(de.ch, null, dk[0]);
                        c0.replace(null, c3.ch, dk[dk.length - 1]);
                        da.fixMarkEnds(c0);
                        for (var dg = 1, di = dk.length - 1; dg < di; ++dg) {
                            c8.push(e.inheritMarks(dk[dg], da))
                        }
                        if (db > 1) {
                            cy.remove(de.line + 1, db - 1, cA)
                        }
                        cy.insert(de.line + 1, c8)
                    }
                }
            }
            if (b1.lineWrapping) {
                var c5 = Math.max(5, bk.clientWidth / bh() - 3);
                cy.iter(de.line, de.line + dk.length, function (dm) {
                    if (dm.hidden) {
                        return
                    }
                    var dn = Math.ceil(dm.text.length / c5) || 1;
                    if (dn != dm.height) {
                        a3(dm, dn)
                    }
                })
            } else {
                cy.iter(de.line, de.line + dk.length, function (dn) {
                    var dm = dn.text;
                    if (dm.length > c2) {
                        bD = dm;
                        c2 = dm.length;
                        aF = null;
                        dj = false
                    }
                });
                if (dj) {
                    c2 = 0;
                    bD = "";
                    aF = null;
                    cy.iter(0, cy.size, function (dn) {
                        var dm = dn.text;
                        if (dm.length > c2) {
                            c2 = dm.length;
                            bD = dm
                        }
                    })
                }
            }
            var c1 = []
              , c7 = dk.length - db - 1;
            for (var dg = 0, dd = ch.length; dg < dd; ++dg) {
                var dh = ch[dg];
                if (dh < de.line) {
                    c1.push(dh)
                } else {
                    if (dh > c3.line) {
                        c1.push(dh + c7)
                    }
                }
            }
            var df = de.line + Math.min(dk.length, 500);
            cH(de.line, df);
            c1.push(df);
            ch = c1;
            bG(100);
            aB.push({
                from: de.line,
                to: c3.line + 1,
                diff: c7
            });
            var c6 = {
                from: de,
                to: c3,
                text: dk
            };
            if (cN) {
                for (var c4 = cN; c4.next; c4 = c4.next) { }
                c4.next = c6
            } else {
                cN = c6
            }
            function dc(dm) {
                return dm <= Math.min(c3.line, c3.line + c7) ? dm : dm + c7
            }
            bw(cZ, dl, dc(cW.from.line), dc(cW.to.line));
            if (bk.clientHeight) {
                bM.style.height = (cy.height * bP() + 2 * cr()) + "px"
            }
        }
        function bQ(c0, c3, c2) {
            c3 = aT(c3);
            if (!c2) {
                c2 = c3
            } else {
                c2 = aT(c2)
            }
            c0 = A(c0);
            function c1(c6) {
                if (Z(c6, c3)) {
                    return c6
                }
                if (!Z(c2, c6)) {
                    return cZ
                }
                var c4 = c6.line + c0.length - (c2.line - c3.line) - 1;
                var c5 = c6.ch;
                if (c6.line == c2.line) {
                    c5 += c0[c0.length - 1].length - (c2.ch - (c2.line == c3.line ? c3.ch : 0))
                }
                return {
                    line: c4,
                    ch: c5
                }
            }
            var cZ;
            aC(c0, c3, c2, function (c4) {
                cZ = c4;
                return {
                    from: c1(cW.from),
                    to: c1(cW.to)
                }
            });
            return cZ
        }
        function bs(cZ, c0) {
            aC(A(cZ), cW.from, cW.to, function (c1) {
                if (c0 == "end") {
                    return {
                        from: c1,
                        to: c1
                    }
                } else {
                    if (c0 == "start") {
                        return {
                            from: cW.from,
                            to: cW.from
                        }
                    } else {
                        return {
                            from: cW.from,
                            to: c1
                        }
                    }
                }
            })
        }
        function aC(c2, c4, c3, cZ) {
            var c1 = c2.length == 1 ? c2[0].length + c4.ch : c2[c2.length - 1].length;
            var c0 = cZ({
                line: c4.line + c2.length - 1,
                ch: c1
            });
            aO(c4, c3, c2, c0.from, c0.to)
        }
        function cO(c3, c2) {
            var c0 = c3.line
              , cZ = c2.line;
            if (c0 == cZ) {
                return cF(c0).text.slice(c3.ch, c2.ch)
            }
            var c1 = [cF(c0).text.slice(c3.ch)];
            cy.iter(c0 + 1, cZ, function (c4) {
                c1.push(c4.text)
            });
            c1.push(cF(cZ).text.slice(0, c2.ch));
            return c1.join("\n")
        }
        function b3() {
            return cO(cW.from, cW.to)
        }
        var bt = false;
        function am() {
            if (bt) {
                return
            }
            b7.set(b1.pollInterval, function () {
                aN();
                bK();
                if (cj) {
                    am()
                }
                ay()
            })
        }
        function aQ() {
            var cZ = false;
            bt = true;
            function c0() {
                aN();
                var c1 = bK();
                if (!c1 && !cZ) {
                    cZ = true;
                    b7.set(60, c0)
                } else {
                    bt = false;
                    am()
                }
                ay()
            }
            b7.set(20, c0)
        }
        var ba = "";
        function bK() {
            if (bf || !cj || ae(bm) || b1.readOnly) {
                return false
            }
            var c0 = bm.value;
            if (c0 == ba) {
                return false
            }
            ci = null;
            var c1 = 0
              , cZ = Math.min(ba.length, c0.length);
            while (c1 < cZ && ba[c1] == c0[c1]) {
                ++c1
            }
            if (c1 < ba.length) {
                cW.from = {
                    line: cW.from.line,
                    ch: cW.from.ch - (ba.length - c1)
                }
            } else {
                if (cn && ad(cW.from, cW.to)) {
                    cW.to = {
                        line: cW.to.line,
                        ch: Math.min(cF(cW.to.line).text.length, cW.to.ch + (c0.length - c1))
                    }
                }
            }
            bs(c0.slice(c1), "end");
            ba = c0;
            return true
        }
        function cC(cZ) {
            if (!ad(cW.from, cW.to)) {
                ba = "";
                bm.value = b3();
                a(bm)
            } else {
                if (cZ) {
                    ba = bm.value = ""
                }
            }
        }
        function bz() {
            if (b1.readOnly != "nocursor") {
                bm.focus()
            }
        }
        function cY() {
            if (!bc.getBoundingClientRect) {
                return
            }
            var cZ = bc.getBoundingClientRect();
            if (I && cZ.top == cZ.bottom) {
                return
            }
            var c0 = window.innerHeight || Math.max(document.body.offsetHeight, document.documentElement.offsetHeight);
            if (cZ.top < 0 || cZ.bottom > c0) {
                bc.scrollIntoView()
            }
        }
        function cf() {
            var c0 = cR(cW.inverted ? cW.from : cW.to);
            var cZ = b1.lineWrapping ? Math.min(c0.x, bu.offsetWidth) : c0.x;
            return aA(cZ, c0.y, cZ, c0.yBot)
        }
        function aA(c1, c7, cZ, c6) {
            var c4 = a5()
              , dc = cr();
            c7 += dc;
            c6 += dc;
            c1 += c4;
            cZ += c4;
            var c9 = bk.clientHeight
              , c2 = bk.scrollTop
              , c0 = false
              , db = true;
            if (c7 < c2) {
                bk.scrollTop = Math.max(0, c7);
                c0 = true
            } else {
                if (c6 > c2 + c9) {
                    bk.scrollTop = c6 - c9;
                    c0 = true
                }
            }
            var c8 = bk.clientWidth
              , da = bk.scrollLeft;
            var c5 = b1.fixedGutter ? aH.clientWidth : 0;
            var c3 = c1 < c5 + c4 + 10;
            if (c1 < da + c5 || c3) {
                if (c3) {
                    c1 = 0
                }
                bk.scrollLeft = Math.max(0, c1 - 10 - c5);
                c0 = true
            } else {
                if (cZ > c8 + da - 3) {
                    bk.scrollLeft = cZ + 10 - c8;
                    c0 = true;
                    if (cZ > bM.clientWidth) {
                        db = false
                    }
                }
            }
            if (c0 && b1.onScroll) {
                b1.onScroll(b9)
            }
            return db
        }
        function bA() {
            var cZ = bP()
              , c2 = bk.scrollTop - cr();
            var c1 = Math.max(0, Math.floor(c2 / cZ));
            var c0 = Math.ceil((c2 + bk.clientHeight) / cZ);
            return {
                from: X(cy, c1),
                to: X(cy, c0)
            }
        }
        function cd(c7, c3) {
            if (!bk.clientWidth) {
                cQ = bL = bd = 0;
                return
            }
            var c2 = bA();
            if (c7 !== true && c7.length == 0 && c2.from > cQ && c2.to < bL) {
                return
            }
            var c8 = Math.max(c2.from - 100, 0)
              , c9 = Math.min(cy.size, c2.to + 100);
            if (cQ < c8 && c8 - cQ < 20) {
                c8 = cQ
            }
            if (bL > c9 && bL - c9 < 20) {
                c9 = Math.min(cy.size, bL)
            }
            var db = c7 === true ? [] : b0([{
                from: cQ,
                to: bL,
                domStart: 0
            }], c7);
            var c6 = 0;
            for (var c4 = 0; c4 < db.length; ++c4) {
                var c5 = db[c4];
                if (c5.from < c8) {
                    c5.domStart += (c8 - c5.from);
                    c5.from = c8
                }
                if (c5.to > c9) {
                    c5.to = c9
                }
                if (c5.from >= c5.to) {
                    db.splice(c4--, 1)
                } else {
                    c6 += c5.to - c5.from
                }
            }
            if (c6 == c9 - c8 && c8 == cQ && c9 == bL) {
                return
            }
            db.sort(function (dd, dc) {
                return dd.domStart - dc.domStart
            });
            var c1 = bP()
              , cZ = aH.style.display;
            aq.style.display = "none";
            aR(c8, c9, db);
            aq.style.display = aH.style.display = "";
            var c0 = c8 != cQ || c9 != bL || bN != bk.clientHeight + c1;
            if (c0) {
                bN = bk.clientHeight + c1
            }
            cQ = c8;
            bL = c9;
            bd = g(cy, c8);
            cg.style.top = (bd * c1) + "px";
            if (bk.clientHeight) {
                bM.style.height = (cy.height * c1 + 2 * cr()) + "px"
            }
            if (aq.childNodes.length != bL - cQ) {
                throw new Error("BAD PATCH! " + JSON.stringify(db) + " size=" + (bL - cQ) + " nodes=" + aq.childNodes.length)
            }
            function da() {
                aF = bk.clientWidth;
                var dd = aq.firstChild
                  , dc = false;
                cy.iter(cQ, bL, function (df) {
                    if (!df.hidden) {
                        var de = Math.round(dd.offsetHeight / c1) || 1;
                        if (df.height != de) {
                            a3(df, de);
                            aS = dc = true
                        }
                    }
                    dd = dd.nextSibling
                });
                if (dc) {
                    bM.style.height = (cy.height * c1 + 2 * cr()) + "px"
                }
                return dc
            }
            if (b1.lineWrapping) {
                da()
            } else {
                if (aF == null) {
                    aF = ct(bD)
                }
                if (aF > bk.clientWidth) {
                    bu.style.width = aF + "px";
                    bM.style.width = "";
                    bM.style.width = bk.scrollWidth + "px"
                } else {
                    bu.style.width = bM.style.width = ""
                }
            }
            aH.style.display = cZ;
            if (c0 || aS) {
                aL() && b1.lineWrapping && da() && aL()
            }
            cV();
            if (!c3 && b1.onUpdate) {
                b1.onUpdate(b9)
            }
            return true
        }
        function b0(c8, c6) {
            for (var c3 = 0, c1 = c6.length || 0; c3 < c1; ++c3) {
                var c5 = c6[c3]
                  , cZ = []
                  , c7 = c5.diff || 0;
                for (var c2 = 0, c0 = c8.length; c2 < c0; ++c2) {
                    var c4 = c8[c2];
                    if (c5.to <= c4.from && c5.diff) {
                        cZ.push({
                            from: c4.from + c7,
                            to: c4.to + c7,
                            domStart: c4.domStart
                        })
                    } else {
                        if (c5.to <= c4.from || c5.from >= c4.to) {
                            cZ.push(c4)
                        } else {
                            if (c5.from > c4.from) {
                                cZ.push({
                                    from: c4.from,
                                    to: c5.from,
                                    domStart: c4.domStart
                                })
                            }
                            if (c5.to < c4.to) {
                                cZ.push({
                                    from: c5.to + c7,
                                    to: c4.to + c7,
                                    domStart: c4.domStart + (c5.to - c4.from)
                                })
                            }
                        }
                    }
                }
                c8 = cZ
            }
            return c8
        }
        function aR(c8, c9, db) {
            if (!db.length) {
                aq.innerHTML = ""
            } else {
                function cZ(dd) {
                    var dc = dd.nextSibling;
                    dd.parentNode.removeChild(dd);
                    return dc
                }
                var c3 = 0, c1 = aq.firstChild, c0;
                for (var c4 = 0; c4 < db.length; ++c4) {
                    var da = db[c4];
                    while (da.domStart > c3) {
                        c1 = cZ(c1);
                        c3++
                    }
                    for (var c2 = 0, c6 = da.to - da.from; c2 < c6; ++c2) {
                        c1 = c1.nextSibling;
                        c3++
                    }
                }
                while (c1) {
                    c1 = cZ(c1)
                }
            }
            var c5 = db.shift()
              , c1 = aq.firstChild
              , c2 = c8;
            var c7 = document.createElement("div");
            cy.iter(c8, c9, function (dc) {
                if (c5 && c5.to == c2) {
                    c5 = db.shift()
                }
                if (!c5 || c5.from > c2) {
                    if (dc.hidden) {
                        var dd = c7.innerHTML = "<pre></pre>"
                    } else {
                        var dd = "<pre" + (dc.className ? ' class="' + dc.className + '"' : "") + ">" + dc.getHTML(a9) + "</pre>";
                        if (dc.bgClassName) {
                            dd = '<div style="position: relative"><pre class="' + dc.bgClassName + '" style="position: absolute; left: 0; right: 0; top: 0; bottom: 0; z-index: -2">&#160;</pre>' + dd + "</div>"
                        }
                    }
                    c7.innerHTML = dd;
                    aq.insertBefore(c7.firstChild, c1)
                } else {
                    c1 = c1.nextSibling
                }
                ++c2
            })
        }
        function aL() {
            if (!b1.gutter && !b1.lineNumbers) {
                return
            }
            var c0 = cg.offsetHeight
              , c8 = bk.clientHeight;
            aH.style.height = (c0 - c8 < 2 ? c8 : c0) + "px";
            var c6 = [], c4 = cQ, c7;
            cy.iter(cQ, Math.max(bL, cQ + 1), function (da) {
                if (da.hidden) {
                    c6.push("<pre></pre>")
                } else {
                    var c9 = da.gutterMarker;
                    var dc = b1.lineNumbers ? c4 + b1.firstLineNumber : null;
                    if (c9 && c9.text) {
                        dc = c9.text.replace("%N%", dc != null ? dc : "")
                    } else {
                        if (dc == null) {
                            dc = "\u00a0"
                        }
                    }
                    c6.push((c9 && c9.style ? '<pre class="' + c9.style + '">' : "<pre>"), dc);
                    for (var db = 1; db < da.height; ++db) {
                        c6.push("<br/>&#160;")
                    }
                    c6.push("</pre>");
                    if (!c9) {
                        c7 = c4
                    }
                }
                ++c4
            });
            aH.style.display = "none";
            aY.innerHTML = c6.join("");
            if (c7 != null) {
                var c2 = aY.childNodes[c7 - cQ];
                var c3 = String(cy.size).length
                  , cZ = H(c2)
                  , c1 = "";
                while (cZ.length + c1.length < c3) {
                    c1 += "\u00a0"
                }
                if (c1) {
                    c2.insertBefore(document.createTextNode(c1), c2.firstChild)
                }
            }
            aH.style.display = "";
            var c5 = Math.abs((parseInt(bu.style.marginLeft) || 0) - aH.offsetWidth) > 2;
            bu.style.marginLeft = aH.offsetWidth + "px";
            aS = false;
            return c5
        }
        function cV() {
            var c2 = ad(cW.from, cW.to);
            var dd = cR(cW.from, true);
            var c8 = c2 ? dd : cR(cW.to, true);
            var c6 = cW.inverted ? dd : c8
              , c0 = bP();
            var cZ = ak(aD)
              , c1 = ak(aq);
            bX.style.top = Math.max(0, Math.min(bk.offsetHeight, c6.y + c1.top - cZ.top)) + "px";
            bX.style.left = Math.max(0, Math.min(bk.offsetWidth, c6.x + c1.left - cZ.left)) + "px";
            if (c2) {
                bc.style.top = c6.y + "px";
                bc.style.left = (b1.lineWrapping ? Math.min(c6.x, bu.offsetWidth) : c6.x) + "px";
                bc.style.display = "";
                bg.style.display = "none"
            } else {
                var db = dd.y == c8.y
                  , c4 = "";
                var c9 = bu.clientWidth || bu.offsetWidth;
                var c5 = bu.clientHeight || bu.offsetHeight;
                function dc(di, dh, dg, de) {
                    var df = E ? "width: " + (!dg ? c9 : c9 - dg - di) + "px" : "right: " + dg + "px";
                    c4 += '<div class="CodeMirror-selected" style="position: absolute; left: ' + di + "px; top: " + dh + "px; " + df + "; height: " + de + 'px"></div>'
                }
                if (cW.from.ch && dd.y >= 0) {
                    var da = db ? c9 - c8.x : 0;
                    dc(dd.x, dd.y, da, c0)
                }
                var c3 = Math.max(0, dd.y + (cW.from.ch ? c0 : 0));
                var c7 = Math.min(c8.y, c5) - c3;
                if (c7 > 0.2 * c0) {
                    dc(0, c3, 0, c7)
                }
                if ((!db || !cW.from.ch) && c8.y < c5 - 0.5 * c0) {
                    dc(0, c8.y, c9 - c8.x, c0)
                }
                bg.innerHTML = c4;
                bc.style.display = "none";
                bg.style.display = ""
            }
        }
        function a4(cZ) {
            if (cZ) {
                ci = ci || (cW.inverted ? cW.to : cW.from)
            } else {
                ci = null
            }
        }
        function bx(c1, c0) {
            var cZ = ci && aT(ci);
            if (cZ) {
                if (Z(cZ, c1)) {
                    c1 = cZ
                } else {
                    if (Z(c0, cZ)) {
                        c0 = cZ
                    }
                }
            }
            bw(c1, c0);
            b6 = true
        }
        function bw(c6, c5, cZ, c4) {
            cv = null;
            if (cZ == null) {
                cZ = cW.from.line;
                c4 = cW.to.line
            }
            if (ad(cW.from, c6) && ad(cW.to, c5)) {
                return
            }
            if (Z(c5, c6)) {
                var c2 = c5;
                c5 = c6;
                c6 = c2
            }
            if (c6.line != cZ) {
                var c3 = bR(c6, cZ, cW.from.ch);
                if (!c3) {
                    cK(c6.line, false)
                } else {
                    c6 = c3
                }
            }
            if (c5.line != c4) {
                c5 = bR(c5, c4, cW.to.ch)
            }
            if (ad(c6, c5)) {
                cW.inverted = false
            } else {
                if (ad(c6, cW.to)) {
                    cW.inverted = false
                } else {
                    if (ad(c5, cW.from)) {
                        cW.inverted = true
                    }
                }
            }
            if (b1.autoClearEmptyLines && ad(cW.from, cW.to)) {
                var c1 = cW.inverted ? c6 : c5;
                if (c1.line != cW.from.line && cW.from.line < cy.size) {
                    var c0 = cF(cW.from.line);
                    if (/^\s+$/.test(c0.text)) {
                        setTimeout(ar(function () {
                            if (c0.parent && /^\s+$/.test(c0.text)) {
                                var c7 = Y(c0);
                                bQ("", {
                                    line: c7,
                                    ch: 0
                                }, {
                                    line: c7,
                                    ch: c0.text.length
                                })
                            }
                        }, 10))
                    }
                }
            }
            cW.from = c6;
            cW.to = c5;
            aP = true
        }
        function bR(c4, c0, c1) {
            function c3(c7) {
                var c9 = c4.line + c7
                  , c6 = c7 == 1 ? cy.size : -1;
                while (c9 != c6) {
                    var c5 = cF(c9);
                    if (!c5.hidden) {
                        var c8 = c4.ch;
                        if (c2 || c8 > c1 || c8 > c5.text.length) {
                            c8 = c5.text.length
                        }
                        return {
                            line: c9,
                            ch: c8
                        }
                    }
                    c9 += c7
                }
            }
            var cZ = cF(c4.line);
            var c2 = c4.ch == cZ.text.length && c4.ch != c1;
            if (!cZ.hidden) {
                return c4
            }
            if (c4.line >= c0) {
                return c3(1) || c3(-1)
            } else {
                return c3(-1) || c3(1)
            }
        }
        function a6(cZ, c1, c0) {
            var c2 = aT({
                line: cZ,
                ch: c1 || 0
            });
            (c0 ? bx : bw)(c2, c2)
        }
        function bZ(cZ) {
            return Math.max(0, Math.min(cZ, cy.size - 1))
        }
        function aT(c1) {
            if (c1.line < 0) {
                return {
                    line: 0,
                    ch: 0
                }
            }
            if (c1.line >= cy.size) {
                return {
                    line: cy.size - 1,
                    ch: cF(cy.size - 1).text.length
                }
            }
            var cZ = c1.ch
              , c0 = cF(c1.line).text.length;
            if (cZ == null || cZ > c0) {
                return {
                    line: c1.line,
                    ch: c0
                }
            } else {
                if (cZ < 0) {
                    return {
                        line: c1.line,
                        ch: 0
                    }
                } else {
                    return c1
                }
            }
        }
        function co(c2, c6) {
            var c3 = cW.inverted ? cW.from : cW.to
              , c7 = c3.line
              , cZ = c3.ch;
            var c5 = cF(c7);
            function c0() {
                for (var c8 = c7 + c2, da = c2 < 0 ? -1 : cy.size; c8 != da; c8 += c2) {
                    var c9 = cF(c8);
                    if (!c9.hidden) {
                        c7 = c8;
                        c5 = c9;
                        return true
                    }
                }
            }
            function c4(c8) {
                if (cZ == (c2 < 0 ? 0 : c5.text.length)) {
                    if (!c8 && c0()) {
                        cZ = c2 < 0 ? c5.text.length : 0
                    } else {
                        return false
                    }
                } else {
                    cZ += c2
                }
                return true
            }
            if (c6 == "char") {
                c4()
            } else {
                if (c6 == "column") {
                    c4(true)
                } else {
                    if (c6 == "word") {
                        var c1 = false;
                        for (; ;) {
                            if (c2 < 0) {
                                if (!c4()) {
                                    break
                                }
                            }
                            if (ag(c5.text.charAt(cZ))) {
                                c1 = true
                            } else {
                                if (c1) {
                                    if (c2 < 0) {
                                        c2 = 1;
                                        c4()
                                    }
                                    break
                                }
                            }
                            if (c2 > 0) {
                                if (!c4()) {
                                    break
                                }
                            }
                        }
                    }
                }
            }
            return {
                line: c7,
                ch: cZ
            }
        }
        function cE(cZ, c0) {
            var c1 = cZ < 0 ? cW.from : cW.to;
            if (ci || ad(cW.from, cW.to)) {
                c1 = co(cZ, c0)
            }
            a6(c1.line, c1.ch, true)
        }
        function cm(cZ, c0) {
            if (!ad(cW.from, cW.to)) {
                bQ("", cW.from, cW.to)
            } else {
                if (cZ < 0) {
                    bQ("", co(cZ, c0), cW.to)
                } else {
                    bQ("", cW.from, co(cZ, c0))
                }
            }
            b6 = true
        }
        var cv = null;
        function cx(cZ, c0) {
            var c2 = 0
              , c3 = cR(cW.inverted ? cW.from : cW.to, true);
            if (cv != null) {
                c3.x = cv
            }
            if (c0 == "page") {
                c2 = Math.min(bk.clientHeight, window.innerHeight || document.documentElement.clientHeight)
            } else {
                if (c0 == "line") {
                    c2 = bP()
                }
            }
            var c1 = bH(c3.x, c3.y + c2 * cZ + 2);
            if (c0 == "page") {
                bk.scrollTop += cR(c1, true).y - c3.y
            }
            a6(c1.line, c1.ch, true);
            cv = c3.x
        }
        function bI(c2) {
            var c0 = cF(c2.line).text;
            var c1 = c2.ch
              , cZ = c2.ch;
            while (c1 > 0 && ag(c0.charAt(c1 - 1))) {
                --c1
            }
            while (cZ < c0.length && ag(c0.charAt(cZ))) {
                ++cZ
            }
            bx({
                line: c2.line,
                ch: c1
            }, {
                line: c2.line,
                ch: cZ
            })
        }
        function aK(cZ) {
            bx({
                line: cZ,
                ch: 0
            }, aT({
                line: cZ + 1,
                ch: 0
            }))
        }
        function cB(c1) {
            if (ad(cW.from, cW.to)) {
                return by(cW.from.line, c1)
            }
            var c0 = cW.to.line - (cW.to.ch ? 0 : 1);
            for (var cZ = cW.from.line; cZ <= c0; ++cZ) {
                by(cZ, c1)
            }
        }
        function by(c1, c8) {
            if (!c8) {
                c8 = "add"
            }
            if (c8 == "smart") {
                if (!cb.indent) {
                    c8 = "prev"
                } else {
                    var cZ = cu(c1)
                }
            }
            var c9 = cF(c1), c3 = c9.indentation(b1.tabSize), c0 = c9.text.match(/^\s*/)[0], c5;
            if (c8 == "prev") {
                if (c1) {
                    c5 = cF(c1 - 1).indentation(b1.tabSize)
                } else {
                    c5 = 0
                }
            } else {
                if (c8 == "smart") {
                    c5 = cb.indent(cZ, c9.text.slice(c0.length), c9.text)
                } else {
                    if (c8 == "add") {
                        c5 = c3 + b1.indentUnit
                    } else {
                        if (c8 == "subtract") {
                            c5 = c3 - b1.indentUnit
                        }
                    }
                }
            }
            c5 = Math.max(0, c5);
            var c7 = c5 - c3;
            if (!c7) {
                if (cW.from.line != c1 && cW.to.line != c1) {
                    return
                }
                var c6 = c0
            } else {
                var c6 = ""
                  , c4 = 0;
                if (b1.indentWithTabs) {
                    for (var c2 = Math.floor(c5 / b1.tabSize) ; c2; --c2) {
                        c4 += b1.tabSize;
                        c6 += "\t"
                    }
                }
                while (c4 < c5) {
                    ++c4;
                    c6 += " "
                }
            }
            bQ(c6, {
                line: c1,
                ch: 0
            }, {
                line: c1,
                ch: c0.length
            })
        }
        function bT() {
            cb = u.getMode(b1, b1.mode);
            cy.iter(0, cy.size, function (cZ) {
                cZ.stateAfter = null
            });
            ch = [0];
            bG()
        }
        function be() {
            var cZ = b1.gutter || b1.lineNumbers;
            aH.style.display = cZ ? "" : "none";
            if (cZ) {
                aS = true
            } else {
                aq.parentNode.style.marginLeft = 0
            }
        }
        function cG(c1, c0) {
            if (b1.lineWrapping) {
                aD.className += " CodeMirror-wrap";
                var cZ = bk.clientWidth / bh() - 3;
                cy.iter(0, cy.size, function (c2) {
                    if (c2.hidden) {
                        return
                    }
                    var c3 = Math.ceil(c2.text.length / cZ) || 1;
                    if (c3 != 1) {
                        a3(c2, c3)
                    }
                });
                bu.style.width = bM.style.width = ""
            } else {
                aD.className = aD.className.replace(" CodeMirror-wrap", "");
                aF = null;
                bD = "";
                cy.iter(0, cy.size, function (c2) {
                    if (c2.height != 1 && !c2.hidden) {
                        a3(c2, 1)
                    }
                    if (c2.text.length > bD.length) {
                        bD = c2.text
                    }
                })
            }
            aB.push({
                from: 0,
                to: cy.size
            })
        }
        function a9(c0) {
            var cZ = b1.tabSize - c0 % b1.tabSize
              , c2 = ap[cZ];
            if (c2) {
                return c2
            }
            for (var c3 = '<span class="cm-tab">', c1 = 0; c1 < cZ; ++c1) {
                c3 += " "
            }
            return (ap[cZ] = {
                html: c3 + "</span>",
                width: cZ
            })
        }
        function cD() {
            bk.className = bk.className.replace(/\s*cm-s-\S+/g, "") + b1.theme.replace(/(^|\s)\s*/g, " cm-s-")
        }
        function cX() {
            this.set = []
        }
        cX.prototype.clear = ar(function () {
            var c4 = Infinity
              , c0 = -Infinity;
            for (var c3 = 0, c6 = this.set.length; c3 < c6; ++c3) {
                var c1 = this.set[c3]
                  , cZ = c1.marked;
                if (!cZ || !c1.parent) {
                    continue
                }
                var c5 = Y(c1);
                c4 = Math.min(c4, c5);
                c0 = Math.max(c0, c5);
                for (var c2 = 0; c2 < cZ.length; ++c2) {
                    if (cZ[c2].marker == this) {
                        cZ.splice(c2--, 1)
                    }
                }
            }
            if (c4 != Infinity) {
                aB.push({
                    from: c4,
                    to: c0 + 1
                })
            }
        });
        cX.prototype.find = function () {
            var c4, c5;
            for (var c1 = 0, c3 = this.set.length; c1 < c3; ++c1) {
                var c7 = this.set[c1]
                  , c2 = c7.marked;
                for (var c0 = 0; c0 < c2.length; ++c0) {
                    var cZ = c2[c0];
                    if (cZ.marker == this) {
                        if (cZ.from != null || cZ.to != null) {
                            var c6 = Y(c7);
                            if (c6 != null) {
                                if (cZ.from != null) {
                                    c4 = {
                                        line: c6,
                                        ch: cZ.from
                                    }
                                }
                                if (cZ.to != null) {
                                    c5 = {
                                        line: c6,
                                        ch: cZ.to
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return {
                from: c4,
                to: c5
            }
        }
        ;
        function bE(c5, c4, c1) {
            c5 = aT(c5);
            c4 = aT(c4);
            var cZ = new cX();
            if (!Z(c5, c4)) {
                return cZ
            }
            function c3(c6, c9, c8, c7) {
                cF(c6).addMark(new K(c9, c8, c7, cZ))
            }
            if (c5.line == c4.line) {
                c3(c5.line, c5.ch, c4.ch, c1)
            } else {
                c3(c5.line, c5.ch, null, c1);
                for (var c0 = c5.line + 1, c2 = c4.line; c0 < c2; ++c0) {
                    c3(c0, null, null, c1)
                }
                c3(c4.line, null, c4.ch, c1)
            }
            aB.push({
                from: c5.line,
                to: c4.line + 1
            });
            return cZ
        }
        function aU(c0) {
            c0 = aT(c0);
            var cZ = new G(c0.ch);
            cF(c0.line).addMark(cZ);
            return cZ
        }
        function bo(c4) {
            c4 = aT(c4);
            var c3 = []
              , c1 = cF(c4.line).marked;
            if (!c1) {
                return c3
            }
            for (var c0 = 0, c2 = c1.length; c0 < c2; ++c0) {
                var cZ = c1[c0];
                if ((cZ.from == null || cZ.from <= c4.ch) && (cZ.to == null || cZ.to >= c4.ch)) {
                    c3.push(cZ.marker || cZ)
                }
            }
            return c3
        }
        function bV(cZ, c1, c0) {
            if (typeof cZ == "number") {
                cZ = cF(bZ(cZ))
            }
            cZ.gutterMarker = {
                text: c1,
                style: c0
            };
            aS = true;
            return cZ
        }
        function au(cZ) {
            if (typeof cZ == "number") {
                cZ = cF(bZ(cZ))
            }
            cZ.gutterMarker = null;
            aS = true
        }
        function aX(c0, c2) {
            var c1 = c0
              , cZ = c0;
            if (typeof c0 == "number") {
                cZ = cF(bZ(c0))
            } else {
                c1 = Y(c0)
            }
            if (c1 == null) {
                return null
            }
            if (c2(cZ, c1)) {
                aB.push({
                    from: c1,
                    to: c1 + 1
                })
            } else {
                return null
            }
            return cZ
        }
        function bl(c0, cZ, c1) {
            return aX(c0, function (c2) {
                if (c2.className != cZ || c2.bgClassName != c1) {
                    c2.className = cZ;
                    c2.bgClassName = c1;
                    return true
                }
            })
        }
        function cK(c0, cZ) {
            return aX(c0, function (c1, c4) {
                if (c1.hidden != cZ) {
                    c1.hidden = cZ;
                    a3(c1, cZ ? 0 : 1);
                    var c3 = cW.from.line
                      , c2 = cW.to.line;
                    if (cZ && (c3 == c4 || c2 == c4)) {
                        var c6 = c3 == c4 ? bR({
                            line: c3,
                            ch: 0
                        }, c3, 0) : cW.from;
                        var c5 = c2 == c4 ? bR({
                            line: c2,
                            ch: 0
                        }, c2, 0) : cW.to;
                        if (!c5) {
                            return
                        }
                        bw(c6, c5)
                    }
                    return (aS = true)
                }
            })
        }
        function aV(c0) {
            if (typeof c0 == "number") {
                if (!br(c0)) {
                    return null
                }
                var c1 = c0;
                c0 = cF(c0);
                if (!c0) {
                    return null
                }
            } else {
                var c1 = Y(c0);
                if (c1 == null) {
                    return null
                }
            }
            var cZ = c0.gutterMarker;
            return {
                line: c1,
                handle: c0,
                text: c0.text,
                markerText: cZ && cZ.text,
                markerClass: cZ && cZ.style,
                lineClass: c0.className,
                bgClass: c0.bgClassName
            }
        }
        function ct(cZ) {
            av.innerHTML = "<pre><span>x</span></pre>";
            av.firstChild.firstChild.firstChild.nodeValue = cZ;
            return av.firstChild.firstChild.offsetWidth || 10
        }
        function aG(db, c5) {
            if (c5 <= 0) {
                return 0
            }
            var c2 = cF(db)
              , c8 = c2.text;
            function c9(dc) {
                return b5(c2, dc).left
            }
            var c6 = 0, c4 = 0, c7 = c8.length, c3;
            var c0 = Math.min(c7, Math.ceil(c5 / bh()));
            for (; ;) {
                var c1 = c9(c0);
                if (c1 <= c5 && c0 < c7) {
                    c0 = Math.min(c7, Math.ceil(c0 * 1.2))
                } else {
                    c3 = c1;
                    c7 = c0;
                    break
                }
            }
            if (c5 > c3) {
                return c7
            }
            c0 = Math.floor(c7 * 0.8);
            c1 = c9(c0);
            if (c1 < c5) {
                c6 = c0;
                c4 = c1
            }
            for (; ;) {
                if (c7 - c6 <= 1) {
                    return (c3 - c5 > c5 - c4) ? c6 : c7
                }
                var da = Math.ceil((c6 + c7) / 2)
                  , cZ = c9(da);
                if (cZ > c5) {
                    c7 = da;
                    c3 = cZ
                } else {
                    c6 = da;
                    c4 = cZ
                }
            }
        }
        var cz = "CodeMirror-temp-" + Math.floor(Math.random() * 16777215).toString(16);
        function b5(c0, c3) {
            if (c3 == 0) {
                return {
                    top: 0,
                    left: 0
                }
            }
            var cZ = b1.lineWrapping && c3 < c0.text.length && o.test(c0.text.slice(c3 - 1, c3 + 1));
            av.innerHTML = "<pre>" + c0.getHTML(a9, c3, cz, cZ) + "</pre>";
            var c2 = document.getElementById(cz);
            var c5 = c2.offsetTop
              , c4 = c2.offsetLeft;
            if (I && c5 == 0 && c4 == 0) {
                var c1 = document.createElement("span");
                c1.innerHTML = "x";
                c2.parentNode.insertBefore(c1, c2.nextSibling);
                c5 = c1.offsetTop
            }
            return {
                top: c5,
                left: c4
            }
        }
        function cR(c4, c2) {
            var cZ, c0 = bP(), c3 = c0 * (g(cy, c4.line) - (c2 ? bd : 0));
            if (c4.ch == 0) {
                cZ = 0
            } else {
                var c1 = b5(cF(c4.line), c4.ch);
                cZ = c1.left;
                if (b1.lineWrapping) {
                    c3 += Math.max(0, c1.top)
                }
            }
            return {
                x: cZ,
                y: c3,
                yBot: c3 + c0
            }
        }
        function bH(c8, c7) {
            if (c7 < 0) {
                c7 = 0
            }
            var c5 = bP()
              , c3 = bh()
              , de = bd + Math.floor(c7 / c5);
            var c9 = X(cy, de);
            if (c9 >= cy.size) {
                return {
                    line: cy.size - 1,
                    ch: cF(cy.size - 1).text.length
                }
            }
            var c0 = cF(c9)
              , db = c0.text;
            var dg = b1.lineWrapping
              , c6 = dg ? de - g(cy, c9) : 0;
            if (c8 <= 0 && c6 == 0) {
                return {
                    line: c9,
                    ch: 0
                }
            }
            function df(di) {
                var dj = b5(c0, di);
                if (dg) {
                    var dk = Math.round(dj.top / c5);
                    return Math.max(0, dj.left + (dk - c6) * bk.clientWidth)
                }
                return dj.left
            }
            var dd = 0, dc = 0, c1 = db.length, cZ;
            var da = Math.min(c1, Math.ceil((c8 + c6 * bk.clientWidth * 0.9) / c3));
            for (; ;) {
                var c4 = df(da);
                if (c4 <= c8 && da < c1) {
                    da = Math.min(c1, Math.ceil(da * 1.2))
                } else {
                    cZ = c4;
                    c1 = da;
                    break
                }
            }
            if (c8 > cZ) {
                return {
                    line: c9,
                    ch: c1
                }
            }
            da = Math.floor(c1 * 0.8);
            c4 = df(da);
            if (c4 < c8) {
                dd = da;
                dc = c4
            }
            for (; ;) {
                if (c1 - dd <= 1) {
                    return {
                        line: c9,
                        ch: (cZ - c8 > c8 - dc) ? dd : c1
                    }
                }
                var dh = Math.ceil((dd + c1) / 2)
                  , c2 = df(dh);
                if (c2 > c8) {
                    c1 = dh;
                    cZ = c2
                } else {
                    dd = dh;
                    dc = c2
                }
            }
        }
        function ao(c1) {
            var cZ = cR(c1, true)
              , c0 = ak(bu);
            return {
                x: c0.left + cZ.x,
                y: c0.top + cZ.y,
                yBot: c0.top + cZ.yBot
            }
        }
        var a0, ax, bU;
        function bP() {
            if (bU == null) {
                bU = "<pre>";
                for (var c0 = 0; c0 < 49; ++c0) {
                    bU += "x<br/>"
                }
                bU += "x</pre>"
            }
            var cZ = aq.clientHeight;
            if (cZ == ax) {
                return a0
            }
            ax = cZ;
            av.innerHTML = bU;
            a0 = av.firstChild.offsetHeight / 50 || 1;
            av.innerHTML = "";
            return a0
        }
        var cS, bv = 0;
        function bh() {
            if (bk.clientWidth == bv) {
                return cS
            }
            bv = bk.clientWidth;
            return (cS = ct("x"))
        }
        function cr() {
            return bu.offsetTop
        }
        function a5() {
            return bu.offsetLeft
        }
        function a2(c3, c2) {
            var c1 = ak(bk, true), cZ, c4;
            try {
                cZ = c3.clientX;
                c4 = c3.clientY
            } catch (c3) {
                return null
            }
            if (!c2 && (cZ - c1.left > bk.clientWidth || c4 - c1.top > bk.clientHeight)) {
                return null
            }
            var c0 = ak(bu, true);
            return bH(cZ - c0.left, c4 - c0.top)
        }
        function a1(c0) {
            var c5 = a2(c0)
              , c4 = bk.scrollTop;
            if (!c5 || window.opera) {
                return
            }
            if (ad(cW.from, cW.to) || Z(c5, cW.from) || !Z(c5, cW.to)) {
                ar(a6)(c5.line, c5.ch)
            }
            var c3 = bm.style.cssText;
            bX.style.position = "absolute";
            bm.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (c0.clientY - 5) + "px; left: " + (c0.clientX - 5) + "px; z-index: 1000; background: white; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
            bf = true;
            var c2 = bm.value = b3();
            bz();
            a(bm);
            function cZ() {
                var c6 = A(bm.value).join("\n");
                if (c6 != c2) {
                    ar(bs)(c6, "end")
                }
                bX.style.position = "relative";
                bm.style.cssText = c3;
                if (B) {
                    bk.scrollTop = c4
                }
                bf = false;
                cC(true);
                am()
            }
            if (N) {
                w(c0);
                var c1 = r(window, "mouseup", function () {
                    c1();
                    setTimeout(cZ, 20)
                }, true)
            } else {
                setTimeout(cZ, 50)
            }
        }
        function cM() {
            clearInterval(cP);
            var cZ = true;
            bc.style.visibility = "";
            cP = setInterval(function () {
                bc.style.visibility = (cZ = !cZ) ? "" : "hidden"
            }, 650)
        }
        var bp = {
            "(": ")>",
            ")": "(<",
            "[": "]>",
            "]": "[<",
            "{": "}>",
            "}": "{<"
        };
        function ce(c5) {
            var cZ = cW.inverted ? cW.from : cW.to
              , c7 = cF(cZ.line)
              , c0 = cZ.ch - 1;
            var c4 = (c0 >= 0 && bp[c7.text.charAt(c0)]) || bp[c7.text.charAt(++c0)];
            if (!c4) {
                return
            }
            var c8 = c4.charAt(0)
              , c6 = c4.charAt(1) == ">"
              , di = c6 ? 1 : -1
              , dd = c7.styles;
            for (var dj = c0 + 1, df = 0, dh = dd.length; df < dh; df += 2) {
                if ((dj -= dd[df].length) <= 0) {
                    var dg = dd[df + 1];
                    break
                }
            }
            var c2 = [c7.text.charAt(c0)]
              , dc = /[(){}[\]]/;
            function da(dw, dr, ds) {
                if (!dw.text) {
                    return
                }
                var dv = dw.styles, dq = c6 ? 0 : dw.text.length - 1, dt;
                for (var dm = c6 ? 0 : dv.length - 2, dp = c6 ? dv.length : -2; dm != dp; dm += 2 * di) {
                    var du = dv[dm];
                    if (dv[dm + 1] != null && dv[dm + 1] != dg) {
                        dq += di * du.length;
                        continue
                    }
                    for (var dl = c6 ? 0 : du.length - 1, dk = c6 ? du.length : -1; dl != dk; dl += di,
                    dq += di) {
                        if (dq >= dr && dq < ds && dc.test(dt = du.charAt(dl))) {
                            var dn = bp[dt];
                            if (dn.charAt(1) == ">" == c6) {
                                c2.push(dt)
                            } else {
                                if (c2.pop() != dn.charAt(0)) {
                                    return {
                                        pos: dq,
                                        match: false
                                    }
                                } else {
                                    if (!c2.length) {
                                        return {
                                            pos: dq,
                                            match: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (var df = cZ.line, dh = c6 ? Math.min(df + 100, cy.size) : Math.max(-1, df - 100) ; df != dh; df += di) {
                var c7 = cF(df)
                  , c3 = df == cZ.line;
                var c9 = da(c7, c3 && c6 ? c0 + 1 : 0, c3 && !c6 ? c0 : c7.text.length);
                if (c9) {
                    break
                }
            }
            if (!c9) {
                c9 = {
                    pos: null,
                    match: false
                }
            }
            var dg = c9.match ? "CodeMirror-matchingbracket" : "CodeMirror-nonmatchingbracket";
            var de = bE({
                line: cZ.line,
                ch: c0
            }, {
                line: cZ.line,
                ch: c0 + 1
            }, dg)
              , c1 = c9.pos != null && bE({
                  line: df,
                  ch: c9.pos
              }, {
                  line: df,
                  ch: c9.pos + 1
              }, dg);
            var db = ar(function () {
                de.clear();
                c1 && c1.clear()
            });
            if (c5) {
                setTimeout(db, 800)
            } else {
                b4 = db
            }
        }
        function a7(c5) {
            var c4, c1;
            for (var c0 = c5, c2 = c5 - 40; c0 > c2; --c0) {
                if (c0 == 0) {
                    return 0
                }
                var cZ = cF(c0 - 1);
                if (cZ.stateAfter) {
                    return c0
                }
                var c3 = cZ.indentation(b1.tabSize);
                if (c1 == null || c4 > c3) {
                    c1 = c0 - 1;
                    c4 = c3
                }
            }
            return c1
        }
        function cu(c1) {
            var c0 = a7(c1)
              , cZ = c0 && cF(c0 - 1).stateAfter;
            if (!cZ) {
                cZ = V(cb)
            } else {
                cZ = p(cb, cZ)
            }
            cy.iter(c0, c1, function (c2) {
                c2.highlight(cb, cZ, b1.tabSize);
                c2.stateAfter = p(cb, cZ)
            });
            if (c0 < c1) {
                aB.push({
                    from: c0,
                    to: c1
                })
            }
            if (c1 < cy.size && !cF(c1).stateAfter) {
                ch.push(c1)
            }
            return cZ
        }
        function cH(c1, cZ) {
            var c0 = cu(c1);
            cy.iter(c1, cZ, function (c2) {
                c2.highlight(cb, c0, b1.tabSize);
                c2.stateAfter = p(cb, c0)
            })
        }
        function bS() {
            var c5 = +new Date + b1.workTime;
            var c8 = ch.length;
            while (ch.length) {
                if (!cF(cQ).stateAfter) {
                    var c2 = cQ
                } else {
                    var c2 = ch.pop()
                }
                if (c2 >= cy.size) {
                    continue
                }
                var c0 = a7(c2)
                  , cZ = c0 && cF(c0 - 1).stateAfter;
                if (cZ) {
                    cZ = p(cb, cZ)
                } else {
                    cZ = V(cb)
                }
                var c4 = 0
                  , c1 = cb.compareStates
                  , c7 = false
                  , c6 = c0
                  , c3 = false;
                cy.iter(c6, cy.size, function (da) {
                    var db = da.stateAfter;
                    if (+new Date > c5) {
                        ch.push(c6);
                        bG(b1.workDelay);
                        if (c7) {
                            aB.push({
                                from: c2,
                                to: c6 + 1
                            })
                        }
                        return (c3 = true)
                    }
                    var dc = da.highlight(cb, cZ, b1.tabSize);
                    if (dc) {
                        c7 = true
                    }
                    da.stateAfter = p(cb, cZ);
                    var c9 = null;
                    if (c1) {
                        var dd = db && c1(db, cZ);
                        if (dd != ab) {
                            c9 = !!dd
                        }
                    }
                    if (c9 == null) {
                        if (dc !== false || !db) {
                            c4 = 0
                        } else {
                            if (++c4 > 3 && (!cb.indent || cb.indent(db, "") == cb.indent(cZ, ""))) {
                                c9 = true
                            }
                        }
                    }
                    if (c9) {
                        return true
                    }
                    ++c6
                });
                if (c3) {
                    return
                }
                if (c7) {
                    aB.push({
                        from: c2,
                        to: c6 + 1
                    })
                }
            }
            if (c8 && b1.onHighlightComplete) {
                b1.onHighlightComplete(b9)
            }
        }
        function bG(cZ) {
            if (!ch.length) {
                return
            }
            aw.set(cZ, ar(bS))
        }
        function aN() {
            cp = b6 = cN = null;
            aB = [];
            aP = false;
            cA = []
        }
        function ay() {
            var c3 = false, c0;
            if (aP) {
                c3 = !cf()
            }
            if (aB.length) {
                c0 = cd(aB, true)
            } else {
                if (aP) {
                    cV()
                }
                if (aS) {
                    aL()
                }
            }
            if (c3) {
                cf()
            }
            if (aP) {
                cY();
                cM()
            }
            if (cj && !bf && (cp === true || (cp !== false && aP))) {
                cC(b6)
            }
            if (aP && b1.matchBrackets) {
                setTimeout(ar(function () {
                    if (b4) {
                        b4();
                        b4 = null
                    }
                    if (ad(cW.from, cW.to)) {
                        ce(false)
                    }
                }), 20)
            }
            var cZ = cN
              , c1 = cA;
            if (aP && b1.onCursorActivity) {
                b1.onCursorActivity(b9)
            }
            if (cZ && b1.onChange && b9) {
                b1.onChange(b9, cZ)
            }
            for (var c2 = 0; c2 < c1.length; ++c2) {
                c1[c2](b9)
            }
            if (c0 && b1.onUpdate) {
                b1.onUpdate(b9)
            }
        }
        var cq = 0;
        function ar(cZ) {
            return function () {
                if (!cq++) {
                    aN()
                }
                try {
                    var c0 = cZ.apply(this, arguments)
                } finally {
                    if (!--cq) {
                        ay()
                    }
                }
                return c0
            }
        }
        function bO(cZ) {
            a8.startCompound();
            try {
                return cZ()
            } finally {
                a8.endCompound()
            }
        }
        for (var bJ in ac) {
            if (ac.propertyIsEnumerable(bJ) && !b9.propertyIsEnumerable(bJ)) {
                b9[bJ] = ac[bJ]
            }
        }
        return b9
    }
    u.defaults = {
        value: "",
        mode: null,
        theme: "default",
        indentUnit: 2,
        indentWithTabs: false,
        smartIndent: true,
        tabSize: 4,
        keyMap: "default",
        extraKeys: null,
        electricChars: true,
        autoClearEmptyLines: false,
        onKeyEvent: null,
        onDragEvent: null,
        lineWrapping: false,
        lineNumbers: false,
        gutter: false,
        fixedGutter: false,
        firstLineNumber: 1,
        readOnly: false,
        dragDrop: true,
        onChange: null,
        onCursorActivity: null,
        onGutterClick: null,
        onHighlightComplete: null,
        onUpdate: null,
        onFocus: null,
        onBlur: null,
        onScroll: null,
        matchBrackets: false,
        workTime: 100,
        workDelay: 200,
        pollInterval: 100,
        undoDepth: 40,
        tabindex: null,
        autofocus: null
    };
    var s = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent);
    var M = s || /Mac/.test(navigator.platform);
    var U = /Win/.test(navigator.platform);
    var aj = u.modes = {}
      , S = u.mimeModes = {};
    u.defineMode = function (am, ao) {
        if (!u.defaults.mode && am != "null") {
            u.defaults.mode = am
        }
        if (arguments.length > 2) {
            ao.dependencies = [];
            for (var an = 2; an < arguments.length; ++an) {
                ao.dependencies.push(arguments[an])
            }
        }
        aj[am] = ao
    }
    ;
    u.defineMIME = function (an, am) {
        S[an] = am
    }
    ;
    u.resolveMode = function (am) {
        if (typeof am == "string" && S.hasOwnProperty(am)) {
            am = S[am]
        } else {
            if (typeof am == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(am)) {
                return u.resolveMode("application/xml")
            }
        }
        if (typeof am == "string") {
            return {
                name: am
            }
        } else {
            return am || {
                name: "null"
            }
        }
    }
    ;
    u.getMode = function (an, am) {
        var am = u.resolveMode(am);
        var ao = aj[am.name];
        if (!ao) {
            return u.getMode(an, "text/plain")
        }
        return ao(an, am)
    }
    ;
    u.listModes = function () {
        var an = [];
        for (var am in aj) {
            if (aj.propertyIsEnumerable(am)) {
                an.push(am)
            }
        }
        return an
    }
    ;
    u.listMIMEs = function () {
        var an = [];
        for (var am in S) {
            if (S.propertyIsEnumerable(am)) {
                an.push({
                    mime: am,
                    mode: S[am]
                })
            }
        }
        return an
    }
    ;
    var ac = u.extensions = {};
    u.defineExtension = function (am, an) {
        ac[am] = an
    }
    ;
    var L = u.commands = {
        selectAll: function (am) {
            am.setSelection({
                line: 0,
                ch: 0
            }, {
                line: am.lineCount() - 1
            })
        },
        killLine: function (am) {
            var ap = am.getCursor(true)
              , ao = am.getCursor(false)
              , an = !ad(ap, ao);
            if (!an && am.getLine(ap.line).length == ap.ch) {
                am.replaceRange("", ap, {
                    line: ap.line + 1,
                    ch: 0
                })
            } else {
                am.replaceRange("", ap, an ? ao : {
                    line: ap.line
                })
            }
        },
        deleteLine: function (am) {
            var an = am.getCursor().line;
            am.replaceRange("", {
                line: an,
                ch: 0
            }, {
                line: an
            })
        },
        undo: function (am) {
            am.undo()
        },
        redo: function (am) {
            am.redo()
        },
        goDocStart: function (am) {
            am.setCursor(0, 0, true)
        },
        goDocEnd: function (am) {
            am.setSelection({
                line: am.lineCount() - 1
            }, null, true)
        },
        goLineStart: function (am) {
            am.setCursor(am.getCursor().line, 0, true)
        },
        goLineStartSmart: function (am) {
            var ap = am.getCursor();
            var ao = am.getLine(ap.line)
              , an = Math.max(0, ao.search(/\S/));
            am.setCursor(ap.line, ap.ch <= an && ap.ch ? 0 : an, true)
        },
        goLineEnd: function (am) {
            am.setSelection({
                line: am.getCursor().line
            }, null, true)
        },
        goLineUp: function (am) {
            am.moveV(-1, "line")
        },
        goLineDown: function (am) {
            am.moveV(1, "line")
        },
        goPageUp: function (am) {
            am.moveV(-1, "page")
        },
        goPageDown: function (am) {
            am.moveV(1, "page")
        },
        goCharLeft: function (am) {
            am.moveH(-1, "char")
        },
        goCharRight: function (am) {
            am.moveH(1, "char")
        },
        goColumnLeft: function (am) {
            am.moveH(-1, "column")
        },
        goColumnRight: function (am) {
            am.moveH(1, "column")
        },
        goWordLeft: function (am) {
            am.moveH(-1, "word")
        },
        goWordRight: function (am) {
            am.moveH(1, "word")
        },
        delCharLeft: function (am) {
            am.deleteH(-1, "char")
        },
        delCharRight: function (am) {
            am.deleteH(1, "char")
        },
        delWordLeft: function (am) {
            am.deleteH(-1, "word")
        },
        delWordRight: function (am) {
            am.deleteH(1, "word")
        },
        indentAuto: function (am) {
            am.indentSelection("smart")
        },
        indentMore: function (am) {
            am.indentSelection("add")
        },
        indentLess: function (am) {
            am.indentSelection("subtract")
        },
        insertTab: function (am) {
            am.replaceSelection("\t", "end")
        },
        transposeChars: function (am) {
            var ao = am.getCursor()
              , an = am.getLine(ao.line);
            if (ao.ch > 0 && ao.ch < an.length - 1) {
                am.replaceRange(an.charAt(ao.ch) + an.charAt(ao.ch - 1), {
                    line: ao.line,
                    ch: ao.ch - 1
                }, {
                    line: ao.line,
                    ch: ao.ch + 1
                })
            }
        },
        newlineAndIndent: function (am) {
            am.replaceSelection("\n", "end");
            am.indentLine(am.getCursor().line)
        },
        toggleOverwrite: function (am) {
            am.toggleOverwrite()
        }
    };
    var v = u.keyMap = {};
    v.basic = {
        Left: "goCharLeft",
        Right: "goCharRight",
        Up: "goLineUp",
        Down: "goLineDown",
        End: "goLineEnd",
        Home: "goLineStartSmart",
        PageUp: "goPageUp",
        PageDown: "goPageDown",
        Delete: "delCharRight",
        Backspace: "delCharLeft",
        Tab: "insertTab",
        "Shift-Tab": "indentAuto",
        Enter: "newlineAndIndent",
        Insert: "toggleOverwrite"
    };
    v.pcDefault = {
        "Ctrl-A": "selectAll",
        "Ctrl-D": "deleteLine",
        "Ctrl-Z": "undo",
        "Shift-Ctrl-Z": "redo",
        "Ctrl-Y": "redo",
        "Ctrl-Home": "goDocStart",
        "Alt-Up": "goDocStart",
        "Ctrl-End": "goDocEnd",
        "Ctrl-Down": "goDocEnd",
        "Ctrl-Left": "goWordLeft",
        "Ctrl-Right": "goWordRight",
        "Alt-Left": "goLineStart",
        "Alt-Right": "goLineEnd",
        "Ctrl-Backspace": "delWordLeft",
        "Ctrl-Delete": "delWordRight",
        "Ctrl-S": "save",
        "Ctrl-F": "find",
        "Ctrl-G": "findNext",
        "Shift-Ctrl-G": "findPrev",
        "Shift-Ctrl-F": "replace",
        "Shift-Ctrl-R": "replaceAll",
        "Ctrl-[": "indentLess",
        "Ctrl-]": "indentMore",
        fallthrough: "basic"
    };
    v.macDefault = {
        "Cmd-A": "selectAll",
        "Cmd-D": "deleteLine",
        "Cmd-Z": "undo",
        "Shift-Cmd-Z": "redo",
        "Cmd-Y": "redo",
        "Cmd-Up": "goDocStart",
        "Cmd-End": "goDocEnd",
        "Cmd-Down": "goDocEnd",
        "Alt-Left": "goWordLeft",
        "Alt-Right": "goWordRight",
        "Cmd-Left": "goLineStart",
        "Cmd-Right": "goLineEnd",
        "Alt-Backspace": "delWordLeft",
        "Ctrl-Alt-Backspace": "delWordRight",
        "Alt-Delete": "delWordRight",
        "Cmd-S": "save",
        "Cmd-F": "find",
        "Cmd-G": "findNext",
        "Shift-Cmd-G": "findPrev",
        "Cmd-Alt-F": "replace",
        "Shift-Cmd-Alt-F": "replaceAll",
        "Cmd-[": "indentLess",
        "Cmd-]": "indentMore",
        fallthrough: ["basic", "emacsy"]
    };
    v["default"] = M ? v.macDefault : v.pcDefault;
    v.emacsy = {
        "Ctrl-F": "goCharRight",
        "Ctrl-B": "goCharLeft",
        "Ctrl-P": "goLineUp",
        "Ctrl-N": "goLineDown",
        "Alt-F": "goWordRight",
        "Alt-B": "goWordLeft",
        "Ctrl-A": "goLineStart",
        "Ctrl-E": "goLineEnd",
        "Ctrl-V": "goPageUp",
        "Shift-Ctrl-V": "goPageDown",
        "Ctrl-D": "delCharRight",
        "Ctrl-H": "delCharLeft",
        "Alt-D": "delWordRight",
        "Alt-Backspace": "delWordLeft",
        "Ctrl-K": "killLine",
        "Ctrl-T": "transposeChars"
    };
    function c(am) {
        if (typeof am == "string") {
            return v[am]
        } else {
            return am
        }
    }
    function l(an, am, ar, ap, ao) {
        function aq(ax) {
            ax = c(ax);
            var av = ax[an];
            if (av != null && ap(av)) {
                return true
            }
            if (ax.nofallthrough) {
                if (ao) {
                    ao()
                }
                return true
            }
            var au = ax.fallthrough;
            if (au == null) {
                return false
            }
            if (Object.prototype.toString.call(au) != "[object Array]") {
                return aq(au)
            }
            for (var at = 0, aw = au.length; at < aw; ++at) {
                if (aq(au[at])) {
                    return true
                }
            }
            return false
        }
        if (am && aq(am)) {
            return true
        }
        return aq(ar)
    }
    function Q(an) {
        var am = R[y(an, "keyCode")];
        return am == "Ctrl" || am == "Alt" || am == "Shift" || am == "Mod"
    }
    u.fromTextArea = function (an, ap) {
        if (!ap) {
            ap = {}
        }
        ap.value = an.value;
        if (!ap.tabindex && an.tabindex) {
            ap.tabindex = an.tabindex
        }
        if (ap.autofocus == null && an.getAttribute("autofocus") != null) {
            ap.autofocus = true
        }
        function ar() {
            an.value = am.getValue()
        }
        if (an.form) {
            var aq = r(an.form, "submit", ar, true);
            if (typeof an.form.submit == "function") {
                var ao = an.form.submit;
                function at() {
                    ar();
                    an.form.submit = ao;
                    an.form.submit();
                    an.form.submit = at
                }
                an.form.submit = at
            }
        }
        an.style.display = "none";
        var am = u(function (au) {
            an.parentNode.insertBefore(au, an.nextSibling)
        }, ap);
        am.save = ar;
        am.getTextArea = function () {
            return an
        }
        ;
        am.toTextArea = function () {
            ar();
            an.parentNode.removeChild(am.getWrapperElement());
            an.style.display = "";
            if (an.form) {
                aq();
                if (typeof an.form.submit == "function") {
                    an.form.submit = ao
                }
            }
        }
        ;
        return am
    }
    ;
    function p(ap, am) {
        if (am === true) {
            return am
        }
        if (ap.copyState) {
            return ap.copyState(am)
        }
        var ao = {};
        for (var aq in am) {
            var an = am[aq];
            if (an instanceof Array) {
                an = an.concat([])
            }
            ao[aq] = an
        }
        return ao
    }
    u.copyState = p;
    function V(ao, an, am) {
        return ao.startState ? ao.startState(an, am) : true
    }
    u.startState = V;
    function b(am, an) {
        this.pos = this.start = 0;
        this.string = am;
        this.tabSize = an || 8
    }
    b.prototype = {
        eol: function () {
            return this.pos >= this.string.length
        },
        sol: function () {
            return this.pos == 0
        },
        peek: function () {
            return this.string.charAt(this.pos)
        },
        next: function () {
            if (this.pos < this.string.length) {
                return this.string.charAt(this.pos++)
            }
        },
        eat: function (am) {
            var ao = this.string.charAt(this.pos);
            if (typeof am == "string") {
                var an = ao == am
            } else {
                var an = ao && (am.test ? am.test(ao) : am(ao))
            }
            if (an) {
                ++this.pos;
                return ao
            }
        },
        eatWhile: function (am) {
            var an = this.pos;
            while (this.eat(am)) { }
            return this.pos > an
        },
        eatSpace: function () {
            var am = this.pos;
            while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) {
                ++this.pos
            }
            return this.pos > am
        },
        skipToEnd: function () {
            this.pos = this.string.length
        },
        skipTo: function (am) {
            var an = this.string.indexOf(am, this.pos);
            if (an > -1) {
                this.pos = an;
                return true
            }
        },
        backUp: function (am) {
            this.pos -= am
        },
        column: function () {
            return n(this.string, this.start, this.tabSize)
        },
        indentation: function () {
            return n(this.string, null, this.tabSize)
        },
        match: function (ap, an, am) {
            if (typeof ap == "string") {
                function aq(ar) {
                    return am ? ar.toLowerCase() : ar
                }
                if (aq(this.string).indexOf(aq(ap), this.pos) == this.pos) {
                    if (an !== false) {
                        this.pos += ap.length
                    }
                    return true
                }
            } else {
                var ao = this.string.slice(this.pos).match(ap);
                if (ao && an !== false) {
                    this.pos += ao[0].length
                }
                return ao
            }
        },
        current: function () {
            return this.string.slice(this.start, this.pos)
        }
    };
    u.StringStream = b;
    function K(ap, ao, an, am) {
        this.from = ap;
        this.to = ao;
        this.style = an;
        this.marker = am
    }
    K.prototype = {
        attach: function (am) {
            this.marker.set.push(am)
        },
        detach: function (an) {
            var am = q(this.marker.set, an);
            if (am > -1) {
                this.marker.set.splice(am, 1)
            }
        },
        split: function (ap, am) {
            if (this.to <= ap && this.to != null) {
                return null
            }
            var ao = this.from < ap || this.from == null ? null : this.from - ap + am;
            var an = this.to == null ? null : this.to - ap + am;
            return new K(ao, an, this.style, this.marker)
        },
        dup: function () {
            return new K(null, null, this.style, this.marker)
        },
        clipTo: function (an, aq, am, ap, ao) {
            if (an && ap > this.from && (ap < this.to || this.to == null)) {
                this.from = null
            } else {
                if (this.from != null && this.from >= aq) {
                    this.from = Math.max(ap, this.from) + ao
                }
            }
            if (am && (aq < this.to || this.to == null) && (aq > this.from || this.from == null)) {
                this.to = null
            } else {
                if (this.to != null && this.to > aq) {
                    this.to = ap < this.to ? this.to + ao : aq
                }
            }
        },
        isDead: function () {
            return this.from != null && this.to != null && this.from >= this.to
        },
        sameSet: function (am) {
            return this.marker == am.marker
        }
    };
    function G(am) {
        this.from = am;
        this.to = am;
        this.line = null
    }
    G.prototype = {
        attach: function (am) {
            this.line = am
        },
        detach: function (am) {
            if (this.line == am) {
                this.line = null
            }
        },
        split: function (an, am) {
            if (an < this.from) {
                this.from = this.to = (this.from - an) + am;
                return this
            }
        },
        isDead: function () {
            return this.from > this.to
        },
        clipTo: function (an, aq, am, ap, ao) {
            if ((an || aq < this.from) && (am || ap > this.to)) {
                this.from = 0;
                this.to = -1
            } else {
                if (this.from > aq) {
                    this.from = this.to = Math.max(ap, this.from) + ao
                }
            }
        },
        sameSet: function (am) {
            return false
        },
        find: function () {
            if (!this.line || !this.line.parent) {
                return null
            }
            return {
                line: Y(this.line),
                ch: this.from
            }
        },
        clear: function () {
            if (this.line) {
                var am = q(this.line.marked, this);
                if (am != -1) {
                    this.line.marked.splice(am, 1)
                }
                this.line = null
            }
        }
    };
    function e(an, am) {
        this.styles = am || [an, null];
        this.text = an;
        this.height = 1;
        this.marked = this.gutterMarker = this.className = this.bgClassName = this.handlers = null;
        this.stateAfter = this.parent = this.hidden = null
    }
    e.inheritMarks = function (aq, au) {
        var ap = new e(aq)
          , am = au && au.marked;
        if (am) {
            for (var ao = 0; ao < am.length; ++ao) {
                if (am[ao].to == null && am[ao].style) {
                    var an = ap.marked || (ap.marked = [])
                      , at = am[ao];
                    var ar = at.dup();
                    an.push(ar);
                    ar.attach(ap)
                }
            }
        }
        return ap
    }
    ;
    e.prototype = {
        replace: function (aq, ap, au) {
            var av = []
              , ao = this.marked
              , ar = ap == null ? this.text.length : ap;
            al(0, aq, this.styles, av);
            if (au) {
                av.push(au, null)
            }
            al(ar, this.text.length, this.styles, av);
            this.styles = av;
            this.text = this.text.slice(0, aq) + au + this.text.slice(ar);
            this.stateAfter = null;
            if (ao) {
                var at = au.length - (ar - aq);
                for (var an = 0; an < ao.length; ++an) {
                    var am = ao[an];
                    am.clipTo(aq == null, aq || 0, ap == null, ar, at);
                    if (am.isDead()) {
                        am.detach(this);
                        ao.splice(an--, 1)
                    }
                }
            }
        },
        split: function (au, ar) {
            var ap = [ar, null]
              , an = this.marked;
            al(au, this.text.length, this.styles, ap);
            var ao = new e(ar + this.text.slice(au), ap);
            if (an) {
                for (var aq = 0; aq < an.length; ++aq) {
                    var at = an[aq];
                    var am = at.split(au, ar.length);
                    if (am) {
                        if (!ao.marked) {
                            ao.marked = []
                        }
                        ao.marked.push(am);
                        am.attach(ao);
                        if (am == at) {
                            an.splice(aq--, 1)
                        }
                    }
                }
            }
            return ao
        },
        append: function (an) {
            var at = this.text.length
              , am = an.marked
              , aq = this.marked;
            this.text += an.text;
            al(0, an.text.length, an.styles, this.styles);
            if (aq) {
                for (var ar = 0; ar < aq.length; ++ar) {
                    if (aq[ar].to == null) {
                        aq[ar].to = at
                    }
                }
            }
            if (am && am.length) {
                if (!aq) {
                    this.marked = aq = []
                }
                outer: for (var ar = 0; ar < am.length; ++ar) {
                    var au = am[ar];
                    if (!au.from) {
                        for (var ap = 0; ap < aq.length; ++ap) {
                            var ao = aq[ap];
                            if (ao.to == at && ao.sameSet(au)) {
                                ao.to = au.to == null ? null : au.to + at;
                                if (ao.isDead()) {
                                    ao.detach(this);
                                    am.splice(ar--, 1)
                                }
                                continue outer
                            }
                        }
                    }
                    aq.push(au);
                    au.attach(this);
                    au.from += at;
                    if (au.to != null) {
                        au.to += at
                    }
                }
            }
        },
        fixMarkEnds: function (an) {
            var am = this.marked
              , aq = an.marked;
            if (!am) {
                return
            }
            for (var ap = 0; ap < am.length; ++ap) {
                var at = am[ap]
                  , ar = at.to == null;
                if (ar && aq) {
                    for (var ao = 0; ao < aq.length; ++ao) {
                        if (aq[ao].sameSet(at)) {
                            ar = false;
                            break
                        }
                    }
                }
                if (ar) {
                    at.to = this.text.length
                }
            }
        },
        fixMarkStarts: function () {
            var am = this.marked;
            if (!am) {
                return
            }
            for (var an = 0; an < am.length; ++an) {
                if (am[an].from == null) {
                    am[an].from = 0
                }
            }
        },
        addMark: function (am) {
            am.attach(this);
            if (this.marked == null) {
                this.marked = []
            }
            this.marked.push(am);
            this.marked.sort(function (ao, an) {
                return (ao.from || 0) - (an.from || 0)
            })
        },
        highlight: function (ar, an, at) {
            var aw = new b(this.text, at)
              , ax = this.styles
              , au = 0;
            var aq = false, ao = ax[0], av;
            if (this.text == "" && ar.blankLine) {
                ar.blankLine(an)
            }
            while (!aw.eol()) {
                var am = ar.token(aw, an);
                var ap = this.text.slice(aw.start, aw.pos);
                aw.start = aw.pos;
                if (au && ax[au - 1] == am) {
                    ax[au - 2] += ap
                } else {
                    if (ap) {
                        if (!aq && (ax[au + 1] != am || (au && ax[au - 2] != av))) {
                            aq = true
                        }
                        ax[au++] = ap;
                        ax[au++] = am;
                        av = ao;
                        ao = ax[au]
                    }
                }
                if (aw.pos > 5000) {
                    ax[au++] = this.text.slice(aw.pos);
                    ax[au++] = null;
                    break
                }
            }
            if (ax.length != au) {
                ax.length = au;
                aq = true
            }
            if (au && ax[au - 2] != av) {
                aq = true
            }
            return aq || (ax.length < 5 && this.text.length < 10 ? null : false)
        },
        getTokenAt: function (ar, ap, ao) {
            var am = this.text
              , aq = new b(am);
            while (aq.pos < ao && !aq.eol()) {
                aq.start = aq.pos;
                var an = ar.token(aq, ap)
            }
            return {
                start: aq.start,
                end: aq.pos,
                string: aq.current(),
                className: an || null,
                state: ap
            }
        },
        indentation: function (am) {
            return n(this.text, null, am)
        },
        getHTML: function (aM, am, ao, aq) {
            var ax = []
              , av = true
              , at = 0;
            function aI(aY, aW) {
                if (!aY) {
                    return
                }
                if (av && I && aY.charAt(0) == " ") {
                    aY = "\u00a0" + aY.slice(1)
                }
                av = false;
                if (aY.indexOf("\t") == -1) {
                    at += aY.length;
                    var aX = P(aY)
                } else {
                    var aX = "";
                    for (var aZ = 0; ;) {
                        var aU = aY.indexOf("\t", aZ);
                        if (aU == -1) {
                            aX += P(aY.slice(aZ));
                            at += aY.length - aZ;
                            break
                        } else {
                            at += aU - aZ;
                            var aV = aM(at);
                            aX += P(aY.slice(aZ, aU)) + aV.html;
                            at += aV.width;
                            aZ = aU + 1
                        }
                    }
                }
                if (aW) {
                    ax.push('<span class="', aW, '">', aX, "</span>")
                } else {
                    ax.push(aX)
                }
            }
            var aL = aI;
            if (am != null) {
                var aG = 0
                  , aB = '<span id="' + ao + '">';
                aL = function (aW, aV) {
                    var aU = aW.length;
                    if (am >= aG && am < aG + aU) {
                        if (am > aG) {
                            aI(aW.slice(0, am - aG), aV);
                            if (aq) {
                                ax.push("<wbr>")
                            }
                        }
                        ax.push(aB);
                        aI(aW.slice(am - aG), aV);
                        ax.push("</span>");
                        am--;
                        aG += aU
                    } else {
                        aG += aU;
                        aI(aW, aV);
                        if (aG == am && aG == aQ) {
                            ax.push(aB + "</span>")
                        } else {
                            if (aG > am + 10 && /\s/.test(aW)) {
                                aL = function () { }
                            }
                        }
                    }
                }
            }
            var aF = this.styles
              , aw = this.text
              , aC = this.marked;
            var aQ = aw.length;
            function ar(aU) {
                if (!aU) {
                    return null
                }
                return "cm-" + aU.replace(/ +/g, " cm-")
            }
            if (!aw && am == null) {
                aL(" ")
            } else {
                if (!aC || !aC.length) {
                    for (var aN = 0, ay = 0; ay < aQ; aN += 2) {
                        var aE = aF[aN]
                          , aP = aF[aN + 1]
                          , aH = aE.length;
                        if (ay + aH > aQ) {
                            aE = aE.slice(0, aQ - ay)
                        }
                        ay += aH;
                        aL(aE, ar(aP))
                    }
                } else {
                    var au = 0, aN = 0, aA = "", aP, aT = 0;
                    var aS = aC[0].from || 0
                      , aK = []
                      , aR = 0;
                    function aO() {
                        var aU;
                        while (aR < aC.length && ((aU = aC[aR]).from == au || aU.from == null)) {
                            if (aU.style != null) {
                                aK.push(aU)
                            }
                            ++aR
                        }
                        aS = aR < aC.length ? aC[aR].from : Infinity;
                        for (var aV = 0; aV < aK.length; ++aV) {
                            var aW = aK[aV].to || Infinity;
                            if (aW == au) {
                                aK.splice(aV--, 1)
                            } else {
                                aS = Math.min(aW, aS)
                            }
                        }
                    }
                    var aD = 0;
                    while (au < aQ) {
                        if (aS == au) {
                            aO()
                        }
                        var az = Math.min(aQ, aS);
                        while (true) {
                            if (aA) {
                                var ap = au + aA.length;
                                var an = aP;
                                for (var aJ = 0; aJ < aK.length; ++aJ) {
                                    an = (an ? an + " " : "") + aK[aJ].style
                                }
                                aL(ap > az ? aA.slice(0, az - au) : aA, an);
                                if (ap >= az) {
                                    aA = aA.slice(az - au);
                                    au = az;
                                    break
                                }
                                au = ap
                            }
                            aA = aF[aN++];
                            aP = ar(aF[aN++])
                        }
                    }
                }
            }
            return ax.join("")
        },
        cleanUp: function () {
            this.parent = null;
            if (this.marked) {
                for (var am = 0, an = this.marked.length; am < an; ++am) {
                    this.marked[am].detach(this)
                }
            }
        }
    };
    function al(at, au, am, av) {
        for (var aq = 0, ar = 0, an = 0; ar < au; aq += 2) {
            var ao = am[aq]
              , ap = ar + ao.length;
            if (an == 0) {
                if (ap > at) {
                    av.push(ao.slice(at - ar, Math.min(ao.length, au - ar)), am[aq + 1])
                }
                if (ap >= at) {
                    an = 1
                }
            } else {
                if (an == 1) {
                    if (ap > au) {
                        av.push(ao.slice(0, au - ar), am[aq + 1])
                    } else {
                        av.push(ao, am[aq + 1])
                    }
                }
            }
            ar = ap
        }
    }
    function ah(an) {
        this.lines = an;
        this.parent = null;
        for (var ao = 0, ap = an.length, am = 0; ao < ap; ++ao) {
            an[ao].parent = this;
            am += an[ao].height
        }
        this.height = am
    }
    ah.prototype = {
        chunkSize: function () {
            return this.lines.length
        },
        remove: function (am, au, aq) {
            for (var ap = am, ar = am + au; ap < ar; ++ap) {
                var an = this.lines[ap];
                this.height -= an.height;
                an.cleanUp();
                if (an.handlers) {
                    for (var ao = 0; ao < an.handlers.length; ++ao) {
                        aq.push(an.handlers[ao])
                    }
                }
            }
            this.lines.splice(am, au)
        },
        collapse: function (am) {
            am.splice.apply(am, [am.length, 0].concat(this.lines))
        },
        insertHeight: function (an, ao, am) {
            this.height += am;
            if (I) {
                this.lines = this.lines.slice(0, an).concat(ao).concat(this.lines.slice(an))
            } else {
                this.lines.splice.apply(this.lines, [an, 0].concat(ao))
            }
            for (var ap = 0, aq = ao.length; ap < aq; ++ap) {
                ao[ap].parent = this
            }
        },
        iterN: function (am, ap, ao) {
            for (var an = am + ap; am < an; ++am) {
                if (ao(this.lines[am])) {
                    return true
                }
            }
        }
    };
    function i(ap) {
        this.children = ap;
        var ao = 0
          , am = 0;
        for (var an = 0, ar = ap.length; an < ar; ++an) {
            var aq = ap[an];
            ao += aq.chunkSize();
            am += aq.height;
            aq.parent = this
        }
        this.size = ao;
        this.height = am;
        this.parent = null
    }
    i.prototype = {
        chunkSize: function () {
            return this.size
        },
        remove: function (ao, an, ar) {
            this.size -= an;
            for (var ap = 0; ap < this.children.length; ++ap) {
                var am = this.children[ap]
                  , au = am.chunkSize();
                if (ao < au) {
                    var aq = Math.min(an, au - ao)
                      , av = am.height;
                    am.remove(ao, aq, ar);
                    this.height -= av - am.height;
                    if (au == aq) {
                        this.children.splice(ap--, 1);
                        am.parent = null
                    }
                    if ((an -= aq) == 0) {
                        break
                    }
                    ao = 0
                } else {
                    ao -= au
                }
            }
            if (this.size - an < 25) {
                var aw = [];
                this.collapse(aw);
                this.children = [new ah(aw)];
                this.children[0].parent = this
            }
        },
        collapse: function (am) {
            for (var an = 0, ao = this.children.length; an < ao; ++an) {
                this.children[an].collapse(am)
            }
        },
        insert: function (an, ao) {
            var am = 0;
            for (var ap = 0, aq = ao.length; ap < aq; ++ap) {
                am += ao[ap].height
            }
            this.insertHeight(an, ao, am)
        },
        insertHeight: function (an, aw, av) {
            this.size += aw.length;
            this.height += av;
            for (var ao = 0, aq = this.children.length; ao < aq; ++ao) {
                var am = this.children[ao]
                  , ar = am.chunkSize();
                if (an <= ar) {
                    am.insertHeight(an, aw, av);
                    if (am.lines && am.lines.length > 50) {
                        while (am.lines.length > 50) {
                            var ap = am.lines.splice(am.lines.length - 25, 25);
                            var au = new ah(ap);
                            am.height -= au.height;
                            this.children.splice(ao + 1, 0, au);
                            au.parent = this
                        }
                        this.maybeSpill()
                    }
                    break
                }
                an -= ar
            }
        },
        maybeSpill: function () {
            if (this.children.length <= 10) {
                return
            }
            var ap = this;
            do {
                var an = ap.children.splice(ap.children.length - 5, 5);
                var ao = new i(an);
                if (!ap.parent) {
                    var aq = new i(ap.children);
                    aq.parent = ap;
                    ap.children = [aq, ao];
                    ap = aq
                } else {
                    ap.size -= ao.size;
                    ap.height -= ao.height;
                    var am = q(ap.parent.children, ap);
                    ap.parent.children.splice(am + 1, 0, ao)
                }
                ao.parent = ap.parent
            } while (ap.children.length > 10); ap.parent.maybeSpill()
        },
        iter: function (ao, an, am) {
            this.iterN(ao, an - ao, am)
        },
        iterN: function (am, av, au) {
            for (var an = 0, aq = this.children.length; an < aq; ++an) {
                var ar = this.children[an]
                  , ap = ar.chunkSize();
                if (am < ap) {
                    var ao = Math.min(av, ap - am);
                    if (ar.iterN(am, ao, au)) {
                        return true
                    }
                    if ((av -= ao) == 0) {
                        break
                    }
                    am = 0
                } else {
                    am -= ap
                }
            }
        }
    };
    function C(am, aq) {
        while (!am.lines) {
            for (var an = 0; ; ++an) {
                var ap = am.children[an]
                  , ao = ap.chunkSize();
                if (aq < ao) {
                    am = ap;
                    break
                }
                aq -= ao
            }
        }
        return am.lines[aq]
    }
    function Y(am) {
        if (am.parent == null) {
            return null
        }
        var ar = am.parent
          , aq = q(ar.lines, am);
        for (var an = ar.parent; an; ar = an,
        an = an.parent) {
            for (var ao = 0, ap = an.children.length; ; ++ao) {
                if (an.children[ao] == ar) {
                    break
                }
                aq += an.children[ao].chunkSize()
            }
        }
        return aq
    }
    function X(at, aq) {
        var ao = 0;
        outer: do {
            for (var ap = 0, ar = at.children.length; ap < ar; ++ap) {
                var an = at.children[ap]
                  , am = an.height;
                if (aq < am) {
                    at = an;
                    continue outer
                }
                aq -= am;
                ao += an.chunkSize()
            }
            return ao
        } while (!at.lines); for (var ap = 0, ar = at.lines.length; ap < ar; ++ap) {
            var av = at.lines[ap]
              , au = av.height;
            if (aq < au) {
                break
            }
            aq -= au
        }
        return ao + ap
    }
    function g(am, at) {
        var ao = 0;
        outer: do {
            for (var an = 0, aq = am.children.length; an < aq; ++an) {
                var ar = am.children[an]
                  , ap = ar.chunkSize();
                if (at < ap) {
                    am = ar;
                    continue outer
                }
                at -= ap;
                ao += ar.height
            }
            return ao
        } while (!am.lines); for (var an = 0; an < at; ++an) {
            ao += am.lines[an].height
        }
        return ao
    }
    function k() {
        this.time = 0;
        this.done = [];
        this.undone = [];
        this.compound = 0;
        this.closed = false
    }
    k.prototype = {
        addChange: function (am, ar, an) {
            this.undone.length = 0;
            var ao = +new Date
              , au = this.done[this.done.length - 1]
              , av = au && au[au.length - 1];
            var aq = ao - this.time;
            if (this.compound && au && !this.closed) {
                au.push({
                    start: am,
                    added: ar,
                    old: an
                })
            } else {
                if (aq > 400 || !av || this.closed || av.start > am + an.length || av.start + av.added < am) {
                    this.done.push([{
                        start: am,
                        added: ar,
                        old: an
                    }]);
                    this.closed = false
                } else {
                    var at = Math.max(0, av.start - am)
                      , aw = Math.max(0, (am + an.length) - (av.start + av.added));
                    for (var ap = at; ap > 0; --ap) {
                        av.old.unshift(an[ap - 1])
                    }
                    for (var ap = aw; ap > 0; --ap) {
                        av.old.push(an[an.length - ap])
                    }
                    if (at) {
                        av.start = am
                    }
                    av.added += ar - (an.length - at - aw)
                }
            }
            this.time = ao
        },
        startCompound: function () {
            if (!this.compound++) {
                this.closed = true
            }
        },
        endCompound: function () {
            if (!--this.compound) {
                this.closed = true
            }
        }
    };
    function J() {
        w(this)
    }
    function O(am) {
        if (!am.stop) {
            am.stop = J
        }
        return am
    }
    function T(am) {
        if (am.preventDefault) {
            am.preventDefault()
        } else {
            am.returnValue = false
        }
    }
    function D(am) {
        if (am.stopPropagation) {
            am.stopPropagation()
        } else {
            am.cancelBubble = true
        }
    }
    function w(am) {
        T(am);
        D(am)
    }
    u.e_stop = w;
    u.e_preventDefault = T;
    u.e_stopPropagation = D;
    function j(am) {
        return am.target || am.srcElement
    }
    function x(am) {
        if (am.which) {
            return am.which
        } else {
            if (am.button & 1) {
                return 1
            } else {
                if (am.button & 2) {
                    return 3
                } else {
                    if (am.button & 4) {
                        return 2
                    }
                }
            }
        }
    }
    function y(an, ao) {
        var am = an.override && an.override.hasOwnProperty(ao);
        return am ? an.override[ao] : an[ao]
    }
    function r(ap, ao, an, am) {
        if (typeof ap.addEventListener == "function") {
            ap.addEventListener(ao, an, false);
            if (am) {
                return function () {
                    ap.removeEventListener(ao, an, false)
                }
            }
        } else {
            var aq = function (ar) {
                an(ar || window.event)
            };
            ap.attachEvent("on" + ao, aq);
            if (am) {
                return function () {
                    ap.detachEvent("on" + ao, aq)
                }
            }
        }
    }
    u.connect = r;
    function z() {
        this.id = null
    }
    z.prototype = {
        set: function (am, an) {
            clearTimeout(this.id);
            this.id = setTimeout(an, am)
        }
    };
    var ab = u.Pass = {
        toString: function () {
            return "CodeMirror.Pass"
        }
    };
    var N = /gecko\/\d{7}/i.test(navigator.userAgent);
    var I = /MSIE \d/.test(navigator.userAgent);
    var B = /MSIE [1-8]\b/.test(navigator.userAgent);
    var E = I && document.documentMode == 5;
    var f = /WebKit\//.test(navigator.userAgent);
    var af = /Chrome\//.test(navigator.userAgent);
    var h = /Apple Computer/.test(navigator.vendor);
    var m = /KHTML\//.test(navigator.userAgent);
    var F = function () {
        if (B) {
            return false
        }
        var am = document.createElement("div");
        return "draggable" in am || "dragDrop" in am
    }();
    var d = function () {
        var am = document.createElement("textarea");
        am.value = "foo\nbar";
        if (am.value.indexOf("\r") > -1) {
            return "\r\n"
        }
        return "\n"
    }();
    var o = /^$/;
    if (N) {
        o = /$'/
    } else {
        if (h) {
            o = /\-[^ \-?]|\?[^ !'\"\),.\-\/:;\?\]\}]/
        } else {
            if (af) {
                o = /\-[^ \-\.?]|\?[^ \-\.?\]\}:;!'\"\),\/]|[\.!\"#&%\)*+,:;=>\]|\}~][\(\{\[<]|\$'/
            }
        }
    }
    function n(an, am, ap) {
        if (am == null) {
            am = an.search(/[^\s\u00a0]/);
            if (am == -1) {
                am = an.length
            }
        }
        for (var ao = 0, aq = 0; ao < am; ++ao) {
            if (an.charAt(ao) == "\t") {
                aq += ap - (aq % ap)
            } else {
                ++aq
            }
        }
        return aq
    }
    function t(am) {
        if (am.currentStyle) {
            return am.currentStyle
        }
        return window.getComputedStyle(am, null)
    }
    function ak(an, aw) {
        var ap = an.ownerDocument.body;
        var av = 0
          , au = 0
          , ar = false;
        for (var am = an; am; am = am.offsetParent) {
            var at = am.offsetLeft
              , ao = am.offsetTop;
            if (am == ap) {
                av += Math.abs(at);
                au += Math.abs(ao)
            } else {
                av += at,
                au += ao
            }
            if (aw && t(am).position == "fixed") {
                ar = true
            }
        }
        var aq = aw && !ar ? null : ap;
        for (var am = an.parentNode; am != aq; am = am.parentNode) {
            if (am.scrollLeft != null) {
                av -= am.scrollLeft;
                au -= am.scrollTop
            }
        }
        return {
            left: av,
            top: au
        }
    }
    if (document.documentElement.getBoundingClientRect != null) {
        ak = function (ap, am) {
            try {
                var ao = ap.getBoundingClientRect();
                ao = {
                    top: ao.top,
                    left: ao.left
                }
            } catch (aq) {
                ao = {
                    top: 0,
                    left: 0
                }
            }
            if (!am) {
                if (window.pageYOffset == null) {
                    var an = document.documentElement || document.body.parentNode;
                    if (an.scrollTop == null) {
                        an = document.body
                    }
                    ao.top += an.scrollTop;
                    ao.left += an.scrollLeft
                } else {
                    ao.top += window.pageYOffset;
                    ao.left += window.pageXOffset
                }
            }
            return ao
        }
    }
    function H(am) {
        return am.textContent || am.innerText || am.nodeValue || ""
    }
    function a(am) {
        if (s) {
            am.selectionStart = 0;
            am.selectionEnd = am.value.length
        } else {
            am.select()
        }
    }
    function ad(an, am) {
        return an.line == am.line && an.ch == am.ch
    }
    function Z(an, am) {
        return an.line < am.line || (an.line == am.line && an.ch < am.ch)
    }
    function aa(am) {
        return {
            line: am.line,
            ch: am.ch
        }
    }
    var ai = document.createElement("pre");
    function P(am) {
        ai.textContent = am;
        return ai.innerHTML
    }
    if (P("a") == "\na") {
        P = function (am) {
            ai.textContent = am;
            return ai.innerHTML.slice(1)
        }
    } else {
        if (P("\t") != "\t") {
            P = function (am) {
                ai.innerHTML = "";
                ai.appendChild(document.createTextNode(am));
                return ai.innerHTML
            }
        }
    }
    u.htmlEscape = P;
    function W(ap, ao) {
        if (!ao) {
            return 0
        }
        if (!ap) {
            return ao.length
        }
        for (var an = ap.length, am = ao.length; an >= 0 && am >= 0; --an,
        --am) {
            if (ap.charAt(an) != ao.charAt(am)) {
                break
            }
        }
        return am + 1
    }
    function q(ap, am) {
        if (ap.indexOf) {
            return ap.indexOf(am)
        }
        for (var an = 0, ao = ap.length; an < ao; ++an) {
            if (ap[an] == am) {
                return an
            }
        }
        return -1
    }
    function ag(am) {
        return /\w/.test(am) || am.toUpperCase() != am.toLowerCase()
    }
    var A = "\n\nb".split(/\n/).length != 3 ? function (ao) {
        var ap = 0, an, am = [];
        while ((an = ao.indexOf("\n", ap)) > -1) {
            am.push(ao.slice(ap, ao.charAt(an - 1) == "\r" ? an - 1 : an));
            ap = an + 1
        }
        am.push(ao.slice(ap));
        return am
    }
    : function (am) {
        return am.split(/\r?\n/)
    }
    ;
    u.splitLines = A;
    var ae = window.getSelection ? function (an) {
        try {
            return an.selectionStart != an.selectionEnd
        } catch (am) {
            return false
        }
    }
    : function (ao) {
        try {
            var am = ao.ownerDocument.selection.createRange()
        } catch (an) { }
        if (!am || am.parentElement() != ao) {
            return false
        }
        return am.compareEndPoints("StartToEnd", am) != 0
    }
    ;
    u.defineMode("null", function () {
        return {
            token: function (am) {
                am.skipToEnd()
            }
        }
    });
    u.defineMIME("text/plain", "null");
    var R = {
        3: "Enter",
        8: "Backspace",
        9: "Tab",
        13: "Enter",
        16: "Shift",
        17: "Ctrl",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Esc",
        32: "Space",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
        44: "PrintScrn",
        45: "Insert",
        46: "Delete",
        59: ";",
        91: "Mod",
        92: "Mod",
        93: "Mod",
        127: "Delete",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'",
        63276: "PageUp",
        63277: "PageDown",
        63275: "End",
        63273: "Home",
        63234: "Left",
        63232: "Up",
        63235: "Right",
        63233: "Down",
        63302: "Insert",
        63272: "Delete"
    };
    u.keyNames = R;
    (function () {
        for (var am = 0; am < 10; am++) {
            R[am + 48] = String(am)
        }
        for (var am = 65; am <= 90; am++) {
            R[am] = String.fromCharCode(am)
        }
        for (var am = 1; am <= 12; am++) {
            R[am + 111] = R[am + 63235] = "F" + am
        }
    })();
    return u
})();
CodeMirror.defineMode("javascript", function (I, M) {
    var v = I.indentUnit;
    var Q = M.json;
    var b = function () {
        function W(Z) {
            return {
                type: Z,
                style: "keyword"
            }
        }
        var T = W("keyword a")
          , Y = W("keyword b")
          , X = W("keyword c");
        var U = W("operator")
          , V = {
              type: "atom",
              style: "atom"
          };
        return {
            "if": T,
            "while": T,
            "with": T,
            "else": Y,
            "do": Y,
            "try": Y,
            "finally": Y,
            "return": X,
            "break": X,
            "continue": X,
            "new": X,
            "delete": X,
            "throw": X,
            "var": W("var"),
            "const": W("var"),
            let: W("var"),
            "function": W("function"),
            "catch": W("catch"),
            "for": W("for"),
            "switch": W("switch"),
            "case": W("case"),
            "default": W("default"),
            "in": U,
            "typeof": U,
            "instanceof": U,
            "true": V,
            "false": V,
            "null": V,
            "undefined": V,
            "NaN": V,
            "Infinity": V
        }
    }();
    var N = /[+\-*&%=<>!?|]/;
    function R(V, U, T) {
        U.tokenize = T;
        return T(V, U)
    }
    function h(W, T) {
        var V = false, U;
        while ((U = W.next()) != null) {
            if (U == T && !V) {
                return false
            }
            V = !V && U == "\\"
        }
        return V
    }
    var S, p;
    function B(V, U, T) {
        S = V;
        p = T;
        return U
    }
    function l(X, V) {
        var T = X.next();
        if (T == '"' || T == "'") {
            return R(X, V, z(T))
        } else {
            if (/[\[\]{}\(\),;\:\.]/.test(T)) {
                return B(T)
            } else {
                if (T == "0" && X.eat(/x/i)) {
                    X.eatWhile(/[\da-f]/i);
                    return B("number", "number")
                } else {
                    if (/\d/.test(T)) {
                        X.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
                        return B("number", "number")
                    } else {
                        if (T == "/") {
                            if (X.eat("*")) {
                                return R(X, V, f)
                            } else {
                                if (X.eat("/")) {
                                    X.skipToEnd();
                                    return B("comment", "comment")
                                } else {
                                    if (V.reAllowed) {
                                        h(X, "/");
                                        X.eatWhile(/[gimy]/);
                                        return B("regexp", "string-2")
                                    } else {
                                        X.eatWhile(N);
                                        return B("operator", null, X.current())
                                    }
                                }
                            }
                        } else {
                            if (T == "#") {
                                X.skipToEnd();
                                return B("error", "error")
                            } else {
                                if (N.test(T)) {
                                    X.eatWhile(N);
                                    return B("operator", null, X.current())
                                } else {
                                    X.eatWhile(/[\w\$_]/);
                                    var W = X.current()
                                      , U = b.propertyIsEnumerable(W) && b[W];
                                    return (U && V.kwAllowed) ? B(U.type, U.style, W) : B("variable", "variable", W)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    function z(T) {
        return function (V, U) {
            if (!h(V, T)) {
                U.tokenize = l
            }
            return B("string", "string")
        }
    }
    function f(W, V) {
        var T = false, U;
        while (U = W.next()) {
            if (U == "/" && T) {
                V.tokenize = l;
                break
            }
            T = (U == "*")
        }
        return B("comment", "comment")
    }
    var k = {
        atom: true,
        number: true,
        variable: true,
        string: true,
        regexp: true
    };
    function t(Y, U, T, X, V, W) {
        this.indented = Y;
        this.column = U;
        this.type = T;
        this.prev = V;
        this.info = W;
        if (X != null) {
            this.align = X
        }
    }
    function w(V, U) {
        for (var T = V.localVars; T; T = T.next) {
            if (T.name == U) {
                return true
            }
        }
    }
    function E(X, U, T, W, Y) {
        var Z = X.cc;
        u.state = X;
        u.stream = Y;
        u.marked = null,
        u.cc = Z;
        if (!X.lexical.hasOwnProperty("align")) {
            X.lexical.align = true
        }
        while (true) {
            var V = Z.length ? Z.pop() : Q ? x : y;
            if (V(T, W)) {
                while (Z.length && Z[Z.length - 1].lex) {
                    Z.pop()()
                }
                if (u.marked) {
                    return u.marked
                }
                if (T == "variable" && w(X, W)) {
                    return "variable-2"
                }
                return U
            }
        }
    }
    var u = {
        state: null,
        column: null,
        marked: null,
        cc: null
    };
    function a() {
        for (var T = arguments.length - 1; T >= 0; T--) {
            u.cc.push(arguments[T])
        }
    }
    function G() {
        a.apply(null, arguments);
        return true
    }
    function m(U) {
        var V = u.state;
        if (V.context) {
            u.marked = "def";
            for (var T = V.localVars; T; T = T.next) {
                if (T.name == U) {
                    return
                }
            }
            V.localVars = {
                name: U,
                next: V.localVars
            }
        }
    }
    var D = {
        name: "this",
        next: {
            name: "arguments"
        }
    };
    function s() {
        if (!u.state.context) {
            u.state.localVars = D
        }
        u.state.context = {
            prev: u.state.context,
            vars: u.state.localVars
        }
    }
    function r() {
        u.state.localVars = u.state.context.vars;
        u.state.context = u.state.context.prev
    }
    function j(U, V) {
        var T = function () {
            var W = u.state;
            W.lexical = new t(W.indented, u.stream.column(), U, null, W.lexical, V)
        };
        T.lex = true;
        return T
    }
    function F() {
        var T = u.state;
        if (T.lexical.prev) {
            if (T.lexical.type == ")") {
                T.indented = T.lexical.indented
            }
            T.lexical = T.lexical.prev
        }
    }
    F.lex = true;
    function c(U) {
        return function T(V) {
            if (V == U) {
                return G()
            } else {
                if (U == ";") {
                    return a()
                } else {
                    return G(arguments.callee)
                }
            }
        }
    }
    function y(T) {
        if (T == "var") {
            return G(j("vardef"), J, c(";"), F)
        }
        if (T == "keyword a") {
            return G(j("form"), x, y, F)
        }
        if (T == "keyword b") {
            return G(j("form"), y, F)
        }
        if (T == "{") {
            return G(j("}"), n, F)
        }
        if (T == ";") {
            return G()
        }
        if (T == "function") {
            return G(i)
        }
        if (T == "for") {
            return G(j("form"), c("("), j(")"), g, c(")"), F, y, F)
        }
        if (T == "variable") {
            return G(j("stat"), C)
        }
        if (T == "switch") {
            return G(j("form"), x, j("}", "switch"), c("{"), n, F, F)
        }
        if (T == "case") {
            return G(x, c(":"))
        }
        if (T == "default") {
            return G(c(":"))
        }
        if (T == "catch") {
            return G(j("form"), s, c("("), q, c(")"), y, F, r)
        }
        return a(j("stat"), x, c(";"), F)
    }
    function x(T) {
        if (k.hasOwnProperty(T)) {
            return G(L)
        }
        if (T == "function") {
            return G(i)
        }
        if (T == "keyword c") {
            return G(A)
        }
        if (T == "(") {
            return G(j(")"), A, c(")"), F, L)
        }
        if (T == "operator") {
            return G(x)
        }
        if (T == "[") {
            return G(j("]"), O(x, "]"), F, L)
        }
        if (T == "{") {
            return G(j("}"), O(o, "}"), F, L)
        }
        return G()
    }
    function A(T) {
        if (T.match(/[;\}\)\],]/)) {
            return a()
        }
        return a(x)
    }
    function L(T, U) {
        if (T == "operator" && /\+\+|--/.test(U)) {
            return G(L)
        }
        if (T == "operator" || T == ":") {
            return G(x)
        }
        if (T == ";") {
            return
        }
        if (T == "(") {
            return G(j(")"), O(x, ")"), F, L)
        }
        if (T == ".") {
            return G(P, L)
        }
        if (T == "[") {
            return G(j("]"), x, c("]"), F, L)
        }
    }
    function C(T) {
        if (T == ":") {
            return G(F, y)
        }
        return a(L, c(";"), F)
    }
    function P(T) {
        if (T == "variable") {
            u.marked = "property";
            return G()
        }
    }
    function o(T) {
        if (T == "variable") {
            u.marked = "property"
        }
        if (k.hasOwnProperty(T)) {
            return G(c(":"), x)
        }
    }
    function O(V, T) {
        function U(X) {
            if (X == ",") {
                return G(V, U)
            }
            if (X == T) {
                return G()
            }
            return G(c(T))
        }
        return function W(X) {
            if (X == T) {
                return G()
            } else {
                return a(V, U)
            }
        }
    }
    function n(T) {
        if (T == "}") {
            return G()
        }
        return a(y, n)
    }
    function J(T, U) {
        if (T == "variable") {
            m(U);
            return G(H)
        }
        return G()
    }
    function H(T, U) {
        if (U == "=") {
            return G(x, H)
        }
        if (T == ",") {
            return G(J)
        }
    }
    function g(T) {
        if (T == "var") {
            return G(J, e)
        }
        if (T == ";") {
            return a(e)
        }
        if (T == "variable") {
            return G(K)
        }
        return a(e)
    }
    function K(T, U) {
        if (U == "in") {
            return G(x)
        }
        return G(L, e)
    }
    function e(T, U) {
        if (T == ";") {
            return G(d)
        }
        if (U == "in") {
            return G(x)
        }
        return G(x, c(";"), d)
    }
    function d(T) {
        if (T != ")") {
            G(x)
        }
    }
    function i(T, U) {
        if (T == "variable") {
            m(U);
            return G(i)
        }
        if (T == "(") {
            return G(j(")"), s, O(q, ")"), F, y, r)
        }
    }
    function q(T, U) {
        if (T == "variable") {
            m(U);
            return G()
        }
    }
    return {
        startState: function (T) {
            return {
                tokenize: l,
                reAllowed: true,
                kwAllowed: true,
                cc: [],
                lexical: new t((T || 0) - v, 0, "block", false),
                localVars: M.localVars,
                context: M.localVars && {
                    vars: M.localVars
                },
                indented: 0
            }
        },
        token: function (V, U) {
            if (V.sol()) {
                if (!U.lexical.hasOwnProperty("align")) {
                    U.lexical.align = false
                }
                U.indented = V.indentation()
            }
            if (V.eatSpace()) {
                return null
            }
            var T = U.tokenize(V, U);
            if (S == "comment") {
                return T
            }
            U.reAllowed = !!(S == "operator" || S == "keyword c" || S.match(/^[\[{}\(,;:]$/));
            U.kwAllowed = S != ".";
            return E(U, T, S, p, V)
        },
        indent: function (Y, T) {
            if (Y.tokenize != l) {
                return 0
            }
            var X = T && T.charAt(0)
              , V = Y.lexical;
            if (V.type == "stat" && X == "}") {
                V = V.prev
            }
            var W = V.type
              , U = X == W;
            if (W == "vardef") {
                return V.indented + 4
            } else {
                if (W == "form" && X == "{") {
                    return V.indented
                } else {
                    if (W == "stat" || W == "form") {
                        return V.indented + v
                    } else {
                        if (V.info == "switch" && !U) {
                            return V.indented + (/^(?:case|default)\b/.test(T) ? v : 2 * v)
                        } else {
                            if (V.align) {
                                return V.column + (U ? 0 : 1)
                            } else {
                                return V.indented + (U ? 0 : v)
                            }
                        }
                    }
                }
            }
        },
        electricChars: ":{}"
    }
});
CodeMirror.defineMIME("text/javascript", "javascript");
CodeMirror.defineMIME("application/json", {
    name: "javascript",
    json: true
});
CodeMirror.defineMode("xml", function (y, k) {
    var r = y.indentUnit;
    var x = k.htmlMode ? {
        autoSelfClosers: {
            area: true,
            base: true,
            br: true,
            col: true,
            command: true,
            embed: true,
            frame: true,
            hr: true,
            img: true,
            input: true,
            keygen: true,
            link: true,
            meta: true,
            param: true,
            source: true,
            track: true,
            wbr: true
        },
        implicitlyClosed: {
            dd: true,
            li: true,
            optgroup: true,
            option: true,
            p: true,
            rp: true,
            rt: true,
            tbody: true,
            td: true,
            tfoot: true,
            th: true,
            tr: true
        },
        contextGrabbers: {
            dd: {
                dd: true,
                dt: true
            },
            dt: {
                dd: true,
                dt: true
            },
            li: {
                li: true
            },
            option: {
                option: true,
                optgroup: true
            },
            optgroup: {
                optgroup: true
            },
            p: {
                address: true,
                article: true,
                aside: true,
                blockquote: true,
                dir: true,
                div: true,
                dl: true,
                fieldset: true,
                footer: true,
                form: true,
                h1: true,
                h2: true,
                h3: true,
                h4: true,
                h5: true,
                h6: true,
                header: true,
                hgroup: true,
                hr: true,
                menu: true,
                nav: true,
                ol: true,
                p: true,
                pre: true,
                section: true,
                table: true,
                ul: true
            },
            rp: {
                rp: true,
                rt: true
            },
            rt: {
                rp: true,
                rt: true
            },
            tbody: {
                tbody: true,
                tfoot: true
            },
            td: {
                td: true,
                th: true
            },
            tfoot: {
                tbody: true
            },
            th: {
                td: true,
                th: true
            },
            thead: {
                tbody: true,
                tfoot: true
            },
            tr: {
                tr: true
            }
        },
        doNotIndent: {
            pre: true
        },
        allowUnquoted: true,
        allowMissing: false
    } : {
        autoSelfClosers: {},
        implicitlyClosed: {},
        contextGrabbers: {},
        doNotIndent: {},
        allowUnquoted: false,
        allowMissing: false
    };
    var a = k.alignCDATA;
    var f, g;
    function o(E, D) {
        function B(G) {
            D.tokenize = G;
            return G(E, D)
        }
        var C = E.next();
        if (C == "<") {
            if (E.eat("!")) {
                if (E.eat("[")) {
                    if (E.match("CDATA[")) {
                        return B(w("atom", "]]>"))
                    } else {
                        return null
                    }
                } else {
                    if (E.match("--")) {
                        return B(w("comment", "-->"))
                    } else {
                        if (E.match("DOCTYPE", true, true)) {
                            E.eatWhile(/[\w\._\-]/);
                            return B(z(1))
                        } else {
                            return null
                        }
                    }
                }
            } else {
                if (E.eat("?")) {
                    E.eatWhile(/[\w\._\-]/);
                    D.tokenize = w("meta", "?>");
                    return "meta"
                } else {
                    g = E.eat("/") ? "closeTag" : "openTag";
                    E.eatSpace();
                    f = "";
                    var F;
                    while ((F = E.eat(/[^\s\u00a0=<>\"\'\/?]/))) {
                        f += F
                    }
                    D.tokenize = n;
                    return "tag"
                }
            }
        } else {
            if (C == "&") {
                var A;
                if (E.eat("#")) {
                    if (E.eat("x")) {
                        A = E.eatWhile(/[a-fA-F\d]/) && E.eat(";")
                    } else {
                        A = E.eatWhile(/[\d]/) && E.eat(";")
                    }
                } else {
                    A = E.eatWhile(/[\w\.\-:]/) && E.eat(";")
                }
                return A ? "atom" : "error"
            } else {
                E.eatWhile(/[^&<]/);
                return null
            }
        }
    }
    function n(C, B) {
        var A = C.next();
        if (A == ">" || (A == "/" && C.eat(">"))) {
            B.tokenize = o;
            g = A == ">" ? "endTag" : "selfcloseTag";
            return "tag"
        } else {
            if (A == "=") {
                g = "equals";
                return null
            } else {
                if (/[\'\"]/.test(A)) {
                    B.tokenize = j(A);
                    return B.tokenize(C, B)
                } else {
                    C.eatWhile(/[^\s\u00a0=<>\"\'\/?]/);
                    return "word"
                }
            }
        }
    }
    function j(A) {
        return function (C, B) {
            while (!C.eol()) {
                if (C.next() == A) {
                    B.tokenize = n;
                    break
                }
            }
            return "string"
        }
    }
    function w(B, A) {
        return function (D, C) {
            while (!D.eol()) {
                if (D.match(A)) {
                    C.tokenize = o;
                    break
                }
                D.next()
            }
            return B
        }
    }
    function z(A) {
        return function (D, C) {
            var B;
            while ((B = D.next()) != null) {
                if (B == "<") {
                    C.tokenize = z(A + 1);
                    return C.tokenize(D, C)
                } else {
                    if (B == ">") {
                        if (A == 1) {
                            C.tokenize = o;
                            break
                        } else {
                            C.tokenize = z(A - 1);
                            return C.tokenize(D, C)
                        }
                    }
                }
            }
            return "meta"
        }
    }
    var l, h;
    function b() {
        for (var A = arguments.length - 1; A >= 0; A--) {
            l.cc.push(arguments[A])
        }
    }
    function e() {
        b.apply(null, arguments);
        return true
    }
    function i(A, C) {
        var B = x.doNotIndent.hasOwnProperty(A) || (l.context && l.context.noIndent);
        l.context = {
            prev: l.context,
            tagName: A,
            indent: l.indented,
            startOfLine: C,
            noIndent: B
        }
    }
    function u() {
        if (l.context) {
            l.context = l.context.prev
        }
    }
    function d(A) {
        if (A == "openTag") {
            l.tagName = f;
            return e(m, c(l.startOfLine))
        } else {
            if (A == "closeTag") {
                var B = false;
                if (l.context) {
                    if (l.context.tagName != f) {
                        if (x.implicitlyClosed.hasOwnProperty(l.context.tagName.toLowerCase())) {
                            u()
                        }
                        B = !l.context || l.context.tagName != f
                    }
                } else {
                    B = true
                }
                if (B) {
                    h = "error"
                }
                return e(s(B))
            }
        }
        return e()
    }
    function c(A) {
        return function (B) {
            if (B == "selfcloseTag" || (B == "endTag" && x.autoSelfClosers.hasOwnProperty(l.tagName.toLowerCase()))) {
                q(l.tagName.toLowerCase());
                return e()
            }
            if (B == "endTag") {
                q(l.tagName.toLowerCase());
                i(l.tagName, A);
                return e()
            }
            return e()
        }
    }
    function s(A) {
        return function (B) {
            if (A) {
                h = "error"
            }
            if (B == "endTag") {
                u();
                return e()
            }
            h = "error";
            return e(arguments.callee)
        }
    }
    function q(B) {
        var A;
        while (true) {
            if (!l.context) {
                return
            }
            A = l.context.tagName.toLowerCase();
            if (!x.contextGrabbers.hasOwnProperty(A) || !x.contextGrabbers[A].hasOwnProperty(B)) {
                return
            }
            u()
        }
    }
    function m(A) {
        if (A == "word") {
            h = "attribute";
            return e(p, m)
        }
        if (A == "endTag" || A == "selfcloseTag") {
            return b()
        }
        h = "error";
        return e(m)
    }
    function p(A) {
        if (A == "equals") {
            return e(v, m)
        }
        if (!x.allowMissing) {
            h = "error"
        }
        return (A == "endTag" || A == "selfcloseTag") ? b() : e()
    }
    function v(A) {
        if (A == "string") {
            return e(t)
        }
        if (A == "word" && x.allowUnquoted) {
            h = "string";
            return e()
        }
        h = "error";
        return (A == "endTag" || A == "selfCloseTag") ? b() : e()
    }
    function t(A) {
        if (A == "string") {
            return e(t)
        } else {
            return b()
        }
    }
    return {
        startState: function () {
            return {
                tokenize: o,
                cc: [],
                indented: 0,
                startOfLine: true,
                tagName: null,
                context: null
            }
        },
        token: function (D, C) {
            if (D.sol()) {
                C.startOfLine = true;
                C.indented = D.indentation()
            }
            if (D.eatSpace()) {
                return null
            }
            h = g = f = null;
            var B = C.tokenize(D, C);
            C.type = g;
            if ((B || g) && B != "comment") {
                l = C;
                while (true) {
                    var A = C.cc.pop() || d;
                    if (A(g || B)) {
                        break
                    }
                }
            }
            C.startOfLine = false;
            return h || B
        },
        indent: function (D, A, C) {
            var B = D.context;
            if ((D.tokenize != n && D.tokenize != o) || B && B.noIndent) {
                return C ? C.match(/^(\s*)/)[0].length : 0
            }
            if (a && /<!\[CDATA\[/.test(A)) {
                return 0
            }
            if (B && /^<\//.test(A)) {
                B = B.prev
            }
            while (B && !B.startOfLine) {
                B = B.prev
            }
            if (B) {
                return B.indent + r
            } else {
                return 0
            }
        },
        compareStates: function (D, B) {
            if (D.indented != B.indented || D.tokenize != B.tokenize) {
                return false
            }
            for (var C = D.context, A = B.context; ; C = C.prev,
            A = A.prev) {
                if (!C || !A) {
                    return C == A
                }
                if (C.tagName != A.tagName) {
                    return false
                }
            }
        },
        electricChars: "/"
    }
});
CodeMirror.defineMIME("application/xml", "xml");
if (!CodeMirror.mimeModes.hasOwnProperty("text/html")) {
    CodeMirror.defineMIME("text/html", {
        name: "xml",
        htmlMode: true
    })
}
CodeMirror.defineMode("markdown", function (B, m) {
    var i = CodeMirror.getMode(B, {
        name: "xml",
        htmlMode: true
    });
    var y = "header"
      , d = "comment"
      , A = "quote"
      , z = "string"
      , E = "hr"
      , s = "link"
      , D = "string"
      , g = "em"
      , j = "strong"
      , w = "emstrong";
    var F = /^([*\-=_])(?:\s*\1){2,}\s*$/
      , p = /^[*\-+]\s+/
      , u = /^[0-9]+\.\s+/
      , n = /^(?:\={3,}|-{3,})$/
      , f = /^[^\[*_\\<>`]+/;
    function e(I, H, G) {
        H.f = H.inline = G;
        return G(I, H)
    }
    function r(I, H, G) {
        H.f = H.block = G;
        return G(I, H)
    }
    function o(G) {
        G.em = false;
        G.strong = false;
        return null
    }
    function l(I, H) {
        var G;
        if (H.indentationDiff >= 4) {
            H.indentation -= H.indentationDiff;
            I.skipToEnd();
            return d
        } else {
            if (I.eatSpace()) {
                return null
            } else {
                if (I.peek() === "#" || I.match(n)) {
                    H.header = true
                } else {
                    if (I.eat(">")) {
                        H.indentation++;
                        H.quote = true
                    } else {
                        if (I.peek() === "[") {
                            return e(I, H, k)
                        } else {
                            if (I.match(F, true)) {
                                return E
                            } else {
                                if (G = I.match(p, true) || I.match(u, true)) {
                                    H.indentation += G[0].length;
                                    return z
                                }
                            }
                        }
                    }
                }
            }
        }
        return e(I, H, H.inline)
    }
    function x(I, H) {
        var G = i.token(I, H.htmlState);
        if (G === "tag" && H.htmlState.type !== "openTag" && !H.htmlState.context) {
            H.f = q;
            H.block = l
        }
        return G
    }
    function t(H) {
        var G = [];
        if (H.strong) {
            G.push(H.em ? w : j)
        } else {
            if (H.em) {
                G.push(g)
            }
        }
        if (H.header) {
            G.push(y)
        }
        if (H.quote) {
            G.push(A)
        }
        return G.length ? G.join(" ") : null
    }
    function b(H, G) {
        if (H.match(f, true)) {
            return t(G)
        }
        return undefined
    }
    function q(K, J) {
        var I = J.text(K, J);
        if (typeof I !== "undefined") {
            return I
        }
        var H = K.next();
        if (H === "\\") {
            K.next();
            return t(J)
        }
        if (H === "`") {
            return e(K, J, v(d, "`"))
        }
        if (H === "[") {
            return e(K, J, C)
        }
        if (H === "<" && K.match(/^\w/, false)) {
            K.backUp(1);
            return r(K, J, x)
        }
        var G = t(J);
        if (H === "*" || H === "_") {
            if (K.eat(H)) {
                return (J.strong = !J.strong) ? t(J) : G
            }
            return (J.em = !J.em) ? t(J) : G
        }
        return t(J)
    }
    function C(I, H) {
        while (!I.eol()) {
            var G = I.next();
            if (G === "\\") {
                I.next()
            }
            if (G === "]") {
                H.inline = H.f = h;
                return s
            }
        }
        return s
    }
    function h(I, H) {
        I.eatSpace();
        var G = I.next();
        if (G === "(" || G === "[") {
            return e(I, H, v(D, G === "(" ? ")" : "]"))
        }
        return "error"
    }
    function k(H, G) {
        if (H.match(/^[^\]]*\]:/, true)) {
            G.f = a;
            return s
        }
        return e(H, G, q)
    }
    function a(H, G) {
        H.eatSpace();
        H.match(/^[^\s]+/, true);
        G.f = G.inline = q;
        return D
    }
    function c(G) {
        if (!c[G]) {
            c[G] = new RegExp("^(?:[^\\\\\\" + G + "]|\\\\.)*(?:\\" + G + "|$)")
        }
        return c[G]
    }
    function v(H, I, G) {
        G = G || q;
        return function (K, J) {
            K.match(c(I));
            J.inline = J.f = G;
            return H
        }
    }
    return {
        startState: function () {
            return {
                f: l,
                block: l,
                htmlState: i.startState(),
                indentation: 0,
                inline: q,
                text: b,
                em: false,
                strong: false,
                header: false,
                quote: false
            }
        },
        copyState: function (G) {
            return {
                f: G.f,
                block: G.block,
                htmlState: CodeMirror.copyState(i, G.htmlState),
                indentation: G.indentation,
                inline: G.inline,
                text: G.text,
                em: G.em,
                strong: G.strong,
                header: G.header,
                quote: G.quote
            }
        },
        token: function (I, H) {
            if (I.sol()) {
                if (I.match(/^\s*$/, true)) {
                    return o(H)
                }
                H.header = false;
                H.quote = false;
                H.f = H.block;
                var G = I.match(/^\s*/, true)[0].replace(/\t/g, "    ").length;
                H.indentationDiff = G - H.indentation;
                H.indentation = G;
                if (G > 0) {
                    return null
                }
            }
            return H.f(I, H)
        },
        blankLine: o,
        getType: t
    }
}, "xml");

CodeMirror.defineMIME("text/x-markdown", "markdown");
