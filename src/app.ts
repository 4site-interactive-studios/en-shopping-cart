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
    AUD: "$",
  };

  private additionalComments: HTMLTextAreaElement | null =
    document.querySelector("[name='transaction.comments']");

  private cartItems = "";

  constructor() {
    this.log("Shopping Cart: Debug mode is on");
    if (!this.shouldRun()) {
      this.log("Shopping Cart Not Running");
      return;
    }

    // Check for Additional Comments, if not found, create it
    if (!this.additionalComments) {
      // Create Additional Comments field
      this.createAdditionalComments();
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

  private run() {
    while (
      !this.checkNested(
        (window as any).EngagingNetworks,
        "require",
        "_defined",
        "enjs",
        "setFieldValue"
      )
    ) {
      this.log("4Site Shoppint Cart - Waiting for EngagingNetworks");
      window.setTimeout(() => {
        this.run();
      }, 10);
      return;
    }
    this.setCardsAtttributes();
    this.createCardsAmounts();
    this.createCardsQuantity();
    this.createCardsImageFlip();
    this.watchForQuantityChanges();
    this.setQuantityClickEvent();
    this.addLiveVariables();
    this.addOtherAmount();
    this.addMonthlyCheckbox();
    this.addMobileCta();
    this.checkDebug();
    const monthlyStored =
      localStorage.getItem(`sc-cards-${this.getPageId()}-monthly`) ||
      (window as any).EngagingNetworks.require._defined.enjs.getFieldValue(
        "recurrpay"
      );
    if (monthlyStored === "Y") {
      this.updateFrequency("monthly");
      const monthlyCheckbox = document.querySelector(
        "#sc-monthly"
      ) as HTMLInputElement;
      if (monthlyCheckbox) {
        monthlyCheckbox.checked = true;
      }
    } else {
      this.updateFrequency("onetime");
    }
    this.renderFrequency();

    window.setTimeout(() => {
      this.updateTotal();
    }, 500);
  }

  private renderFrequency() {
    const freqRow = document.querySelector(
      ".frequency-buttons"
    ) as HTMLDivElement;
    if (freqRow) {
      const freqButtons = freqRow.querySelectorAll("div");
      const recurrpay = (
        window as any
      ).EngagingNetworks.require._defined.enjs.getFieldValue("recurrpay");
      const monthlyIcon = `
      <div class="monthly-icon">
      <svg id="monthly-icon-heart" width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.972 15.107c-.443-.427-1.508-1.255-2.393-1.871-2.635-1.752-2.997-2.013-4.063-2.889C1.546 8.737.701 7.127.701 4.95c0-1.066.08-1.468.422-2.107C1.707 1.776 2.551.972 3.617.498 4.381.142 4.763 0 6.03 0c1.328 0 1.61.142 2.393.521.966.474 1.93 1.468 2.152 2.155l.12.426.303-.592c1.749-3.386 7.34-3.338 9.29.095.624 1.089.684 3.41.141 4.712-.724 1.704-2.051 3.007-5.148 4.996-2.031 1.302-4.344 3.29-4.505 3.551-.16.332.02.048-.804-.758z"/>
      </svg>
      <svg id="monthly-icon-paw" width="38" height="31" viewBox="0 0 38 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="p1" d="M6.45749 19.1425C9.19966 9.11877 16.8581 11.1737 18.5133 11.1738C20.1684 11.1739 28.192 9.52885 30.2178 19.1425C33.8793 36.5187 23.7721 29.6687 18.7973 29.6687C13.8225 29.6687 3.73797 36.3754 6.45749 19.1425Z"/>
        <path d="M18 4C18 6.20914 15.9853 8 13.5 8C11.0147 8 9 6.20914 9 4C9 1.79086 11.0147 0 13.5 0C15.9853 0 18 1.79086 18 4Z"/>
        <path d="M29 4C29 6.20914 26.9853 8 24.5 8C22.0147 8 20 6.20914 20 4C20 1.79086 22.0147 0 24.5 0C26.9853 0 29 1.79086 29 4Z"/>
        <path d="M8 11C8 13.2091 6.20914 15 4 15C1.79086 15 0 13.2091 0 11C0 8.79086 1.79086 7 4 7C6.20914 7 8 8.79086 8 11Z"/>
        <path d="M38 11C38 13.2091 36.2091 15 34 15C31.7909 15 30 13.2091 30 11C30 8.79086 31.7909 7 34 7C36.2091 7 38 8.79086 38 11Z"/>
        <animate id="paw-to-heart" xlink:href="#p1" fill="freeze" attributeName="d" to="M19.6324 7.31636C20.1715 6.01409 20.1116 3.69369 19.4927 2.60453C18.4794 0.808119 16.7543 0.00272001 15.0118 0.0178418C12.5177 0.0178418 11.0213 0.999756 9.96961 3.10176C9.39422 1.05455 7.32189 0 5.33784 0C3.29283 0 1.46294 1.00755 0.466507 2.8413C-0.322742 4.32795 -0.0270404 6.46379 0.731797 7.90055C1.78089 9.88687 3.86495 11.2059 5.67154 12.4268C7.29271 13.5224 9.52481 14.9998 9.96904 15.9996C10.0236 15.4998 13.0165 13.2859 14.5215 12.3123C17.596 10.3234 18.9137 9.02114 19.6324 7.31636Z" dur="1s" begin="indefinite"/>
      </svg>
      </div>
      `;

      freqButtons.forEach((button) => {
        const freqText = button.innerText;
        const freq = button.className.split(" ")[0];
        const freqChecked =
          freq === "monthly" ? recurrpay === "Y" : recurrpay === "N";
        const freqMarkup = `
          <input id="frequency-${freq}" type="radio" name="sc-frequency" value="${freq}" ${
          freqChecked ? "checked" : ""
        } />
          <label for="frequency-${freq}">
            ${freq === "monthly" ? monthlyIcon : ""}
            <span>${freqText}</span>
          </label>
        `;
        button.innerHTML = freqMarkup;
      });
      const freqInputs = freqRow.querySelectorAll("input");
      freqInputs.forEach((input) => {
        input.addEventListener("change", (e) => {
          const value = (e.target as HTMLInputElement).value;
          this.updateFrequency(value);
          localStorage.setItem(`sc-cards-${this.getPageId()}-monthly`, value);
          const monthlyCheckbox = document.querySelector(
            "#sc-monthly"
          ) as HTMLInputElement;
          if (monthlyCheckbox) {
            monthlyCheckbox.checked = value === "monthly";
            monthlyCheckbox.dispatchEvent(new Event("change"));
          }
        });
      });
    }
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
        const amountRegex = amount.match(/(\d+)([,.](\d{1,2}))?/);
        const amountNumber = amountRegex
          ? parseFloat(amountRegex[1] + "." + (amountRegex[3] || "0"))
          : 0;
        const quantity = storedCards[index] || 0;
        if (amountNumber > 0) {
          card.setAttribute("data-amount", amountNumber.toFixed(2));
          card.setAttribute("data-quantity", quantity.toString());
          card.setAttribute("data-card", index.toString());
          card.setAttribute(
            "data-currency-symbol",
            this.getCurrencySymbol(card)
          );
          card.setAttribute(
            "data-currency-position",
            this.getCurrencyPosition(card)
          );
          card.setAttribute("data-currency-code", this.getCurrencyCode(card));
          if (quantity > 0) {
            card.setAttribute("data-selected", "true");
          }
        }
      }
    });
  }
  private createCardsImageFlip() {
    this.cardsNode.forEach((card) => {
      const cardImageContainer = card.querySelector(
        "p:first-child"
      ) as HTMLParagraphElement;
      if (cardImageContainer) {
        const cardImage = cardImageContainer.querySelectorAll(
          "img"
        ) as NodeListOf<HTMLImageElement>;
        if (cardImage.length > 1) {
          const cardImageInner = document.createElement("div");
          cardImageInner.classList.add("sc-card-image-inner");
          cardImageContainer.classList.add("sc-card-image-flip");
          cardImage[0].classList.add("sc-card-image-front");
          cardImage[1].classList.add("sc-card-image-back");
          cardImageInner.appendChild(cardImage[0]);
          cardImageInner.appendChild(cardImage[1]);
          cardImageContainer.innerHTML = "";
          cardImageContainer.appendChild(cardImageInner);
          card.setAttribute("data-flip", "true");
        }
      }
    });
  }

  private createCardsAmounts() {
    this.cardsNode.forEach((card) => {
      const amount = this.getCardAmount(card);
      let amountHTML = "";
      // check if amount is an int number
      if (amount % 1 === 0) {
        amountHTML = amount.toString();
      } else {
        // Separate the decimal part
        let decimalPart = amount.toString().split(".")[1];
        // If decimal part is only one digit, add a 0
        if (decimalPart.length === 1) {
          decimalPart += "0";
        }
        // Add a span to the decimal part, with 2 decimals
        amountHTML = `${
          amount.toString().split(".")[0]
        }<span class="decimal">${decimalPart}</span>`;
      }

      const currency = this.getCurrencySymbol(card);
      const position = this.getCurrencyPosition(card);
      const div = document.createElement("div");
      div.classList.add("sc-cards-amount");
      div.classList.add(`position-${position}`);
      div.innerHTML = `<span class="currency">${currency}</span><span class="amount">${amountHTML}</span>`;
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
      return parseFloat(amount);
    }
    return 0;
  }
  private getCardTitle(card: HTMLElement) {
    const title = card.querySelector("h1, h2, h3, h4, h5, h6") as HTMLElement;
    if (title) {
      return title.innerText;
    }
    return "";
  }
  private getCurrencySymbol(card: HTMLElement | null) {
    if (card) {
      const currency = card.getAttribute("data-currency-symbol");
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
      if (
        card.classList.contains("australian") ||
        card.classList.contains("aud")
      ) {
        return this.currencies.AUD;
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

  private getCurrencyCode(card: HTMLElement) {
    const currency = card.getAttribute("data-currency-code");
    if (currency) {
      return currency;
    }
    if (card.classList.contains("euro") || card.classList.contains("eur")) {
      return "EUR";
    }
    if (card.classList.contains("pound") || card.classList.contains("gbp")) {
      return "GBP";
    }
    if (card.classList.contains("dollar") || card.classList.contains("usd")) {
      return "USD";
    }
    if (card.classList.contains("canadian") || card.classList.contains("cad")) {
      return "CAD";
    }
    if (
      card.classList.contains("australian") ||
      card.classList.contains("aud")
    ) {
      return "AUD";
    }
    const currencyCode = document.querySelector(
      '[name="transaction.paycurrency"]'
    ) as HTMLInputElement;
    if (currencyCode && currencyCode.value in this.currencies) {
      return currencyCode.value;
    }
    return "USD";
  }

  private getCurrencyPosition(card: HTMLElement) {
    const position = card.getAttribute("data-currency-position");
    if (position) {
      return position;
    }
    // Try to get the currency position from the card class (local)
    if (card.classList.contains("currency-right")) {
      return "right";
    }
    // Try to get the currency position from the row class (global)
    const row = card.closest(".sc-cards") as HTMLElement;
    if (row.classList.contains("currency-right")) {
      return "right";
    }
    // Default position
    return "left";
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
      const currency = this.getCurrencySymbol(blockOther);
      const currencyCode = this.getCurrencyCode(blockOther);
      const otherAmountWrapper = document.createElement("div");
      otherAmountWrapper.classList.add("block-other-amount");
      otherAmountWrapper.innerHTML = `
      <span class="currency-symbol">${currency}</span>
      <input id="sc-other-amount" aria-label="Enter your custom donation amount" name="transaction.donationAmt.other-standin" type="text" inputmode="decimal" data-lpignore="true" autocomplete="off" value="${otherStored}" tabindex="1" placeholder="0" />
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
          const freqButtons = document.querySelectorAll(
            ".frequency-buttons input"
          ) as NodeListOf<HTMLInputElement>;
          freqButtons.forEach((button) => {
            button.checked =
              (button.value === "onetime" && value === "N") ||
              (button.value === "monthly" && value === "Y");
          });
        });
      }
    }
  }
  private addMobileCta() {
    const mobileCta = document.querySelector(
      ".sc-mobile-checkout"
    ) as HTMLDivElement;
    // When clicking on the mobile CTA, scroll to .en__field--firstName
    if (mobileCta) {
      mobileCta.addEventListener("click", () => {
        const firstName = document.querySelector(
          ".en__field--firstName"
        ) as HTMLDivElement;
        if (firstName && !firstName.classList.contains("en__hidden")) {
          firstName.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          const billingInfo = document.querySelector(
            ".en__donation--billing--info"
          ) as HTMLDivElement;
          if (billingInfo && !billingInfo.classList.contains("en__hidden")) {
            billingInfo.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      });
      // When scrolling, hide the mobile CTA if the user scrolls past the .en__field--firstName
      window.addEventListener("scroll", () => {
        const firstName = document.querySelector(
          ".en__field--firstName"
        ) as HTMLDivElement;
        if (firstName && !firstName.classList.contains("en__hidden")) {
          const fieldPosition = firstName.getBoundingClientRect().top;
          if (fieldPosition < window.innerHeight - 200) {
            mobileCta.classList.add("hidden");
          } else {
            mobileCta.classList.remove("hidden");
          }
        } else {
          const billingInfo = document.querySelector(
            ".en__donation--billing--info"
          ) as HTMLDivElement;
          if (billingInfo && !billingInfo.classList.contains("en__hidden")) {
            const fieldPosition = billingInfo.getBoundingClientRect().top;
            if (fieldPosition < window.innerHeight - 200) {
              mobileCta.classList.add("hidden");
            } else {
              mobileCta.classList.remove("hidden");
            }
          }
        }
      });
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
              // this.log(variableName);
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
    if (variableName === "FREQUENCY") {
      const freqElements = document.querySelectorAll(
        '[class*="show-frequency-"]'
      ) as NodeListOf<HTMLDivElement>;
      const freq = value === "" ? "single" : "monthly";
      freqElements.forEach((element) => {
        if (element.classList.contains(`show-frequency-${freq}`)) {
          element.classList.remove("peta-hide");
        } else {
          element.classList.add("peta-hide");
        }
      });
    }
  }
  private updateTotal() {
    this.total = 0;
    this.cartItems = "";
    this.cardsNode.forEach((card) => {
      const amount = this.getCardAmount(card);
      const quantity = this.getCardQuantity(card);
      const title = this.getCardTitle(card);
      if (quantity > 0) {
        this.cartItems = `['${quantity}','${title}','${amount.toFixed(
          2
        )}'] \r\n${this.cartItems}`;
      }
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
        this.cartItems = `['1','Other','${otherAmountValue.toFixed(2)}'] \r\n${
          this.cartItems
        }`;
        this.total += otherAmountValue;
      }
    }
    this.log("Shopping Cart Total:", this.total);
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
    const otherAmountField = document.querySelector(
      'input[name="transaction.donationAmt.other"]'
    ) as HTMLInputElement;
    if (otherAmountField && otherAmountField.value !== "") {
      const keyUpEvent = new Event("keyup");
      otherAmountField.dispatchEvent(keyUpEvent);
    } else {
      const donationAmountCheckbox = document.querySelector(
        'input[name="transaction.donationAmt"]:checked'
      ) as HTMLInputElement;
      if (donationAmountCheckbox) {
        const clickEvent = new Event("click");
        donationAmountCheckbox.dispatchEvent(clickEvent);
      }
    }
    if (this.total % 1 !== 0) {
      this.updateLiveVariables("TOTAL", this.total.toFixed(2));
    } else {
      this.updateLiveVariables("TOTAL", this.total.toString());
    }
    if (this.total > 0) {
      document.querySelector("body").setAttribute("data-item-selected", "true");
    } else {
      document.querySelector("body").removeAttribute("data-item-selected");
    }

    this.additionalComments.value = this.cartItems;

    return this.total;
  }
  private updateFrequency(freq = "") {
    const monthlyInput = document.querySelector(
      "#sc-monthly"
    ) as HTMLInputElement;
    let isMonthly = false;
    if (monthlyInput && monthlyInput.checked) {
      isMonthly = true;
    }
    if (freq === "monthly") {
      isMonthly = true;
    } else if (freq === "onetime") {
      isMonthly = false;
    }
    const monthly = isMonthly ? "Y" : "N";
    (window as any).EngagingNetworks.require._defined.enjs.setFieldValue(
      "recurrpay",
      monthly
    );
    const recurrpay = document.querySelectorAll(
      'input[name="transaction.recurrpay"]'
    ) as NodeListOf<HTMLInputElement>;
    if (recurrpay.length > 0) {
      recurrpay.forEach((input) => {
        if (input.value === monthly) {
          input.dispatchEvent(new Event("change"));
        }
      });
    }
    if (monthly === "Y") {
      (window as any).EngagingNetworks.require._defined.enjs.setFieldValue(
        "recurrfreq",
        "MONTHLY"
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

  private checkNested(obj: any, ...args: string[]) {
    for (let i = 0; i < args.length; i++) {
      if (!obj || !Object.getOwnPropertyDescriptor(obj, args[i])) {
        return false;
      }
      obj = obj[args[i]];
    }
    return true;
  }

  private createAdditionalComments() {
    const formBlock = document.createElement("div");
    formBlock.classList.add(
      "en__component",
      "en__component--formblock",
      "hide"
    );

    const textField = document.createElement("div");
    textField.classList.add("en__field", "en__field--text");

    const textElement = document.createElement("div");
    textElement.classList.add("en__field__element", "en__field__element--text");

    const inputField = document.createElement("textarea");
    inputField.classList.add(
      "en__field__input",
      "en__field__input--textarea",
      "foursite-shopping-cart-added-input"
    );
    inputField.setAttribute("name", "transaction.comments");
    inputField.setAttribute("value", "");
    if (this.isDebug()) {
      inputField.style.width = "100%";
      inputField.setAttribute(
        "placeholder",
        "Additional Comments (Debug Mode)"
      );
    }

    textElement.appendChild(inputField);
    textField.appendChild(textElement);
    formBlock.appendChild(textField);
    const submitElement = document.querySelector(
      ".en__submit"
    ) as HTMLDivElement;
    if (submitElement) {
      const lastFormComponent = submitElement.closest(".en__component");
      if (lastFormComponent) {
        // Insert the new field after the submit button
        lastFormComponent.parentNode?.insertBefore(
          formBlock,
          lastFormComponent.nextSibling
        );
      }
    } else {
      const form = document.querySelector("form");
      if (form) {
        form.appendChild(formBlock);
      }
    }
    this.additionalComments = inputField;
  }

  public log(message: any, ...optionalParams: any[]) {
    if (this.isDebug()) {
      console.log(message, optionalParams);
    }
  }
}
