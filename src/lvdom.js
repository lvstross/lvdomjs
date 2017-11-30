/*
* Browser Support IE8
*/
//IE8 indexOf polyfill
if (typeof Array.prototype.indexOf !== "function") {
    Array.prototype.indexOf = function(item) {
        for(var i = 0; i < this.length; i++) {
            if (this[i] === item) {
                return i;
            }
        }
        return -1;
    };
}

window.lvdom = (function(){
    function Lvdom(els) {
        for(var i = 0; i < els.length; i++) {
            this[i] = els[i];
        }
        this.length = els.length;
    }

    // ============ Utilities ================
    Lvdom.prototype.map = function(callback) {
        var results = [], i = 0;
        for(; i < this.length; i++) {
            results.push(callback.call(this, this[i], i));
        }
        return results;
    };
    Lvdom.prototype.forEach = function(callback) {
        this.map(callback);
        return this;
    };
    Lvdom.prototype.mapOne = function(callback) {
        var m = this.map(callback);
        return m.length > 1 ? m : m[0];
    };

    // =============== DOM Manipulation ===============
    Lvdom.prototype.text = function (text) {
        if (typeof text !== "undefined") {
            return this.forEach(function(el) {
                el.innerText = text;
            });
        } else {
            return this.mapOne(function(el) {
                return el.innerText;
            });
        }
    };

    // HTML function
    Lvdom.prototype.html = function(html) {
        if (typeof html !== "undefined") {
            return this.forEach(function(el) {
                el.innerHTML = html;
            });
        } else {
            return this.mapOne(function(el) {
                return el.innerHTML;
            });
        }
    };

    // Adding classes function
    Lvdom.prototype.addClass = function(classes) {
        var className = "";
        if (typeof classes !== "string") {
            for (var i = 0; i < classes.length; i++) {
                className += " " + classes[i];
            }
        } else {
            className = " " + classes;
        }
        return this.forEach(function(el) {
            el.className += className;
        });
    };

    // Removing classes function
    Lvdom.prototype.removeClass = function (clazz) {
        return this.forEach(function(el) {
            var cs = el.className.split(" "), i;

            while( (i = cs.indexOf(clazz)) > -1) {
                cs = cs.slice(0, i).concat(cs.slice(++i));
            }
            el.className = cs.join(" ");
        });
    };

    // Getting and Setting Attributes
    Lvdom.prototype.attr = function (attr, val) {
        if (typeof val !== "undefined") {
            return this.forEach(function(el) {
                el.setAttribute(attr, val);
            });
        } else {
            return this.mapOne(function(el) {
                return el.getAttribute(attr);
            });
        }
    };

    // Append elements to the page
    Lvdom.prototype.append = function (els) {
        this.forEach(function(parEl, i){
            els.forEach(function(childEl) {
                if(i > 0) {
                    childEl = childEl.cloneNode(true);
                }
                parEl.appendChild(childEl);
            });
        });
    };

    // Prepend elements to the page
    Lvdom.prototype.prepend = function (els) {
        return this.forEach(function (parEl, i) {
            for (var j = els.length -1; j > -1; j--) {
                childEl = (i > 0) ? els[j].cloneNode(true) : els[j];
                parEl.insertBefore(childEl, parEl.firstChild);
            }
        }); 
    };

    // Removing Element Nodes
    Lvdom.prototype.remove = function() {
        return this.forEach(function(el) {
            return el.parantNode.removeChild(el);
        });
    };

    // Event Handeler
    Lvdom.prototype.on = (function() {
        if (document.addEventListener) {
            return function (evt, fn) {
                return this.forEach(function (el) {
                    el.addEventListener(evt, fn, false);
                });
            };
        } else if (document.attachEvent) {
            return function (evt, fn) {
                return this.forEach(function (el) {
                    el.attachEvent("on" + evt, fn);
                });
            };
        } else {
            return function (evt, fn) {
                return this.forEach(function (el) {
                    el["on" + evt] = fn;
                });
            };
        }
    }());

    // Unhook events
    Lvdom.prototype.off = (function () {
        if (document.removeEventListener) {
            return function (evt, fn) {
                return this.forEach(function (el) {
                    el.removeEventListener(evt, fn, false);
                });
            };
        } else if (document.detachEvent)  {
            return function (evt, fn) {
                return this.forEach(function (el) {
                    el.detachEvent("on" + evt, fn);
                });
            };
        } else {
            return function (evt, fn) {
                return this.forEach(function (el) {
                    el["on" + evt] = null;
                });
            };
        }
    }());

    var lvdom = {
        // Css Selector Support
        get: function(selector) {
            var els;
            // Selector Patterns
            var id_selector = /^\#{1}/i.test(selector);
            var class_selector = /^\.{1}/i.test(selector);
            var tag_selector = /\w+/i.test(selector);
            // Remove CSS Selector
            if(id_selector || class_selector){
                selector = selector.split("").filter(function(val, i){
                    return i != 0;
                }).join("");
            }
            // Select by selector type
            if(id_selector) {
                els = [document.getElementById(selector)];
            } else if (class_selector){
                els = document.getElementsByClassName(selector);
            } else if (tag_selector){
                els = document.getElementsByTagName(selector);
            } else if (selector.length) {
                els = selector;
            } else {
                els = [selector];
            }
            return new Lvdom(els);
        },
        /**
        * Creating a new element
        *
        * param tagName  Name of tag we are creating
        * param attrs  An object of attributes
        * return new Lvdom 
        */
        create: function(tagName, attrs) {
            var el = new Dome([document.createElement(tagName)]);
            if (attrs) {
                if (attrs.className) {
                    e.addClass(attrs.className);
                    delete attrs.className;
                }
                if (attrs.text) {
                    el.text(attrs.text);
                    delete attrs.text;
                }
                for (var key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        el .attr(key, attrs[key]);
                    }
                }
            }
            return el;
        }
    };

    return lvdom;
}());
// Repo: https://github.com/andrew8088/dome