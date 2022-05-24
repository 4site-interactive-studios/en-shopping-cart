export class App {
  private cardsNode = document.querySelectorAll(
    ".sc-cards > div:not(.block-other)"
  ) as NodeListOf<HTMLDivElement>;

  private total = 0;

  private currencies: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "$",
  };

  constructor() {
    if (this.isDebug()) {
      console.log("Shopping Cart: Debug mode is on");
    }
    if (!this.shouldRun()) {
      console.log("Shopping Cart Not Running");
      return;
    }

    // Document Load
    if (document.readyState !== "loading") {
      this.run();
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        this.run();
      });
    }
  }

  private shouldRun() {
    return this.cardsNode.length > 0;
  }

  private setCardsAtttributes() {
    const storedCards = JSON.parse(
      localStorage.getItem(`sc-cards-${this.getPageId()}`) || "[]"
    );
    this.cardsNode.forEach((card, index) => {
      const amountNode = card.querySelector(
        "h1 + p, h2 + p, h3 + p, h4 + p, h5 + p, h6 + p"
      ) as HTMLParagraphElement;
      if (amountNode) {
        const amount = amountNode.innerText;
        const amountRegex = amount.match(/\d+/g);
        const amountNumber = amountRegex
          ? parseInt(amountRegex.join(""), 10)
          : 0;
        const quantity = storedCards[index] || 0;
        if (amountNumber > 0) {
          card.setAttribute("data-amount", amountNumber.toString());
          card.setAttribute("data-quantity", quantity.toString());
          card.setAttribute("data-card", index.toString());
          card.setAttribute("data-currency", this.getCurrency(card));
          if (quantity > 0) {
            card.setAttribute("data-selected", "true");
          }
        }
      }
    });
  }
  private createCardsAmounts() {
    this.cardsNode.forEach((card) => {
      const amount = this.getCardAmount(card);
      const currency = this.getCurrency(card);
      const div = document.createElement("div");
      div.classList.add("sc-cards-amount");
      div.innerHTML = `<span class="currency">${currency}</span><span class="amount">${amount}</span>`;
      card.appendChild(div);
    });
  }
  private createCardsQuantity() {
    this.cardsNode.forEach((card) => {
      const amountNode = card.querySelector(
        "h1 + p, h2 + p, h3 + p, h4 + p, h5 + p, h6 + p"
      ) as HTMLParagraphElement;
      const quantity = this.getCardQuantity(card);
      const div = document.createElement("div");
      div.classList.add("sc-cards-quantity");
      div.innerHTML = `
        <div class="decrease"></div>
        <div class="quantity">${quantity}</div>
        <div class="increase"></div>
      `;
      amountNode.parentNode.insertBefore(div, amountNode.nextSibling);
    });
  }

  private increaseQuantity(card: HTMLElement) {
    const quantity = this.getCardQuantity(card);
    const newQuantity = quantity + 1;
    card.setAttribute("data-quantity", newQuantity.toString());
    card.setAttribute("data-selected", "true");
  }

  private decreaseQuantity(card: HTMLElement) {
    const quantity = this.getCardQuantity(card);
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      card.setAttribute("data-quantity", newQuantity.toString());
      if (newQuantity === 0) {
        card.removeAttribute("data-selected");
      }
    }
  }

  private getCardAmount(card: HTMLElement) {
    const amount = card.getAttribute("data-amount");
    if (amount) {
      return parseInt(amount, 10);
    }
    return 0;
  }
  private getCurrency(card: HTMLElement | null) {
    if (card) {
      const currency = card.getAttribute("data-currency");
      if (currency) {
        return currency;
      }
      if (card.classList.contains("euro") || card.classList.contains("eur")) {
        return this.currencies.EUR;
      }
      if (card.classList.contains("pound") || card.classList.contains("gbp")) {
        return this.currencies.GBP;
      }
      if (card.classList.contains("dollar") || card.classList.contains("usd")) {
        return this.currencies.USD;
      }
      if (
        card.classList.contains("canadian") ||
        card.classList.contains("cad")
      ) {
        return this.currencies.CAD;
      }
    }
    const currency = document.querySelector(
      '[name="transaction.paycurrency"]'
    ) as HTMLInputElement;
    if (currency && currency.value in this.currencies) {
      return this.currencies[currency.value];
    }
    return "$";
  }

  private getCardQuantity(card: HTMLElement) {
    const quantity = card.getAttribute("data-quantity");
    if (quantity) {
      return parseInt(quantity, 10);
    }
    return 0;
  }

  private watchForQuantityChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          const card = mutation.target as HTMLElement;
          const quantityElement = card.querySelector(
            ".sc-cards-quantity > .quantity"
          ) as HTMLDivElement;
          if (quantityElement) {
            quantityElement.innerText = this.getCardQuantity(card).toString();
          }
          this.rememberQuantity();
          this.updateTotal();
        }
      });
    });
    this.cardsNode.forEach((card) => {
      observer.observe(card, {
        attributes: true,
        attributeFilter: ["data-quantity"],
      });
    });
  }
  private addOtherAmount() {
    const blockOther = document.querySelector(".block-other") as HTMLDivElement;
    if (blockOther) {
      const otherStored =
        localStorage.getItem(`sc-cards-${this.getPageId()}-other`) || "0";
      if (otherStored !== "0") {
        blockOther.setAttribute("data-selected", "true");
      }
      const currency = this.getCurrency(blockOther);
      const currencyCode = Object.keys(this.currencies).find(
        (key) => this.currencies[key] === currency
      );
      const otherAmountWrapper = document.createElement("div");
      otherAmountWrapper.classList.add("block-other-amount");
      otherAmountWrapper.innerHTML = `
      <span class="currency-symbol">${currency}</span>
      <input id="sc-other-amount" type="text" inputmode="decimal" data-lpignore="true" autocomplete="off" value="${otherStored}" tabindex="1">
      <span class="currency-code">${currencyCode}</span>
      `;
      blockOther.appendChild(otherAmountWrapper);
      const otherAmount = blockOther.querySelector("input") as HTMLInputElement;
      if (otherAmount) {
        otherAmount.addEventListener("input", (e) => {
          const value = (e.target as HTMLInputElement).value || "0";
          localStorage.setItem(`sc-cards-${this.getPageId()}-other`, value);
          if (value === "0") {
            blockOther.removeAttribute("data-selected");
          } else {
            blockOther.setAttribute("data-selected", "true");
          }
          this.updateTotal();
        });
        otherAmount.addEventListener("focus", function (e) {
          if ((e.target as HTMLInputElement).value === "0") {
            (e.target as HTMLInputElement).value = "";
          }
        });
      }
    }
  }
  private addMonthlyCheckbox() {
    const monthly = document.querySelector(
      ".monthly-checkbox"
    ) as HTMLDivElement;
    if (monthly) {
      const monthlyStored =
        localStorage.getItem(`sc-cards-${this.getPageId()}-monthly`) || "N";
      if (monthlyStored !== "N") {
        monthly.setAttribute("data-selected", "true");
      }
      const monthlyCheckbox = `
      <input id="sc-monthly" value="Y" type="checkbox" ${
        monthlyStored === "Y" ? "checked='checked'" : ""
      }>
      `;
      monthly.innerHTML =
        monthlyCheckbox +
        `<label for="sc-monthly">` +
        monthly.innerHTML +
        `</label>`;
      const monthlyInput = monthly.querySelector("input") as HTMLInputElement;
      if (monthlyInput) {
        monthlyInput.addEventListener("change", (e) => {
          const value = (e.target as HTMLInputElement).checked ? "Y" : "N";
          localStorage.setItem(`sc-cards-${this.getPageId()}-monthly`, value);
          if (value === "N") {
            monthly.removeAttribute("data-selected");
          } else {
            monthly.setAttribute("data-selected", "true");
          }
          this.updateFrequency();
          this.updateTotal();
        });
      }
    }
  }
  private addLiveVariables() {
    const textComponents = document.querySelectorAll(
      ".en__component--copyblock, .en__component--codeblock, .en__submit button"
    ) as NodeListOf<HTMLDivElement>;
    if (textComponents.length > 0) {
      textComponents.forEach((component) => {
        if (component.innerText.includes("[[")) {
          const liveVariables = component.innerText.match(/\[\[(.*?)\]\]/g);
          if (liveVariables) {
            liveVariables.forEach((variable) => {
              const variableName = variable
                .replace(/\[\[/g, "")
                .replace(/\]\]/g, "");
              // console.log(variableName);
              component.innerHTML = component.innerHTML.replace(
                `[[${variableName}]]`,
                "<span class='sc-live-variable' data-variable='" +
                  variableName +
                  "'></span>"
              );
            });
          }
        }
      });
    }
  }
  private updateLiveVariables(variableName: string, value: string) {
    const liveVariables = document.querySelectorAll(
      ".sc-live-variable[data-variable='" + variableName + "']"
    ) as NodeListOf<HTMLDivElement>;
    if (liveVariables.length > 0) {
      liveVariables.forEach((variable) => {
        variable.innerText = value;
      });
    }
  }
  private updateTotal() {
    this.total = 0;
    this.cardsNode.forEach((card) => {
      const amount = this.getCardAmount(card);
      const quantity = this.getCardQuantity(card);
      this.total += amount * quantity;
    });
    const otherAmount = document.querySelector(
      "#sc-other-amount"
    ) as HTMLInputElement;
    if (otherAmount) {
      const otherAmountValue = parseFloat(
        parseFloat(otherAmount.value).toFixed(2)
      );
      if (otherAmountValue > 0) {
        this.total += otherAmountValue;
      }
    }
    if (this.isDebug()) console.log("Shopping Cart Total:", this.total);
    const otherField = document.querySelector(
      "[name='transaction.donationAmt.other']"
    ) as HTMLInputElement;
    if (otherField) {
      otherField.value = this.total.toString();
    }
    (window as any).EngagingNetworks.require._defined.enjs.setFieldValue(
      "donationAmt",
      this.total
    );
    this.updateLiveVariables("TOTAL", this.total.toString());
    return this.total;
  }
  private updateFrequency() {
    const monthlyInput = document.querySelector(
      "#sc-monthly"
    ) as HTMLInputElement;
    if (monthlyInput) {
      const monthly = monthlyInput.checked ? "Y" : "N";
      (window as any).EngagingNetworks.require._defined.enjs.setFieldValue(
        "recurrpay",
        monthly
      );
    }
    const frequency = (
      window as any
    ).EngagingNetworks.require._defined.enjs.getFieldValue("recurrpay");
    if (frequency === "Y") {
      const monthlyLabel = document.querySelector(
        "[name='transaction.recurrpay'][value='Y'] + label"
      ) as HTMLLabelElement;
      if (monthlyLabel) {
        this.updateLiveVariables("FREQUENCY", monthlyLabel.innerText);
      } else {
        this.updateLiveVariables("FREQUENCY", "Monthly");
      }
    } else {
      this.updateLiveVariables("FREQUENCY", "");
    }
  }
  private setQuantityClickEvent() {
    this.cardsNode.forEach((card) => {
      const increase = card.querySelector(
        ".sc-cards-quantity > .increase"
      ) as HTMLDivElement;
      const decrease = card.querySelector(
        ".sc-cards-quantity > .decrease"
      ) as HTMLDivElement;
      if (increase && decrease) {
        increase.addEventListener("click", () => {
          this.increaseQuantity(card);
        });
        decrease.addEventListener("click", () => {
          this.decreaseQuantity(card);
        });
      }
    });
  }

  private rememberQuantity() {
    const cards: number[] = [];
    this.cardsNode.forEach((card, index) => {
      cards[index] = this.getCardQuantity(card);
    });
    localStorage.setItem(`sc-cards-${this.getPageId()}`, JSON.stringify(cards));
  }

  private getPageId() {
    if ("pageJson" in window) return (window as any)?.pageJson?.campaignPageId;
    return 0;
  }

  private isDebug() {
    const regex = new RegExp("[\\?&]debug=([^&#]*)");
    const results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  private checkDebug() {
    if (this.isDebug()) {
      document.querySelector("body").setAttribute("data-debug", "true");
    }
  }

  private run() {
    this.setCardsAtttributes();
    this.createCardsAmounts();
    this.createCardsQuantity();
    this.watchForQuantityChanges();
    this.setQuantityClickEvent();
    this.addLiveVariables();
    this.addOtherAmount();
    this.addMonthlyCheckbox();
    this.updateFrequency();
    this.checkDebug();
    window.setTimeout(() => {
      this.updateTotal();
    }, 500);
  }
}
