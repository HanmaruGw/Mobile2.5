
Ext.define("Docs.History", {
    singleton: true,
    init: function () {
        Ext.util.History.useTopWindow = false;
        Ext.util.History.init(function () {
            this.historyLoaded = true;
            this.initialNavigate()
        }, this);
        Ext.util.History.on("change", function (b) {
            this.navigate(b, true)
        }, this)
    },
    notifyTabsLoaded: function () {
        this.tabsLoaded = true;
        this.initialNavigate()
    },
    initialNavigate: function () {
        if (this.tabsLoaded && this.historyLoaded) {
            this.navigate(Ext.util.History.getToken(), true)
        }
    },
    navigate: function (e, g) {
        var f = this.parseToken(e);
        if (f.url == "#!/javascriptapi") {
            Docs.App.getController("Classes").loadIndex(g)
        } else {
            if (f.type === "javascriptapi") {
                Docs.App.getController("Classes").loadClass(f.url, g)
            } else {
                if (f.url === "#!/guide") {
                    Docs.App.getController("Guides").loadIndex(g)
                } else {
                    if (f.type === "guide") {
                        Docs.App.getController("Guides").loadGuide(f.url, g)
                    } else {
                        if (f.url === "#!/video") {
                            Docs.App.getController("Videos").loadIndex(g)
                        } else {
                            if (f.type === "video") {
                                Docs.App.getController("Videos").loadVideo(f.url, g)
                            } else {
                                if (f.url === "#!/example") {
                                    Docs.App.getController("Examples").loadIndex()
                                } else {
                                    if (f.type === "example") {
                                        Docs.App.getController("Examples").loadExample(f.url, g)
                                    } else {
                                        if (f.url === "#!/comment") {
                                            Docs.App.getController("Comments").loadIndex()
                                        } else {
                                            if (f.url === "#!/tests") {
                                                Docs.App.getController("Tests").loadIndex()
                                            } else {
                                                if (Docs.App.getController("Welcome").isActive()) {
                                                    Docs.App.getController("Welcome").loadIndex(g)
                                                } else {
                                                    if (!this.noRepeatNav) {
                                                        this.noRepeatNav = true;
                                                        var h = Ext.getCmp("doctabs").staticTabs[0];
                                                        if (h) {
                                                            this.navigate(h.href, g)
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    parseToken: function (d) {
        var c = d && d.match(/!?(\/(javascriptapi|guide|example|video|comment|tests)(\/(.*))?)/);
        return c ? {
            type: c[2],
            url: "#!" + c[1]
        } : {}
    },
    push: function (e, f) {
        e = this.cleanUrl(e);
        if (!/^#!?/.test(e)) {
            e = "#!" + e
        }
        var d = Ext.util.History.getToken() || "";
        if ("#" + d.replace(/^%21/, "!") !== e) {
            Ext.util.History.add(e)
        }
    },
    cleanUrl: function (b) {
        return b.replace(/^[^#]*#/, "#")
    }
});
Ext.define("Docs.Auth", {
    singleton: true,
    requires: ["Ext.Ajax", "Ext.util.Cookies"],
    init: function (c, d) {
        Ext.Ajax.request({
            url: Docs.data.commentsUrl + "/session",
            params: {
                sid: this.getSid()
            },
            method: "GET",
            cors: true,
            callback: function (g, a, h) {
                if (h && h.responseText) {
                    var b = Ext.JSON.decode(h.responseText);
                    if (b && b.sessionID) {
                        this.setSid(b.sessionID)
                    }
                    if (b && b.userName) {
                        this.currentUser = b
                    }
                    c.call(d, true)
                } else {
                    c.call(d, false)
                }
            },
            scope: this
        })
    },
    login: function (b) {
        Ext.Ajax.request({
            url: Docs.data.commentsUrl + "/login",
            method: "POST",
            cors: true,
            params: {
                username: b.username,
                password: b.password
            },
            callback: function (h, f, a) {
                var g = Ext.JSON.decode(a.responseText);
                if (g.success) {
                    this.currentUser = g;
                    this.setSid(g.sessionID, b.remember);
                    b.success && b.success.call(b.scope)
                } else {
                    b.failure && b.failure.call(b.scope, g.reason)
                }
            },
            scope: this
        })
    },
    logout: function (c, d) {
        Ext.Ajax.request({
            url: Docs.data.commentsUrl + "/logout?sid=" + this.getSid(),
            method: "POST",
            cors: true,
            callback: function () {
                this.currentUser = undefined;
                c && c.call(d)
            },
            scope: this
        })
    },
    setSid: function (d, f) {
        this.sid = d;
        if (d) {
            var e = null;
            if (f) {
                e = new Date();
                e.setTime(e.getTime() + (60 * 60 * 24 * 30 * 1000))
            }
            Ext.util.Cookies.set("sid", d, e)
        } else {
            Ext.util.Cookies.clear("sid")
        }
    },
    getSid: function () {
        if (!this.sid) {
            this.sid = Ext.util.Cookies.get("sid")
        }
        return this.sid
    },
    getUser: function () {
        return this.currentUser
    },
    isLoggedIn: function () {
        return !!this.getUser()
    },
    isModerator: function () {
        return this.getUser() && this.getUser().mod
    },
    getRegistrationUrl: function () {
        return Docs.data.commentsUrl + "/register"
    }
});
Ext.define("Docs.CommentCounts", {
    constructor: function (b) {
        this.counts = {};
        Ext.Array.each(b, function (a) {
            this.counts[a._id] = a.value
        }, this)
    },
    get: function (b) {
        return this.counts[b.join("__")] || 0
    },
    change: function (c, d) {
        delete this.totals;
        return this.counts[c.join("__")] = this.get(c) + d
    },
    getClassTotal: function (b) {
        if (!this.totals) {
            this.totals = {};
            Ext.Object.each(this.counts, function (a, f) {
                var e = a.split("__");
                if (e[0] === "class") {
                    this.totals[e[1]] = (this.totals[e[1]] || 0) + f
                }
            }, this)
        }
        return this.totals[b]
    }
});
Ext.define("Docs.CommentSubscriptions", {
    constructor: function (b) {
        this.subscriptions = {};
        Ext.Array.each(b, function (a) {
            this.subscriptions[a.join("__")] = true
        }, this)
    },
    has: function (b) {
        return this.subscriptions[b.join("__")]
    },
    set: function (c, d) {
        this.subscriptions[c.join("__")] = d
    }
});
Ext.define("Docs.LocalStore", {
    storeName: "",
    init: function () {
        this.localStorage = !!window.localStorage;
        this.store = Ext.create(this.storeName);
        if (this.localStorage) {
            this.cleanup();
            this.store.load();
            if (window.addEventListener) {
                window.addEventListener("storage", Ext.Function.bind(this.onStorageChange, this), false)
            } else {
                window.attachEvent("onstorage", Ext.Function.bind(this.onStorageChange, this))
            }
        }
    },
    onStorageChange: function (b) {
        b = b || window.event;
        if (b.key === this.store.getProxy().id) {
            this.store.load()
        }
    },
    syncStore: function () {
        this.localStorage && this.store.sync()
    },
    cleanup: function () {
        var f = /-settings/;
        for (var d = 0; d < window.localStorage.length; d++) {
            var e = window.localStorage.key(d);
            if (!f.test(e)) {
                window.localStorage.removeItem(e)
            }
        }
    }
});
Ext.define("Docs.view.Header", {
    extend: "Ext.container.Container",
    alias: "widget.docheader",
    contentEl: "header-content",
    initComponent: function () {
        if (Docs.otherProducts) {
            this.style = "cursor: pointer;",
            this.cls = "dropdown";
            this.menu = Ext.create("Ext.menu.Menu", {
                renderTo: Ext.getBody(),
                plain: true,
                items: Docs.otherProducts
            })
        }
        this.callParent()
    },
    listeners: {
        afterrender: function (b) {
            if (this.menu) {
                b.el.addListener("click", function (d, a) {
                    this.menu.showBy(this.el, "bl", [120, 0])
                }, this)
            }
        }
    }
});
Ext.define("Docs.view.examples.Container", {
    extend: "Ext.panel.Panel",
    alias: "widget.examplecontainer",
    layout: "fit",
    initComponent: function () {
        this.dockedItems = [{
            xtype: "container",
            dock: "top",
            html: ['<div class="cls-grouping example-toolbar">', "<div>", '<button class="new-window">Open in new window</button>', "</div>", "</div>"].join("")
        }];
        this.tpl = new Ext.XTemplate('<iframe style="width: 100%; height: 100%; border: 0;" src="{url}" title="Software Development Kit"></iframe>');   // title 추가
        this.callParent(arguments)
    },
    load: function (b) {
        this.update(this.tpl.apply(b))
    },
    clear: function () {
        this.update("")
    }
});
Ext.define("Docs.controller.Content", {
    extend: "Ext.app.Controller",
    MIDDLE: 1,
    title: "",
    loadIndex: function (b) {
        b || Docs.History.push(this.baseUrl);
        this.getViewport().setPageTitle(this.title);
        Ext.getCmp("doctabs").activateTab(this.baseUrl);
        Ext.getCmp("card-panel").layout.setActiveItem(this.getIndex());
        this.getIndex().restoreScrollState()
    },
    opensNewWindow: function (b) {
        return b.button === this.MIDDLE || b.shiftKey || b.ctrlKey
    },
    getBaseUrl: function () {
        return document.location.href.replace(/\/?(index.html|template.html)?(\?[^#]*)?#.*/, "")
    }
});
Ext.define("Docs.Syntax", {
    singleton: true,
    highlight: function (b) {
        Ext.Array.forEach(Ext.query("pre", b.dom || b), function (a) {
            a = Ext.get(a);
            if (a.child("code")) {
                if (!(a.hasCls("inline-example") && a.hasCls("preview"))) {
                    a.addCls("prettyprint")
                }
            } else {
                if (!a.parent(".CodeMirror") && !a.hasCls("hierarchy")) {
                    a.addCls("notpretty")
                }
            }
        });
        prettyPrint()
    }
});
Ext.define("Docs.ClassRegistry", {
    singleton: true,
    canonicalName: function (b) {
        if (!this.altNames) {
            this.altNames = {};
            Ext.each(Docs.data.search, function (a) {
                if (a.type === "class" && !/:/.test(a.cls)) {
                    this.altNames[a.cls] = a.id
                }
            }, this)
        }
        return this.altNames[b] || b
    },
    shortName: function (b) {
        return b.split(/\./).pop()
    },
    packageName: function (b) {
        return b.slice(0, -this.shortName(b).length - 1) || ""
    },
    search: function (S, H) {
        var J = 5;
        var T = 4;
        var X = 3;
        var K = new Array(J * T * X);
        for (var E = 0; E < K.length; E++) {
            K[E] = []
        }
        var O = J * T * 0;
        var Z = J * T * 1;
        var R = J * T * 2;
        var U = J * 0;
        var L = J * 1;
        var W = J * 2;
        var F = J * 3;
        if (H) {
            var P = 4;
            for (var E = 0; E < H.length; E++) {
                var i = H[E];
                if (i.score > 5) {
                    K[P + U + O].push(i)
                } else {
                    if (i.score > 1) {
                        K[P + U + Z].push(i)
                    } else {
                        K[P + U + R].push(i)
                    }
                }
            }
        }
        var M = /[.:]/.test(S);
        var G = Ext.escapeRe(S);
        var g = new RegExp("^" + G + "$", "i");
        var Y = new RegExp("^" + G, "i");
        var N = new RegExp(G, "i");
        var V = Docs.data.search;
        for (var E = 0, r = V.length; E < r; E++) {
            var Q = V[E];
            var I = M ? Q.fullName : Q.name;
            var D = Q.meta.removed ? F : (Q.meta["private"] ? W : (Q.meta.deprecated ? L : U));
            if (g.test(I)) {
                K[Q.sort + D + O].push(this.highlightMatch(Q, g))
            } else {
                if (Y.test(I)) {
                    K[Q.sort + D + Z].push(this.highlightMatch(Q, Y))
                } else {
                    if (N.test(I)) {
                        K[Q.sort + D + R].push(this.highlightMatch(Q, N))
                    }
                }
            }
        }
        return Ext.Array.flatten(K)
    },
    highlightMatch: function (c, d) {
        c = Ext.apply({}, c);
        c.name = c.name.replace(d, "<strong>$&</strong>");
        c.fullName = c.fullName.replace(d, "<strong>$&</strong>");
        return c
    }
});
Ext.define("Docs.GuideSearch", {
    singleton: true,
    isEnabled: function () {
        return !!Docs.data.guideSearch.url
    },
    deferredSearch: function (f, h, j, g) {
        clearTimeout(this.timeout);
        var i = this.timeout = Ext.Function.defer(function () {
            this.search(f, function (a) {
                if (i === this.timeout) {
                    h.call(j, a)
                }
            }, this)
        }, g, this)
    },
    search: function (f, g, e) {
        var h = this.currentRequest = Ext.data.JsonP.request({
            url: Docs.data.guideSearch.url,
            params: {
                fragsize: 32,
                max_fragments: 1,
                q: f,
                product: Docs.data.guideSearch.product,
                version: Docs.data.guideSearch.version,
                start: 0,
                limit: 100
            },
            callback: function (a, b) {
                if (a && b.success && this.currentRequest === h) {
                    g.call(e, Ext.Array.map(b.docs, this.adaptJson, this))
                }
            },
            scope: this
        })
    },
    adaptJson: function (b) {
        return {
            icon: "icon-guide",
            name: this.format(b.title),
            fullName: this.format(b.body),
            url: b.url,
            meta: {},
            score: b.score
        }
    },
    format: function (c) {
        var d = c.replace(/\s+/g, " ");
        return d.replace(/<em class="match">(.*?)<\/em>/g, "<strong>$1</strong>")
    }
});
Ext.define("Docs.store.Search", {
    extend: "Ext.data.Store",
    fields: ["name", "fullName", "icon", "url", "meta", "sort"],
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    }
});
Ext.define("Docs.model.Setting", {
    fields: ["id", "key", "value"],
    extend: "Ext.data.Model",
    requires: ["Ext.data.proxy.LocalStorage"],
    proxy: {
        type: window.localStorage ? "localstorage" : "memory",
        id: Docs.data.localStorageDb + "-settings"
    }
});
Ext.define("Docs.view.TabMenu", {
    extend: "Ext.menu.Menu",
    plain: true,
    componentCls: "tab-menu",
    initComponent: function () {
        this.addEvents("tabItemClick", "closeAllTabs");
        this.items = [{
            text: "Close other tabs",
            iconCls: "close",
            cls: "close-all",
            handler: function () {
                this.fireEvent("closeAllTabs")
            },
            scope: this
        }];
        this.callParent()
    },
    addTab: function (c, d) {
        this.insert(this.items.length - 1, {
            text: c.text,
            iconCls: c.iconCls,
            origIcon: c.iconCls,
            href: c.href,
            cls: d,
            handler: this.onTabItemClick,
            scope: this
        })
    },
    onTabItemClick: function (b) {
        this.fireEvent("tabItemClick", b)
    },
    addTabCls: function (c, d) {
        this.items.each(function (a) {
            if (a.href === c.href) {
                a.addCls(d)
            }
        })
    }
});
Ext.define("Docs.view.Scrolling", {
    onClassMixedIn: function (b) {
        Ext.Function.interceptBefore(b.prototype, "initComponent", this.prototype.initScrolling)
    },
    initScrolling: function () {
        this.scrollContext = "index";
        this.scrollState = {};
        this.on("afterrender", function () {
            this.getScrollEl().addListener("scroll", this.saveScrollState, this)
        }, this)
    },
    setScrollContext: function (b) {
        this.scrollContext = b
    },
    eraseScrollContext: function (b) {
        delete this.scrollState[b]
    },
    saveScrollState: function () {
        this.scrollState[this.scrollContext] = this.getScrollTop()
    },
    restoreScrollState: function () {
        this.setScrollTop(this.scrollState[this.scrollContext] || 0)
    },
    scrollToView: function (d, c) {
        d = Ext.get(d);
        c = c || {};
        if (d) {
            this.setScrollTop(this.getScrollTop() + d.getY() + (c.offset || 0));
            this.setScrollLeft(0);
            c.highlight && d.highlight()
        }
    },
    getScrollTop: function () {
        return this.getScrollEl().getScroll()["top"]
    },
    setScrollTop: function (b) {
        return this.getScrollEl().scrollTo("top", b)
    },
    setScrollLeft: function (b) {
        return this.getScrollEl().scrollTo("left", b)
    },
    scrollToTop: function () {
        this.getScrollEl().scrollTo("top")
    },
    getScrollEl: function () {
        return this.body || this.el
    }
});
Ext.define("Docs.ContentGrabber", {
    singleton: true,
    get: function (f) {
        var e;
        var d = Ext.get(f);
        if (d) {
            e = d.dom.innerHTML;
            d.remove()
        }
        return e
    }
});
Ext.define("Docs.view.comments.HeaderMenu", {
    extend: "Ext.container.Container",
    alias: "widget.commentsHeaderMenu",
    componentCls: "comments-header-menu",
    html: ["<h1>", '  <a href="#" class="users selected">Users</a>', '  <a href="#" class="targets">Topics</a>', '  <a href="#" class="tags">Tags</a>', "</h1>"].join(""),
    afterRender: function () {
        this.callParent(arguments);
        Ext.Array.forEach(["users", "targets", "tags"], function (d) {
            var c = this.getEl().down("a." + d);
            c.on("click", function (b, a) {
                this.getEl().select("a", true).removeCls("selected");
                c.addCls("selected");
                this.fireEvent("select", d)
            }, this, {
                preventDefault: true
            })
        }, this)
    }
});
Ext.define("Docs.view.examples.Device", {
    config: {
        url: "",
        id: undefined,
        device: "phone",
        orientation: "landscape"
    },
    constructor: function (b) {
        this.initConfig(b);
        Ext.apply(this, this.getIframeSize());
        this.id = this.id || Ext.id();
        this.tpl = new Ext.XTemplate('<div class="touchExample {device} {orientation}">', '<iframe id={id} style="width: {width}; height: {height}; border: 0;" ', 'src="{[this.deviceUrl(values)]}" title="Software Development Kit"></iframe>', "</div>", {
            deviceUrl: function (a) {
                return a.url + "?deviceType=" + (a.device === "tablet" ? "Tablet" : "Phone")
            }
        })
    },
    toHtml: function () {
        return this.tpl.apply(this)
    },
    setDevice: function (b) {
        this.device = b;
        Ext.apply(this, this.getIframeSize())
    },
    setOrientation: function (b) {
        this.orientation = b;
        Ext.apply(this, this.getIframeSize())
    },
    getIframeSize: function () {
        var b = {
            phone: {
                width: "481px",
                height: "320px"
            },
            miniphone: {
                width: "320px",
                height: "219px"
            },
            tablet: {
                width: "717px",
                height: "538px"
            }
        }[this.device];
        if (this.orientation === "landscape") {
            return b
        } else {
            return {
                width: b.height,
                height: b.width
            }
        }
    }
});
Ext.define("Docs.model.Test", {
    extend: "Ext.data.Model",
    fields: ["id", "name", "href", "code", "options", {
        name: "status",
        defaultValue: "ready"
    }, "message"]
});
Ext.define("Docs.view.examples.InlineToolbar", {
    extend: "Ext.toolbar.Toolbar",
    componentCls: "inline-example-tb",
    height: 30,
    initComponent: function () {
        this.addEvents("buttonclick");
        this.items = [{
            iconCls: "code",
            padding: "0 2 0 0",
            margin: "0 3 0 0",
            text: "Code Editor",
            handler: this.createEventFirerer("code")
        }, {
            padding: 0,
            margin: "0 3 0 0",
            iconCls: "preview",
            text: "Live Preview",
            handler: this.createEventFirerer("preview")
        }, "->", {
            padding: 0,
            margin: 0,
            iconCls: "copy",
            text: "Select Code",
            handler: this.createEventFirerer("copy")
        }];
        this.callParent(arguments)
    },
    createEventFirerer: function (b) {
        return Ext.Function.bind(function () {
            this.fireEvent("buttonclick", b)
        }, this)
    },
    activateButton: function (b) {
        Ext.Array.each(this.query("button"), function (a) {
            a.removeCls("active")
        });
        Ext.Array.each(this.query("button[iconCls=" + b + "]"), function (a) {
            a.addCls("active")
        })
    }
});
Ext.define("Docs.view.Signature", {
    singleton: true,
    render: function (f, d) {
        d = d || "short";
        var e = Ext.Array.map(Docs.data.signatures, function (a) {
            return f[a.tagname] ? '<span class="' + a.tagname + '">' + (a[d]) + "</span>" : ""
        }).join(" ");
        return '<span class="signature">' + e + "</span>"
    }
});
Ext.define("Docs.view.DocTree", {
    extend: "Ext.tree.Panel",
    alias: "widget.doctree",
    cls: "doc-tree iScroll",
    useArrows: true,
    rootVisible: false,
    border: false,
    bodyBorder: false,
    initComponent: function () {
        this.addEvents("urlclick");
        this.root.expanded = true;
        this.on("itemclick", this.onItemClick, this);
        this.on("beforeitemcollapse", this.handleBeforeExpandCollapse, this);
        this.on("beforeitemexpand", this.handleBeforeExpandCollapse, this);
        this.callParent();
        this.nodeTpl = new Ext.XTemplate('<a href="{url}" rel="{url}">{text}</a>');
        this.initNodeLinks()
    },
    initNodeLinks: function () {
        this.getRootNode().cascadeBy(this.applyNodeTpl, this)
    },
    applyNodeTpl: function (b) {
        if (b.get("leaf")) {
            b.set("text", this.nodeTpl.apply({
                text: b.get("text"),
                url: b.raw.url
            }));
            b.commit()
        }
    },
    onItemClick: function (h, j, k, l, i) {
        var e = j.raw ? j.raw.url : j.data.url;
        if (e) {
            this.fireEvent("urlclick", e, i)
        } else {
            if (!j.isLeaf()) {
                if (j.isExpanded()) {
                    j.collapse(false)
                } else {
                    j.expand(false)
                }
            }
        }
    },
    selectUrl: function (d) {
        var c = this.findNodeByUrl(d);
        if (c) {
            c.bubble(function (a) {
                a.expand()
            });
            this.getSelectionModel().select(c)
        } else {
            this.getSelectionModel().deselectAll()
        }
    },
    findNodeByUrl: function (b) {
        return this.getRootNode().findChildBy(function (a) {
            return b === a.raw.url
        }, this, true)
    },
    findRecordByUrl: function (d) {
        var c = this.findNodeByUrl(d);
        return c ? c.raw : undefined
    },
    handleBeforeExpandCollapse: function (b) {
        if (this.getView().isAnimating(b)) {
            return false
        }
    }
});
Ext.define("Docs.Tip", {
    singleton: true,
    show: function (g, e, f) {
        f = f || "right";
        this.tips = this.tips || {};
        if (this.tips[f]) {
            var h = this.tips[f];
            h.update(g);
            h.setTarget(e);
            h.show()
        } else {
            var h = this.tips[f] = Ext.create("Ext.tip.ToolTip", {
                anchor: f,
                target: e,
                html: g
            });
            h.show()
        }
    }
});
Ext.define("Docs.view.comments.Pager", {
    extend: "Ext.Component",
    alias: "widget.commentsPager",
    componentCls: "recent-comments-pager",
    afterRender: function () {
        this.callParent(arguments);
        this.getEl().on("click", function () {
            this.fireEvent("loadMore", this.offset + this.limit)
        }, this, {
            preventDefault: true,
            delegate: "a.fetchMoreComments"
        })
    },
    configure: function (b) {
        Ext.apply(this, b);
        this.update(this.getPagerHtml())
    },
    reset: function () {
        this.update("<span></span>No comments found.")
    },
    getPagerHtml: function () {
        var d = this.total_rows || 0;
        var e = this.offset + this.limit;
        var f = Math.min(this.limit, d - e);
        if (d > e) {
            return ["<span></span>", '<a href="#" class="fetchMoreComments" rel="' + e + '">', "Showing comments 1-" + e + " of " + d + ". ", "Click to load " + f + " more...", "</a>"].join("")
        } else {
            return "<span></span>That's all. Total " + d + " comments."
        }
    }
});
Ext.define("Docs.view.SimpleSelectBehavior", {
    mixins: {
        observable: "Ext.util.Observable"
    },
    constructor: function (c, d) {
        this.mixins.observable.constructor.call(this, {
            listeners: d
        });
        c.on({
            select: this.onSelect,
            deselect: this.onDeselect,
            scope: this
        })
    },
    onSelect: function (c, d) {
        this.selectedItem = d;
        this.fireEvent("select", d)
    },
    onDeselect: function (c, d) {
        this.selectedItem = undefined;
        Ext.Function.defer(function () {
            if (!this.selectedItem) {
                this.fireEvent("deselect", d)
            }
        }, 10, this)
    }
});
Ext.define("Docs.view.comments.FilterField", {
    extend: "Ext.form.field.Trigger",
    alias: "widget.commentsFilterField",
    triggerCls: "reset",
    componentCls: "comments-filter-field",
    hideTrigger: true,
    enableKeyEvents: true,
    initComponent: function () {
        this.callParent(arguments);
        this.on({
            keyup: this.onKeyUp,
            specialkey: this.onSpecialKey,
            scope: this
        })
    },
    onKeyUp: function () {
        this.fireEvent("filter", this.getValue());
        this.setHideTrigger(this.getValue().length === 0)
    },
    onSpecialKey: function (c, d) {
        if (d.keyCode === Ext.EventObject.ESC) {
            this.reset();
            this.fireEvent("filter", "")
        }
    },
    onTriggerClick: function () {
        this.reset();
        this.focus();
        this.fireEvent("filter", "");
        this.setHideTrigger(true)
    }
});
Ext.define("Docs.view.comments.TopList", {
    extend: "Ext.panel.Panel",
    componentCls: "comments-toplist",
    requires: ["Docs.view.SimpleSelectBehavior", "Docs.view.comments.FilterField"],
    layout: "border",
    displayField: "text",
    scoreField: "score",
    filterEmptyText: "Filter by name...",
    initComponent: function () {
        this.items = [this.tabpanel = Ext.widget("tabpanel", {
            plain: true,
            region: "north",
            height: 50,
            items: [{
                title: "By comment count"
            }],
            dockedItems: [{
                dock: "bottom",
                items: [{
                    xtype: "commentsFilterField",
                    emptyText: this.filterEmptyText,
                    width: 320,
                    height: 20,
                    listeners: {
                        filter: this.onFilter,
                        scope: this
                    }
                }]
            }]
        }), this.list = Ext.widget("dataview", {
            region: "center",
            cls: "iScroll top-list",
            autoScroll: true,
            store: new Ext.data.Store({
                model: this.model
            }),
            allowDeselect: true,
            tpl: ["<ul>", '<tpl for=".">', "<li>", '<span class="score">{' + this.scoreField + "}</span>", '<span class="text">{' + this.displayField + "}</span>", "</li>", "</tpl>", "</ul>"],
            itemSelector: "li"
        })];
        new Docs.view.SimpleSelectBehavior(this.list, {
            select: this.onSelect,
            deselect: this.onDeselect,
            scope: this
        });
        this.callParent(arguments)
    },
    afterRender: function () {
        this.callParent(arguments);
        this.list.getStore().load()
    },
    onFilter: function (b) {
        this.list.getSelectionModel().deselectAll();
        this.list.getStore().clearFilter(true);
        this.list.getStore().filter({
            property: this.displayField,
            value: b,
            anyMatch: true
        })
    },
    deselectAll: function () {
        this.list.getSelectionModel().deselectAll()
    },
    onSelect: function (b) {
        this.fireEvent("select", b)
    },
    onDeselect: function () {
        this.fireEvent("select", undefined)
    }
});
Ext.define("Docs.view.cls.MemberWrap", {
    constructor: function (b) {
        Ext.apply(this, b);
        this.el = Ext.get(b.el)
    },
    setExpanded: function (b) {
        if (b) {
            if (!this.isExpanded()) {
                this.el.addCls("open")
            }
        } else {
            this.el.removeCls("open")
        }
    },
    isExpanded: function () {
        return this.el.hasCls("open")
    },
    getDefinedIn: function () {
        return this.el.down(".meta .defined-in").getAttribute("rel")
    },
    getMemberId: function () {
        return this.el.getAttribute("id")
    }
});
Ext.define("Docs.view.examples.InlineEditor", {
    extend: "Ext.Panel",
    bodyPadding: 2,
    autoScroll: true,
    componentCls: "inline-example-editor",
    initComponent: function () {
        this.addEvents("init", "change");
        this.on("afterlayout", this.initCodeMirror, this);
        this.callParent(arguments)
    },
    initCodeMirror: function (b) {
        if (!this.codemirror) {
            this.codemirror = CodeMirror(this.body, {
                mode: "javascript",
                indentUnit: 4,
                value: this.value,
                extraKeys: {
                    Tab: "indentMore",
                    "Shift-Tab": "indentLess"
                },
                onChange: Ext.Function.bind(function (a) {
                    this.fireEvent("change")
                }, this)
            });
            this.fireEvent("init")
        }
    },
    refresh: function () {
        this.codemirror.refresh()
    },
    getValue: function () {
        return this.codemirror ? this.codemirror.getValue() : this.value
    },
    getHeight: function () {
        var b = this.el.down(".CodeMirror-lines");
        return b ? b.getHeight() : undefined
    },
    selectAll: function () {
        var d = this.codemirror.lineCount() - 1;
        var c = this.codemirror.getLine(d).length;
        this.codemirror.setSelection({
            line: 0,
            ch: 0
        }, {
            line: d,
            ch: c
        })
    }
});
Ext.define("Docs.view.examples.InlinePreview", {
    extend: "Ext.Panel",
    requires: ["Docs.view.examples.Device"],
    bodyPadding: "0 10",
    statics: {
        iframeCounter: 0,
        getNextIframeId: function () {
            this.iframeCounter++;
            return this.iframeCounter.toString()
        }
    },
    options: {},
    constructor: function (b) {
        b = b || {};
        b.iframeId = this.self.getNextIframeId();
        b.id = "inline-preview-" + b.iframeId;
        this.callParent([b]);
        this.addEvents(["previewsuccess", "previewfailure"])
    },
    initComponent: function () {
        this.html = this.getHtml();
        this.callParent(arguments)
    },
    getHtml: function () {
        if (Docs.data.touchExamplesUi) {
            return Ext.create("Docs.view.examples.Device", {
                url: "eg-iframe.html",
                id: this.iframeId,
                device: this.options.device,
                orientation: this.options.orientation
            }).toHtml()
        } else {
            var b = new Ext.XTemplate('<iframe id="{id}" style="width: 100%; height: 100%; border: 0" frameBorder="0" title="Software Development Kit"></iframe>'); // title 추가
            return b.apply({
                id: this.iframeId
            })
        }
    },
    update: function (h) {
        var f = this.options;
        var e = Ext.get(this.iframeId);
        var g = Ext.Function.bind(this.iframeCallback, this);
        if (e) {
            e.on("load", function () {
                Ext.Function.defer(function () {
                    e.dom.contentWindow.loadInlineExample(h + "\n", f, g)
                }, 100)
            }, this, {
                single: true
            });
            e.dom.src = "eg-iframe.html"
        }
    },
    iframeCallback: function (c, d) {
        if (c) {
            this.fireEvent("previewsuccess", this)
        } else {
            this.fireEvent("previewfailure", this, d)
        }
    },
    getHeight: function () {
        return document.getElementById(this.iframeId).parentNode.clientHeight
    }
});
Ext.define("Docs.view.cls.Logic", {
    showPrivateClasses: false,
    constructor: function (b) {
        Ext.apply(this, b)
    }
});
Ext.define("Docs.view.comments.Form", {
    extend: "Ext.Component",
    alias: "widget.commentsForm",
    requires: ["Docs.Tip"],
    tpl: ['<form class="commentForm <tpl if="!updateComment">newComment</tpl>">', '<tpl if="title">', "<p>{title}</p>", "</tpl>", "<textarea>{content}</textarea>", '<div class="com-meta">', "{[Docs.Comments.avatar(values.user.emailHash)]}", '<div class="form-author">Logged in as {user.userName}</div>', '<tpl if="!updateComment">', '<label class="subscribe">', 'Email updates? <input type="checkbox" class="subscriptionCheckbox" <tpl if="userSubscribed">checked="checked"</tpl> />', '<span class="sep"> | </span>', "</label>", "</tpl>", '<a href="#" class="toggleCommentGuide">Show help &#8595;</a>', '<input type="submit" class="sub submitComment" value="{[values.updateComment ? "Update" : "Post"]} comment" />', '<tpl if="updateComment">', ' or <a href="#" class="cancelUpdateComment">cancel</a>', "</tpl>", "</div>", '<div class="commentGuideTxt" style="display: none;">', "<ul>", '<li>Use <strong><a href="http://daringfireball.net/projects/markdown/syntax" target="_blank">Markdown</a></strong>', " for formatting:</li>", "</ul>", '<div class="markdown preview">', "<h4>Markdown</h4>", "<pre>", "**Bold**, _italic_\n", "and `monospaced font`.\n", "\n", "    Indent with 4 spaces\n", "    for a code block.\n", "\n", "1. numbered lists\n", "2. are cool\n", "\n", "- bulleted lists\n", "- make your point\n", "\n", "[External link](http//example.com)\n", "\n", "Leave a blank line\n", "between paragraphs.\n", "</pre>", "</div>", '<div class="markdown result">', "<h4>Result</h4>", "<strong>Bold</strong>, <em>italic</em> and<br/>", "<code>monospaced font</code>.<br/>", '<pre class="prettyprint">', "Indent with 4 spaces\n", "for a code block.", "</pre>", "<ol>", "<li>numbered lists</li>", "<li>are cool</li>", "</ol>", "<ul>", "<li>bulleted lists</li>", "<li>make your point</li>", "</ul>", '<a href="http://example.com">External link</a><br/>', "<br/>", "Leave a blank line between paragraphs.<br/><br/>", "</div>", "<ul>", "<li>Use comments to:", "<ul>", "<li>Inform us about <strong>bugs in documentation.</strong></li>", "<li>Give <strong>useful tips</strong> to other developers.</li>", "<li><strong>Warn about bugs</strong> and problems that might bite.</li>", "</ul>", "</li>", "<li>Don't post comments for:", "<ul>", "<li><strong>Questions about code or usage</strong>", ' - use the <a href="http://www.sencha.com/forum" target="_blank">Sencha Forum</a>.</li>', "<li><strong>SDK bugs</strong>", ' - use the <a href="http://www.sencha.com/forum" target="_blank">Sencha Forum</a>.</li>', "<li><strong>Docs App bugs</strong>", ' - use the <a href="https://github.com/senchalabs/jsduck/issues" target="_blank">GitHub Issue tracker</a>.</li>', "</ul></li>", "<li>Comments may be edited or deleted at any time by a moderator.</li>", '<li>Avatars can be managed at <a href="http://www.gravatar.com" target="_blank">Gravatar</a> (use your forum email address).</li>', "<li>To write a reply use <strong><code>@username</code></strong> syntax &ndash; the user will get notified.</li>", "</ul>", "</div>", "</form>"],
    initComponent: function () {
        this.data = {
            title: this.title,
            updateComment: (this.content !== undefined),
            content: this.content,
            userSubscribed: this.userSubscribed,
            user: this.user
        };
        this.callParent(arguments)
    },
    setValue: function (b) {
        this.codeMirror.setValue(b)
    },
    afterRender: function () {
        this.callParent(arguments);
        this.makeCodeMirror(this.getEl().down("textarea").dom);
        this.bindEvents()
    },
    makeCodeMirror: function (d) {
        var c = true;
        this.codeMirror = CodeMirror.fromTextArea(d, {
            mode: "markdown",
            lineWrapping: true,
            indentUnit: 4,
            extraKeys: {
                Tab: "indentMore",
                "Shift-Tab": "indentLess"
            },
            onFocus: Ext.Function.bind(function () {
                if (c && this.codeMirror.getValue() === "") {
                    this.toggleGuide(true)
                }
                c = false
            }, this)
        })
    },
    bindEvents: function () {
        this.getEl().on("click", function () {
            this.toggleGuide()
        }, this, {
            preventDefault: true,
            delegate: "a.toggleCommentGuide"
        });
        this.getEl().on("click", function () {
            this.fireEvent("cancel")
        }, this, {
            preventDefault: true,
            delegate: "a.cancelUpdateComment"
        });
        this.getEl().on("click", function () {
            this.fireEvent("submit", this.codeMirror.getValue())
        }, this, {
            preventDefault: true,
            delegate: "input.submitComment"
        });
        this.getEl().on("click", function (c, d) {
            this.fireEvent("subscriptionChange", Ext.get(d).dom.checked)
        }, this, {
            delegate: "input.subscriptionCheckbox"
        })
    },
    toggleGuide: function (f) {
        var d = this.getEl().down(".commentGuideTxt");
        d.setVisibilityMode(Ext.dom.Element.DISPLAY);
        var e = this.getEl().down(".toggleCommentGuide");
        if (!d.isVisible() || f === true) {
            d.show(true);
            e.update("Hide help &#8593;")
        } else {
            d.hide(true);
            e.update("Show help &#8595;")
        }
    },
    showSubscriptionMessage: function (d) {
        var e = this.getEl().down("input.subscriptionCheckbox");
        var f = d ? "Updates to this thread will be e-mailed to you" : "You have unsubscribed from this thread";
        Docs.Tip.show(f, e, "bottom")
    }
});
Ext.define("Docs.view.comments.DragZone", {
    extend: "Ext.dd.DragZone",
    constructor: function (d, c) {
        this.view = d;
        this.callParent([d.getEl(), c])
    },
    getDragData: function (f) {
        var d = f.getTarget("img.drag-handle", 10);
        if (d) {
            var e = Ext.fly(d).up(this.view.itemSelector).dom;
            return {
                sourceEl: e,
                repairXY: Ext.fly(e).getXY(),
                ddel: this.cloneCommentEl(e),
                comment: this.view.getRecord(e)
            }
        }
        return false
    },
    cloneCommentEl: function (e) {
        var f = e.cloneNode(true);
        var d = Ext.fly(f).down(".comments-list-with-form");
        d && d.remove();
        f.id = Ext.id();
        return f
    },
    getRepairXY: function () {
        return this.dragData.repairXY
    }
});
Ext.define("Docs.view.comments.DropZone", {
    extend: "Ext.dd.DropZone",
    constructor: function (d, c) {
        this.view = d;
        this.callParent([d.getEl(), c])
    },
    getTargetFromEvent: function (b) {
        return b.getTarget(this.view.itemSelector, 10)
    },
    onNodeEnter: function (g, f, h, e) {
        if (this.isValidDropTarget(g, e)) {
            Ext.fly(g).addCls("drop-target-hover")
        }
    },
    onNodeOut: function (g, f, h, e) {
        Ext.fly(g).removeCls("drop-target-hover")
    },
    onNodeOver: function (g, f, h, e) {
        if (this.isValidDropTarget(g, e)) {
            return this.dropAllowed
        } else {
            return false
        }
    },
    isValidDropTarget: function (d, e) {
        var f = this.view.getRecord(d);
        return f && f.get("id") !== e.comment.get("id")
    },
    onNodeDrop: function (g, f, h, e) {
        if (this.isValidDropTarget(g, e)) {
            this.onValidDrop(e.comment, this.view.getRecord(g));
            return true
        }
        return false
    },
    onValidDrop: Ext.emptyFn
});
Ext.define("Docs.view.comments.TopLevelDropZone", {
    extend: "Ext.dd.DropZone",
    getTargetFromEvent: function (b) {
        return b.getTarget("a.side.toggleComments", 10)
    },
    onNodeEnter: function (g, f, h, e) {
        if (this.isValidDropTarget(e)) {
            Ext.fly(g).addCls("drop-target-hover")
        }
    },
    onNodeOut: function (g, f, h, e) {
        Ext.fly(g).removeCls("drop-target-hover")
    },
    onNodeOver: function (g, f, h, e) {
        if (this.isValidDropTarget(e)) {
            return this.dropAllowed
        } else {
            return false
        }
    },
    isValidDropTarget: function (b) {
        return !!b.comment.get("parentId")
    },
    onNodeDrop: function (g, f, h, e) {
        if (this.isValidDropTarget(e)) {
            this.onValidDrop(e.comment, undefined);
            return true
        }
        return false
    },
    onValidDrop: Ext.emptyFn
});
Ext.define("Docs.Comments", {
    extend: "Ext.util.Observable",
    singleton: true,
    requires: ["Docs.Auth", "Docs.CommentCounts", "Docs.CommentSubscriptions", "Ext.data.JsonP", "Ext.Ajax"],
    init: function (c, d) {
        if (!(Docs.data.commentsUrl && Docs.data.commentsDomain && this.isBrowserSupported())) {
            c.call(d);
            return
        }
        Docs.Auth.init(function (a) {
            if (a) {
                this.enabled = true;
                this.fetchCountsAndSubscriptions(function (f, b) {
                    this.counts = new Docs.CommentCounts(f);
                    this.subscriptions = new Docs.CommentSubscriptions(b);
                    c.call(d)
                }, this)
            } else {
                c.call(d)
            }
        }, this)
    },
    isBrowserSupported: function () {
        return ("withCredentials" in new XMLHttpRequest()) || (Ext.ieVersion >= 8)
    },
    fetchCountsAndSubscriptions: function (c, d) {
        this.request("jsonp", {
            url: "/comments_meta",
            method: "GET",
            success: function (a) {
                c.call(d, a.comments, a.subscriptions)
            },
            scope: this
        })
    },
    loadSubscriptions: function (c, d) {
        this.fetchSubscriptions(function (a) {
            this.subscriptions = new Docs.CommentSubscriptions(a);
            c.call(d)
        }, this)
    },
    clearSubscriptions: function () {
        this.subscriptions = new Docs.CommentSubscriptions([])
    },
    fetchSubscriptions: function (c, d) {
        this.request("jsonp", {
            url: "/subscriptions",
            method: "GET",
            success: function (a) {
                c.call(d, a.subscriptions)
            },
            scope: this
        })
    },
    isEnabled: function () {
        return this.enabled
    },
    getCount: function (b) {
        return this.enabled ? this.counts.get(b) : 0
    },
    changeCount: function (f, e) {
        var d = this.counts.change(f, e);
        this.fireEvent("countChange", f, d)
    },
    hasSubscription: function (b) {
        return this.subscriptions.has(b)
    },
    getClassTotalCount: function (b) {
        return this.counts.getClassTotal(b)
    },
    load: function (d, f, e) {
        this.request("jsonp", {
            url: "/comments",
            method: "GET",
            params: {
                startkey: Ext.JSON.encode(d)
            },
            success: f,
            scope: e
        })
    },
    loadReplies: function (f, d, e) {
        this.request("jsonp", {
            url: "/replies",
            method: "GET",
            params: {
                parentId: f
            },
            success: d,
            scope: e
        })
    },
    post: function (b) {
        this.request("ajax", {
            url: "/comments",
            method: "POST",
            params: {
                target: Ext.JSON.encode(b.target),
                parentId: b.parentId,
                comment: b.content,
                url: this.buildPostUrl(b.target)
            },
            callback: function (h, f, a) {
                var g = Ext.JSON.decode(a.responseText);
                if (f && g.success) {
                    this.changeCount(b.target, +1);
                    b.callback && b.callback.call(b.scope, g.comment)
                }
            },
            scope: this
        })
    },
    buildPostUrl: function (i) {
        var f = i[0];
        var g = i[1];
        var h = i[2];
        if (f == "video") {
            var j = "#!/video/" + g
        } else {
            if (f == "guide") {
                var j = "#!/guide/" + g
            } else {
                var j = "#!/javascriptapi/" + g + (h ? "-" + h : "")
            }
        }
        return "http://" + window.location.host + window.location.pathname + j
    },
    subscribe: function (h, e, g, f) {
        this.request("ajax", {
            url: "/subscribe",
            method: "POST",
            params: {
                target: Ext.JSON.encode(h),
                subscribed: e
            },
            callback: function (c, a, d) {
                var b = Ext.JSON.decode(d.responseText);
                if (a && b.success) {
                    this.subscriptions.set(h, e);
                    g && g.call(f)
                }
            },
            scope: this
        })
    },
    request: function (c, d) {
        d.url = this.buildRequestUrl(d.url);
        if (c === "jsonp") {
            Ext.data.JsonP.request(d)
        } else {
            d.cors = true;
            Ext.Ajax.request(d)
        }
    },
    buildRequestUrl: function (b) {
        b = Docs.data.commentsUrl + "/" + Docs.data.commentsDomain + b;
        return b + (b.match(/\?/) ? "&" : "?") + "sid=" + Docs.Auth.getSid()
    },
    avatar: function (c, d) {
        return '<img class="avatar ' + (d || "") + '" width="25" height="25" src="http://www.gravatar.com/avatar/' + c + '?s=25&amp;r=PG&amp;d=identicon">'
    },
    counterHtml: function (b) {
        return b > 0 ? '<span class="comment-counter-small">' + b + "</span>" : ""
    }
});
Ext.define("Docs.controller.Auth", {
    extend: "Ext.app.Controller",
    requires: ["Docs.Auth", "Docs.Comments"],
    refs: [{
        ref: "authHeaderForm",
        selector: "authHeaderForm"
    }],
    init: function () {
        this.control({
            "authHeaderForm, authForm": {
                login: this.login,
                logout: this.logout
            }
        });
        var b = this.getController("Tabs");
        b.onLaunch = Ext.Function.createSequence(b.onLaunch, this.afterTabsLaunch, this)
    },
    afterTabsLaunch: function () {
        if (Docs.Comments.isEnabled()) {
            if (Docs.Auth.isLoggedIn()) {
                this.setLoggedIn()
            } else {
                this.setLoggedOut()
            }
        }
    },
    login: function (e, g, f, h) {
        Docs.Auth.login({
            username: g,
            password: f,
            remember: h,
            success: this.setLoggedIn,
            failure: function (a) {
                e.showMessage(a)
            },
            scope: this
        })
    },
    logout: function (b) {
        Docs.Auth.logout(this.setLoggedOut, this)
    },
    setLoggedIn: function () {
        Docs.Comments.loadSubscriptions(function () {
            this.getAuthHeaderForm().showLoggedIn(Docs.Auth.getUser());
            this.eachCmp("commentsListWithForm", function (b) {
                b.showCommentingForm()
            });
            this.eachCmp("commentsList", function (b) {
                b.refresh()
            });
            this.getController("Tabs").showCommentsTab()
        }, this)
    },
    setLoggedOut: function () {
        Docs.Comments.clearSubscriptions();
        this.getAuthHeaderForm().showLoggedOut();
        this.eachCmp("commentsListWithForm", function (b) {
            b.showAuthForm()
        });
        this.eachCmp("commentsList", function (b) {
            b.refresh()
        });
        this.getController("Tabs").hideCommentsTab()
    },
    eachCmp: function (e, f, d) {
        Ext.Array.forEach(Ext.ComponentQuery.query(e), f, d)
    }
});
Ext.define("Docs.controller.Welcome", {
    extend: "Docs.controller.Content",
    baseUrl: "#",
    refs: [{
        ref: "viewport",
        selector: "#viewport"
    }, {
        ref: "index",
        selector: "#welcomeindex"
    }],
    init: function () {
        this.addEvents("loadIndex")
    },
    loadIndex: function () {
        this.fireEvent("loadIndex");
        Ext.getCmp("treecontainer").hide();
        this.callParent([true])
    },
    isActive: function () {
        return !!this.getIndex().getTab()
    }
});

Ext.define("Docs.controller.Failure", {
    extend: "Docs.controller.Content",
    baseUrl: "#",
    refs: [{
        ref: "viewport",
        selector: "#viewport"
    }, {
        ref: "index",
        selector: "#failure"
    }],
    show404: function (c) {
        var d = new Ext.XTemplate("<h1>Sorry...</h1>",
            "<p>{msg}</p>"
            /*,
            "<p>Maybe it was renamed to something else?<br> Or maybe your internet connection has failed?<br> ",
            "This would be sad. Hopefully it's just a bug on our side.</p>",
            "<p>Most likely you just followed a broken link inside this very documentation. ",
            "Go and report it to the authors of the docs.</p>",
            "<p>But if you think it's a bug in JSDuck documentation-generator itself, feel free to open ",
            "an issue at the <a href='https://github.com/senchalabs/jsduck/issues'>JSDuck issue tracker</a>.</p>",
            "<p>Sorry for all this :(</p>"*/
            );
        Ext.getCmp("failure").update(d.apply({
            msg: c
        }));
        Ext.getCmp("card-panel").layout.setActiveItem("failure")
    }
});

Ext.define("Docs.controller.Classes", {
    extend: "Docs.controller.Content",
    baseUrl: "#!/javascriptapi",
    title: "DEXT5 API Documentation",
    requires: ["Docs.History", "Docs.Syntax", "Docs.ClassRegistry"],
    refs: [{
        ref: "viewport",
        selector: "#viewport"
    }, {
        ref: "index",
        selector: "#classindex"
    }, {
        ref: "header",
        selector: "classheader"
    }, {
        ref: "overview",
        selector: "classoverview"
    }, {
        ref: "tabPanel",
        selector: "classtabpanel"
    }, {
        ref: "tree",
        selector: "#classtree"
    }, {
        ref: "favoritesGrid",
        selector: "#favorites-grid"
    }],
    cache: {},
    init: function () {
        this.addEvents("showIndex", "showClass", "showMember");
        Ext.getBody().addListener("click", function (c, d) {
            this.handleUrlClick(decodeURI(d.href), c)
        }, this, {
            preventDefault: true,
            delegate: ".docClass"
        });
        this.control({
            classtree: {
                urlclick: function (d, c) {
                    this.handleUrlClick(d, c, this.getTree())
                }
            },
            toolbar: {
                toggleExpanded: function (b) {
                    this.getOverview().setAllMembersExpanded(b)
                }
            },
            classoverview: {
                afterrender: function (b) {
                    b.el.addListener("click", function (i, k) {
                        var h = Ext.get(k).up(".member")
                          , l = h.down(".meta .defined-in")
                          , j = l.getAttribute("rel")
                          , a = h.getAttribute("id");
                        if (this.getOverview().isMemberExpanded(a)) {
                            this.setExpanded(a, false)
                        } else {
                            this.setExpanded(a, true);
                            this.fireEvent("showMember", j, a)
                        }
                    }, this, {
                        preventDefault: true,
                        delegate: ".expandable"
                    });
                    b.el.addListener("click", Ext.emptyFn, this, {
                        preventDefault: true,
                        delegate: ".not-expandable"
                    })
                }
            },
            treecontainer: {
                afterrender: function (b) {
                    b.el.addListener("dblclick", function () {
                        if (b.getWidth() < 30) {
                            b.setWidth(b.expandedWidth)
                        } else {
                            b.expandedWidth = b.getWidth();
                            b.setWidth(20)
                        }
                    }, this, {
                        delegate: ".x-resizable-handle"
                    })
                }
            },
            doctabs: {
                tabClose: function (b) {
                    this.getOverview().eraseScrollContext(b)
                }
            }
        })
    },
    setExpanded: function (f, d) {
        var e = this.currentCls;
        if (!e.expanded) {
            e.expanded = {}
        }
        this.getOverview().setMemberExpanded(f, d);
        if (d) {
            e.expanded[f] = d
        } else {
            delete e.expanded[f]
        }
    },
    applyExpanded: function (b) {
        Ext.Object.each(b.expanded || {}, function (a) {
            Ext.get(a).addCls("open")
        }, this)
    },
    handleUrlClick: function (d, f, e) {
        d = Docs.History.cleanUrl(d);
        if (this.opensNewWindow(f)) {
            window.open(d);
            e && e.selectUrl(this.currentCls ? "#!/javascriptapi/" + this.currentCls.name : "")
        } else {
            this.loadClass(d)
        }
    },
    loadIndex: function (b) {
        Ext.getCmp("treecontainer").showTree("classtree");
        this.callParent(arguments);
        this.fireEvent("showIndex")
    },
    loadClass: function (f, i) {
        Ext.getCmp("card-panel").layout.setActiveItem("classcontainer");
        Ext.getCmp("treecontainer").showTree("classtree");
        i || Docs.History.push(f);
        var j = f.match(/^#!\/javascriptapi\/(.*?)(?:-(.*))?$/);
        var g = Docs.ClassRegistry.canonicalName(j[1]);
        var h = j[2];
        if (this.getOverview()) {
            this.getOverview().setLoading(true)
        }
        if (this.cache[g]) {
            this.showClass(this.cache[g], h)
        } else {
            this.cache[g] = "in-progress";
            Ext.data.JsonP.request({
                url: this.getBaseUrl() + "/api/" + g + ".js",
                callbackName: g.replace(/\./g, "_"),
                success: function (b, a) {
                    this.cache[g] = b;
                    this.showClass(b, h)
                },
                failure: function (b, a) {
                    this.cache[g] = false;
                    this.getOverview().setLoading(false);
                    this.getController("Failure").show404("Class <b>" + Ext.String.htmlEncode(g) + "</b> was not found.")
                },
                scope: this
            })
        }
    },
    showClass: function (e, f) {
        var d = false;
        if (e === "in-progress") {
            return
        }
        this.getOverview().setLoading(false);
        this.getViewport().setPageTitle(e.name);
        if (this.currentCls !== e) {
            this.currentCls = e;
            this.getHeader().load(e);
            this.getOverview().load(e);
            this.applyExpanded(e);
            d = true
        }
        this.currentCls = e;
        this.getOverview().setScrollContext("#!/javascriptapi/" + e.name);
        if (f) {
            this.getOverview().scrollToEl("#" + f);
            this.fireEvent("showMember", e.name, f)
        } else {
            this.getOverview().restoreScrollState()
        }
        this.getTree().selectUrl("#!/javascriptapi/" + e.name);
        this.fireEvent("showClass", e.name, {
            reRendered: d
        })
    }
});
Ext.define("Docs.controller.Search", {
    extend: "Ext.app.Controller",
    requires: ["Docs.ClassRegistry", "Docs.GuideSearch", "Docs.store.Search", "Docs.History"],
    stores: ["Search"],
    refs: [{
        ref: "field",
        selector: "#search-field"
    }],
    pageIndex: 0,
    pageSize: 10,
    basicSearchDelay: 50,
    guideSearchDelay: 500,
    dropdownHideDelay: 500,
    init: function () {
        this.control({
            "#search-dropdown": {
                itemclick: function (c, d) {
                    this.loadRecord(d)
                },
                changePage: function (c, d) {
                    this.pageIndex += d;
                    this.displayResults();
                    this.keepDropdown()
                },
                footerClick: function (b) {
                    this.keepDropdown()
                }
            },
            "#search-field": {
                keyup: function (m, l) {
                    var j = this.getDropdown();
                    m.setHideTrigger(m.getValue().length === 0);
                    if (l.keyCode === Ext.EventObject.ESC || !m.value) {
                        j.hide();
                        m.setValue("");
                        return
                    } else {
                        j.show()
                    }
                    var h = j.getSelectionModel();
                    var i = h.getLastSelected();
                    var n = j.store.indexOf(i);
                    var k = j.store.getCount() - 1;
                    if (l.keyCode === Ext.EventObject.UP) {
                        if (n === undefined) {
                            h.select(0)
                        } else {
                            h.select(n === 0 ? k : (n - 1))
                        }
                    } else {
                        if (l.keyCode === Ext.EventObject.DOWN) {
                            if (n === undefined) {
                                h.select(0)
                            } else {
                                h.select(n === k ? 0 : n + 1)
                            }
                        } else {
                            if (l.keyCode === Ext.EventObject.ENTER) {
                                l.preventDefault();
                                i && this.loadRecord(i)
                            } else {
                                this.pageIndex = 0;
                                clearTimeout(this.searchTimeout);
                                this.searchTimeout = Ext.Function.defer(function () {
                                    this.search(m.value)
                                }, this.basicSearchDelay, this)
                            }
                        }
                    }
                },
                focus: function (b) {
                    if (b.value && this.getDropdown().store.getCount() > 0) {
                        this.getDropdown().show()
                    }
                },
                blur: function () {
                    var b = this.getDropdown();
                    this.hideTimeout = Ext.Function.defer(b.hide, this.dropdownHideDelay, b)
                }
            }
        })
    },
    getDropdown: function () {
        return this.dropdown || (this.dropdown = Ext.getCmp("search-dropdown"))
    },
    keepDropdown: function () {
        clearTimeout(this.hideTimeout);
        this.getField().focus()
    },
    loadRecord: function (b) {
        Docs.History.navigate(b.get("url"));
        this.getDropdown().hide()
    },
    search: function (b) {
        if (b === this.previousTerm) {
            return
        }
        this.previousTerm = b;
        this.basicSearch(b);
        if (Docs.GuideSearch.isEnabled()) {
            this.guideSearch(b)
        }
    },
    guideSearch: function (b) {
        Docs.GuideSearch.deferredSearch(b, function (a) {
            this.basicSearch(b, a)
        }, this, this.guideSearchDelay)
    },
    basicSearch: function (c, d) {
        this.displayResults(Docs.ClassRegistry.search(c, d))
    },
    displayResults: function (d) {
        d = d || this.previousResults;
        if (this.pageIndex < 0) {
            this.pageIndex = 0
        } else {
            if (this.pageIndex > Math.floor(d.length / this.pageSize)) {
                this.pageIndex = Math.floor(d.length / this.pageSize)
            }
        }
        var f = this.pageIndex * this.pageSize;
        var e = f + this.pageSize;
        this.getDropdown().setTotal(d.length);
        this.getDropdown().setStart(f);
        this.getDropdown().getStore().loadData(d.slice(f, e));
        this.getDropdown().alignTo("search-field", "bl", [-12, -2]);
        if (d.length > 0) {
            this.getDropdown().getSelectionModel().select(0)
        }
        this.previousResults = d
    }
});
Ext.define("Docs.controller.Examples", {
    extend: "Docs.controller.Content",
    baseUrl: "#!/example",
    title: "Examples",
    refs: [{
        ref: "viewport",
        selector: "#viewport"
    }, {
        ref: "index",
        selector: "#exampleindex"
    }, {
        ref: "tree",
        selector: "#exampletree"
    }, {
        ref: "page",
        selector: "#example"
    }],
    init: function () {
        this.addEvents("showExample");
        this.control({
            "#exampletree": {
                urlclick: function (d, c) {
                    this.loadExample(d)
                }
            },
            "exampleindex > thumblist": {
                urlclick: function (b) {
                    this.loadExample(b)
                }
            },
            "touchexamplecontainer, examplecontainer": {
                afterrender: function (b) {
                    b.el.addListener("click", function (d, a) {
                        this.openInNewWindow()
                    }, this, {
                        delegate: "button.new-window"
                    })
                }
            },
            touchexamplecontainer: {
                afterrender: function (b) {
                    b.el.addListener("click", function (d, a) {
                        this.changeDevice("tablet")
                    }, this, {
                        delegate: "button.tablet"
                    });
                    b.el.addListener("click", function (d, a) {
                        this.changeDevice("phone")
                    }, this, {
                        delegate: "button.phone"
                    });
                    b.el.addListener("click", function (d, a) {
                        this.changeOrientation("portrait")
                    }, this, {
                        delegate: "button.portrait"
                    });
                    b.el.addListener("click", function (d, a) {
                        this.changeOrientation("landscape")
                    }, this, {
                        delegate: "button.landscape"
                    })
                }
            }
        })
    },
    loadIndex: function () {
        Ext.getCmp("treecontainer").showTree("exampletree");
        this.callParent()
    },
    loadExample: function (d, f) {
        var e = this.getExample(d);
        if (!e) {
            this.getController("Failure").show404("Example <b>" + Ext.String.htmlEncode(d) + "</b> was not found.");
            return
        }
        this.getViewport().setPageTitle(e.text);
        if (this.activeUrl !== d) {
            this.getPage().clear();
            this.activateExampleCard();
            this.getPage().load(e)
        } else {
            this.activateExampleCard()
        }
        f || Docs.History.push(d);
        this.fireEvent("showExample", d);
        this.getTree().selectUrl(d);
        this.activeUrl = d
    },
    activateExampleCard: function () {
        Ext.getCmp("card-panel").layout.setActiveItem("example");
        Ext.getCmp("treecontainer").showTree("exampletree")
    },
    getExample: function (b) {
        if (!this.map) {
            this.map = {};
            Ext.Array.forEach(Docs.data.examples, function (a) {
                Ext.Array.forEach(a.items, function (d) {
                    this.map["#!/example/" + d.name] = d
                }, this)
            }, this)
        }
        return this.map[b]
    },
    changeOrientation: function (b) {
        this.getPage().setOrientation(b)
    },
    changeDevice: function (b) {
        this.getPage().setDevice(b)
    },
    openInNewWindow: function () {
        window.open(this.getExample(this.activeUrl).url)
    }
});
Ext.define("Docs.controller.Guides", {
    extend: "Docs.controller.Content",
    baseUrl: "#!/guide",
    title: "Guides",
    refs: [{
        ref: "viewport",
        selector: "#viewport"
    }, {
        ref: "index",
        selector: "#guideindex"
    }, {
        ref: "tree",
        selector: "#guidetree"
    }, {
        ref: "guide",
        selector: "#guide"
    }],
    cache: {},
    init: function () {
        this.addEvents("showGuide");
        this.control({
            "#guidetree": {
                urlclick: function (d, c) {
                    this.handleUrlClick(d, c, this.getTree())
                }
            },
            "guideindex > thumblist": {
                urlclick: function (b) {
                    this.loadGuide(b)
                }
            },
            indexcontainer: {
                afterrender: function (b) {
                    b.el.addListener("click", function (d, a) {
                        this.handleUrlClick(a.href, d)
                    }, this, {
                        preventDefault: true,
                        delegate: ".guide"
                    })
                }
            },
            doctabs: {
                tabClose: function (b) {
                    this.getGuide().eraseScrollContext(b)
                }
            }
        })
    },
    handleUrlClick: function (d, f, e) {
        d = d.replace(/.*#!?/, "#!");
        if (this.opensNewWindow(f)) {
            window.open(d);
            e && e.selectUrl(this.activeUrl ? this.activeUrl : "")
        } else {
            this.loadGuide(d)
        }
    },
    loadIndex: function () {
        Ext.getCmp("treecontainer").showTree("guidetree");
        this.callParent()
    },
    loadGuide: function (j, h) {
        Ext.getCmp("card-panel").layout.setActiveItem("guide");
        Ext.getCmp("treecontainer").showTree("guidetree");
        var g = j.match(/^#!\/guide\/(.*?)(-section-.*)?$/);
        var f = g[1];
        var i = g[2];
        j = "#!/guide/" + f;

        h || Docs.History.push(j);
        if (this.cache[f] && (this.cache[f].embededScript == null || this.cache[f].runScript == null)) {
            this.showGuide(this.cache[f], j, f, i);
        } else {
            this.cache[f] = "in-progress";
            Ext.data.JsonP.request({
                url: this.getBaseUrl() + "/guides/" + f + "/README.js",
                callbackName: f,
                success: function (a) {
                    this.cache[f] = a;
                    this.showGuide(a, j, f, i)
                },
                failure: function (b, a) {
                    this.cache[f] = false;
                    this.getController("Failure").show404("Guide <b>" + Ext.String.htmlEncode(f) + "</b> was not found.")
                },
                scope: this
            })
        }
    },
    showGuide: function (i, j, f, h) {
        var g = false;
        if (i === "in-progress") {
            return
        }
        this.getViewport().setPageTitle(i.title);
        if (this.activeUrl !== j) {
            Ext.getCmp("guide").load({
                name: f,
                content: i.guide
            });
            g = true;
        }
        
        // 스크립트를 실행하기 위하여 다음코드 추가 by smkim 2017.08.21        
        if (i.embededScript != null) {
            var embededScriptBlock = document.getElementById("embededScriptBlock");
            if (embededScriptBlock) {
                embededScriptBlock.innerHTML = i.embededScript;
            }
        } 

        if (i.runScript != null) {
            eval(i.runScript);            
        }

        this.activeUrl = j;
        this.getGuide().setScrollContext(this.activeUrl);
        if (h) {
            this.getGuide().scrollToEl(f + h)
        } else {
            this.getGuide().restoreScrollState()
        }
        this.fireEvent("showGuide", f, {
            reRendered: g
        });
        this.getTree().selectUrl(j)
    }
});
Ext.define("Docs.controller.Videos", {
    extend: "Docs.controller.Content",
    baseUrl: "#!/video",
    title: "Videos",
    refs: [{
        ref: "viewport",
        selector: "#viewport"
    }, {
        ref: "index",
        selector: "#videoindex"
    }, {
        ref: "tree",
        selector: "#videotree"
    }],
    init: function () {
        this.addEvents("showVideo");
        this.control({
            "#videotree": {
                urlclick: function (b) {
                    this.loadVideo(b)
                }
            },
            "videoindex > thumblist": {
                urlclick: function (b) {
                    this.loadVideo(b)
                }
            }
        })
    },
    loadIndex: function () {
        Ext.getCmp("treecontainer").showTree("videotree");
        this.callParent()
    },
    loadVideo: function (j, h) {
        var f = false;
        Ext.getCmp("card-panel").layout.setActiveItem("video");
        Ext.getCmp("treecontainer").showTree("videotree");
        var g = j.match(/^#!\/video\/(.*)$/)[1];
        var i = this.getVideo(g);
        if (!i) {
            this.getController("Failure").show404("Video <b>" + Ext.String.htmlEncode(g) + "</b> was not found.");
            return
        }
        this.getViewport().setPageTitle(i.title);
        if (this.activeUrl !== j) {
            Ext.getCmp("video").load(i);
            f = true
        }
        h || Docs.History.push(j);
        this.fireEvent("showVideo", g, {
            reRendered: f
        });
        this.getTree().selectUrl(j);
        this.activeUrl = j
    },
    getVideo: function (b) {
        if (!this.map) {
            this.map = {};
            Ext.Array.forEach(Docs.data.videos, function (a) {
                Ext.Array.forEach(a.items, function (d) {
                    this.map[d.name] = d
                }, this)
            }, this)
        }
        return this.map[b]
    }
});
Ext.define("Docs.controller.CommentCounts", {
    extend: "Ext.app.Controller",
    requires: ["Docs.Comments"],
    refs: [{
        ref: "class",
        selector: "classoverview"
    }, {
        ref: "classIndex",
        selector: "#classindex"
    }, {
        ref: "guide",
        selector: "#guide"
    }, {
        ref: "guideIndex",
        selector: "#guideindex"
    }, {
        ref: "video",
        selector: "#video"
    }, {
        ref: "videoIndex",
        selector: "#videoindex"
    }],
    init: function () {
        Docs.Comments.on("countChange", this.updateCounts, this)
    },
    updateCounts: function (c, d) {
        this.getClass().updateCommentCounts();
        this.getClassIndex().updateCommentCounts();
        this.getGuide().updateCommentCounts();
        this.getGuideIndex().updateCommentCounts();
        this.getVideo().updateCommentCounts();
        this.getVideoIndex().updateCommentCounts()
    }
});
Ext.define("Docs.controller.Tests", {
    extend: "Docs.controller.Content",
    baseUrl: "#!/tests",
    refs: [{
        ref: "viewport",
        selector: "#viewport"
    }, {
        ref: "index",
        selector: "#testsindex"
    }],
    init: function () {
        this.addEvents("loadIndex");
        this.control({
            "#testsgrid": {
                afterrender: this.loadExamples
            }
        })
    },
    loadIndex: function () {
        this.fireEvent("loadIndex");
        Ext.getCmp("treecontainer").hide();
        this.callParent([true])
    },
    isActive: function () {
        return !!this.getIndex().getTab()
    },
    loadExamples: function () {
        this.getIndex().disable();
        Ext.data.JsonP.request({
            url: this.getBaseUrl() + "/inline-examples.js",
            callbackName: "__inline_examples__",
            success: function (b) {
                this.getIndex().addExamples(b);
                this.getIndex().enable()
            },
            scope: this
        })
    }
});
Ext.define("Docs.store.Settings", {
    extend: "Ext.data.Store",
    requires: ["Docs.model.Setting"],
    model: "Docs.model.Setting"
});
Ext.define("Docs.Settings", {
    extend: "Docs.LocalStore",
    singleton: true,
    requires: "Docs.store.Settings",
    storeName: "Docs.store.Settings",
    defaults: {
        show: {
            "public": true,
            "protected": false,
            "private": false,
            deprecated: false,
            removed: false,
            inherited: true,
            accessor: true
        },
        comments: {
            hideRead: false
        },
        showPrivateClasses: false,
        classTreeLogic: "PackageLogic"
    },
    set: function (d, f) {
        var e = this.store.findExact("key", d);
        if (e > -1) {
            this.store.removeAt(e)
        }
        this.store.add({
            key: d,
            value: f
        });
        this.syncStore()
    },
    get: function (c) {
        var d = this.store.findExact("key", c);
        return d > -1 ? this.store.getAt(d).get("value") : this.defaults[c]
    }
});
Ext.define("Docs.controller.Tabs", {
    extend: "Ext.app.Controller",
    requires: ["Docs.History", "Docs.Settings"],
    refs: [{
        ref: "welcomeIndex",
        selector: "#welcomeindex"
    }, {
        ref: "classIndex",
        selector: "#classindex"
    }, {
        ref: "guideIndex",
        selector: "#guideindex"
    }, {
        ref: "videoIndex",
        selector: "#videoindex"
    }, {
        ref: "exampleIndex",
        selector: "#exampleindex"
    }, {
        ref: "testsIndex",
        selector: "#testsindex"
    }, {
        ref: "commentIndex",
        selector: "#commentindex"
    }, {
        ref: "classTree",
        selector: "#classtree"
    }, {
        ref: "guideTree",
        selector: "#guidetree"
    }, {
        ref: "exampleTree",
        selector: "#exampletree"
    }, {
        ref: "videoTree",
        selector: "#videotree"
    }, {
        ref: "doctabs",
        selector: "#doctabs"
    }],
    init: function () {
        
        this.getController("Classes").addListener({
            showClass: function (b) {
                this.addTabFromTree("#!/javascriptapi/" + b)
            },
            scope: this
        });
        this.getController("Guides").addListener({
            showGuide: function (b) {
                this.addTabFromTree("#!/guide/" + b)
            },
            scope: this
        });
        this.getController("Examples").addListener({
            showExample: function (b) {
                this.addTabFromTree(b)
            },
            scope: this
        });
        this.getController("Videos").addListener({
            showVideo: function (b) {
                this.addTabFromTree("#!/video/" + b)
            },
            scope: this
        });
        this.control({
            "[componentCls=doctabs]": {
                tabActivate: function (d, c) {
                    Docs.History.push(d, c)
                },
                scope: this
            }
        })
    },
    onLaunch: function () {
        this.getDoctabs().setStaticTabs(Ext.Array.filter(
            [
                this.getWelcomeIndex().getTab(),                
                this.getGuideIndex().getTab(),
                this.getExampleIndex().getTab(),
                this.getClassIndex().getTab(),                
                this.getVideoIndex().getTab(),                
                this.getTestsIndex().getTab()
            ], function (a) {
            return a
        }));
        this.commentsTab = this.getCommentIndex().getTab();
        var b = Docs.Settings.get("tabs");
        if (b) {
            Ext.Array.forEach(b, function (a) {
                this.addTabFromTree(a, {
                    animate: false
                })
            }, this)
        }
        Docs.History.notifyTabsLoaded()
    },
    showCommentsTab: function () {
        var b = this.getDoctabs().getStaticTabs();
        this.getDoctabs().setStaticTabs(b.concat(this.commentsTab))
    },
    hideCommentsTab: function () {
        var b = this.getDoctabs().getStaticTabs();
        this.getDoctabs().setStaticTabs(Ext.Array.remove(b, this.commentsTab))
    },
    addTabFromTree: function (h, g) {
        var e = this.getTree(h);
        var f = e.findRecordByUrl(h);
        if (f) {
            this.addTab(f, g)
        }
    },
    addTab: function (d, c) {
        c = c || {
            animate: true,
            activate: true
        };
        this.getDoctabs().addTab({
            href: d.url,
            text: d.text,
            iconCls: d.iconCls
        }, c)
    },
    getTree: function (b) {
        if (/#!?\/javascriptapi/.test(b)) {
            return this.getClassTree()
        } else {
            if (/#!?\/guide/.test(b)) {
                return this.getGuideTree()
            } else {
                if (/#!?\/video/.test(b)) {
                    return this.getVideoTree()
                } else {
                    if (/#!?\/example/.test(b)) {
                        return this.getExampleTree()
                    } else {
                        return this.getClassTree()
                    }
                }
            }
        }
    }
});
Ext.define("Docs.controller.Comments", {
    extend: "Docs.controller.Content",
    baseUrl: "#!/comment",
    title: "Comments",
    requires: ["Docs.Settings", "Docs.Comments"],
    refs: [{
        ref: "viewport",
        selector: "#viewport"
    }, {
        ref: "index",
        selector: "#commentindex"
    }, {
        ref: "commentsFullList",
        selector: "commentsFullList"
    }],
    recentCommentsSettings: {},
    init: function () {
        this.control({
            commentsFullList: {
                hideReadChange: function () {
                    this.fetchRecentComments()
                },
                sortOrderChange: function (b) {
                    this.recentCommentsSettings.sortByScore = (b === "votes");
                    this.fetchRecentComments()
                }
            },
            commentsPager: {
                loadMore: function (b) {
                    this.fetchRecentComments(b)
                }
            },
            commentsUsers: {
                select: function (b) {
                    this.recentCommentsSettings.username = b;
                    this.fetchRecentComments()
                }
            },
            commentsTargets: {
                select: function (b) {
                    this.recentCommentsSettings.targetId = b && b.get("id");
                    this.fetchRecentComments()
                }
            },
            commentsTags: {
                select: function (b) {
                    this.recentCommentsSettings.tagname = b && b.get("tagname");
                    this.fetchRecentComments()
                }
            }
        })
    },
    loadIndex: function () {
        this.fireEvent("loadIndex");
        Ext.getCmp("treecontainer").hide();
        if (!this.recentComments) {
            this.fetchRecentComments();
            this.recentComments = true
        }
        this.callParent([true])
    },
    fetchRecentComments: function (f) {
        var e = Docs.Settings.get("comments");
        var d = {
            offset: f || 0,
            limit: 100,
            hideRead: e.hideRead ? 1 : undefined,
            sortByScore: this.recentCommentsSettings.sortByScore ? 1 : undefined,
            username: this.recentCommentsSettings.username,
            targetId: this.recentCommentsSettings.targetId,
            tagname: this.recentCommentsSettings.tagname
        };
        this.getCommentsFullList().setMasked(true);
        Docs.Comments.request("jsonp", {
            url: "/comments_recent",
            method: "GET",
            params: d,
            success: function (a) {
                this.getCommentsFullList().setMasked(false);
                var b = f > 0;
                this.getCommentsFullList().load(a, b)
            },
            scope: this
        })
    }
});
Ext.define("Docs.view.Tabs", {
    extend: "Ext.container.Container",
    alias: "widget.doctabs",
    id: "doctabs",
    componentCls: "doctabs",
    requires: ["Docs.History", "Docs.ClassRegistry", "Docs.view.TabMenu"],
    minTabWidth: 80,
    maxTabWidth: 160,
    animDuration: 150,
    tabs: [],
    tabsInBar: [],
    tabCache: {},
    staticTabs: [],
    initComponent: function () {
        this.addEvents("tabActivate", "tabClose");
        this.tpl = Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="doctab overview {cls}{active}">', '<div class="l"></div>', '<div class="m">', '<tpl if="text">', '<a class="tabUrl ov-tab-text" href="{href}">{text}</a>', "<tpl else>", '<a class="tabUrl ov-tab" href="{href}">&nbsp;</a>', "</tpl>", "</div>", '<div class="r"></div>', "</div>", "</tpl>", '<div style="float: left; width: 8px">&nbsp;</div>', '<div class="tab-overflow"></div>');
        this.html = this.tpl.applyTemplate(this.staticTabs);
        this.tabTpl = Ext.create("Ext.XTemplate", '<div class="doctab', '{[values.active ? (" active") : ""]}', '" style="', '{[values.width ? ("width: " + values.width + "px;") : ""]}', '{[values.visible ? "" : "visibility: hidden;"]}">', '<div class="l"></div>', '<div class="m">', '<span class="icn {iconCls}">&nbsp;</span>', '<a class="tabUrl main-tab" href="{href}">{text}</a>', "</div>", '<div class="r"><a class="close" href="#">&nbsp;</a></div>', "</div>");
        this.on("afterrender", this.initListeners, this);
        this.on("resize", this.refresh, this);
        this.callParent()
    },
    initListeners: function () {
        this.el.on("mouseover", function (c, d) {
            Ext.get(d).addCls("ovr")
        }, this, {
            delegate: ".close"
        });
        this.el.on("mouseout", function (c, d) {
            Ext.get(d).removeCls("ovr")
        }, this, {
            delegate: ".close"
        });
        this.el.on("click", function (f, d) {
            var e = Ext.get(d).up(".doctab").down(".tabUrl").getAttribute("href");
            e = Docs.History.cleanUrl(e);
            this.removeTab(e);
            this.fireEvent("tabClose", e)
        }, this, {
            delegate: ".close",
            preventDefault: true
        });
        this.el.on("click", function (f, d) {
            if (Ext.fly(f.getTarget()).hasCls("close")) {
                return
            }
            var e = Ext.get(d).down(".tabUrl").getAttribute("href");
            this.fireEvent("tabActivate", e, {
                navigate: true
            })
        }, this, {
            delegate: ".doctab"
        });
        this.el.on("contextmenu", function (c, d) {
            if (!Ext.get(d).hasCls("overview")) {
                this.createMenu().showBy(d)
            }
        }, this, {
            delegate: ".doctab",
            preventDefault: true
        });
        this.el.on("click", Ext.emptyFn, this, {
            delegate: ".tabUrl",
            preventDefault: true
        });
        this.el.on("mouseleave", function () {
            if (this.shouldResize) {
                this.resizeTabs({
                    animate: true
                })
            }
        }, this)
    },
    setStaticTabs: function (b) {
        this.staticTabs = b;
        this.refresh()
    },
    getStaticTabs: function (b) {
        return this.staticTabs
    },
    addTab: function (d, c) {
        d = this.formatTabTexts(d);
        this.tabCache[d.href] = d;
        if (!this.hasTab(d.href)) {
            this.tabs.push(d.href);
            if (this.roomForNewTab()) {
                this.addTabToBar(d, c)
            }
            this.addTabToMenu(this.overflowButton.menu, d)
        }
        if (c.activate) {
            this.activateTab(d.href)
        }
        this.saveTabs()
    },
    formatTabTexts: function (c) {
        if (/#!?\/javascriptapi\//.test(c.href)) {
            var d = c.href.replace(/^.*#!?\/javascriptapi\//, "");
            c.text = Docs.ClassRegistry.shortName(d);
            c.tooltip = d
        } else {
            c.tooltip = c.text
        }
        return c
    },
    removeTab: function (d) {
        if (!this.hasTab(d)) {
            return
        }
        this.removeFromArray(this.tabs, d);
        var e = this.removeFromArray(this.tabsInBar, d);
        var f = this.tabs[this.tabsInBar.length];
        if (f) {
            this.tabsInBar.push(f)
        }
        if (this.activeTab === d) {
            if (this.tabs.length === 0) {
                Docs.App.getController(this.getControllerName(d)).loadIndex()
            } else {
                if (e === this.tabs.length) {
                    e -= 1
                }
                this.activateTab(this.tabs[e]);
                this.fireEvent("tabActivate", this.tabs[e])
            }
        }
        if (this.tabs.length >= this.maxTabsInBar()) {
            this.refresh()
        } else {
            this.removeTabFromBar(d)
        }
        this.saveTabs()
    },
    removeFromArray: function (f, d) {
        var e = Ext.Array.indexOf(f, d);
        if (e !== -1) {
            Ext.Array.erase(f, e, 1)
        }
        return e
    },
    activateTab: function (d) {
        this.activeTab = d;
        if (!this.inTabs(d)) {
            this.swapLastTabWith(d)
        }
        Ext.Array.each(Ext.query(".doctab a.tabUrl"), function (a) {
            Ext.get(a).up(".doctab").removeCls(["active", "highlight"])
        });
        var e = Ext.query('.doctab a[href="' + d + '"]')[0];
        if (e) {
            var f = Ext.get(e).up(".doctab");
            f.addCls("active")
        }
        this.highlightOverviewTab(d)
    },
    refresh: function () {
        var i = this.tpl.applyTemplate(this.staticTabs);
        var f = this.maxTabsInBar() < this.tabs.length ? this.maxTabsInBar() : this.tabs.length;
        this.tabsInBar = this.tabs.slice(0, f);
        for (var j = 0; j < f; j++) {
            var h = this.tabCache[this.tabs[j]];
            var g = Ext.apply(h, {
                visible: true,
                active: this.activeTab === h.href,
                width: this.tabWidth()
            });
            i += this.tabTpl.applyTemplate(g)
        }
        this.el.dom.innerHTML = i;
        if (this.activeTab && this.activeTab !== this.tabs[f - 1]) {
            this.activateTab(this.activeTab);
            this.fireEvent("tabActivate", this.activeTab)
        }
        this.highlightOverviewTab(this.activeTab);
        this.createOverflowButton();
        this.addToolTips()
    },
    closeAllTabs: function () {
        if (this.inTabBar(this.activeTab)) {
            this.tabs = this.tabsInBar = [this.activeTab]
        } else {
            this.tabs = this.tabsInBar = []
        }
        this.refresh();
        this.saveTabs()
    },
    tabData: function () {
        return Ext.Array.map(this.tabs, function (b) {
            return this.tabCache[b]
        }, this)
    },
    roomForNewTab: function () {
        return this.tabsInBar.length < this.maxTabsInBar()
    },
    hasTab: function (b) {
        return Ext.Array.contains(this.tabs, b)
    },
    addTabToBar: function (e, d) {
        this.tabsInBar.push(e.href);
        var f = Ext.get(this.tabTpl.append(this.el.dom, e));
        this.addMainTabTooltip(f, e);
        if (d.animate && !Ext.isIE) {
            f.setStyle("width", "10px");
            f.setStyle({
                visibility: "visible"
            });
            f.animate({
                to: {
                    width: this.tabWidth()
                }
            })
        } else {
            f.setStyle({
                visibility: "visible"
            })
        }
        this.resizeTabs(d)
    },
    inTabBar: function (b) {
        return Ext.Array.contains(this.tabsInBar, b)
    },
    inTabs: function (d) {
        var c = Ext.Array.pluck(this.staticTabs, "href").concat(this.tabsInBar);
        return Ext.Array.contains(c, d)
    },
    removeTabFromBar: function (d) {
        var c = this.getTabEl(d);
        c.dom.removed = true;
        if (Ext.isIE) {
            c.remove();
            this.createOverflowButton()
        } else {
            c.animate({
                to: {
                    top: 30
                },
                duration: this.animDuration
            }).animate({
                to: {
                    width: 10
                },
                duration: this.animDuration,
                listeners: {
                    afteranimate: function () {
                        c.remove();
                        this.shouldResize = true;
                        this.createOverflowButton()
                    },
                    scope: this
                }
            })
        }
    },
    swapLastTabWith: function (d) {
        var e = this.getTabEl(this.tabsInBar[this.tabsInBar.length - 1]);
        if (e) {
            var f = this.tabTpl.append(document.body, this.tabCache[d]);
            e.dom.parentNode.replaceChild(f, e.dom);
            this.tabsInBar[this.tabsInBar.length - 1] = d;
            Ext.get(f).setStyle({
                visibility: "visible",
                width: String(this.tabWidth()) + "px"
            });
            this.addMainTabTooltip(f, this.tabCache[d])
        }
    },
    highlightOverviewTab: function (d) {
        var c = Ext.query(".doctab." + this.getControllerName(d).toLowerCase());
        if (c && c[0]) {
            Ext.get(c[0]).addCls("highlight")
        }
    },
    maxTabsInBar: function () {
        return Math.floor(this.tabBarWidth() / this.minTabWidth)
    },
    tabWidth: function () {
        var b = Math.floor(this.tabBarWidth() / this.tabsInBar.length) + 6;
        if (b > this.maxTabWidth) {
            return this.maxTabWidth
        } else {
            if (b < this.minTabWidth) {
                return this.minTabWidth
            } else {
                return b
            }
        }
    },
    tabBarWidth: function () {
        return this.getWidth() - (this.staticTabs.length * 50) - 15
    },
    resizeTabs: function (b) {
        this.shouldResize = false;
        Ext.Array.each(Ext.query(".doctab"), function (a) {
            var d = Ext.get(a);
            if (!d.dom.removed && !d.hasCls("overview")) {
                if (b && b.animate && !Ext.isIE) {
                    d.animate({
                        to: {
                            width: this.tabWidth()
                        }
                    })
                } else {
                    d.setWidth(this.tabWidth())
                }
            }
        }, this)
    },
    getTabEl: function (c) {
        var d = Ext.query('.doctab a[href="' + c + '"]');
        if (d && d[0]) {
            return Ext.get(d[0]).up(".doctab")
        }
    },
    createOverflowButton: function () {
        if (this.overflowButton) {
            this.overflowButton.destroy()
        }
        this.overflowButton = Ext.create("Ext.button.Button", {
            baseCls: "",
            renderTo: this.getEl().down(".tab-overflow"),
            menu: this.createMenu()
        })
    },
    createMenu: function () {
        var b = new Docs.view.TabMenu({
            listeners: {
                closeAllTabs: this.closeAllTabs,
                tabItemClick: function (a) {
                    this.fireEvent("tabActivate", a.href, {
                        navigate: true
                    })
                },
                scope: this
            }
        });
        Ext.Array.each(this.tabs, function (a) {
            this.addTabToMenu(b, this.tabCache[a])
        }, this);
        return b
    },
    addTabToMenu: function (g, h) {
        var f = Ext.Array.indexOf(this.tabs, h.href);
        if (this.tabs.length > this.tabsInBar.length && f === this.maxTabsInBar()) {
            g.addTabCls(h, "overflow")
        }
        var e = this.inTabBar(h.href);
        g.addTab(h, e ? "" : "overflow")
    },
    addToolTips: function () {
        Ext.Array.each(this.staticTabs, function (c) {
            var d = Ext.get(Ext.query(".doctab." + c.cls)[0]);
            if (d) {
                Ext.create("Ext.tip.ToolTip", {
                    target: d,
                    html: c.tooltip
                })
            }
        });
        Ext.Array.each(this.tabsInBar, function (e) {
            var f = Ext.get(Ext.query('a.main-tab[href="' + e + '"]')[0]);
            var d = this.tabCache[e];
            if (f) {
                this.addMainTabTooltip(f.up(".doctab"), d)
            }
        }, this)
    },
    addMainTabTooltip: function (c, d) {
        if (d.tooltip) {
            Ext.create("Ext.tip.ToolTip", {
                target: c,
                html: d.tooltip
            })
        }
    },
    saveTabs: function () {
        Docs.Settings.set("tabs", this.tabs)
    },
    getControllerName: function (b) {
        if (/#!?\/javascriptapi/.test(b)) {
            return "Classes"
        } else {
            if (/#!?\/guide/.test(b)) {
                return "Guides"
            } else {
                if (/#!?\/video/.test(b)) {
                    return "Videos"
                } else {
                    if (/#!?\/example/.test(b)) {
                        return "Examples"
                    } else {
                        if (/#!?\/tests/.test(b)) {
                            return "Tests"
                        } else {
                            if (/#!?\/comment/.test(b)) {
                                return "Comments"
                            } else {
                                return "Index"
                            }
                        }
                    }
                }
            }
        }
    }
});
Ext.define("Docs.view.welcome.Index", {
    extend: "Ext.container.Container",
    alias: "widget.welcomeindex",
    mixins: ["Docs.view.Scrolling"],
    requires: ["Docs.ContentGrabber"],
    cls: "welcome iScroll",
    initComponent: function () {
        this.html = Docs.ContentGrabber.get("welcome-content");
        this.hasContent = !!this.html;
        this.callParent(arguments)
    },
    getTab: function () {
        return this.hasContent ? {
            cls: "index",
            href: "#",
            tooltip: "Home"
        } : false
    }
});

Ext.define("Docs.view.cls.Index", {
    extend: "Ext.container.Container",
    alias: "widget.classindex",
    requires: ["Docs.ContentGrabber", "Docs.Comments"],
    mixins: ["Docs.view.Scrolling"],
    cls: "class-categories iScroll",
    margin: "15 10",
    autoScroll: true,
    initComponent: function () {
        this.tpl = new Ext.XTemplate('<h1 class="top" style="padding-bottom: 10px">DEXT5 API Documentation</h1>', '<tpl if="notice">', '<div class="notice">{notice}</div>', "</tpl>", "{categories}", "{news}");
        this.data = {
            notice: Docs.data.message || Docs.ContentGrabber.get("notice-text"),
            categories: Docs.ContentGrabber.get("categories-content"),
            news: Docs.ContentGrabber.get("news-content")
        };
        this.callParent(arguments)
    },
    afterRender: function () {
        this.callParent(arguments);
        if (!Docs.Comments.isEnabled()) {
            return
        }
        this.initComments()
    },
    initComments: function () {
        this.getEl().select("a.docClass").each(function (a) {
            var f = a.getHTML();
            var e = Docs.Comments.getClassTotalCount(f);
            if (e) {
                Ext.DomHelper.append(a, Docs.Comments.counterHtml(e))
            }
        }, this)
    },
    updateCommentCounts: function () {
        if (!this.getEl()) {
            return
        }
        this.getEl().select(".comment-counter-small").remove();
        this.initComments()
    },
    getTab: function () {
        var b = (Docs.data.classes || []).length > 0;
        return b ? {
            cls: "classes",
            href: "#!/javascriptapi",
            tooltip: "DEXT5 API Documentation"
        } : false
    }
});
Ext.define("Docs.view.examples.TouchContainer", {
    extend: "Ext.panel.Panel",
    alias: "widget.touchexamplecontainer",
    requires: ["Docs.view.examples.Device"],
    layout: "fit",
    cls: "example-container iScroll",
    autoScroll: true,
    bodyPadding: "10 0 5 0",
    initComponent: function () {
        this.dockedItems = [{
            xtype: "container",
            dock: "top",
            html: ['<h1 class="example-title">Example</h1>', '<div class="cls-grouping example-toolbar">', '<div class="devices">', '<button class="phone selected">Phone</button>', '<button class="tablet">Tablet</button>', "</div>", '<span class="separator">&nbsp;</span>', '<div class="orientations">', '<button class="landscape selected">Landscape</button>', '<button class="portrait">Portrait</button>', "</div>", "<div>", '<button class="new-window">Open in new window</button>', "</div>", "</div>"].join("")
        }];
        this.callParent(arguments)
    },
    load: function (b) {
        this.title = b.title + " Example";
        this.device = Ext.create("Docs.view.examples.Device", {
            url: b.url,
            device: b.device || "phone",
            orientation: b.orientation || "landscape"
        });
        this.refresh()
    },
    refresh: function () {
        this.update(this.device.toHtml());
        this.updateScale();
        this.updateTitle();
        this.updateButtons()
    },
    setDevice: function (b) {
        this.device.setDevice(b);
        this.refresh()
    },
    setOrientation: function (b) {
        this.device.setOrientation(b);
        this.refresh()
    },
    updateScale: function () {
        var b = Ext.query("iframe", this.el.dom)[0];
        if (b) {
            b.onload = Ext.Function.bind(function () {
                var d = document.createElement("style");
                var a = "html { overflow: hidden }";
                if (this.device.getDevice() === "tablet") {
                    a += "body { font-size: 79.8% !important; }"
                }
                d.innerHTML = a;
                b.contentWindow.document.body.appendChild(d)
            }, this)
        }
    },
    updateTitle: function () {
        Ext.get(Ext.query(".example-title")).update(this.title)
    },
    updateButtons: function () {
        Ext.Array.each(Ext.query(".example-toolbar .orientations button"), function (b) {
            Ext.get(b).removeCls("selected")
        });
        Ext.get(Ext.query(".example-toolbar .orientations button." + this.device.getOrientation())).addCls("selected");
        Ext.Array.each(Ext.query(".example-toolbar .devices button"), function (b) {
            Ext.get(b).removeCls("selected")
        });
        Ext.get(Ext.query(".example-toolbar .devices button." + this.device.getDevice())).addCls("selected")
    },
    clear: function () {
        this.update("")
    }
});
Ext.define("Docs.view.search.Dropdown", {
    extend: "Ext.view.View",
    alias: "widget.searchdropdown",
    requires: ["Docs.view.Signature"],
    floating: true,
    autoShow: false,
    autoRender: true,
    toFrontOnShow: true,
    focusOnToFront: false,
    store: "Search",
    id: "search-dropdown",
    overItemCls: "x-view-over",
    trackOver: true,
    itemSelector: "div.item",
    singleSelect: true,
    pageStart: 0,
    pageSize: 10,
    initComponent: function () {
        this.addEvents("changePage", "footerClick");
        this.tpl = new Ext.XTemplate('<tpl for=".">', '<div class="item">', '<div class="icon {icon}"></div>', '<div class="meta">{[this.getMetaTags(values.meta)]}</div>', '<div class="title {[this.getCls(values.meta)]}">{name}</div>', '<div class="class">{fullName}</div>', "</div>", "</tpl>", '<div class="footer">', '<tpl if="this.getTotal()">', '<a href="#" class="prev">&lt;</a>', '<span class="total">{[this.getStart()+1]}-{[this.getEnd()]} of {[this.getTotal()]}</span>', '<a href="#" class="next">&gt;</a>', "<tpl else>", '<span class="total">Nothing found</span>', "</tpl>", "</div>", {
            getCls: function (b) {
                return b["private"] ? "private" : (b.removed ? "removed" : "")
            },
            getMetaTags: function (b) {
                return Docs.view.Signature.render(b)
            },
            getTotal: Ext.bind(this.getTotal, this),
            getStart: Ext.bind(this.getStart, this),
            getEnd: Ext.bind(this.getEnd, this)
        });
        this.on("afterrender", function () {
            this.el.addListener("click", function () {
                this.fireEvent("changePage", this, -1)
            }, this, {
                preventDefault: true,
                delegate: ".prev"
            });
            this.el.addListener("click", function () {
                this.fireEvent("changePage", this, +1)
            }, this, {
                preventDefault: true,
                delegate: ".next"
            });
            this.el.addListener("click", function () {
                this.fireEvent("footerClick", this)
            }, this, {
                delegate: ".footer"
            })
        }, this);
        this.callParent(arguments)
    },
    setTotal: function (b) {
        this.total = b
    },
    getTotal: function () {
        return this.total
    },
    setStart: function (b) {
        this.pageStart = b
    },
    getStart: function (b) {
        return this.pageStart
    },
    getEnd: function (c) {
        var d = this.pageStart + this.pageSize;
        return d > this.total ? this.total : d
    }
});
Ext.define("Docs.view.search.Container", {
    extend: "Ext.container.Container",
    alias: "widget.searchcontainer",
    requires: "Docs.view.search.Dropdown",
    initComponent: function () {
        if (Docs.data.search.length) {
            this.cls = "search";
            this.items = [{
                xtype: "triggerfield",
                triggerCls: "reset",
                emptyText: "Search",
                width: 170,
                id: "search-field",
                enableKeyEvents: true,
                hideTrigger: true,
                onTriggerClick: function () {
                    this.reset();
                    this.focus();
                    this.setHideTrigger(true);
                    Ext.getCmp("search-dropdown").hide()
                }
            }, {
                xtype: "searchdropdown"
            }]
        }
        this.callParent()
    }
});
Ext.define("Docs.view.GroupTree", {
    extend: "Docs.view.DocTree",
    alias: "widget.grouptree",
    initComponent: function () {
        this.root = {
            text: "Root",
            children: this.buildTree(this.data)
        };
        this.callParent()
    },
    buildTree: function (b) {
        return Ext.Array.map(b, function (a) {
            if (a.items) {
                return {
                    text: a.title,
                    iconCls: "icon-pkg",
                    expanded: !!a.expanded,
                    children: this.buildTree(a.items)
                }
            } else {
                return this.convert(a)
            }
        }, this)
    }
});
Ext.define("Docs.view.auth.BaseForm", {
    extend: "Ext.Component",
    requires: ["Docs.Tip", "Docs.Auth"],
    createLoginFormHtml: function () {
        return ['<form class="loginForm">', '<input class="username" type="text" name="username" placeholder="Username" />', '<input class="password" type="password" name="password" placeholder="Password" />', '<label><input type="checkbox" name="remember" /> Remember Me</label>', '<input class="submit" type="submit" value="Sign in" />', " or ", '<a class="register" href="' + Docs.Auth.getRegistrationUrl() + '" target="_blank">Register</a>', "</form>"].join("")
    },
    bindFormSubmitEvent: function () {
        this.getEl().down("form").on("submit", this.submitLogin, this, {
            preventDefault: true
        })
    },
    submitLogin: function (m, h) {
        var n = Ext.get(h);
        var j = n.down("input[name=username]").getValue();
        var i = n.down("input[name=password]").getValue();
        var l = n.down("input[name=remember]");
        var k = l ? !!(l.getAttribute("checked")) : false;
        this.fireEvent("login", this, j, i, k)
    },
    showMessage: function (c) {
        var d = this.getEl().down("input[type=submit]");
        Docs.Tip.show(c, d, "bottom")
    }
});
Ext.define("Docs.view.auth.HeaderForm", {
    extend: "Docs.view.auth.BaseForm",
    alias: "widget.authHeaderForm",
    requires: ["Docs.Comments"],
    afterRender: function () {
        this.callParent(arguments);
        this.getEl().addListener("click", this.showLoginForm, this, {
            preventDefault: true,
            delegate: ".login"
        });
        this.getEl().addListener("click", function () {
            this.fireEvent("logout", this)
        }, this, {
            preventDefault: true,
            delegate: ".logout"
        })
    },
    showLoginForm: function () {
        this.update(this.createLoginFormHtml());
        this.bindFormSubmitEvent()
    },
    showLoggedIn: function (d) {
        var c = Docs.Comments.avatar(d.emailHash);
        this.update(c + "<div><span>" + d.userName + '</span> | <a href="#" class="logout">Logout</a></div>')
    },
    showLoggedOut: function () {
        this.update('<a href="#" class="login">Sign in / Register</a>')
    }
});
Ext.define("Docs.view.comments.Users", {
    alias: "widget.commentsUsers",
    extend: "Ext.panel.Panel",
    componentCls: "comments-users",
    requires: ["Docs.Comments", "Docs.view.SimpleSelectBehavior", "Docs.view.comments.FilterField"],
    layout: "border",
    initComponent: function () {
        this.items = [this.tabpanel = Ext.widget("tabpanel", {
            plain: true,
            region: "north",
            height: 50,
            items: [{
                title: "Votes"
            }, {
                title: "Comments"
            }],
            dockedItems: [{
                dock: "bottom",
                items: [{
                    xtype: "commentsFilterField",
                    emptyText: "Filter users by name...",
                    width: 320,
                    height: 20,
                    listeners: {
                        filter: this.onFilter,
                        scope: this
                    }
                }]
            }],
            listeners: {
                tabchange: this.onTabChange,
                scope: this
            }
        }), this.list = Ext.widget("dataview", {
            region: "center",
            cls: "iScroll users-list",
            autoScroll: true,
            store: Ext.create("Ext.data.Store", {
                fields: ["userName", "score", "emailHash", "mod"]
            }),
            allowDeselect: true,
            tpl: ["<ul>", '<tpl for=".">', "<li>", '<span class="score">{score}</span>', "{[Docs.Comments.avatar(values.emailHash)]}", '<span class="username <tpl if="mod">moderator</tpl>">{userName}</span>', "</li>", "</tpl>", "</ul>"],
            itemSelector: "li"
        })];
        new Docs.view.SimpleSelectBehavior(this.list, {
            select: this.onSelect,
            deselect: this.onDeselect,
            scope: this
        });
        this.callParent(arguments)
    },
    afterRender: function () {
        this.callParent(arguments);
        this.fetchUsers("votes")
    },
    onTabChange: function (d, c) {
        if (c.title === "Votes") {
            this.fetchUsers("votes")
        } else {
            this.fetchUsers("comments")
        }
    },
    onFilter: function (b) {
        this.list.getSelectionModel().deselectAll();
        this.list.getStore().clearFilter(true);
        this.list.getStore().filter({
            property: "userName",
            value: b,
            anyMatch: true
        })
    },
    deselectAll: function () {
        this.list.getSelectionModel().deselectAll()
    },
    onSelect: function (b) {
        this.selectedUser = b;
        this.fireEvent("select", b.get("userName"))
    },
    onDeselect: function () {
        this.selectedUser = undefined;
        this.fireEvent("select", undefined)
    },
    fetchUsers: function (b) {
        Docs.Comments.request("jsonp", {
            url: "/users",
            method: "GET",
            params: {
                sortBy: b
            },
            success: this.loadUsers,
            scope: this
        })
    },
    loadUsers: function (c) {
        this.list.getStore().loadData(c.data);
        if (this.selectedUser) {
            var d = this.list.getStore().findExact("userName", this.selectedUser.get("userName"));
            this.list.getSelectionModel().select(d, false, true)
        }
    }
});
Ext.define("Docs.view.cls.Header", {
    extend: "Ext.container.Container",
    requires: ["Docs.view.Signature"],
    alias: "widget.classheader",
    cls: "classheader",
    padding: "10 0 17 0",
    height: 55,
    initComponent: function () {
        //this.tpl = Ext.create("Ext.XTemplate", '<h1 class="{[this.getClass(values)]}">', '<tpl if="Docs.data.source">', '<a href="#" class="class-source-link">{name}', '<span class="class-source-tip">View source...</span>', "</a>", "<tpl else>", '<strong class="class-source-link">{name}</strong>', "</tpl>", '<tpl if="singleton">', '<span class="singleton">singleton</span>', "</tpl>", "<tpl if=\"values['enum']\">", '<span class="enum">enum of <b>{[values["enum"].type]}</b></span>', "</tpl>", "{[this.renderAliases(values.aliases)]}", "{[this.renderMetaTags(values.meta)]}", "</h1>", '<tpl if="Docs.data.showPrintButton">', '<a class="print" href="?print=/javascriptapi/{name}" target="_blank">Print</a>', "</tpl>", {
        this.tpl = Ext.create("Ext.XTemplate", '<h1 class="{[this.getClass(values)]}">', '<tpl if="Docs.data.source">', '<a href="#" class="class-source-link">{name}', '<span class="class-source-tip"></span>', "</a>", "<tpl else>", '<strong class="class-source-link">{name}</strong>', "</tpl>", '<tpl if="singleton">', '<span class="singleton"></span>', "</tpl>", "<tpl if=\"values['enum']\">", '<span class="enum">enum of <b>{[values["enum"].type]}</b></span>', "</tpl>", "{[this.renderAliases(values.aliases)]}", "{[this.renderMetaTags(values.meta)]}", "</h1>", '<tpl if="Docs.data.showPrintButton">', '<a class="print" href="?print=/javascriptapi/{name}" target="_blank">Print</a>', "</tpl>", {
            getClass: function (b) {
                if (b.singleton) {
                    return "singleton"
                } else {
                    if (b.component) {
                        return "component"
                    } else {
                        return "class"
                    }
                }
            },
            renderAliases: function (e) {
                var f = {
                    widget: "xtype",
                    plugin: "ptype",
                    feature: "ftype"
                };
                var d = [];
                e && Ext.Object.each(e, function (a, b) {
                    d.push((f[a] || a) + ": " + b.join(", "))
                });
                if (d.length > 0) {
                    return "<span class='xtype'>" + d.join(", ") + "</span>"
                } else {
                    return ""
                }
            },
            renderMetaTags: function (b) {
                return " " + Docs.view.Signature.render(b, "long")
            }
        });
        if (Docs.data.source) {
            this.on("render", this.initSourceLink, this)
        }
        this.callParent()
    },
    initSourceLink: function () {
        this.classLinkEvent("click", function () {
            /*
            var d = this.loadedCls.files;
            if (d.length === 1) {
                window.open("source/" + d[0].href)
            } else {
                var c = this.createFileMenu(d);
                c.showBy(this, undefined, [58, -20])
            }
            */
        }, this);
        this.classLinkEvent("mouseover", function () {
            this.el.down(".class-source-tip").addCls("hover")
        }, this);
        this.classLinkEvent("mouseout", function () {
            this.el.down(".class-source-tip").removeCls("hover")
        }, this)
    },
    classLinkEvent: function (d, e, f) {
        this.el.on(d, e, f, {
            preventDefault: true,
            delegate: "a.class-source-link"
        })
    },
    createFileMenu: function (b) {
        return new Ext.menu.Menu({
            items: Ext.Array.map(b, function (a) {
                return {
                    text: a.filename,
                    handler: function () {
                        window.open("source/" + a.href)
                    }
                }
            }, this)
        })
    },
    load: function (b) {
        this.loadedCls = b;
        this.update(this.tpl.apply(b))
    }
});
Ext.override(Ext.dom.Element, {
    getAttribute: (Ext.isIE6 || Ext.isIE7 || Ext.isIE8) ? function (f, h) {
        var g = this.dom, d;
        if (h) {
            d = typeof g[h + ":" + f];
            if (d != "undefined" && d != "unknown") {
                return g[h + ":" + f] || null
            }
            return null
        }
        if (f === "for") {
            f = "htmlFor"
        }
        return g[f] || null
    }
    : function (e, d) {
        var f = this.dom;
        if (d) {
            return f.getAttributeNS(d, e) || f.getAttribute(d + ":" + e)
        }
        return f.getAttribute(e) || f[e] || null
    }
});
Ext.define("Docs.view.ThumbList", {
    extend: "Ext.view.View",
    alias: "widget.thumblist",
    requires: ["Docs.Comments"],
    cls: "thumb-list",
    itemSelector: "dl",
    urlField: "url",
    commentType: "",
    itemTpl: [],
    initComponent: function () {
        this.addEvents("urlclick");
        Ext.Array.forEach(this.data, function (c, d) {
            c.id = "sample-" + d
        });
        this.store = Ext.create("Ext.data.JsonStore", {
            fields: ["id", "title", "items"]
        });
        this.store.loadData(this.flattenSubgroups(this.data));
        this.tpl = new Ext.XTemplate(Ext.Array.flatten(["<div>", '<tpl for=".">', '<div><a name="{id}"></a><h2><div>{title}</div></h2>', "<dl>", '<tpl for="items">', this.itemTpl, "</tpl>", '<div style="clear:left"></div></dl></div>', "</tpl>", "</div>"]));
        this.itemTpl = undefined;
        this.data = undefined;
        this.on("viewready", function () {
            this.initHover();
            if (Docs.Comments.isEnabled()) {
                this.initComments()
            }
        }, this);
        this.callParent(arguments)
    },
    initHover: function () {
        this.getEl().on("mouseover", function (c, d) {
            Ext.get(d).addCls("over")
        }, this, {
            delegate: "dd"
        });
        this.getEl().on("mouseout", function (c, d) {
            Ext.get(d).removeCls("over")
        }, this, {
            delegate: "dd"
        })
    },
    initComments: function () {
        this.getEl().select("dd").each(function (e) {
            var d = e.getAttributeNS("ext", this.urlField).replace(/^.*\//, "");
            var f = Docs.Comments.getCount([this.commentType, d, ""]);
            if (f) {
                Ext.DomHelper.append(e.down("p"), Docs.Comments.counterHtml(f))
            }
        }, this)
    },
    updateCommentCounts: function () {
        if (!this.getEl()) {
            return
        }
        this.getEl().select(".comment-counter-small").remove();
        this.initComments()
    },
    flattenSubgroups: function (c) {
        function d(a) {
            if (a.items) {
                return Ext.Array.map(a.items, d)
            } else {
                return a
            }
        }
        return Ext.Array.map(c, function (a) {
            return {
                id: a.id,
                title: a.title,
                items: Ext.Array.map(a.items, function (b) {
                    if (b.items) {
                        var f = Ext.apply({}, d(b)[0]);
                        f.title = b.title;
                        return f
                    } else {
                        return b
                    }
                })
            }
        })
    },
    onContainerClick: function (c) {
        var d = c.getTarget("h2", 3, true);
        if (d) {
            d.up("div").toggleCls("collapsed")
        }
    },
    onItemClick: function (h, j, l, i) {
        var k = i.getTarget("dd", 5, true);
        if (k && !i.getTarget("a", 2)) {
            var e = k.getAttributeNS("ext", this.urlField);
            this.fireEvent("urlclick", e)
        }
        return this.callParent(arguments)
    }
});
Ext.define("Docs.view.guides.Index", {
    extend: "Ext.container.Container",
    alias: "widget.guideindex",
    requires: ["Docs.view.ThumbList"],
    mixins: ["Docs.view.Scrolling"],
    cls: "iScroll",
    margin: "10 0 0 0",
    autoScroll: true,
    initComponent: function () {
        this.items = [{
            xtype: "container",
            html: '<h1 class="eg">Guides</h1>'
        }, Ext.create("Docs.view.ThumbList", {
            commentType: "guide",
            itemTpl: ['<dd ext:url="#!/guide/{name}"><div class="thumb"><img src="guides/{name}/icon.png"/></div>', "<div><h4>{title}</h4><p>{description}</p></div>", "</dd>"],
            data: Docs.data.guides
        })];
        this.callParent(arguments)
    },
    getTab: function () {
        var b = (Docs.data.guides || []).length > 0;
        return b ? {
            cls: "guides",
            href: "#!/guide",
            tooltip: "Guides"
        } : false
    },
    updateCommentCounts: function () {
        this.down("thumblist").updateCommentCounts()
    }
});
Ext.define("Docs.view.videos.Index", {
    extend: "Ext.container.Container",
    alias: "widget.videoindex",
    requires: ["Docs.view.ThumbList"],
    mixins: ["Docs.view.Scrolling"],
    cls: "iScroll",
    margin: "10 0 0 0",
    autoScroll: true,
    initComponent: function () {
        this.items = [{
            xtype: "container",
            html: '<h1 class="eg">Videos</h1>'
        }, Ext.create("Docs.view.ThumbList", {
            commentType: "video",
            itemTpl: ['<dd ext:url="#!/video/{name}"><div class="thumb"><img src="{thumb}"/></div>', "<div><h4>{title}", "</h4><p>{[values.description.substr(0,80)]}...</p></div>", "</dd>"],
            data: Docs.data.videos
        })];
        this.callParent(arguments)
    },
    getTab: function () {
        var b = (Docs.data.videos || []).length > 0;
        return b ? {
            cls: "videos",
            href: "#!/video",
            tooltip: "Videos"
        } : false
    },
    updateCommentCounts: function () {
        this.down("thumblist").updateCommentCounts()
    }
});
Ext.define("Docs.view.examples.Index", {
    extend: "Ext.container.Container",
    alias: "widget.exampleindex",
    requires: ["Docs.view.ThumbList"],
    mixins: ["Docs.view.Scrolling"],
    cls: "iScroll",
    margin: "10 0 0 0",
    autoScroll: true,
    initComponent: function () {
        this.cls += Docs.data.touchExamplesUi ? " touch-examples-ui" : "";
        this.items = [{
            xtype: "container",
            html: '<h1 class="eg">Examples</h1>'
        }, Ext.create("Docs.view.ThumbList", {
            itemTpl: ['<dd ext:url="#!/example/{name}">', '<div class="thumb"><img src="{icon}"/></div>', "<div><h4>{title}", "<tpl if=\"status === 'new'\">", '<span class="new-sample"> (New)</span>', "</tpl>", "<tpl if=\"status === 'updated'\">", '<span class="updated-sample"> (Updated)</span>', "</tpl>", "<tpl if=\"status === 'experimental'\">", '<span class="new-sample"> (Experimental)</span>', "</tpl>", "</h4><p>{description}</p></div>", "</dd>"],
            data: Docs.data.examples
        })];
        this.callParent(arguments)
    },
    getTab: function () {
        var b = (Docs.data.examples || []).length > 0;
        return b ? {
            cls: "examples",
            href: "#!/example",
            tooltip: "Examples"
        } : false
    }
});
Ext.define("Docs.view.examples.Inline", {
    extend: "Ext.Panel",
    alias: "widget.inlineexample",
    requires: ["Docs.view.examples.InlineEditor", "Docs.view.examples.InlinePreview"],
    componentCls: "inline-example-cmp",
    layout: "card",
    border: 0,
    resizable: {
        transparent: true,
        handles: "s",
        constrainTo: false
    },
    maxCodeHeight: 400,
    options: {},
    constructor: function () {
        this.callParent(arguments);
        this.addEvents("previewsuccess", "previewfailure")
    },
    initComponent: function () {
        this.options = Ext.apply({
            device: "phone",
            orientation: "landscape"
        }, this.options);
        this.items = [this.editor = Ext.create("Docs.view.examples.InlineEditor", {
            cmpName: "code",
            value: this.value,
            listeners: {
                init: this.updateHeight,
                change: this.updateHeight,
                scope: this
            }
        }), this.preview = Ext.create("Docs.view.examples.InlinePreview", {
            cmpName: "preview",
            options: this.options
        })];
        this.relayEvents(this.preview, ["previewsuccess", "previewfailure"]);
        if (this.options.preview) {
            this.activeItem = 1;
            if (this.toolbar) {
                this.toolbar.activateButton("preview")
            }
        } else {
            this.activeItem = 0;
            if (this.toolbar) {
                this.toolbar.activateButton("code")
            }
        }
        this.on("afterrender", this.init, this);
        this.callParent(arguments)
    },
    init: function () {
        var b = this.layout.getActiveItem();
        if (b.cmpName === "preview") {
            this.showPreview()
        }
        this.updateHeight();
        if (this.toolbar) {
            this.initToolbarEvents()
        }
    },
    initToolbarEvents: function () {
        this.toolbar.on("buttonclick", function (b) {
            if (b === "code") {
                this.showCode()
            } else {
                if (b === "preview") {
                    this.showPreview()
                } else {
                    if (b === "copy") {
                        this.showCode();
                        this.editor.selectAll()
                    }
                }
            }
        }, this)
    },
    showCode: function () {
        this.layout.setActiveItem(0);
        this.updateHeight();
        if (this.toolbar) {
            this.toolbar.activateButton("code")
        }
    },
    showPreview: function () {
        this.preview.update(this.editor.getValue());
        this.layout.setActiveItem(1);
        this.updateHeight();
        if (this.toolbar) {
            this.toolbar.activateButton("preview")
        }
    },
    updateHeight: function () {
        var d = this.preview.getHeight();
        var e = this.editor.getHeight();
        var f = 30;
        if (Docs.data.touchExamplesUi && d > 0) {
            this.setHeight(d + f)
        } else {
            if (e > 0) {
                this.setHeight(Ext.Number.constrain(e + f, 0, this.maxCodeHeight))
            }
        }
    }
});
Ext.define("Docs.view.examples.InlineWrap", {
    requires: ["Docs.view.examples.Inline", "Docs.view.examples.InlineToolbar"],
    constructor: function (c) {
        this.pre = c;
        var d = this.parseOptions(c.className);
        this.initToolbar();
        if (d.preview) {
            this.replacePre(d)
        } else {
            this.tb.on("buttonclick", function (a) {
                d.preview = (a === "preview");
                this.replacePre(d)
            }, this, {
                single: true
            })
        }
    },
    parseOptions: function (c) {
        var d = {};
        Ext.Array.forEach(c.split(/ +/), function (a) {
            if (a === "phone" || a === "miniphone" || a === "tablet") {
                d.device = a
            } else {
                if (a === "ladscape" || a === "portrait") {
                    d.orientation = a
                } else {
                    d[a] = true
                }
            }
        });
        return d
    },
    initToolbar: function () {
        var b = document.createElement("div");
        this.pre.parentNode.insertBefore(b, this.pre);
        this.tb = Ext.create("Docs.view.examples.InlineToolbar", {
            renderTo: b
        })
    },
    replacePre: function (d) {
        var c = document.createElement("div");
        this.pre.parentNode.replaceChild(c, this.pre);
        Ext.create("Docs.view.examples.Inline", {
            height: 200,
            renderTo: c,
            value: Ext.String.htmlDecode(Ext.util.Format.stripTags(this.pre.innerHTML)),
            options: d,
            toolbar: this.tb
        })
    }
});
Ext.define("Docs.controller.InlineExamples", {
    extend: "Ext.app.Controller",
    requires: ["Docs.view.examples.InlineWrap"],
    init: function () {
        this.control({
            classoverview: {
                resize: this.createResizer(".class-overview"),
                afterload: this.replaceExampleDivs
            },
            guidecontainer: {
                resize: this.createResizer(".guide-container"),
                afterload: this.replaceExampleDivs
            }
        })
    },
    createResizer: function (b) {
        return function () {
            Ext.Array.each(Ext.ComponentQuery.query(b + " .inlineexample"), function (a) {
                if (a.editor && a.isVisible()) {
                    a.doLayout()
                }
            })
        }
    },
    replaceExampleDivs: function () {
        Ext.Array.each(Ext.query(".inline-example"), function (b) {
            Ext.create("Docs.view.examples.InlineWrap", b)
        }, this)
    }
});
Ext.define("Docs.view.tests.BatchRunner", {
    extend: "Ext.container.Container",
    requires: ["Docs.view.examples.Inline"],
    initComponent: function () {
        this.addEvents("start", "finish", "statuschange");
        this.callParent(arguments)
    },
    run: function (b) {
        this.fireEvent("start");
        this.runNext({
            pass: 0,
            fail: 0,
            total: b.length,
            remaining: b
        })
    },
    runNext: function (h) {
        this.fireEvent("statuschange", h);
        if (!h.remaining || h.remaining.length < 1) {
            this.fireEvent("finish");
            return
        }
        var j = h.remaining.shift();
        var i = j.get("options");
        i.preview = false;
        var f = "var alert = function(){};\n";
        var g = Ext.create("Docs.view.examples.Inline", {
            cls: "doc-test-preview",
            height: 0,
            value: f + j.get("code"),
            options: i,
            listeners: {
                previewsuccess: function (a) {
                    this.onSuccess(j, h)
                },
                previewfailure: function (a, b) {
                    this.onFailure(j, h, b)
                },
                scope: this
            }
        });
        this.removeAll();
        this.add(g);
        g.showPreview()
    },
    onSuccess: function (d, c) {
        d.set("status", "success");
        d.commit();
        c.pass++;
        this.runNext(c)
    },
    onFailure: function (e, f, d) {
        e.set("status", "failure");
        e.set("message", d.toString());
        e.commit();
        f.fail++;
        this.runNext(f)
    }
});
Ext.define("Docs.view.tests.Index", {
    extend: "Ext.container.Container",
    requires: ["Docs.model.Test", "Docs.view.tests.BatchRunner"],
    mixins: ["Docs.view.Scrolling"],
    alias: "widget.testsindex",
    layout: {
        type: "vbox",
        align: "stretch",
        shrinkToFit: true
    },
    padding: 10,
    initComponent: function () {
        this.store = Ext.create("Ext.data.Store", {
            model: "Docs.model.Test",
            data: []
        });
        this.grid = Ext.create("Ext.grid.Panel", {
            itemId: "testsgrid",
            padding: "5 0 5 0",
            autoScroll: true,
            flex: 1,
            store: this.store,
            selModel: {
                mode: "MULTI"
            },
            columns: [{
                xtype: "templatecolumn",
                text: "Name",
                width: 300,
                tpl: '<a href="{href}">{name}</a>'
            }, {
                xtype: "templatecolumn",
                text: "Status",
                width: 80,
                tpl: '<span class="doc-test-{status}">{status}</span>'
            }, {
                text: "Message",
                flex: 1,
                dataIndex: "message"
            }],
            listeners: {
                itemdblclick: function (c, d) {
                    this.batchRunner.run([d])
                },
                scope: this
            }
        });
        this.batchRunner = Ext.create("Docs.view.tests.BatchRunner", {
            height: 0,
            listeners: {
                start: this.disable,
                finish: this.enable,
                statuschange: this.updateTestStatus,
                scope: this
            }
        });
        this.items = [{
            html: "<h1>Inline examples test page</h1>",
            height: 30
        }, {
            itemId: "testcontainer",
            layout: {
                type: "vbox",
                align: "stretch",
                shrinkToFit: true
            },
            flex: 1,
            items: [{
                itemId: "testcontrols",
                layout: "hbox",
                items: [{
                    html: "<b>Double-click</b> to run an example, or",
                    margin: "5 5 5 0"
                }, {
                    xtype: "button",
                    itemId: "run-selected-button",
                    text: "Run Selected",
                    margin: 5,
                    handler: function () {
                        this.batchRunner.run(this.grid.getSelectionModel().getSelection())
                    },
                    scope: this
                }, {
                    html: "or",
                    margin: 5
                }, {
                    xtype: "button",
                    itemId: "run-all-button",
                    text: "Run All Examples",
                    margin: 5,
                    handler: function () {
                        this.batchRunner.run(this.store.getRange())
                    },
                    scope: this
                }, {
                    itemId: "testStatus",
                    margin: "5 5 5 15"
                }]
            }, this.grid]
        }, this.batchRunner];
        this.callParent(arguments)
    },
    getTab: function () {
        return Docs.data.tests ? {
            cls: "tests",
            href: "#!/tests",
            tooltip: "Tests",
            text: "Tests"
        } : false
    },
    addExamples: function (b) {
        this.store.add(b);
        this.setStatus(true, this.store.getCount() + " examples loaded.")
    },
    updateTestStatus: function (d) {
        var c = d.pass + d.fail;
        this.setStatus(d.fail === 0, c + "/" + d.total + " examples tested, " + d.fail + " failures")
    },
    setStatus: function (d, f) {
        var e = d ? "doc-test-success" : "doc-test-failure";
        this.down("#testStatus").update('<span class="' + e + '">' + f + "</span>")
    }
});
Ext.define("Docs.view.cls.PackageLogic", {
    extend: "Docs.view.cls.Logic",
    requires: "Docs.ClassRegistry",
    create: function () {
        this.root = {
            children: [],
            text: "Root"
        };
        this.packages = {
            "": this.root
        };
        this.privates = [];
        Ext.Array.forEach(this.classes, this.addClass, this);
        this.sortTree(this.root);
        return {
            root: this.root,
            privates: this.privates
        }
    },
    sortTree: function (b) {
        b.children.sort(this.compare);
        Ext.Array.forEach(b.children, this.sortTree, this)
    },
    compare: function (g, h) {
        if (g.leaf === h.leaf) {
            var b = g.text.toLowerCase();
            var a = h.text.toLowerCase();
            return b > a ? 1 : (b < a ? -1 : 0)
        } else {
            return g.leaf ? 1 : -1
        }
    },
    addClass: function (g) {
        if (g["private"] && !this.showPrivateClasses) {
            this.privates.push(this.classNode(g));
            return
        }
        if (this.packages[g.name]) {
            var f = this.packages[g.name];
            var i = this.classNode(g);
            f.iconCls = i.iconCls;
            f.url = i.url
        } else {
            var h = Docs.ClassRegistry.packageName(g.name);
            var j = this.packages[h] || this.addPackage(h);
            var i = this.classNode(g);
            this.addChild(j, i);
            this.packages[g.name] = i
        }
    },
    addPackage: function (e) {
        var g = Docs.ClassRegistry.packageName(e);
        var h = this.packages[g] || this.addPackage(g);
        var f = this.packageNode(e);
        this.addChild(h, f);
        this.packages[e] = f;
        return f
    },
    addChild: function (d, c) {
        d.children.push(c);
        if (d.leaf) {
            d.leaf = false
        }
    },
    classNode: function (b) {
        return {
            text: Docs.ClassRegistry.shortName(b.name),
            url: "#!/javascriptapi/" + b.name,
            iconCls: b.icon,
            cls: b["private"] ? "private" : "",
            leaf: true,
            children: []
        }
    },
    packageNode: function (b) {
        return {
            text: Docs.ClassRegistry.shortName(b),
            iconCls: "icon-pkg",
            leaf: false,
            children: []
        }
    }
});
Ext.define("Docs.view.cls.InheritanceLogic", {
    extend: "Docs.view.cls.Logic",
    create: function () {
        this.root = {
            children: [],
            text: "Root"
        };
        this.privates = [];
        this.subclasses = this.buildLookupTable(this.classes);
        Ext.Array.forEach(this.classes, this.addClass, this);
        if (!this.showPrivateClasses) {
            this.stripPrivateClasses(this.root)
        }
        this.sortTree(this.root);
        return {
            root: this.root,
            privates: this.privates
        }
    },
    sortTree: function (b) {
        b.children.sort(Ext.bind(this.compare, this));
        Ext.Array.forEach(b.children, this.sortTree, this)
    },
    compare: function (g, h) {
        var b = g.text.toLowerCase();
        var a = h.text.toLowerCase();
        return b > a ? 1 : (b < a ? -1 : 0)
    },
    buildLookupTable: function (d) {
        var c = {};
        Ext.Array.forEach(d, function (b) {
            var a = b["extends"];
            if (a && a !== "Object") {
                if (!c[a]) {
                    c[a] = []
                }
                c[a].push(b)
            }
        }, this);
        return c
    },
    classNode: function (b) {
        return {
            text: b.name,
            url: "#!/javascriptapi/" + b.name,
            iconCls: b.icon,
            cls: b["private"] ? "private" : ""
        }
    },
    addClass: function (e) {
        var d = e["extends"];
        if (!d || d === "Object") {
            var f = this.classNode(e);
            this.root.children.push(f);
            f.children = this.getSubclasses(e.name);
            f.leaf = f.children.length === 0
        }
    },
    getSubclasses: function (b) {
        if (!this.subclasses[b]) {
            return []
        }
        return Ext.Array.map(this.subclasses[b], function (a) {
            var d = this.classNode(a);
            d.children = this.getSubclasses(a.name);
            d.leaf = d.children.length === 0;
            return d
        }, this)
    },
    stripPrivateClasses: function (b) {
        b.children = Ext.Array.filter(b.children, function (a) {
            this.stripPrivateClasses(a);
            if (a.cls === "private" && a.children.length === 0) {
                this.privates.push(a);
                return false
            } else {
                return true
            }
        }, this)
    }
});
Ext.define("Docs.view.cls.Tree", {
    extend: "Docs.view.DocTree",
    alias: "widget.classtree",
    requires: ["Docs.view.cls.PackageLogic", "Docs.view.cls.InheritanceLogic", "Docs.Settings"],
    initComponent: function () {
        this.setLogic(Docs.Settings.get("classTreeLogic"), Docs.Settings.get("showPrivateClasses"));
        /*
        this.dockedItems = [{
            xtype: "container",
            dock: "bottom",
            layout: "hbox",
            items: [{
                width: 34
            }, {
                xtype: "checkbox",
                boxLabel: "Show private classes",
                cls: "cls-private-cb",
                checked: Docs.Settings.get("showPrivateClasses"),
                listeners: {
                    change: function (d, c) {
                        this.setLogic(Docs.Settings.get("classTreeLogic"), c)
                    },
                    scope: this
                }
            }]
        }, {
            xtype: "container",
            dock: "bottom",
            cls: "cls-grouping",
            html: [this.makeButtonHtml("PackageLogic", "By Package"), this.makeButtonHtml("InheritanceLogic", "By Inheritance")].join("")
        }];
        */
        this.on("afterrender", this.setupButtonClickHandler, this);
        this.callParent()
    },
    makeButtonHtml: function (d, c) {
        return Ext.String.format('<button class="{0} {1}">{2}</button>', d, Docs.Settings.get("classTreeLogic") === d ? "selected" : "", c)
    },
    setupButtonClickHandler: function () {
        this.el.addListener("click", function (g, h) {
            var f = Ext.get(h)
              , e = Ext.get(Ext.query(".cls-grouping button.selected")[0]);
            if (e.dom === f.dom) {
                return
            }
            e.removeCls("selected");
            f.addCls("selected");
            if (f.hasCls("PackageLogic")) {
                this.setLogic("PackageLogic", Docs.Settings.get("showPrivateClasses"))
            } else {
                this.setLogic("InheritanceLogic", Docs.Settings.get("showPrivateClasses"))
            }
        }, this, {
            delegate: "button"
        })
    },
    setLogic: function (i, f) {
        Docs.Settings.set("classTreeLogic", i);
        Docs.Settings.set("showPrivateClasses", f);
        var g = new Docs.view.cls[i]({
            classes: this.data,
            showPrivateClasses: f
        });
        if (this.root) {
            var h = this.getSelectionModel().getLastSelected();
            var j = g.create();
            this.expandLonelyNode(j.root);
            this.setRootNode(j.root);
            this.initNodeLinks();
            h && this.selectUrl(h.raw.url)
        } else {
            var j = g.create();
            this.root = j.root;
            this.expandLonelyNode(this.root)
        }
        this.privates = j.privates
    },
    expandLonelyNode: function (d) {
        var c = Ext.Array.filter(d.children, function (a) {
            return a.children.length > 0
        });
        if (c.length == 1) {
            c[0].expanded = true
        }
    },
    findRecordByUrl: function (b) {
        return this.callParent([b]) || this.findPrivateRecordByUrl(b)
    },
    findPrivateRecordByUrl: function (e) {
        var f = this.privates;
        for (var d = 0; d < f.length; d++) {
            if (f[d].url === e) {
                return f[d]
            }
        }
        return undefined
    }
});
Ext.define("Docs.view.TreeContainer", {
    extend: "Ext.panel.Panel",
    alias: "widget.treecontainer",
    requires: ["Docs.view.cls.Tree", "Docs.view.GroupTree"],
    cls: "iScroll",
    layout: "card",
    resizable: true,
    resizeHandles: "e",
    collapsible: true,
    hideCollapseTool: true,
    animCollapse: true,
    header: false,
    initComponent: function () {
        this.items = [{}, {
            xtype: "classtree",
            id: "classtree",
            data: Docs.data.classes
        }, {
            xtype: "grouptree",
            id: "exampletree",
            data: Docs.data.examples,
            convert: function (b) {
                return {
                    leaf: true,
                    text: b.title,
                    url: "#!/example/" + b.name,
                    iconCls: "icon-example"
                }
            }
        }, {
            xtype: "grouptree",
            id: "guidetree",
            data: Docs.data.guides,
            convert: function (b) {
                return {
                    leaf: true,
                    text: b.title,
                    url: "#!/guide/" + b.name,
                    iconCls: "icon-guide"
                }
            }
        }, {
            xtype: "grouptree",
            id: "videotree",
            data: Docs.data.videos,
            convert: function (b) {
                return {
                    leaf: true,
                    text: b.title,
                    url: "#!/video/" + b.name,
                    iconCls: "icon-video"
                }
            }
        }];
        this.callParent()
    },
    showTree: function (b) {
        this.show();
        this.layout.setActiveItem(b)
    }
});
Ext.define("Docs.view.comments.Expander", {
    alias: "widget.commentsExpander",
    extend: "Ext.Component",
    requires: ["Docs.Comments", "Docs.view.comments.TopLevelDropZone"],
    uses: ["Docs.view.comments.ListWithForm"],
    componentCls: "comments-expander",
    initComponent: function () {
        this.tpl = new Ext.XTemplate('<a href="#" class="side toggleComments"><span></span></a>', '<a href="#" class="name toggleComments">', "{[this.renderCount(values.count)]}", "</a>", {
            renderCount: this.renderCount
        });
        this.data = {
            count: this.count
        };
        this.callParent(arguments)
    },
    renderCount: function (b) {
        if (b === 1) {
            return "View 1 comment."
        } else {
            if (b > 1) {
                return "View " + b + " comments."
            } else {
                return "No comments. Click to add."
            }
        }
    },
    afterRender: function () {
        this.callParent(arguments);
        this.getEl().select(".toggleComments").each(function (b) {
            b.on("click", this.toggle, this, {
                preventDefault: true
            })
        }, this);
        new Docs.view.comments.TopLevelDropZone(this.getEl().down(".side.toggleComments"), {
            onValidDrop: Ext.Function.bind(this.setParent, this)
        })
    },
    setParent: function (c, d) {
        c.setParent(d, this.reload, this)
    },
    toggle: function () {
        this.expanded ? this.collapse() : this.expand()
    },
    expand: function () {
        this.expanded = true;
        this.getEl().addCls("open");
        this.getEl().down(".name").setStyle("display", "none");
        if (this.list) {
            this.list.show()
        } else {
            this.loadComments()
        }
    },
    collapse: function () {
        this.expanded = false;
        this.getEl().removeCls("open");
        this.getEl().down(".name").setStyle("display", "block");
        if (this.list) {
            this.list.hide()
        }
    },
    loadComments: function () {
        this.list = new Docs.view.comments.ListWithForm({
            target: this.target,
            newCommentTitle: this.newCommentTitle,
            renderTo: this.getEl(),
            listeners: {
                reorder: this.reload,
                scope: this
            }
        });
        this.reload()
    },
    reload: function () {
        Docs.Comments.load(this.target, function (b) {
            this.list.load(b)
        }, this)
    },
    setCount: function (b) {
        this.getEl().down(".name").update(this.renderCount(b))
    }
});
Ext.define("Docs.view.comments.LargeExpander", {
    requires: ["Docs.Comments", "Docs.view.comments.Expander"],
    html: ['<div class="comments-large-expander">', '<h3 class="icon-comment">Comments</h3>', "<div></div>", "</div>"].join(""),
    type: "class",
    constructor: function (e) {
        Ext.apply(this, e);
        this.el = Ext.get(e.el);
        var d = Ext.DomHelper.append(this.el, this.html, true).down("div");
        var f = [this.type, this.name, ""];
        this.expander = new Docs.view.comments.Expander({
            count: Docs.Comments.getCount(f),
            target: f,
            renderTo: d,
            onCountUpdated: this.onCountUpdated
        })
    },
    getExpander: function () {
        return this.expander
    }
});
Ext.define("Docs.view.guides.Container", {
    extend: "Ext.panel.Panel",
    alias: "widget.guidecontainer",
    componentCls: "guide-container",
    mixins: ["Docs.view.Scrolling"],
    requires: ["Docs.Comments", "Docs.view.comments.LargeExpander"],
    initComponent: function () {
        this.addEvents("afterload");
        this.callParent(arguments)
    },
    scrollToEl: function (c) {
        var d = Ext.get(c);
        if (!d) {
            d = Ext.get(Ext.query("a[name='" + c + "']")[0])
        }
        this.scrollToView(d, {
            highlight: true,
            offset: -100
        })
    },
    load: function (b) {
        this.guide = b;
        this.tpl = this.tpl || new Ext.XTemplate(Docs.data.showPrintButton ? '<a class="print guide" href="?print=/guide/{name}" target="_blank">Print</a>' : "", "{content}");
        this.update(this.tpl.apply(b));
        Docs.Syntax.highlight(this.getEl());
        if (Docs.Comments.isEnabled()) {
            this.initComments()
        }
        this.fireEvent("afterload")
    },
    initComments: function () {
        this.expander = new Docs.view.comments.LargeExpander({
            type: "guide",
            name: this.guide.name,
            el: this.getEl().down(".x-panel-body")
        })
    },
    updateCommentCounts: function () {
        if (!this.expander) {
            return
        }
        this.expander.getExpander().setCount(Docs.Comments.getCount(["guide", this.guide.name, ""]))
    }
});
Ext.define("Docs.view.videos.Container", {
    extend: "Ext.panel.Panel",
    alias: "widget.videocontainer",
    componentCls: "video-container",
    requires: ["Docs.Comments", "Docs.view.comments.LargeExpander"],
    initComponent: function () {
        this.callParent(arguments);
        this.on("hide", this.pauseVideo, this)
    },
    pauseVideo: function () {
        var b = document.getElementById("video_player");
        if (b && b.api_pause) {
            b.api_pause()
        }
    },
    load: function (b) {
        this.video = b;
        this.tpl = this.tpl || new Ext.XTemplate('<iframe src="http://player.vimeo.com/video/{id}" width="640" height="360" frameborder="0" title="Software Development Kit"' , "webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>", "<h1>{title}</h1>", "<p>{[this.linkify(values.description)]}</p>", {
            linkify: function (a) {
                return a.replace(/(\bhttps?:\/\/\S+)/ig, "<a href='$1'>$1</a>")
            }
        });
        this.update(this.tpl.apply(b));
        if (Docs.Comments.isEnabled()) {
            this.initComments()
        }
    },
    initComments: function () {
        this.expander = new Docs.view.comments.LargeExpander({
            type: "video",
            name: this.video.name,
            el: this.getEl().down(".x-panel-body")
        })
    },
    updateCommentCounts: function () {
        if (!this.expander) {
            return
        }
        this.expander.getExpander().setCount(Docs.Comments.getCount(["video", this.video.name, ""]))
    }
});
Ext.define("Docs.view.comments.MemberWrap", {
    extend: "Docs.view.cls.MemberWrap",
    requires: ["Docs.Comments", "Docs.view.comments.Expander"],
    constructor: function (d) {
        this.callParent([d]);
        var c = Docs.Comments.getCount(this.getTarget());
        if (c > 0) {
            this.updateSignatureCommentCount(c)
        }
    },
    getTarget: function () {
        if (!this.target) {
            this.target = ["class", this.getDefinedIn(), this.getMemberId()]
        }
        return this.target
    },
    getExpander: function () {
        if (!this.expander) {
            var b = Ext.DomHelper.append(this.el.down(".long"), "<div></div>");
            this.expander = new Docs.view.comments.Expander({
                count: Docs.Comments.getCount(this.getTarget()),
                target: this.getTarget(),
                newCommentTitle: this.getNewCommentTitle(),
                renderTo: b
            })
        }
        return this.expander
    },
    setCount: function (b) {
        this.getExpander().setCount(b);
        this.updateSignatureCommentCount(b)
    },
    updateSignatureCommentCount: function (g) {
        var e = this.el.down(".title");
        var f = e.down(".comment-counter-small");
        if (g > 0) {
            if (f) {
                f.update("" + g)
            } else {
                var h = Ext.DomHelper.append(e, Docs.Comments.counterHtml(g), true);
                h.on("click", function () {
                    this.el.addCls("open");
                    this.getExpander().expand();
                    this.parent.scrollToEl(this.getExpander().getEl())
                }, this)
            }
        } else {
            if (f) {
                f.remove()
            }
        }
    },
    getNewCommentTitle: function () {
        if (this.getDefinedIn() !== this.className) {
            return ["<b>Be aware.</b> This member is inherited from <b>" + this.getDefinedIn() + "</b>; ", "comments posted here will also be posted to that page."].join("")
        } else {
            return undefined
        }
    },
    setExpanded: function (b) {
        this.callParent([b]);
        if (b) {
            this.getExpander().show()
        }
    }
});
Ext.define("Docs.view.comments.Template", {
    extend: "Ext.XTemplate",
    requires: ["Docs.Auth", "Docs.Comments"],
    statics: {
        create: function (d) {
            var c = "tpl-" + Ext.JSON.encode(d);
            if (!this[c]) {
                this[c] = new this();
                Ext.apply(this[c], d)
            }
            return this[c]
        }
    },
    constructor: function () {
        this.callParent(["<div>", '<tpl for=".">', '<div class="comment" id="{id}">', '<tpl if="deleted">', '<div class="deleted-comment">Comment was deleted. <a href="#" class="undoDeleteComment">Undo</a>.</div>', "<tpl else>", '<div class="com-meta">', "{[this.avatar(values.emailHash)]}", '<div class="author<tpl if="moderator"> moderator" title="Sencha Engineer</tpl>">', "{author}", '<tpl if="this.isTargetVisible()">', '<span class="target"> on {[this.target(values.target)]}</span>', "</tpl>", "</div>", '<div class="top-right">', '<tpl for="tags">', '<span href="#" class="command tag">', "<b>{.}</b>", '<tpl if="this.isMod()"><a href="#" class="remove-tag" title="Delete tag">&ndash;</a></tpl>', "</span>", "</tpl>", '<tpl if="this.isMod()">', '<a href="#" class="command add-tag" title="Add new tag">+</a>', "</tpl>", '<tpl if="this.isMod()">', '<a href="#" class="command readComment <tpl if="read">read</tpl>">Read</a>', "</tpl>", '<tpl if="this.isMod() || this.isAuthor(values.author)">', '<a href="#" class="command editComment">Edit</a>', '<a href="#" class="command deleteComment">Delete</a>', "</tpl>", '<span class="time" title="{[this.date(values.createdAt)]}">{[this.dateStr(values.createdAt)]}</span>', "</div>", '<div class="vote">', '<a href="#" class="voteCommentUp{[values.upVote ? " selected" : ""]}" ', 'title="Vote Up">&nbsp;</a>', '<span class="score">{score}</span>', '<a href="#" class="voteCommentDown{[values.downVote ? " selected" : ""]}" ', 'title="Vote Down">&nbsp;</a>', "</div>", "</div>", '<div class="content">{contentHtml}</div>', "</tpl>", "</div>", "</tpl>", "</div>", this])
    },
    avatar: function (b) {
        return Docs.Comments.avatar(b, this.isMod() && this.enableDragDrop ? "drag-handle" : "")
    },
    isTargetVisible: function () {
        return this.showTarget
    },
    dateStr: function (e) {
        try {
            var h = Math.ceil(Number(new Date()) / 1000);
            var i = Math.ceil(Number(new Date(e)) / 1000);
            var k = h - i;
            if (k < 60) {
                return "just now"
            } else {
                if (k < 60 * 60) {
                    var j = String(Math.round(k / (60)));
                    return j + (j == "1" ? " minute" : " minutes") + " ago"
                } else {
                    if (k < 60 * 60 * 24) {
                        var j = String(Math.round(k / (60 * 60)));
                        return j + (j == "1" ? " hour" : " hours") + " ago"
                    } else {
                        if (k < 60 * 60 * 24 * 31) {
                            var j = String(Math.round(k / (60 * 60 * 24)));
                            return j + (j == "1" ? " day" : " days") + " ago"
                        } else {
                            return Ext.Date.format(new Date(e), "jS M 'y")
                        }
                    }
                }
            }
        } catch (l) {
            return ""
        }
    },
    date: function (d) {
        try {
            return Ext.Date.format(new Date(d), "jS F Y g:ia")
        } catch (c) {
            return ""
        }
    },
    isMod: function () {
        return Docs.Auth.isModerator()
    },
    isAuthor: function (b) {
        return Docs.Auth.getUser().userName == b
    },
    target: function (h) {
        var e = h[1]
          , g = h[1]
          , f = "#!/javascriptapi/";
        if (h[0] == "video") {
            g = "Video " + g;
            f = "#!/video/"
        } else {
            if (h[0] == "guide") {
                g = "Guide " + g;
                f = "#!/guide/"
            } else {
                if (h[2] != "") {
                    e += "-" + h[2];
                    if (h[0] == "class") {
                        g += "#" + h[2].replace(/^.*-/, "")
                    } else {
                        g += " " + h[2]
                    }
                }
            }
        }
        return '<a href="' + f + e + '">' + g + "</a>"
    }
});
Ext.define("Docs.view.comments.RepliesExpander", {
    alias: "widget.commentsRepliesExpander",
    extend: "Ext.Component",
    requires: ["Docs.Comments"],
    uses: ["Docs.view.comments.ListWithForm"],
    componentCls: "comments-replies-expander",
    initComponent: function () {
        this.tpl = new Ext.XTemplate('<a href="#" class="replies-button {[this.getCountCls(values.count)]}">', "{[this.renderCount(values.count)]}", "</a>", {
            renderCount: this.renderCount,
            getCountCls: this.getCountCls
        });
        this.data = {
            count: this.count
        };
        this.callParent(arguments)
    },
    renderCount: function (b) {
        if (b === 1) {
            return "1 reply..."
        } else {
            if (b > 1) {
                return b + " replies..."
            } else {
                return "Write reply..."
            }
        }
    },
    getCountCls: function (b) {
        return (b > 0) ? "with-replies" : ""
    },
    afterRender: function () {
        this.callParent(arguments);
        this.getEl().down(".replies-button").on("click", this.toggle, this, {
            preventDefault: true
        })
    },
    toggle: function () {
        this.expanded ? this.collapse() : this.expand()
    },
    expand: function () {
        this.expanded = true;
        this.getEl().down(".replies-button").update("Hide replies.");
        if (this.list) {
            this.list.show()
        } else {
            this.loadComments()
        }
    },
    collapse: function () {
        this.expanded = false;
        this.refreshRepliesButton();
        if (this.list) {
            this.list.hide()
        }
    },
    refreshRepliesButton: function () {
        var b = this.getEl().down(".replies-button");
        b.update(this.renderCount(this.count));
        b.removeCls("with-replies");
        b.addCls(this.getCountCls(this.count))
    },
    loadComments: function () {
        this.list = new Docs.view.comments.ListWithForm({
            target: this.target,
            parentId: this.parentId,
            newCommentTitle: "<b>Reply to comment</b>",
            renderTo: this.getEl(),
            listeners: {
                countChange: this.setCount,
                scope: this
            }
        });
        Docs.Comments.loadReplies(this.parentId, function (b) {
            this.list.load(b)
        }, this)
    },
    setCount: function (b) {
        this.count = b;
        if (!this.expanded) {
            this.refreshRepliesButton()
        }
    }
});
Ext.define("Docs.model.Comment", {
    extend: "Ext.data.Model",
    requires: ["Docs.Comments"],
    fields: [{
        name: "id",
        mapping: "_id"
    }, "author", "emailHash", "moderator", "createdAt", "target", "score", "upVote", "downVote", "contentHtml", "read", "tags", "deleted", "parentId", "replyCount"],
    proxy: {
        type: "ajax",
        reader: "json"
    },
    vote: function (c, d) {
        this.request({
            method: "POST",
            url: "/comments/" + this.get("id"),
            params: {
                vote: c
            },
            success: function (a) {
                this.set("upVote", a.direction === "up");
                this.set("downVote", a.direction === "down");
                this.set("score", a.total);
                this.commit()
            },
            failure: Ext.Function.bind(d.failure, d.scope),
            scope: this
        })
    },
    loadContent: function (c, d) {
        this.request({
            url: "/comments/" + this.get("id"),
            method: "GET",
            success: function (a) {
                c.call(d, a.content)
            },
            scope: this
        })
    },
    saveContent: function (b) {
        this.request({
            url: "/comments/" + this.get("id"),
            method: "POST",
            params: {
                content: b
            },
            success: function (a) {
                this.set("contentHtml", a.content);
                this.commit()
            },
            scope: this
        })
    },
    setDeleted: function (b) {
        this.request({
            url: "/comments/" + this.get("id") + (b ? "/delete" : "/undo_delete"),
            method: "POST",
            success: function () {
                this.set("deleted", b);
                this.commit();
                Docs.Comments.changeCount(this.get("target"), b ? -1 : +1)
            },
            scope: this
        })
    },
    markRead: function () {
        this.request({
            url: "/comments/" + this.get("id") + "/read",
            method: "POST",
            success: function () {
                this.set("read", true);
                this.commit()
            },
            scope: this
        })
    },
    setParent: function (d, f, e) {
        this.request({
            url: "/comments/" + this.get("id") + "/set_parent",
            method: "POST",
            params: d ? {
                parentId: d.get("id")
            } : undefined,
            success: f,
            scope: e
        })
    },
    addTag: function (b) {
        this.changeTag("add_tag", b, function () {
            this.get("tags").push(b)
        }, this)
    },
    removeTag: function (b) {
        this.changeTag("remove_tag", b, function () {
            Ext.Array.remove(this.get("tags"), b)
        }, this)
    },
    changeTag: function (h, e, g, f) {
        this.request({
            url: "/comments/" + this.get("id") + "/" + h,
            method: "POST",
            params: {
                tagname: e
            },
            success: function () {
                g.call(f);
                this.commit()
            },
            scope: this
        })
    },
    request: function (b) {
        Docs.Comments.request("ajax", {
            url: b.url,
            method: b.method,
            params: b.params,
            callback: function (h, f, a) {
                var g = Ext.JSON.decode(a.responseText);
                if (f && g.success) {
                    b.success && b.success.call(b.scope, g)
                } else {
                    b.failure && b.failure.call(b.scope, g.reason)
                }
            },
            scope: this
        })
    }
});
Ext.define("Docs.CommentsProxy", {
    extend: "Ext.data.proxy.JsonP",
    alias: "proxy.comments",
    requires: ["Docs.Comments"],
    constructor: function (b) {
        b.url = Docs.Comments.buildRequestUrl(b.url);
        this.callParent([b])
    }
});
Ext.define("Docs.model.Target", {
    extend: "Ext.data.Model",
    requires: ["Docs.CommentsProxy"],
    fields: ["id", "type", "cls", "member", "score", {
        name: "text",
        convert: function (e, f) {
            var d = f.data;
            if (d.type === "class") {
                return d.cls + (d.member ? "#" + d.member.replace(/^.*-/, "") : "")
            } else {
                return d.type + " " + d.cls
            }
        }
    }],
    proxy: {
        type: "comments",
        url: "/targets",
        reader: {
            type: "json",
            root: "data"
        }
    }
});
Ext.define("Docs.view.comments.Targets", {
    extend: "Docs.view.comments.TopList",
    alias: "widget.commentsTargets",
    requires: ["Docs.model.Target"],
    model: "Docs.model.Target",
    displayField: "text",
    filterEmptyText: "Filter topics by name..."
});
Ext.define("Docs.model.Tag", {
    extend: "Ext.data.Model",
    requires: ["Docs.CommentsProxy"],
    fields: ["tagname", "score"],
    proxy: {
        type: "comments",
        url: "/tags",
        reader: {
            type: "json",
            root: "data"
        }
    }
});
Ext.define("Docs.view.comments.Tags", {
    extend: "Docs.view.comments.TopList",
    alias: "widget.commentsTags",
    requires: ["Docs.model.Tag"],
    model: "Docs.model.Tag",
    displayField: "tagname",
    filterEmptyText: "Filter tags by name..."
});
Ext.define("Docs.view.comments.TagEditor", {
    extend: "Ext.container.Container",
    requires: ["Docs.model.Tag"],
    floating: true,
    hidden: true,
    componentCls: "comments-tageditor",
    statics: {
        cachedStore: undefined,
        getStore: function () {
            if (!this.cachedStore) {
                this.cachedStore = Ext.create("Ext.data.Store", {
                    model: "Docs.model.Tag",
                    listeners: {
                        load: function () {
                            this.cachedStore.sort("tagname", "ASC")
                        },
                        scope: this
                    }
                });
                this.cachedStore.load()
            }
            return this.cachedStore
        }
    },
    initComponent: function () {
        this.items = [{
            xtype: "combobox",
            listConfig: {
                cls: "comments-tageditor-boundlist"
            },
            store: this.statics().getStore(),
            queryMode: "local",
            displayField: "tagname",
            valueField: "tagname",
            enableKeyEvents: true,
            emptyText: "New tag name...",
            listeners: {
                select: this.handleSelect,
                blur: this.destroy,
                keyup: this.onKeyUp,
                scope: this
            }
        }];
        this.callParent(arguments)
    },
    popup: function (b) {
        this.show();
        this.alignTo(b, "bl", [-12, -2]);
        this.down("combobox").focus(true, 100)
    },
    onKeyUp: function (c, d) {
        if (d.keyCode === Ext.EventObject.ENTER) {
            this.handleSelect()
        } else {
            if (d.keyCode === Ext.EventObject.ESC) {
                this.destroy()
            }
        }
    },
    handleSelect: function () {
        var c = Ext.String.trim(this.down("combobox").getValue() || "");
        if (c) {
            var d = this.rememberNewTag(c);
            this.fireEvent("select", d)
        }
        this.destroy()
    },
    rememberNewTag: function (g) {
        var f = this.statics().getStore();
        var e = new RegExp("^" + Ext.String.escapeRegex(g) + "$", "i");
        var h = f.query("tagname", e);
        if (h.getCount() === 0) {
            f.add({
                tagname: g
            });
            f.sort("tagname", "ASC");
            return g
        } else {
            return h.get(0).get("tagname")
        }
    }
});
Ext.define("Docs.view.comments.List", {
    extend: "Ext.view.View",
    alias: "widget.commentsList",
    requires: ["Docs.Auth", "Docs.Syntax", "Docs.Comments", "Docs.view.comments.Template", "Docs.view.comments.Form", "Docs.view.comments.TagEditor", "Docs.view.comments.RepliesExpander", "Docs.view.comments.DragZone", "Docs.view.comments.DropZone", "Docs.model.Comment", "Docs.Tip"],
    componentCls: "comments-list",
    itemSelector: "div.comment",
    emptyText: '<div class="loading">Loading...</div>',
    deferEmptyText: false,
    initComponent: function () {
        this.store = Ext.create("Ext.data.Store", {
            model: "Docs.model.Comment",
            listeners: {
                update: this.fireChangeEvent,
                scope: this
            }
        });
        this.tpl = Docs.view.comments.Template.create({
            showTarget: this.showTarget,
            enableDragDrop: this.enableDragDrop
        });
        this.callParent(arguments);
        this.on("refresh", function () {
            Docs.Syntax.highlight(this.getEl());
            this.renderExpanders(this.store.getRange())
        }, this);
        this.on("itemupdate", function (f, e, d) {
            Docs.Syntax.highlight(d);
            this.renderExpanders([f])
        }, this)
    },
    renderExpanders: function (b) {
        if (b[0] && b[0].get("parentId")) {
            return
        }
        Ext.Array.forEach(b, function (a) {
            if (a.get("deleted")) {
                return
            }
            new Docs.view.comments.RepliesExpander({
                count: a.get("replyCount"),
                target: a.get("target"),
                parentId: a.get("id"),
                renderTo: this.getNode(a)
            })
        }, this)
    },
    afterRender: function () {
        this.callParent(arguments);
        this.mun(this.getTargetEl(), "keydown");
        this.delegateClick("a.voteCommentUp", function (d, c) {
            this.vote(d, c, "up")
        }, this);
        this.delegateClick("a.voteCommentDown", function (d, c) {
            this.vote(d, c, "down")
        }, this);
        this.delegateClick("a.editComment", function (d, c) {
            this.edit(d, c)
        }, this);
        this.delegateClick("a.deleteComment", function (d, c) {
            this.setDeleted(d, c, true)
        }, this);
        this.delegateClick("a.undoDeleteComment", function (d, c) {
            this.setDeleted(d, c, false)
        }, this);
        this.delegateClick("a.readComment", this.markRead, this);
        this.delegateClick("a.add-tag", this.addTag, this);
        this.delegateClick("a.remove-tag", this.removeTag, this);
        if (this.enableDragDrop) {
            new Docs.view.comments.DragZone(this);
            new Docs.view.comments.DropZone(this, {
                onValidDrop: Ext.Function.bind(this.setParent, this)
            })
        }
    },
    delegateClick: function (e, f, d) {
        this.getEl().on("click", function (b, c) {
            var a = this.getRecord(this.findItemByChild(c));
            if (a) {
                f.call(d, c, a)
            }
        }, this, {
            preventDefault: true,
            delegate: e
        })
    },
    vote: function (e, f, d) {
        if (!Docs.Auth.isLoggedIn()) {
            Docs.Tip.show("Please login to vote on this comment", e);
            return
        }
        if (f.get("upVote") && d === "up" || f.get("downVote") && d === "down") {
            Docs.Tip.show("You have already voted on this comment", e);
            return
        }
        f.vote(d, {
            failure: function (a) {
                Docs.Tip.show(a, e)
            }
        })
    },
    edit: function (d, c) {
        c.loadContent(function (a) {
            var b = Ext.get(d).up(".comment").down(".content");
            b.update("");
            new Docs.view.comments.Form({
                renderTo: b,
                title: "<b>Edit comment</b>",
                user: Docs.Auth.getUser(),
                content: a,
                listeners: {
                    submit: function (f) {
                        c.saveContent(f)
                    },
                    cancel: function () {
                        this.refreshComment(c)
                    },
                    scope: this
                }
            })
        }, this)
    },
    refreshComment: function (b) {
        this.refreshNode(this.getStore().findExact("id", b.get("id")))
    },
    setDeleted: function (d, f, e) {
        f.setDeleted(e)
    },
    markRead: function (d, c) {
        c.markRead()
    },
    addTag: function (d, f) {
        var e = new Docs.view.comments.TagEditor();
        e.on("select", f.addTag, f);
        e.popup(d)
    },
    removeTag: function (e, f) {
        var d = Ext.get(e).up(".tag").down("b").getHTML();
        f.removeTag(d)
    },
    setParent: function (c, d) {
        c.setParent(d, function () {
            this.fireEvent("reorder")
        }, this)
    },
    load: function (f, e) {
        if (f.length === 0) {
            this.emptyText = ""
        }
        var d = this.store.getProxy().getReader().readRecords(f).records;
        this.store.loadData(d, e);
        this.fireChangeEvent()
    },
    fireChangeEvent: function () {
        var b = function (a) {
            return !a.get("deleted")
        };
        this.fireEvent("countChange", this.getStore().queryBy(b).getCount())
    }
});
Ext.define("Docs.view.comments.FullList", {
    extend: "Ext.panel.Panel",
    alias: "widget.commentsFullList",
    requires: ["Docs.Settings", "Docs.Auth", "Docs.Comments", "Docs.view.comments.List", "Docs.view.comments.Pager"],
    componentCls: "comments-full-list",
    dockedItems: [{
        xtype: "container",
        dock: "top",
        height: 35,
        html: ['<h1 style="float:left;">Comments</h1>', '<p style="float:left; margin: 5px 0 0 25px">', '<label style="padding-right: 10px;"><input type="checkbox" name="hideRead" id="hideRead" /> Hide read</label>', "</p>"].join(" ")
    }],
    layout: "border",
    items: [{
        xtype: "tabpanel",
        cls: "comments-tabpanel",
        plain: true,
        region: "north",
        height: 25,
        items: [{
            title: "Recent"
        }, {
            title: "Votes"
        }]
    }, {
        region: "center",
        xtype: "container",
        autoScroll: true,
        cls: "iScroll",
        items: [{
            xtype: "commentsList",
            id: "recentcomments",
            showTarget: true
        }, {
            xtype: "commentsPager"
        }]
    }],
    afterRender: function () {
        this.callParent(arguments);
        this.initCheckboxes();
        this.initTabs();
        this.setMasked(true)
    },
    load: function (f, e) {
        this.down("commentsList").load(f, e);
        var d = f[f.length - 1];
        if (d) {
            this.down("commentsPager").configure(d)
        } else {
            this.down("commentsPager").reset()
        }
    },
    setMasked: function (c) {
        var d = this.getEl();
        if (d) {
            d[c ? "mask" : "unmask"]()
        }
    },
    initCheckboxes: function () {
        var f = Docs.Settings.get("comments");
        var e = Ext.get("hideRead");
        if (e) {
            e.dom.checked = f.hideRead;
            e.on("change", function () {
                this.saveSetting("hideRead", e.dom.checked);
                this.fireEvent("hideReadChange")
            }, this)
        }
        this.setHideReadVisibility();
        var d = Docs.App.getController("Auth");
        d.on("available", this.setHideReadVisibility, this);
        d.on("loggedIn", this.setHideReadVisibility, this);
        d.on("loggedOut", this.setHideReadVisibility, this)
    },
    setHideReadVisibility: function () {
        var b = Docs.Auth.isModerator();
        Ext.get("hideRead").up("label").setStyle("display", b ? "inline" : "none")
    },
    initTabs: function () {
        this.down("tabpanel[cls=comments-tabpanel]").on("tabchange", function (d, c) {
            if (c.title === "Recent") {
                this.fireEvent("sortOrderChange", "recent")
            } else {
                this.fireEvent("sortOrderChange", "votes")
            }
        }, this)
    },
    saveSetting: function (d, e) {
        var f = Docs.Settings.get("comments");
        f[d] = e;
        Docs.Settings.set("comments", f)
    },
    getTab: function () {
        return Docs.Comments.isEnabled() ? {
            cls: "comments",
            href: "#!/comment",
            tooltip: "Comments"
        } : false
    }
});
Ext.define("Docs.view.comments.Index", {
    extend: "Ext.panel.Panel",
    alias: "widget.commentindex",
    mixins: ["Docs.view.Scrolling"],
    requires: ["Docs.Comments", "Docs.view.comments.FullList", "Docs.view.comments.HeaderMenu", "Docs.view.comments.Users", "Docs.view.comments.Targets", "Docs.view.comments.Tags"],
    componentCls: "comments-index",
    margin: "10 0 0 0",
    layout: "border",
    items: [{
        region: "center",
        xtype: "commentsFullList"
    }, {
        region: "east",
        itemId: "cardPanel",
        layout: "border",
        width: 300,
        margin: "0 0 0 20",
        layout: "card",
        dockedItems: [{
            xtype: "commentsHeaderMenu",
            dock: "top",
            height: 35
        }],
        items: [{
            xtype: "commentsUsers"
        }, {
            xtype: "commentsTargets"
        }, {
            xtype: "commentsTags"
        }]
    }],
    initComponent: function () {
        this.callParent(arguments);
        var d = this.down("#cardPanel");
        var c = {
            users: this.down("commentsUsers"),
            targets: this.down("commentsTargets"),
            tags: this.down("commentsTags")
        };
        this.down("commentsHeaderMenu").on("select", function (a) {
            Ext.Object.each(c, function (b, f) {
                if (b !== a) {
                    f.deselectAll()
                }
            });
            d.getLayout().setActiveItem(c[a])
        }, this)
    },
    getTab: function () {
        return Docs.Comments.isEnabled() ? {
            cls: "comments",
            href: "#!/comment",
            tooltip: "Comments"
        } : false
    }
});
Ext.define("Docs.view.HoverMenu", {
    extend: "Ext.view.View",
    requires: ["Docs.Comments", "Docs.view.Signature"],
    alias: "widget.hovermenu",
    componentCls: "hover-menu",
    itemSelector: "div.item",
    deferEmptyText: false,
    columnHeight: 25,
    initComponent: function () {
        this.renderTo = Ext.getBody();
        this.tpl = new Ext.XTemplate("<table>", "<tr>", "<td>", '<tpl for=".">', '<div class="item">', "{[this.renderLink(values)]}", "</div>", '<tpl if="xindex % this.columnHeight === 0 && xcount &gt; xindex">', "</td><td>", "</tpl>", "</tpl>", "</td>", "</tr>", "</table>", {
            columnHeight: this.columnHeight,
            renderLink: function (e) {
                var d = Docs.view.Signature.render(e.meta);
                var f = Docs.Comments.counterHtml(e.commentCount);
                return Ext.String.format('<a href="#!/javascriptapi/{0}" rel="{0}" class="docClass">{1} {2} {3}</a>', e.url, e.label, d, f)
            }
        });
        this.callParent()
    }
});
Ext.define("Docs.view.HoverMenuButton", {
    extend: "Ext.toolbar.TextItem",
    alias: "widget.hovermenubutton",
    componentCls: "hover-menu-button",
    requires: ["Docs.view.HoverMenu"],
    showCount: false,
    statics: {
        menus: []
    },
    initComponent: function () {
        this.addEvents("click");
        if (this.showCount) {
            this.initialText = this.text;
            this.text += " <sup>" + this.store.getCount() + "</sup>";
            this.store.on("datachanged", function () {
                this.setText(this.initialText + " <sup>" + this.store.getCount() + "</sup>")
            }, this)
        }
        this.callParent(arguments)
    },
    getColumnHeight: function () {
        var c = 200;
        var d = 18;
        return Math.floor((Ext.Element.getViewportHeight() - c) / d)
    },
    onRender: function () {
        this.callParent(arguments);
        this.getEl().on({
            click: function () {
                this.fireEvent("click")
            },
            mouseover: this.deferShowMenu,
            mouseout: this.deferHideMenu,
            scope: this
        })
    },
    onDestroy: function () {
        if (this.menu) {
            this.menu.destroy();
            Ext.Array.remove(Docs.view.HoverMenuButton.menus, this.menu)
        }
        this.callParent(arguments)
    },
    renderMenu: function () {
        this.menu = Ext.create("Docs.view.HoverMenu", {
            store: this.store,
            columnHeight: this.getColumnHeight()
        });
        this.menu.getEl().on({
            click: function (b) {
                this.menu.hide();
                b.preventDefault()
            },
            mouseover: function () {
                clearTimeout(this.hideTimeout)
            },
            mouseout: this.deferHideMenu,
            scope: this
        });
        Docs.view.HoverMenuButton.menus.push(this.menu)
    },
    deferHideMenu: function () {
        clearTimeout(Docs.view.HoverMenuButton.showTimeout);
        if (!this.menu) {
            return
        }
        this.hideTimeout = Ext.Function.defer(function () {
            this.menu.hide()
        }, 200, this)
    },
    deferShowMenu: function () {
        clearTimeout(Docs.view.HoverMenuButton.showTimeout);
        Docs.view.HoverMenuButton.showTimeout = Ext.Function.defer(function () {
            if (!this.menu) {
                this.renderMenu()
            }
            Ext.Array.forEach(Docs.view.HoverMenuButton.menus, function (a) {
                if (a !== this.menu) {
                    a.hide()
                }
            }, this);
            clearTimeout(this.hideTimeout);
            this.menu.show();
            var j = this.getEl().getXY()
              , n = Ext.ComponentQuery.query("classoverview toolbar")[0]
              , k = j[0] - 10
              , l = n.getEl().getXY()
              , i = n.getWidth()
              , m = this.menu.getEl().getWidth()
              , h = Ext.getCmp("doctabs").getWidth();
            if (m > h) {
                k = 0
            } else {
                if ((k + m) > h) {
                    k = h - m - 30
                }
            }
            if (k < l[0]) {
                k = l[0]
            }
            this.menu.getEl().setStyle({
                left: k + "px",
                top: (j[1] + 25) + "px"
            })
        }, 200, this)
    },
    getStore: function () {
        return this.store
    }
});
Ext.define("Docs.view.cls.Toolbar", {
    extend: "Ext.toolbar.Toolbar",
    requires: ["Docs.view.HoverMenuButton", "Docs.Settings", "Docs.Comments", "Ext.form.field.Checkbox"],
    dock: "top",
    cls: "member-links",
    docClass: {},
    accessors: {},
    initComponent: function () {
        this.addEvents("menubuttonclick", "commentcountclick", "filter", "toggleExpanded");
        this.items = [];
        this.memberButtons = {};
        Ext.Array.forEach(Docs.data.memberTypes, function (e) {
            var a = Ext.Array.filter(this.docClass.members, function (c) {
                return c.tagname === e.name
            });
            a.sort(function (c, d) {
                if (c.name === "constructor" && c.tagname === "method") {
                    return -1
                }
                return c.name < d.name ? -1 : (c.name > d.name ? 1 : 0)
            });
            if (a.length > 0) {
                var f = this.createMemberButton({
                    text: e.toolbar_title || e.title,
                    type: e.name,
                    members: a
                });
                this.memberButtons[e.name] = f;
                this.items.push(f)
            }
        }, this);
        this.checkItems = {
            "public": this.createCb("Public", "public"),
            "protected": this.createCb("Protected", "protected"),
            "private": this.createCb("Private", "private"),
            inherited: this.createCb("Inherited", "inherited"),
            accessor: this.createCb("Accessor", "accessor"),
            deprecated: this.createCb("Deprecated", "deprecated"),
            removed: this.createCb("Removed", "removed")
        };
        var b = this;
        this.items = this.items.concat([{
            xtype: "tbfill"
        }, this.filterField = Ext.widget("triggerfield", {
            triggerCls: "reset",
            cls: "member-filter",
            hideTrigger: true,
            //emptyText: "Filter class members",
            emptyText: "Filter string",
            enableKeyEvents: true,
            width: 150,
            listeners: {
                keyup: function (a) {
                    this.fireEvent("filter", a.getValue(), this.getShowFlags());
                    a.setHideTrigger(a.getValue().length === 0)
                },
                specialkey: function (d, a) {
                    if (a.keyCode === Ext.EventObject.ESC) {
                        d.reset();
                        this.fireEvent("filter", "", this.getShowFlags())
                    }
                },
                scope: this
            },
            onTriggerClick: function () {
                this.reset();
                this.focus();
                b.fireEvent("filter", "", b.getShowFlags());
                this.setHideTrigger(true)
            }
        }), {
            xtype: "tbspacer",
            width: 0
        }, this.commentCount = this.createCommentCount(), {
            xtype: "button",
            //text: "Show",
            text: "",
            //menu: [this.checkItems["public"], this.checkItems["protected"], this.checkItems["private"], "-", this.checkItems.inherited, this.checkItems.accessor, this.checkItems.deprecated, this.checkItems.removed]
            menu: null            
        }, {
            xtype: "button",
            iconCls: "expand-all-members",
            tooltip: "Expand all",
            enableToggle: true,
            toggleHandler: function (a, d) {
                a.setIconCls(d ? "collapse-all-members" : "expand-all-members");
                this.fireEvent("toggleExpanded", d)
            },
            scope: this
        }]);
        this.callParent(arguments)
    },
    getShowFlags: function () {
        var d = {};
        for (var c in this.checkItems) {
            d[c] = this.checkItems[c].checked
        }
        return d
    },
    createCb: function (c, d) {
        return Ext.widget("menucheckitem", {
            text: c,
            checked: Docs.Settings.get("show")[d],
            listeners: {
                checkchange: function () {
                    this.fireEvent("filter", this.filterField.getValue(), this.getShowFlags())
                },
                scope: this
            }
        })
    },
    createMemberButton: function (d) {
        var c = Ext.Array.map(d.members, function (a) {
            return this.createLinkRecord(this.docClass.name, a)
        }, this);
        return Ext.create("Docs.view.HoverMenuButton", {
            text: d.text,
            cls: "icon-" + d.type,
            store: this.createStore(c),
            showCount: true,
            listeners: {
                click: function () {
                    this.fireEvent("menubuttonclick", d.type)
                },
                scope: this
            }
        })
    },
    createStore: function (c) {
        var d = Ext.create("Ext.data.Store", {
            fields: ["id", "url", "label", "inherited", "accessor", "meta", "commentCount"]
        });
        d.add(c);
        return d
    },
    createLinkRecord: function (d, c) {
        return {
            id: c.id,
            url: d + "-" + c.id,
            label: (c.tagname === "method" && c.name === "constructor") ? "new " + d : c.name,
            inherited: c.owner !== d,
            accessor: c.tagname === "method" && this.accessors.hasOwnProperty(c.name),
            meta: c.meta,
            commentCount: Docs.Comments.getCount(["class", d, c.id])
        }
    },
    showMenuItems: function (d, e, f) {
        Ext.Array.forEach(Docs.data.memberTypes, function (b) {
            var c = this.memberButtons[b.name];
            if (c) {
                c.getStore().filterBy(function (h) {
                    return !(!d["public"] && !(h.get("meta")["private"] || h.get("meta")["protected"]) || !d["protected"] && h.get("meta")["protected"] || !d["private"] && h.get("meta")["private"] || !d.inherited && h.get("inherited") || !d.accessor && h.get("accessor") || !d.deprecated && h.get("meta")["deprecated"] || !d.removed && h.get("meta")["removed"] || e && !f.test(h.get("label")))
                });
                var a = c.menu;
                if (a && Ext.getVersion().version >= "4.1.0") {
                    a.show();
                    a.hide()
                }
            }
        }, this)
    },
    getFilterValue: function () {
        return this.filterField.getValue()
    },
    createCommentCount: function () {
        return Ext.create("Ext.container.Container", {
            width: 24,
            margin: "0 4 0 0",
            cls: "comment-btn",
            html: "0",
            hidden: true,
            listeners: {
                afterrender: function (b) {
                    b.el.addListener("click", function () {
                        this.fireEvent("commentcountclick")
                    }, this)
                },
                scope: this
            }
        })
    },
    showCommentCount: function () {
        this.commentCount.show()
    },
    setCommentCount: function (b) {
        this.commentCount.update("" + (b || 0));
        this.refreshMenuCommentCounts()
    },
    refreshMenuCommentCounts: function () {
        Ext.Object.each(this.memberButtons, function (c, d) {
            d.getStore().each(function (a) {
                a.set("commentCount", Docs.Comments.getCount(["class", this.docClass.name, a.get("id")]))
            }, this)
        }, this)
    }
});
Ext.define("Docs.view.cls.Overview", {
    extend: "Ext.panel.Panel",
    alias: "widget.classoverview",
    requires: ["Docs.view.cls.Toolbar", "Docs.view.examples.Inline",
        "Docs.view.comments.LargeExpander", "Docs.view.cls.MemberWrap",
        "Docs.view.comments.MemberWrap", "Docs.Syntax", "Docs.Settings", "Docs.Comments"],
    mixins: ["Docs.view.Scrolling"],
    cls: "class-overview iScroll",
    autoScroll: true,
    border: false,
    bodyPadding: "20 8 20 5",
    initComponent: function () {
        this.addEvents("afterload");
        this.callParent(arguments)
    },
    scrollToEl: function (j, h) {
        var g = (typeof j == "string") ? Ext.get(Ext.query(j)[0]) : j;
        if (g) {
            var f = g.hasCls("member");
            g.show();
            if (!g.isVisible(true)) {
                g.up(".subsection").show();
                g.up(".members-section").show()
            }
            if (f && g.down(".expandable")) {
                this.setMemberExpanded(j.replace(/#/, ""), true)
            }
            var i = this.body.getBox().y;
            this.scrollToView(g, {
                highlight: true,
                offset: (h || 0) - (f ? i : i - 10)
            })
        }
    },
    load: function (b) {
        this.docClass = b;
        this.accessors = this.buildAccessorsMap();
        if (this.toolbar) {
            this.removeDocked(this.toolbar, false);
            this.toolbar.destroy()
        }
        this.toolbar = Ext.create("Docs.view.cls.Toolbar", {
            docClass: this.docClass,
            accessors: this.accessors,
            listeners: {
                filter: function (d, a) {
                    this.filterMembers(d, a)
                },
                menubuttonclick: function (a) {
                    this.scrollToEl("h3.members-title.icon-" + a, -20)
                },
                commentcountclick: this.expandClassComments,
                scope: this
            }
        });
        this.addDocked(this.toolbar);
        this.update(b.html);
        Docs.Syntax.highlight(this.getEl());
        this.filterMembers("", Docs.Settings.get("show"));
        if (Docs.Comments.isEnabled()) {
            this.initComments()
        } else {
            this.initBasicMemberWrappers()
        }
        this.fireEvent("afterload")
    },
    initComments: function () {
        this.toolbar.showCommentCount();
        this.toolbar.setCommentCount(Docs.Comments.getCount(["class", this.docClass.name, ""]));
        this.clsExpander = new Docs.view.comments.LargeExpander({
            name: this.docClass.name,
            el: Ext.query(".doc-contents")[0]
        });
        this.memberWrappers = {};
        Ext.Array.forEach(Ext.query(".member"), function (c) {
            var d = new Docs.view.comments.MemberWrap({
                parent: this,
                className: this.docClass.name,
                el: c
            });
            this.memberWrappers[d.getMemberId()] = d
        }, this)
    },
    initBasicMemberWrappers: function () {
        this.memberWrappers = {};
        Ext.Array.forEach(Ext.query(".member"), function (c) {
            var d = new Docs.view.cls.MemberWrap({
                el: c
            });
            this.memberWrappers[d.getMemberId()] = d
        }, this)
    },
    updateCommentCounts: function () {
        if (!this.docClass) {
            return
        }
        var b = Docs.Comments.getCount(["class", this.docClass.name, ""]);
        this.toolbar.setCommentCount(b);
        this.clsExpander.getExpander().setCount(b);
        Ext.Object.each(this.memberWrappers, function (a, d) {
            d.setCount(Docs.Comments.getCount(d.getTarget()))
        }, this)
    },
    expandClassComments: function () {
        var b = this.clsExpander.getExpander();
        b.expand();
        this.scrollToEl(b.getEl(), -40)
    },
    setMemberExpanded: function (c, d) {
        this.memberWrappers[c].setExpanded(d)
    },
    isMemberExpanded: function (b) {
        return this.memberWrappers[b].isExpanded()
    },
    setAllMembersExpanded: function (b) {
        if (Docs.Comments.isEnabled()) {
            Ext.Object.each(this.memberWrappers, function (a, d) {
                d.getExpander().show()
            }, this)
        }
        Ext.Object.each(this.memberWrappers, function (a, d) {
            d.setExpanded(b)
        }, this)
    },
    filterMembers: function (h, e) {
        Docs.Settings.set("show", e);
        var f = h.length > 0;
        Ext.Array.forEach(Ext.query(".doc-contents, .hierarchy"), function (a) {
            Ext.get(a).setStyle({
                display: f ? "none" : "block"
            })
        });
        var g = new RegExp(Ext.String.escapeRegex(h), "i");
        this.eachMember(function (c) {
            var b = Ext.get(c.id);
            var a = !(!e["public"] && !(c.meta["private"] || c.meta["protected"]) || !e["protected"] && c.meta["protected"] || !e["private"] && c.meta["private"] || !e.inherited && (c.owner !== this.docClass.name) || !e.accessor && c.tagname === "method" && this.accessors.hasOwnProperty(c.name) || !e.deprecated && c.meta.deprecated || !e.removed && c.meta.removed || f && !g.test(c.name));
            if (a) {
                b.setStyle({
                    display: "block"
                })
            } else {
                b.setStyle({
                    display: "none"
                })
            }
        }, this);
        Ext.Array.forEach(Ext.query(".member.first-child"), function (a) {
            Ext.get(a).removeCls("first-child")
        });
        Ext.Array.forEach(Ext.query(".members-section"), function (b) {
            var a = this.getVisibleElements(".member", b);
            Ext.get(b).setStyle({
                display: a.length > 0 ? "block" : "none"
            });
            Ext.Array.forEach(Ext.query(".subsection", b), function (d) {
                var c = this.getVisibleElements(".member", d);
                if (c.length > 0) {
                    c[0].addCls("first-child");
                    Ext.get(d).setStyle({
                        display: "block"
                    })
                } else {
                    Ext.get(d).setStyle({
                        display: "none"
                    })
                }
            }, this)
        }, this);
        this.toolbar.showMenuItems(e, f, g)
    },
    buildAccessorsMap: function (c) {
        var d = {};
        Ext.Array.forEach(this.docClass.members, function (b) {
            if (b.tagname === "cfg") {
                var a = Ext.String.capitalize(b.name);
                d["get" + a] = true;
                d["set" + a] = true
            }
        });
        return d
    },
    getVisibleElements: function (e, d) {
        var f = Ext.Array.map(Ext.query(e, d), function (a) {
            return Ext.get(a)
        });
        return Ext.Array.filter(f, function (a) {
            return a.isVisible()
        })
    },
    eachMember: function (c, d) {
        Ext.Array.forEach(this.docClass.members, c, d)
    }
});
Ext.define("Docs.view.cls.Container", {
    extend: "Ext.container.Container",
    alias: "widget.classcontainer",
    requires: ["Docs.view.cls.Header", "Docs.view.cls.Overview"],
    layout: "border",
    padding: "5 10 0 10",
    initComponent: function () {
        this.items = [Ext.create("Docs.view.cls.Header", {
            region: "north"
        }), Ext.create("Docs.view.cls.Overview", {
            region: "center"
        })];
        this.callParent(arguments)
    }
});
Ext.define("Docs.view.Viewport", {
    extend: "Ext.container.Viewport",
    requires: ["Docs.view.search.Container",
        "Docs.view.Header", "Docs.view.Tabs",
        "Docs.view.TreeContainer", "Docs.view.welcome.Index",
        "Docs.view.auth.HeaderForm", "Docs.view.comments.Index",
        "Docs.view.cls.Index",
        "Docs.view.cls.Container", "Docs.view.guides.Index",
        "Docs.view.guides.Container", "Docs.view.videos.Index",
        "Docs.view.videos.Container", "Docs.view.examples.Index",
        "Docs.view.examples.Container", "Docs.view.examples.TouchContainer",
        "Docs.view.tests.Index"],
    id: "viewport",
    layout: "border",
    defaults: {
        xtype: "container"
    },
    initComponent: function () {
        this.items = [{
            region: "north",
            id: "north-region",
            height: 65,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                height: 37,
                xtype: "container",
                layout: "hbox",
                items: [{
                    xtype: "docheader"
                }, {
                    xtype: "container",
                    flex: 1
                }, {
                    id: "loginContainer",
                    xtype: "authHeaderForm",
                    padding: "10 20 0 0"
                }, {
                    xtype: "searchcontainer",
                    id: "search-container",
                    width: 230,
                    margin: "4 0 0 0"
                }]
            }, {
                xtype: "doctabs"
            }]
        }, {
            region: "center",
            layout: "border",
            items: [{
                region: "west",
                xtype: "treecontainer",
                id: "treecontainer",
                border: 1,
                bodyPadding: "10 9 4 9",
                width: 280
            }, {
                region: "center",
                id: "center-container",
                layout: "fit",
                border: false,
                padding: "5 10",
                items: {
                    id: "card-panel",
                    cls: "card-panel",
                    xtype: "container",
                    layout: {
                        type: "card",
                        deferredRender: true
                    },
                    items: [{
                        autoScroll: true,
                        xtype: "welcomeindex",
                        id: "welcomeindex"
                    }, {
                        xtype: "container",
                        id: "failure"
                    }, {
                        autoScroll: true,
                        xtype: "classindex",
                        id: "classindex"
                    }, {
                        xtype: "classcontainer",
                        id: "classcontainer"
                    }, {
                        autoScroll: true,
                        xtype: "guideindex",
                        id: "guideindex"
                    }, {
                        autoScroll: true,
                        xtype: "guidecontainer",
                        id: "guide",
                        cls: "iScroll"
                    }, {
                        xtype: "videoindex",
                        id: "videoindex"
                    }, {
                        autoScroll: true,
                        xtype: "videocontainer",
                        id: "video",
                        cls: "iScroll"
                    }, {
                        xtype: "exampleindex",
                        id: "exampleindex"
                    }, {
                        xtype: Docs.data.touchExamplesUi ? "touchexamplecontainer" : "examplecontainer",
                        id: "example"
                    }, {
                        xtype: "testsindex",
                        id: "testsindex"
                    }, {
                        xtype: "commentindex",
                        id: "commentindex"
                    }]
                }
            }]
        }, {
            region: "south",
            id: "footer",
            height: 20,
            contentEl: "footer-content"
        }];
        this.callParent(arguments)
    },
    setPageTitle: function (b) {
        b = Ext.util.Format.stripTags(b);
        if (!this.origTitle) {
            this.origTitle = document.title
        }
        document.title = b ? (b + " - " + this.origTitle) : this.origTitle
    }
});
Ext.define("Docs.Application", {
    requires: ["Ext.app.Application",
        "Docs.History",
        "Docs.Comments",
        "Docs.Settings",
        "Docs.view.Viewport",
        "Docs.controller.Auth",
        "Docs.controller.Welcome",        
        "Docs.controller.Failure",
        "Docs.controller.Classes",
        "Docs.controller.Search",
        "Docs.controller.InlineExamples",
        "Docs.controller.Examples",
        "Docs.controller.Guides",
        "Docs.controller.Videos",
        "Docs.controller.Tabs",
        "Docs.controller.Comments",
        "Docs.controller.CommentCounts",
        "Docs.controller.Tests"],
    constructor: function () {
        Docs.Comments.init(this.createApp, this)
    },
    createApp: function () {
        new Ext.app.Application({
            name: "Docs",
            controllers: ["Auth",
                "Welcome",                
                "Failure",
                "Classes",
                "Search",
                "InlineExamples",
                "Examples",
                "Guides",
                "Videos",
                "Tabs",
                "Comments",
                "CommentCounts",
                "Tests"],
            launch: this.launch
        })
    },
    launch: function () {
        Docs.App = this;
        Docs.Settings.init();
        Ext.create("Docs.view.Viewport");
        Docs.History.init();
        if (Docs.initEventTracking) {
            Docs.initEventTracking()
        }
        Ext.get("loading").remove()
    }
});
Ext.define("Docs.view.auth.Form", {
    extend: "Docs.view.auth.BaseForm",
    alias: "widget.authForm",
    componentCls: "auth-form",
    initComponent: function () {
        this.html = ['<span class="before-text">Sign in to post a comment:</span>', this.createLoginFormHtml()];
        this.callParent(arguments)
    },
    afterRender: function () {
        this.callParent(arguments);
        this.bindFormSubmitEvent()
    }
});
Ext.define("Docs.view.comments.ListWithForm", {
    extend: "Ext.container.Container",
    alias: "widget.commentsListWithForm",
    requires: ["Docs.view.comments.List", "Docs.view.comments.Form", "Docs.view.auth.Form", "Docs.Comments", "Docs.Auth"],
    componentCls: "comments-list-with-form",
    initComponent: function () {
        this.items = [this.list = new Docs.view.comments.List({
            enableDragDrop: true
        })];
        this.relayEvents(this.list, ["countChange", "reorder"]);
        this.callParent(arguments)
    },
    load: function (c, d) {
        this.list.load(c, d);
        if (Docs.Auth.isLoggedIn()) {
            this.showCommentingForm()
        } else {
            this.showAuthForm()
        }
    },
    showAuthForm: function () {
        if (this.commentingForm) {
            this.remove(this.commentingForm);
            delete this.commentingForm
        }
        if (!this.authForm) {
            this.authForm = new Docs.view.auth.Form();
            this.add(this.authForm)
        }
    },
    showCommentingForm: function () {
        if (this.authForm) {
            this.remove(this.authForm);
            delete this.authForm
        }
        if (!this.commentingForm) {
            this.commentingForm = new Docs.view.comments.Form({
                title: this.newCommentTitle,
                user: Docs.Auth.getUser(),
                userSubscribed: Docs.Comments.hasSubscription(this.target),
                listeners: {
                    submit: this.postComment,
                    subscriptionChange: this.subscribe,
                    scope: this
                }
            });
            this.add(this.commentingForm)
        }
    },
    postComment: function (b) {
        Docs.Comments.post({
            target: this.target,
            parentId: this.parentId,
            content: b,
            callback: function (a) {
                this.commentingForm.setValue("");
                this.list.load([a], true)
            },
            scope: this
        })
    },
    subscribe: function (b) {
        Docs.Comments.subscribe(this.target, b, function () {
            this.commentingForm.showSubscriptionMessage(b)
        }, this)
    }
});
Ext.ns("Docs");
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        Docs: "app"
    }
});
Ext.require("Ext.form.field.Trigger");
Ext.require("Ext.tab.Panel");
Ext.require("Ext.grid.column.Action");
Ext.require("Ext.grid.plugin.DragDrop");
Ext.require("Ext.layout.container.Border");
Ext.require("Ext.data.TreeStore");
Ext.require("Ext.toolbar.Spacer");
Ext.require("Docs.Application");
Ext.onReady(function () {
    Ext.create("Docs.Application")
});


var dext_sdk_curr_page;
var dext_sdk_curr_page_without_param;
var dext_sdk_curr_page_param;
var dext_sdk_curr_section;

function setDextPageInfo() {
    var tempUrl = window.location.href.split("#!");
    dext_sdk_curr_page = tempUrl[0];
    dext_sdk_curr_section = tempUrl[1];

    if (dext_sdk_curr_page.indexOf("?") > -1) {
        var tempPageUrl = dext_sdk_curr_page.split("?");
        dext_sdk_curr_page_without_param = tempPageUrl[0];
        dext_sdk_curr_page_param = tempPageUrl[1];
    } else {
        dext_sdk_curr_page_without_param = dext_sdk_curr_page;
        dext_sdk_curr_page_param = "";
    }   
}

function getDextPageQueryString() {
    if (dext_sdk_curr_page_param == "") return {};
    var dext_sdk_curr_page_paramAry = dext_sdk_curr_page_param.split('&');
    var b = {};
    for (var i = 0; i < dext_sdk_curr_page_paramAry.length; ++i) {
        var p = dext_sdk_curr_page_paramAry[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}