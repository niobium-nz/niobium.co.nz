let stripe;
let currency;
let elements;
let amount;

initialize("nzd", 988, "pk_test_51RSwkoRt21XMpal88MegWydqv4YnluqxPMXXCrh0EGbYJEUokmgwZkHxf18BiCrurjrRaWbqwf0hygdKUBdo5IlP00s8EmNX99");

document
    .querySelector("#payment-form")
    .addEventListener("submit", handleSubmit);

function initialize(amt, crc, key) {
    currency = crc;
    amount = amt;
    stripe = Stripe(key);
    const options = {
        mode: 'payment',
        amount: amt,
        currency: crc,
        appearance: {
            theme: 'stripe',
        },
    };

    elements = stripe.elements(options);

    const paymentElementOptions = {
        layout: "accordion",
    };

    const paymentElement = elements.create("payment", paymentElementOptions);
    paymentElement.mount("#payment-element");
}

function updateAmount(newAmount, newCurrency) {
    amount = newAmount;
    elements.update({ amount: newAmount, currency: newCurrency });
}

async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
        showMessage(submitError);
        return;
    }

    const response = await fetch("http://localhost:7109/payments/orders", {
        method: "POST",
    });
    const { instruction } = await response.json();
    const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: instruction,
        confirmParams: {
            // Make sure to change this to your payment completion page
            return_url: `http://localhost:7109/payments/complete?id=123`,
        },
    });

    if (error) {
        // This point is only reached if there's an immediate error when
        // confirming the payment. Show the error to your customer (for example, payment details incomplete)
        if (error.type === "card_error" || error.type === "validation_error") {
            showMessage(error.message);
        } else {
            showMessage("An unexpected error occurred.");
        }
    } else {
        // Your customer is redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer is redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
    }
}

// ------- UI helpers -------

function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");

    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setLoading(false);
    setTimeout(function () {
        messageContainer.classList.add("hidden");
        messageContainer.textContent = "";
    }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
    if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("#submit").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("#submit").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
}
