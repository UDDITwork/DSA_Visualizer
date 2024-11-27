// Variable Declaration
const enqueue = document.querySelector(".enqueue");
const dequeue = document.querySelector(".dequeue");
const reset = document.querySelector(".reset");
const bucket = document.querySelector(".main-queue-bucket");
const input = document.querySelector(".text");
const message = document.querySelector(".message");
const messageBox = document.querySelector(".message-box");
const box = document.querySelectorAll(".box");
const queue = [];

// Disable all buttons
const buttonDisable = () => {
    enqueue.disabled = true;
    enqueue.classList.add("disable-button");
    dequeue.disabled = true;
    dequeue.classList.add("disable-button");
    reset.disabled = true;
    reset.classList.add("disable-button");
    input.disabled = true;
};

// Enable all buttons
const buttonEnable = () => {
    enqueue.disabled = false;
    enqueue.classList.remove("disable-button");
    dequeue.disabled = false;
    dequeue.classList.remove("disable-button");
    reset.disabled = false;
    reset.classList.remove("disable-button");
    input.disabled = false;
};

// When the enqueue button will be clicked
enqueue.addEventListener("click", () => {
    if (input.value == "") {
        message.innerHTML = "Please Enter a value.";
        messageBox.classList.add("error-message");
        setTimeout(() => {
            messageBox.classList.remove("error-message");
        }, 1200);
        return;
    }

    if (queue.length === 5) {
        input.value = "";
        message.innerHTML = "Queue Overflow";
        messageBox.classList.add("error-message");
        setTimeout(() => {
            messageBox.classList.remove("error-message");
        }, 1200);
        return;
    }

    const itemValue = input.value;
    queue.push(itemValue);

    const element = document.createElement("div");
    element.classList.add("ele");
    element.innerText = queue[queue.length - 1];
    bucket.appendChild(element);

    box[0].innerHTML = queue[0];
    box[1].innerHTML = itemValue;
    input.value = "";

    element.classList.add("ele-add");
    buttonDisable();

    setTimeout(() => {
        element.classList.remove("ele-add");
        message.innerHTML = `Item ${itemValue} is Enqueued.`;
        box[3].innerHTML = queue.length;
        buttonEnable();
    }, 1500);
});

// When the dequeue button will be clicked
dequeue.addEventListener("click", () => {
    if (queue.length === 0) {
        messageBox.classList.add("error-message");
        message.innerHTML = "Queue Underflow";
        setTimeout(() => {
            messageBox.classList.remove("error-message");
        }, 1200);
        return;
    }

    const itemValue = queue.shift();
    box[2].innerHTML = itemValue;

    bucket.firstElementChild.classList.add("ele-remove");
    buttonDisable();

    setTimeout(() => {
        bucket.removeChild(bucket.firstElementChild);
        box[0].innerHTML = queue.length > 0 ? queue[0] : "";
        message.innerHTML = `Item ${itemValue} is Dequeued.`;
        box[3].innerHTML = queue.length;
        buttonEnable();
    }, 1500);
});

// When the reset button will be clicked
reset.addEventListener("click", () => {
    while (queue.length > 0) {
        queue.shift();
    }

    box[0].innerHTML = "";
    box[1].innerHTML = "";
    box[2].innerHTML = "";
    message.innerHTML = "";

    while (bucket.firstChild) {
        bucket.removeChild(bucket.firstChild);
    }

    box[3].innerHTML = "0";
});
