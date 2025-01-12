const itemNameInput = document.getElementById('ItemNameInput');
const itemPriceInput = document.getElementById('ItemPriceInput');

const enterItemButton = document.getElementById('lebutton');
const removeItemButton = document.getElementById('RemoveButton');

const itemDisplay = document.getElementById('ItemDisplay');
const totalDisplay = document.getElementById('TotalDisplay');

itemNameInput.setAttribute("placeholder", "Enter Item Name");
itemPriceInput.setAttribute("placeholder", "Enter Item Price");



let itemNames = [];
let itemPrices = [];

let tax = 0.10;




enterItemButton.onclick = function()
{
    itemNames.push(itemNameInput.value);
    itemPrices.push(Number(itemPriceInput.value));

    itemDisplay.textContent = itemDisplay.textContent + itemNames[itemNames.length - 1] + " for $" + itemPrices[itemPrices.length - 1] + "\n";
    
    itemNameInput.value = ""
    itemPriceInput.value = ""
    calculate();
};


removeItemButton.onclick = function()
{
    itemDisplay.textContent = itemDisplay.textContent.replace(itemNames[itemNames.length - 1] + " for $" + itemPrices[itemPrices.length - 1] + "\n", "");
    
    itemNames.pop();
    itemPrices.pop();

    calculate();
}

function calculate()
{
    let total = 0
    for (i in itemPrices)
        {
            itemTax = itemPrices[i] * tax;
            total += itemPrices[i] + itemTax;
        }
    
    total = Math.round(total*100)/100;
    totalDisplay.textContent = "Total: $" + total;
}