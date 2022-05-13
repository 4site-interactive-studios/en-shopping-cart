(()=>{"use strict";new(function(){function t(){var t=this;this.cardsNode=document.querySelectorAll(".sc-cards > div:not(.block-other)"),this.total=0,this.isDebug()&&console.log("Shopping Cart: Debug mode is on"),this.shouldRun()?"loading"!==document.readyState?this.run():document.addEventListener("DOMContentLoaded",(function(){t.run()})):console.log("Shopping Cart Not Running")}return t.prototype.shouldRun=function(){return this.cardsNode.length>0},t.prototype.setCardsAtttributes=function(){var t=JSON.parse(localStorage.getItem("sc-cards-".concat(this.getPageId()))||"[]");this.cardsNode.forEach((function(e,a){var n=e.querySelector("h1 + p, h2 + p, h3 + p, h4 + p, h5 + p, h6 + p");if(n){var r=n.innerText.match(/\d+/g),o=r?parseInt(r.join(""),10):0,i=t[a]||0;o>0&&(e.setAttribute("data-amount",o.toString()),e.setAttribute("data-quantity",i.toString()),e.setAttribute("data-card",a.toString()),e.classList.contains("euro")?e.setAttribute("data-currency","€"):e.setAttribute("data-currency","$"),i>0&&e.setAttribute("data-selected","true"))}}))},t.prototype.createCardsAmounts=function(){var t=this;this.cardsNode.forEach((function(e){var a=t.getCardAmount(e),n=t.getCardCurrency(e),r=document.createElement("div");r.classList.add("sc-cards-amount"),r.innerHTML='<span class="currency">'.concat(n,'</span><span class="amount">').concat(a,"</span>"),e.appendChild(r)}))},t.prototype.createCardsQuantity=function(){var t=this;this.cardsNode.forEach((function(e){var a=e.querySelector("h1 + p, h2 + p, h3 + p, h4 + p, h5 + p, h6 + p"),n=t.getCardQuantity(e),r=document.createElement("div");r.classList.add("sc-cards-quantity"),r.innerHTML='\n        <div class="decrease"></div>\n        <div class="quantity">'.concat(n,'</div>\n        <div class="increase"></div>\n      '),a.parentNode.insertBefore(r,a.nextSibling)}))},t.prototype.increaseQuantity=function(t){var e=this.getCardQuantity(t)+1;t.setAttribute("data-quantity",e.toString()),t.setAttribute("data-selected","true")},t.prototype.decreaseQuantity=function(t){var e=this.getCardQuantity(t);if(e>0){var a=e-1;t.setAttribute("data-quantity",a.toString()),0===a&&t.removeAttribute("data-selected")}},t.prototype.getCardAmount=function(t){var e=t.getAttribute("data-amount");return e?parseInt(e,10):0},t.prototype.getCardCurrency=function(t){return t.getAttribute("data-currency")||"$"},t.prototype.getCardQuantity=function(t){var e=t.getAttribute("data-quantity");return e?parseInt(e,10):0},t.prototype.watchForQuantityChanges=function(){var t=this,e=new MutationObserver((function(e){e.forEach((function(e){if("attributes"===e.type){var a=e.target,n=a.querySelector(".sc-cards-quantity > .quantity");n&&(n.innerText=t.getCardQuantity(a).toString()),t.rememberQuantity(),t.updateTotal()}}))}));this.cardsNode.forEach((function(t){e.observe(t,{attributes:!0,attributeFilter:["data-quantity"]})}))},t.prototype.addOtherAmount=function(){var t=this,e=document.querySelector(".block-other");if(e){var a=localStorage.getItem("sc-cards-".concat(this.getPageId(),"-other"))||"0";"0"!==a&&e.setAttribute("data-selected","true");var n="$",r="USD";e.classList.contains("euro")?(e.setAttribute("data-currency","€"),n="€",r="EUR"):e.setAttribute("data-currency","$");var o=document.createElement("div");o.classList.add("block-other-amount"),o.innerHTML='\n      <span class="currency-symbol">'.concat(n,'</span>\n      <input id="sc-other-amount" type="text" inputmode="decimal" data-lpignore="true" autocomplete="off" value="').concat(a,'" tabindex="1">\n      <span class="currency-code">').concat(r,"</span>\n      "),e.appendChild(o);var i=e.querySelector("input");i&&(i.addEventListener("input",(function(a){var n=a.target.value||"0";localStorage.setItem("sc-cards-".concat(t.getPageId(),"-other"),n),"0"===n?e.removeAttribute("data-selected"):e.setAttribute("data-selected","true"),t.updateTotal()})),i.addEventListener("focus",(function(t){"0"===t.target.value&&(t.target.value="")})))}},t.prototype.addMonthlyCheckbox=function(){var t=this,e=document.querySelector(".monthly-checkbox");if(e){var a=localStorage.getItem("sc-cards-".concat(this.getPageId(),"-monthly"))||"N";"N"!==a&&e.setAttribute("data-selected","true");var n='\n      <input id="sc-monthly" value="Y" type="checkbox" '.concat("Y"===a?"checked='checked'":"",">\n      ");e.innerHTML=n+'<label for="sc-monthly">'+e.innerHTML+"</label>";var r=e.querySelector("input");r&&r.addEventListener("change",(function(a){var n=a.target.checked?"Y":"N";localStorage.setItem("sc-cards-".concat(t.getPageId(),"-monthly"),n),"N"===n?e.removeAttribute("data-selected"):e.setAttribute("data-selected","true"),t.updateFrequency(),t.updateTotal()}))}},t.prototype.addLiveVariables=function(){var t=document.querySelectorAll(".en__component--copyblock, .en__component--codeblock, .en__submit button");t.length>0&&t.forEach((function(t){if(t.innerText.includes("[[")){var e=t.innerText.match(/\[\[(.*?)\]\]/g);e&&e.forEach((function(e){var a=e.replace(/\[\[/g,"").replace(/\]\]/g,"");t.innerHTML=t.innerHTML.replace("[[".concat(a,"]]"),"<span class='sc-live-variable' data-variable='"+a+"'></span>")}))}}))},t.prototype.updateLiveVariables=function(t,e){var a=document.querySelectorAll(".sc-live-variable[data-variable='"+t+"']");a.length>0&&a.forEach((function(t){t.innerText=e}))},t.prototype.updateTotal=function(){var t=this;this.total=0,this.cardsNode.forEach((function(e){var a=t.getCardAmount(e),n=t.getCardQuantity(e);t.total+=a*n}));var e=document.querySelector("#sc-other-amount");if(e){var a=parseFloat(parseFloat(e.value).toFixed(2));a>0&&(this.total+=a)}this.isDebug()&&console.log("Shopping Cart Total:",this.total);var n=document.querySelector("[name='transaction.donationAmt.other']");return n&&(n.value=this.total.toString()),window.EngagingNetworks.require._defined.enjs.setFieldValue("donationAmt",this.total),this.updateLiveVariables("TOTAL",this.total.toString()),this.total},t.prototype.updateFrequency=function(){var t=document.querySelector("#sc-monthly");if(t){var e=t.checked?"Y":"N";window.EngagingNetworks.require._defined.enjs.setFieldValue("recurrpay",e)}if("Y"===window.EngagingNetworks.require._defined.enjs.getFieldValue("recurrpay")){var a=document.querySelector("[name='transaction.recurrpay'][value='Y'] + label");a?this.updateLiveVariables("FREQUENCY",a.innerText):this.updateLiveVariables("FREQUENCY","Monthly")}else this.updateLiveVariables("FREQUENCY","")},t.prototype.setQuantityClickEvent=function(){var t=this;this.cardsNode.forEach((function(e){var a=e.querySelector(".sc-cards-quantity > .increase"),n=e.querySelector(".sc-cards-quantity > .decrease");a&&n&&(a.addEventListener("click",(function(){t.increaseQuantity(e)})),n.addEventListener("click",(function(){t.decreaseQuantity(e)})))}))},t.prototype.rememberQuantity=function(){var t=this,e=[];this.cardsNode.forEach((function(a,n){e[n]=t.getCardQuantity(a)})),localStorage.setItem("sc-cards-".concat(this.getPageId()),JSON.stringify(e))},t.prototype.getPageId=function(){var t;return"pageJson"in window?null===(t=null===window||void 0===window?void 0:window.pageJson)||void 0===t?void 0:t.campaignPageId:0},t.prototype.isDebug=function(){var t=new RegExp("[\\?&]debug=([^&#]*)").exec(location.search);return null===t?"":decodeURIComponent(t[1].replace(/\+/g," "))},t.prototype.checkDebug=function(){this.isDebug()&&document.querySelector("body").setAttribute("data-debug","true")},t.prototype.run=function(){var t=this;this.setCardsAtttributes(),this.createCardsAmounts(),this.createCardsQuantity(),this.watchForQuantityChanges(),this.setQuantityClickEvent(),this.addLiveVariables(),this.addOtherAmount(),this.addMonthlyCheckbox(),this.updateFrequency(),this.checkDebug(),window.setTimeout((function(){t.updateTotal()}),500)},t}())})();