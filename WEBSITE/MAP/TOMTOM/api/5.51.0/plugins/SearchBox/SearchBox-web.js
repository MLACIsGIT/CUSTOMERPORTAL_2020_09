!function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=10)}([function(t,e,n){"use strict";function r(t){var e=!1,n=!0,r=!1,i=void 0;try{for(var o,s=document.styleSheets[Symbol.iterator]();!(n=(o=s.next()).done);n=!0){var a=o.value.href;if(a&&-1!==a.indexOf(t)){e=!0;break}}}catch(t){r=!0,i=t}finally{try{n||null==s.return||s.return()}finally{if(r)throw i}}e||console.warn('It seems that you forgot to add "'.concat(t,'" to your page, that is ')+"why some information might not be visible on your map. You can find the missing asset on our Downloads page: https://developer.tomtom.com/maps-sdk-web-js/downloads")}e.a=function(t){var e=!0,n=!1,i=void 0;try{for(var o,s=t[Symbol.iterator]();!(e=(o=s.next()).done);e=!0){r(o.value)}}catch(t){n=!0,i=t}finally{try{e||null==s.return||s.return()}finally{if(n)throw i}}}},,function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){(function(e){var n=/^\s+|\s+$/g,r=/^[-+]0x[0-9a-f]+$/i,i=/^0b[01]+$/i,o=/^0o[0-7]+$/i,s=parseInt,a="object"==typeof e&&e&&e.Object===Object&&e,u="object"==typeof self&&self&&self.Object===Object&&self,l=a||u||Function("return this")(),c=Object.prototype.toString,p=Math.max,f=Math.min,h=function(){return l.Date.now()};function d(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function _(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return!!t&&"object"==typeof t}(t)&&"[object Symbol]"==c.call(t)}(t))return NaN;if(d(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=d(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(n,"");var a=i.test(t);return a||o.test(t)?s(t.slice(2),a?2:8):r.test(t)?NaN:+t}t.exports=function(t,e,n){var r,i,o,s,a,u,l=0,c=!1,v=!1,m=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function y(e){var n=r,o=i;return r=i=void 0,l=e,s=t.apply(o,n)}function g(t){return l=t,a=setTimeout(w,e),c?y(t):s}function b(t){var n=t-u;return void 0===u||n>=e||n<0||v&&t-l>=o}function w(){var t=h();if(b(t))return x(t);a=setTimeout(w,function(t){var n=e-(t-u);return v?f(n,o-(t-l)):n}(t))}function x(t){return a=void 0,m&&r?y(t):(r=i=void 0,s)}function O(){var t=h(),n=b(t);if(r=arguments,i=this,u=t,n){if(void 0===a)return g(u);if(v)return a=setTimeout(w,e),y(u)}return void 0===a&&(a=setTimeout(w,e)),s}return e=_(e)||0,d(n)&&(c=!!n.leading,o=(v="maxWait"in n)?p(_(n.maxWait)||0,e):o,m="trailing"in n?!!n.trailing:m),O.cancel=function(){void 0!==a&&clearTimeout(a),l=0,r=u=i=a=void 0},O.flush=function(){return void 0===a?s:x(h())},O}}).call(this,n(2))},,,function(t,e){
/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */
"document"in window.self&&("classList"in document.createElement("_")&&(!document.createElementNS||"classList"in document.createElementNS("http://www.w3.org/2000/svg","g"))||function(t){"use strict";if("Element"in t){var e=t.Element.prototype,n=Object,r=String.prototype.trim||function(){return this.replace(/^\s+|\s+$/g,"")},i=Array.prototype.indexOf||function(t){for(var e=0,n=this.length;e<n;e++)if(e in this&&this[e]===t)return e;return-1},o=function(t,e){this.name=t,this.code=DOMException[t],this.message=e},s=function(t,e){if(""===e)throw new o("SYNTAX_ERR","An invalid or illegal string was specified");if(/\s/.test(e))throw new o("INVALID_CHARACTER_ERR","String contains an invalid character");return i.call(t,e)},a=function(t){for(var e=r.call(t.getAttribute("class")||""),n=e?e.split(/\s+/):[],i=0,o=n.length;i<o;i++)this.push(n[i]);this._updateClassName=function(){t.setAttribute("class",this.toString())}},u=a.prototype=[],l=function(){return new a(this)};if(o.prototype=Error.prototype,u.item=function(t){return this[t]||null},u.contains=function(t){return-1!==s(this,t+="")},u.add=function(){var t,e=arguments,n=0,r=e.length,i=!1;do{t=e[n]+"",-1===s(this,t)&&(this.push(t),i=!0)}while(++n<r);i&&this._updateClassName()},u.remove=function(){var t,e,n=arguments,r=0,i=n.length,o=!1;do{for(t=n[r]+"",e=s(this,t);-1!==e;)this.splice(e,1),o=!0,e=s(this,t)}while(++r<i);o&&this._updateClassName()},u.toggle=function(t,e){t+="";var n=this.contains(t),r=n?!0!==e&&"remove":!1!==e&&"add";return r&&this[r](t),!0===e||!1===e?e:!n},u.toString=function(){return this.join(" ")},n.defineProperty){var c={get:l,enumerable:!0,configurable:!0};try{n.defineProperty(e,"classList",c)}catch(t){void 0!==t.number&&-2146823252!==t.number||(c.enumerable=!1,n.defineProperty(e,"classList",c))}}else n.prototype.__defineGetter__&&e.__defineGetter__("classList",l)}}(window.self),function(){"use strict";var t=document.createElement("_");if(t.classList.add("c1","c2"),!t.classList.contains("c2")){var e=function(t){var e=DOMTokenList.prototype[t];DOMTokenList.prototype[t]=function(t){var n,r=arguments.length;for(n=0;n<r;n++)t=arguments[n],e.call(this,t)}};e("add"),e("remove")}if(t.classList.toggle("c3",!1),t.classList.contains("c3")){var n=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(t,e){return 1 in arguments&&!this.contains(t)==!e?e:n.call(this,t)}}t=null}())},function(t,e,n){t.exports=n.p+"src/SearchBox/dist/SearchBox.css"},,,function(t,e,n){"use strict";n.r(e);n(6);var r="tomtom.searchbox.resultscleared",i="tomtom.searchbox.resultsfound",o="tomtom.searchbox.resultselected",s="tomtom.searchbox.resultfocused",a="tomtom.searchbox.inputrestored",u=function t(e,n){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.origin=e,this.data=n},l=function(t,e){return new u(t,e)},c=40,p=38,f=13,h=27,d=8,_="FUZZY_SEARCH",v="AUTOCOMPLETE",m="brand",y="category",g='\n    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n            <path d="M10.5,4 C14.0898509,4 17,6.91014913 17,10.5 C17,11.9337106 16.5358211,13.2590065 15.7495478,14.3338028 L19.7071068,18.2928932 C20.0976311,18.6834175 20.0976311,19.3165825 19.7071068,19.7071068 C19.3165825,20.0976311 18.6834175,20.0976311 18.2928932,19.7071068 L14.3338028,15.7495478 C13.2590065,16.5358211 11.9337106,17 10.5,17 C6.91014913,17 4,14.0898509 4,10.5 C4,6.91014913 6.91014913,4 10.5,4 Z M10.5,6 C8.01471863,6 6,8.01471863 6,10.5 C6,12.9852814 8.01471863,15 10.5,15 C12.9852814,15 15,12.9852814 15,10.5 C15,8.01471863 12.9852814,6 10.5,6 Z" id="Shape"></path>\n    </svg>',b='\n    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="13" viewBox="0 0 15 13">\n    <path d="M15.512418,11.5 L19.9637666,7.28870352 C20.1223719,7.13865149 20.1223719,6.89512441 19.9637666,6.74507238 L18.2390424,5.11253903 C18.0795704,4.96248699 17.8221618,4.96248699 17.6635565,5.11253903 L13.2122078,9.3238355 L8.7608592,5.11253903 C8.68545669,5.04120281 8.58145321,5.00020499 8.47398296,5.00020499 C8.36564601,5.00020499 8.26250923,5.04120281 8.18624002,5.11253903 L6.46064906,6.74507238 C6.38437985,6.81722855 6.34191176,6.91480337 6.34191176,7.01729793 C6.34191176,7.11979249 6.38437985,7.21736731 6.46064906,7.28952348 L10.9119977,11.5 L6.46064906,15.7112965 C6.38437985,15.7834526 6.34191176,15.8810275 6.34191176,15.9827021 C6.34191176,16.0851966 6.38437985,16.1827715 6.46064906,16.2549276 L8.18624002,17.887461 C8.26250923,17.9596171 8.36564601,17.999795 8.47398296,17.999795 C8.58145321,17.999795 8.68545669,17.9596171 8.7608592,17.887461 L13.2122078,13.6761645 L17.6635565,17.887461 C17.8221618,18.037513 18.0795704,18.037513 18.2390424,17.887461 L19.9637666,16.2549276 C20.1223719,16.1048756 20.1223719,15.8613485 19.9637666,15.7112965 L15.512418,11.5 Z" transform="translate(-5.544 -5)"/>\n    </svg>';function w(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function x(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function O(t,e,n){return e&&x(t.prototype,e),n&&x(t,n),t}var C=function(){function t(e,n,r,i){var o,a,u,c=this;w(this,t),u=function(){c._evented.fire(s,l(null,{result:c._result,text:c._getResultText()}))},(a="focus")in(o=this)?Object.defineProperty(o,a,{value:u,enumerable:!0,configurable:!0,writable:!0}):o[a]=u,this._evented=e,this._options=r,this._result=n,this._type=i,this._createResultElement()}return O(t,[{key:"select",value:function(t){this._evented.fire(o,l(t,{result:this._result,text:this._getResultText()}))}},{key:"getContainer",value:function(){return this._container}},{key:"_createResultElement",value:function(){this._container=document.createElement("div"),this._container.onmousedown=function(t){return t.preventDefault()},this._container.onclick=this.select.bind(this),this._container.className="tt-search-box-result-list";var t=function(t){return'<span class="tt-search-box-result-list-bold">'.concat(t,"</span>")},e=function(t){return'<span class="tt-search-box-result-list-text-content">'.concat(t,"</span>")};switch(this._type){case _:var n=this._getAddress(),r=this._getPoiName(),i=null;n&&r?i="".concat(t(r)," ").concat(n):n&&(i="".concat(t(n))),i&&(this._container.innerHTML="".concat('\n    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n            <path d="M12,4 C15.3068357,4 18,6.61029768 18,9.84615385 C18,11.813391 16.4537597,14.7566138 13.3693459,18.8534202 L13.3693459,18.8534202 L12.7915956,19.6110453 C12.3912752,20.1296516 11.6087248,20.1296516 11.2084044,19.6110453 C7.73934285,15.1169529 6,11.9326175 6,9.84615385 C6,6.61029768 8.69316428,4 12,4 Z M12,6 C9.78398823,6 8,7.72909628 8,9.84615385 C8,11.1589113 9.25046927,13.5982613 11.758095,17.016979 L11.758095,17.016979 L11.999,17.344 L12.4887469,16.6780042 C14.7534108,13.5448791 15.9207088,11.2710802 15.9960961,9.97670688 L15.9960961,9.97670688 L16,9.84615385 C16,7.72909628 14.2160118,6 12,6 Z M12,8 C13.1045695,8 14,8.8954305 14,10 C14,11.1045695 13.1045695,12 12,12 C10.8954305,12 10,11.1045695 10,10 C10,8.8954305 10.8954305,8 12,8 Z" id="Combined-Shape" fill-rule="nonzero"></path>\n    </svg>'," ").concat(e("".concat(i))));break;case v:var o=this._getSuggestionName(),s=this._getSuggestionType();if(o&&s){var a="plaintext"===s?"":" ".concat(this._options.labels.suggestions[s]);this._container.innerHTML="".concat(g," ").concat(e("".concat(t(o)).concat(a)))}}}},{key:"_getSuggestionName",value:function(){return this._result.value?this._result.value:null}},{key:"_getSuggestionType",value:function(){return this._result.type?this._result.type:null}},{key:"_getPoiName",value:function(){return void 0!==this._result.poi&&void 0!==this._result.poi.name?this._result.poi.name:null}},{key:"_getAddress",value:function(){if(void 0!==this._result.address){var t=[];return void 0!==this._result.address.freeformAddress&&t.push(this._result.address.freeformAddress),void 0!==this._result.address.countryCodeISO3&&t.push(this._result.address.countryCodeISO3),t.join(", ")}return null}},{key:"_getResultText",value:function(){switch(this._type){case _:return this._result.poi?this._result.poi.name+", "+this._result.address.freeformAddress:this._result.address.freeformAddress;case v:return this._result.value}return""}}]),t}(),S=function(){function t(e){w(this,t),this._container=document.createElement("div"),this._container.className="tt-search-box-result-list",this._container.innerText=e}return O(t,[{key:"select",value:function(){}},{key:"getContainer",value:function(){return this._container}}]),t}(),T={resultListElement:function(t,e,n,r){return new C(t,e,n,r)},noResultsListElement:function(t){return new S(t)}};function I(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function R(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,i=!1,o=void 0;try{for(var s,a=t[Symbol.iterator]();!(r=(s=a.next()).done)&&(n.push(s.value),!e||n.length!==e);r=!0);}catch(t){i=!0,o=t}finally{try{r||null==a.return||a.return()}finally{if(i)throw o}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function L(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var j=function t(e,n,r){var i=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),L(this,"_onKeyDown",(function(t){var e=t.keyCode||t.which;e===c||e===p?i._highlightElement(e):e===f&&i._selectElement(t)})),L(this,"setVisibility",(function(t){var e=t?"remove":"add";i._container.classList[e]("-hidden")})),L(this,"_findAutocompleteResponseSegments",(function(t,e){var n={};for(var r in t){var i=t[r].segments;for(var o in i){if(Object.keys(n).length===e)break;var s=i[o];"plaintext"!==s.type&&(n[s.type+s.value]=s)}}return n})),L(this,"_hasAnyResults",(function(t,e){return!(t&&t.results&&t.results.length||e&&e.results&&e.results.length)})),L(this,"_convertSearchResponseToListElements",(function(t){var e=R(t,2),n=e[0],r=e[1];if(i._hasAnyResults(n,r))return[T.noResultsListElement(i.params.options.labels.noResultsMessage)];var o=[];if(r&&r.results){var s=i._findAutocompleteResponseSegments(r.results,2);o.push.apply(o,I(Object.values(s).map((function(t){return T.resultListElement(i.params.evented,t,i.params.options,v)}))))}return n&&o.push.apply(o,I(n.results.map((function(t){return T.resultListElement(i.params.evented,t,i.params.options,_)})))),o})),L(this,"appendResults",(function(t){var e=R(t,2),n=e[0],r=e[1];i.clearResults();var o=i._convertSearchResponseToListElements([n,r]);i._resultsCount=o.length,o.forEach((function(t){i._resultListElements.push(t),i._container.appendChild(t.getContainer())}),i),i._container.style.height="auto"})),L(this,"clearResults",(function(){for(;i._container.firstChild;)i._container.removeChild(i._container.firstChild),i._container.style.height="0px";i._resultsCount=-1,i._resultListElements=[],i._highlightedIdx=-1})),L(this,"_highlightElement",(function(t){i._updateHighlightedElementStyle("remove"),i._updateHighlightedIndex(t),i._updateHighlightedElementStyle("add");var e=i._resultListElements[i._highlightedIdx];e&&e.focus&&e.focus()})),L(this,"_selectElement",(function(t){if(i._highlightedIdx>-1){var e=i._resultListElements[i._highlightedIdx];e&&e.select(t)}else t.preventDefault()})),L(this,"updateOptions",(function(t){i.params.options=Object.assign({},i.params.options,t)})),L(this,"getHighlightedIndex",(function(){return i._highlightedIdx})),L(this,"_updateHighlightedIndex",(function(t){i._highlightedIdx=t===p?i._highlightedIdx-1<0?-1:i._highlightedIdx-1:i._highlightedIdx+1>=i._resultsCount?0:i._highlightedIdx+1})),L(this,"_updateHighlightedElementStyle",(function(t){var e=i._container.childNodes[i._highlightedIdx];e&&(e.classList[t]("-highlighted"),"add"===t&&e.scrollIntoView(!1))})),this.params={},this.params.evented=e,this.params.options=r,this._container=document.createElement("div"),this._container.className="tt-search-box-result-list-container -hidden",this._highlightedIdx=-1,this._resultsCount=-1,this._resultListElements=[],n.appendChild(this._container),n.onkeydown=this._onKeyDown},E=n(3),k=n.n(E);function F(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var P=function t(e,n,i,o){var s=this,a=o.onInput,u=o.onKeydown,l=o.onKeyup,f=o.onClear,_=o.onClick,v=o.onBlur,m=o.onFilterReset;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),F(this,"updateOptions",(function(t){s.params.options=Object.assign({},s.params.options,t),s._setPlaceholder()})),F(this,"getValue",(function(){return s._input.value})),F(this,"setValue",(function(t){s._input.value=t})),F(this,"isFilterSet",(function(){return Boolean(s._filterType)})),F(this,"getPreviousData",(function(){return{previousValue:s._previousInput,previousFilterOptions:s._previousFilterOptions}})),F(this,"_create",(function(){s._inputContainer=document.createElement("div"),s._inputContainer.className="tt-search-box-input-container",s._inputContainer.onmousedown=function(t){return t.preventDefault()},s._inputContainer.onclick=s._onContainerClick,s._addSearchIcon(),s._addFilter(),s._addInput(),s._addClearIcon()})),F(this,"_onContainerClick",(function(){document.activeElement!==s._input&&s._input.focus()})),F(this,"_addFilter",(function(){s._filter=document.createElement("div"),s._filter.className="tt-searchbox-filter-label -hidden",s._filterText=document.createElement("div"),s._filterText.className="tt-searchbox-filter-label__text",s._filterRemoveButton=document.createElement("div"),s._filterRemoveButton.className="tt-searchbox-filter-label__close-button",s._filterRemoveButton.innerHTML=b,s._filter.appendChild(s._filterText),s._filter.appendChild(s._filterRemoveButton),s._inputContainer.appendChild(s._filter)})),F(this,"_onFilterReset",(function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];s.params.onFilterReset(s._filterType),s._indicateFilterRemoval(!1),s._filterType=null,s._filter.classList.add("-hidden"),t&&(s._previousFilterOptions={filterType:void 0,filterText:void 0})})),F(this,"updateFilter",(function(t){var e=t.text,n=t.type,r=arguments.length>1&&void 0!==arguments[1]&&arguments[1];s.params.onFilterReset(s._filterType),s._filterType=n,s._filter.classList.remove("-hidden"),s._filterRemoveButton.onclick=function(){return s._onFilterReset(!0)},s._filterText.innerText=e,r&&(s._previousFilterOptions={filterType:n,filterText:e})})),F(this,"_setPlaceholder",(function(){s._input.setAttribute("placeholder",s.params.options.labels.placeholder)})),F(this,"_addInput",(function(){s._input=document.createElement("input"),s._input.className="tt-search-box-input",s._setPlaceholder(),s._input.oninput=k()(s._onInput,s.params.options.idleTimePress),s._input.onfocus=s.toggleInputFocus.bind(null,!0),s._input.onmousedown=function(t){return t.stopPropagation()},s._input.onkeydown=s._onKeyDown,s._input.onkeyup=s._onKeyUp,s._input.onclick=s._onClick,s._input.onblur=s._onBlur,s._inputContainer.appendChild(s._input)})),F(this,"_onClick",(function(t){s._indicateFilterRemoval(!1),s.params.onClick(t)})),F(this,"_onBlur",(function(t){s.toggleInputFocus.call(null,!1),s.params.onBlur(t)})),F(this,"_indicateFilterRemoval",(function(t){s._filter.classList.toggle("-highlighted",t),s._deletionConfirmed=t})),F(this,"_onKeyDown",(function(t){s.params.onKeydown(t),(t.keyCode||t.which)===d?0===s._input.selectionStart&&(s._deletionConfirmed?s._onFilterReset(!0):s._indicateFilterRemoval(!0)):s._indicateFilterRemoval(!1)})),F(this,"_onKeyUp",(function(t){var e=t.keyCode||t.which;if(e!==c&&e!==p&&e!==h){s._previousInput=s.getValue();var n=s._filterText.innerText&&""!==s._filterText.innerText?s._filterText.innerText:void 0;s._previousFilterOptions={filterType:s._filterType,filterText:n}}s.params.onKeyup(t)})),F(this,"_addSearchIcon",(function(){s.params.options.showSearchButton&&(s._searchIcon=document.createElement("div"),s._searchIcon.innerHTML=g,s._inputContainer.appendChild(s._searchIcon))})),F(this,"_addClearIcon",(function(){var t=s;s._closeIcon=document.createElement("div"),s._closeIcon.className="tt-search-box-close-icon -hidden",s._closeIcon.innerHTML=b,s._inputContainer.appendChild(s._closeIcon),s._closeIcon.onclick=function(){t._input.value="",t._closeIcon.classList.add("-hidden"),t.params.onClear(),t.params.evented.fire(r),t._onFilterReset(),t._previousInput=void 0,t._previousFilterOptions={filterType:void 0,filterText:void 0}}})),F(this,"_onInput",(function(){var t=s._input.value.length>0||s.isFilterSet();s._closeIcon.classList.toggle("-hidden",!t),t&&s.params.onInput(s._input.value)})),F(this,"toggleInputFocus",(function(t){s._inputContainer.classList.toggle("-focused",t)})),this.params={},this.params.evented=e,this.params.options=i,this.params.onInput=a,this.params.onKeydown=u,this.params.onKeyup=l,this.params.onClear=f,this.params.onClick=_,this.params.onBlur=v,this.params.onFilterReset=m,this._create(),n.appendChild(this._inputContainer),this._previousInput=void 0,this._previousFilterOptions={filterType:void 0,filterText:void 0}};n(7);function M(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function A(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function B(t,e,n){var r=t[e];r||(r=[],t[e]=r),r.push(n)}function N(t,e,n){var r=t[e];return r&&r.forEach((function(t){t.apply(void 0,A(n))})),r}var W=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.eventToHandlersMap={},this.onceEventToHandlersMap={}}var e,n,r;return e=t,(n=[{key:"fire",value:function(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),r=1;r<e;r++)n[r-1]=arguments[r];N(this.eventToHandlersMap,t,n),N(this.onceEventToHandlersMap,t,n)&&delete this.onceEventToHandlersMap[t]}},{key:"on",value:function(t,e){B(this.eventToHandlersMap,t,e)}},{key:"off",value:function(t){t?(delete this.eventToHandlersMap[t],delete this.onceEventToHandlersMap[t]):(this.eventToHandlersMap={},this.onceEventToHandlersMap={})}},{key:"once",value:function(t,e){B(this.onceEventToHandlersMap,t,e)}}])&&M(e.prototype,n),r&&M(e,r),t}(),H=n(0);function D(t){return(D="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function V(t,e){if(null==t)return{};var n,r,i=function(t,e){if(null==t)return{};var n,r,i={},o=Object.keys(t);for(r=0;r<o.length;r++)n=o[r],e.indexOf(n)>=0||(i[n]=t[n]);return i}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(r=0;r<o.length;r++)n=o[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(i[n]=t[n])}return i}function K(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,i=!1,o=void 0;try{for(var s,a=t[Symbol.iterator]();!(r=(s=a.next()).done)&&(n.push(s.value),!e||n.length!==e);r=!0);}catch(t){i=!0,o=t}finally{try{r||null==a.return||a.return()}finally{if(i)throw o}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function z(t,e,n,r,i,o,s){try{var a=t[o](s),u=a.value}catch(t){return void n(t)}a.done?e(u):Promise.resolve(u).then(r,i)}function Z(t){return function(){var e=this,n=arguments;return new Promise((function(r,i){var o=t.apply(e,n);function s(t){z(o,r,i,s,a,"next",t)}function a(t){z(o,r,i,s,a,"throw",t)}s(void 0)}))}}function q(t){return(q=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function $(t,e){return($=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function U(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function Q(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function Y(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?Q(Object(n),!0).forEach((function(e){G(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):Q(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function G(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var X={placeholder:"",suggestions:{brand:"Suggested brand",category:"Suggested category"},noResultsMessage:"No results found."};function J(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e.labels&&e.labels.placeholder||e.placeholder,r=e.labels&&e.labels.noResultsMessage||e.noResultsMessage,i=Y({},e.labels);return n&&(i.placeholder=n),r&&(i.noResultsMessage=r),Object.assign({},t,i,{suggestions:Object.assign({},t.suggestions,i.suggestions)})}var tt=function(t){function e(t,n){var r,u;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),u=function(t,e){return!e||"object"!==D(e)&&"function"!=typeof e?U(t):e}(this,q(e).call(this)),G(U(U(u)),"getOptions",(function(){return u.options})),G(U(U(u)),"getSearchBoxHTML",(function(){return u._container})),G(U(U(u)),"onAdd",(function(t){return u.options.cssStyleCheck&&Object(H.a)(["SearchBox.css"]),u._map=t,u._container.classList.add("mapboxgl-ctrl","tt-ctrl"),u._container})),G(U(U(u)),"onRemove",(function(){u._container.parentNode.removeChild(u._container),u._map=void 0})),G(U(U(u)),"query",(function(){var t=u.options.searchOptions&&u.options.searchOptions.typeahead||!1;u._query({triggeredBySubmit:!0,useTypeahead:t})})),G(U(U(u)),"_query",Z(regeneratorRuntime.mark((function t(){var e,n,r,o,s,a,c=arguments;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e=c.length>0&&void 0!==c[0]?c[0]:{triggeredBySubmit:!1,useTypeahead:!0},(n=u._inputWrapper.getValue().trim())||u._inputWrapper.isFilterSet()){t.next=4;break}return t.abrupt("return");case 4:return t.prev=4,t.next=7,u._runSearch(e.useTypeahead);case 7:r=t.sent,o=K(r,2),s=o[0],a=o[1],u.options.filterSearchResults&&s&&s.results&&(s.results=s.results.filter(u.options.filterSearchResults)),n===u._inputWrapper.getValue().trim()&&u._resultList.appendResults([s,a]),u.fire(i,l(null,{metadata:{triggeredBy:e.triggeredBySubmit?"submit":"input"},results:Y({},s&&{fuzzySearch:s},{},a&&{autocomplete:a})})),t.next=19;break;case 16:t.prev=16,t.t0=t.catch(4),console.error(t.t0);case 19:case"end":return t.stop()}}),t,null,[[4,16]])})))),G(U(U(u)),"updateOptions",(function(t){var e=u.options.labels;u.options=Y({},u.options,{},t),u.options.labels=J(e,t),u._resultList.updateOptions(u.options),u._inputWrapper.updateOptions(u.options)})),G(U(U(u)),"setFilter",(function(t){var e=t.type,n=t.value;if(!e||!n)throw new Error("Invalid filterOptions format passed. Expected object properties are[type] and [value]");u.removeFilter();var r=u._availableFilters[e](n),i=r.displayedInputValue,o=V(r,["displayedInputValue"]);u._inputWrapper.updateFilter({text:i,type:e},!0);var s=Y({},u.options,{searchOptions:Y({},u.options.searchOptions,{},o)});u.updateOptions(s),u._inputWrapper._onInput()})),G(U(U(u)),"_availableFilters",(G(r={},y,(function(t){return{categorySet:t.id,displayedInputValue:t.name}})),G(r,m,(function(t){return{brandSet:t.name,displayedInputValue:t.name}})),r)),G(U(U(u)),"removeFilter",(function(){u.options.searchOptions&&(u.options.searchOptions.brandSet&&delete u.options.searchOptions.brandSet,u.options.searchOptions.categorySet&&delete u.options.searchOptions.categorySet),u._inputWrapper._onFilterReset()})),G(U(U(u)),"_createSearchBoxContainer",(function(){return u._container=document.createElement("div"),u._container.className="tt-search-box",u._addInputWrapper(),u._addResultList(),u._container})),G(U(U(u)),"_onInputClear",(function(){u._resultList.clearResults()})),G(U(U(u)),"_handleInputClick",(function(){u._resultList.setVisibility(!0)})),G(U(U(u)),"_handleInputBlur",(function(){u._resultList.setVisibility(!1)})),G(U(U(u)),"_handleKeydown",function(){var t=Z(regeneratorRuntime.mark((function t(e){var n;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if((n=e.keyCode||e.which)!==p&&n!==c||e.preventDefault(),n!==f||-1!==u._resultList.getHighlightedIndex()||!u.options.searchOptions){t.next=8;break}return e.preventDefault(),t.next=6,u._query({useTypeahead:!1,triggeredBySubmit:!0});case 6:return u._resultList.clearResults(),t.abrupt("return");case 8:if(n!==h){t.next=12;break}return e.preventDefault(),u._resultList.setVisibility(!1),t.abrupt("return");case 12:u._resultList.setVisibility(!0);case 13:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),G(U(U(u)),"_handleKeyup",(function(t){var e=t.keyCode||t.which;e!==c&&e!==p||-1===u._resultList.getHighlightedIndex()&&u._restoreOriginalQuery()})),G(U(U(u)),"_restoreOriginalQuery",(function(){var t=u._inputWrapper.getPreviousData(),e=t.previousValue,n=t.previousFilterOptions;n.filterType?u._inputWrapper.updateFilter({type:n.filterType,text:n.filterText}):u.removeFilter(),e&&u._inputWrapper.setValue(e),u.fire(a)})),G(U(U(u)),"_addResultList",(function(){u._resultList=new j(U(U(u)),u._container,u.options)})),G(U(U(u)),"_addInputWrapper",(function(){u._inputWrapper=new P(U(U(u)),u._container,u.options,{onInput:u._onInputChange,onKeydown:u._handleKeydown,onKeyup:u._handleKeyup,onClear:u._onInputClear,onClick:u._handleInputClick,onBlur:u._handleInputBlur,onFilterReset:u._onFilterReset})})),G(U(U(u)),"_onResultSelected",function(){var t=Z(regeneratorRuntime.mark((function t(e){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:u._onResultFocused(e),u._resultList.clearResults(),u._inputWrapper.toggleInputFocus(!1);case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),G(U(U(u)),"_onResultFocused",function(){var t=Z(regeneratorRuntime.mark((function t(e){var n,r,i,o,s,a,l,c;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:"matches"in e.data.result?(n=e.data.result.matches.inputQuery[0],r=n.offset,i=n.length,o=u._inputWrapper.isFilterSet()||!u._isInputFilledWithSelectedResult,s=o?u._inputWrapper.getValue():"",a=s.split(s.slice(r,r+i)).join("").trim(),u._inputWrapper.setValue(a),(l=e.data.result.type)===y&&(c={categorySet:e.data.result.id}),l===m&&(c={brandSet:e.data.result.value}),u._inputWrapper.updateFilter({text:e.data.text,type:l}),u.options=Object.assign({},u.options,{searchOptions:Object.assign({},u.options.searchOptions,c)}),u._isInputFilledWithSelectedResult=!1):(u._inputWrapper.setValue(e.data.text),u._inputWrapper._onFilterReset(),u._isInputFilledWithSelectedResult=!0);case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),G(U(U(u)),"_onFilterReset",(function(){var t=Y({},u.options.searchOptions);delete t.categorySet,delete t.brandSet,u.options=Object.assign({},u.options,{searchOptions:t})})),G(U(U(u)),"_onInputChange",(function(t){u.options.minNumberOfCharacters>t.length||(u._query(),u._isInputFilledWithSelectedResult=!1)})),G(U(U(u)),"_runSearch",(function(t){var e=u._inputWrapper.getValue().trim(),n=[];if(u.options.searchOptions){var r=Y({query:e,typeahead:u._inputWrapper.isFilterSet()||t},u._map&&{center:u._map.getCenter()},{},u.options.searchOptions);n.push(u.fuzzySearch(r))}else n.push(void 0);if(u.options.autocompleteOptions&&!u._inputWrapper.isFilterSet()){var i=Y({query:e},u._map&&{center:u._map.getCenter()},{},u.options.autocompleteOptions);n.push(u.autocomplete(i))}else n.push(void 0);return Promise.all(n.map((function(t){return void 0!==t?t.go():t})))})),u.fuzzySearch=t.fuzzySearch,u.autocomplete=t.autocomplete,u.options=Object.assign({},{idleTimePress:200,minNumberOfCharacters:3,searchOptions:null,autocompleteOptions:null,showSearchButton:!0,cssStyleCheck:!0},n),u.options.labels=J(X,n),u._createSearchBoxContainer(),u.on(o,u._onResultSelected.bind(U(U(u)))),u.on(s,u._onResultFocused.bind(U(U(u)))),u}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&$(t,e)}(e,t),e}(W);window.tt=window.tt||{},window.tt.plugins=window.tt.plugins||{},window.tt.plugins.SearchBox=tt}]);