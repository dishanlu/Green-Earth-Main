
const manageSpinner=(status,name)=>{
    console.log("Spinner status:", status, "Target:", name);
if(status==true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById(name).classList.add("hidden");
    } 
        else {
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById(name).classList.remove("hidden")
    }
}

const loadCategories=()=>{
    manageSpinner(true,"left-section");
    fetch("https://openapi.programming-hero.com/api/categories")
    .then(res=>res.json())
    .then(data=>{
      addCategories(data.categories)
   manageSpinner(false,"left-section");
    })
}

loadCategories();

const addCategories=(data)=>{
    const category=document.getElementById("categories");
    data.forEach(element => {
        const type=document.createElement("div");
     type.innerHTML = `
        <a onclick="loadCertainTypes(${element.id})" class="category-btn btn btn-outline w-full border-none justify-start text-left hover:bg-green-900 hover:text-white">
          ${element.category_name}
        </a>
   `;
        category.appendChild(type);
    });
}

const loadCertainTypes=(id)=>{
    manageSpinner(true,"mid-section");
 document.querySelectorAll(".category-btn").forEach(btn => {
 btn.classList.remove("bg-green-900", "text-white");
     btn.classList.add("btn-outline"); 
    });

const clickedBtn = document.querySelector(`.category-btn[onclick="loadCertainTypes(${id})"]`);
    if (clickedBtn) {
clickedBtn.classList.add("bg-green-900", "text-white");
    clickedBtn.classList.remove("btn-outline"); 
    }

fetch(`https://openapi.programming-hero.com/api/category/${id}`)
 .then(res=>res.json())
 .then(data=>{
      loadCards(data.plants)
    })
}

const loadAllTypes=()=>{
    manageSpinner(true,"mid-section");
    document.querySelectorAll(".category-btn").forEach(btn => {
 btn.classList.remove("bg-green-900", "text-white");
    btn.classList.add("btn-outline");
    });

    const allTreesBtn = document.querySelector(`.category-btn[onclick="loadAllTypes()"]`);
    if (allTreesBtn) {
    allTreesBtn.classList.add("bg-green-900", "text-white");
        allTreesBtn.classList.remove("btn-outline");
    }

    fetch("https://openapi.programming-hero.com/api/plants")
    .then(res=>res.json())
.then(data=>loadCards(data.plants))
}

const loadPlantDetails=(id)=>{
    manageSpinner(true,"details-conatiner");
    fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then(res=>res.json())
    .then(data=>{
   displayPlantDeatil(data.plants)
        manageSpinner(false,"details-conatiner");
    })
}

const displayPlantDeatil=(data)=>{
    const detailsBox=document.getElementById("details-conatiner");
    detailsBox.innerHTML=`
        <div class="card w-full h-full flex flex-col justify-between  bg-white p-[16px] space-y-[20px]">
            <h1  class=" font-semibold my-2 text-[1.2rem]">${data.name}</h1>
        <div class="bg-[#EDEDED] w-full h-[240px] flex items-center justify-center overflow-hidden rounded-md">
                <img src="${data.image}" alt="${data.name}" class="h-full w-full object-cover" />
          </div>
            <div ><span class="font-bold text-[1.1rem]">Category: </span>${data.category}</div>
            <div ><span class="font-bold text-[1.1rem]">Price: </span>$${data.price}</div>
          <p><span class="font-bold text-[1.1rem]">Description: </span>${data.description}</p>
        </div>
    `;
    document.getElementById("my_modal_5").showModal();
}

loadAllTypes();

const loadCards=(data)=> {
    const cardContainer=document.getElementById("mid-section");
    cardContainer.innerHTML="";
    data.forEach(element => {
        const type=document.createElement("div");
      type.innerHTML=`
        <div class="card w-full h-full flex flex-col justify-between max-w-[343px] bg-white p-[16px]">
            <div class="bg-[#EDEDED] w-full h-[180px] flex items-center justify-center overflow-hidden rounded-md">
                <img src="${element.image}" alt="${element.name}" class="h-full w-full object-cover" />
            </div>
            <h1 onclick="loadPlantDetails(${element.id})" class="cursor-pointer font-semibold my-2 text-[1.2rem]">${element.name}</h1>
            <p>${element.description}</p>
            <div class="flex justify-between items-center my-[8px]">
             <div class="rounded-xl bg-[#DCFCE7] py-[5px] px-[10px] text-center"><span>${element.category}</span></div>
                <div ><span>$${element.price}</span></div>
            </div>
            <button onclick="addToCart(${element.id})" class="btn w-full rounded-2xl  border-none bg-green-900 text-white hover:bg-green-600">Add to Cart</button>
        </div>
        `;
        cardContainer.appendChild(type);
    });
    manageSpinner(false,"mid-section");
}

const addToCart = (id) => {
    const cart = document.getElementById("cart-cards");
    const totalAmountText = document.getElementById("total-amount").innerText;
    const totalAmount = Number(totalAmountText.replace(/[^0-9.]/g, ""));

    fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then(res => res.json())
    .then(data => {
        const plant = data.plants;
        const existingItem = document.getElementById(`cart-${plant.id}`);

  if (existingItem) {
            const quantityText = existingItem.querySelector(".cart-quantity");
         let quantity = parseInt(quantityText.innerText);
            quantity += 1;
            quantityText.innerText = quantity;

            const newTotal = totalAmount + plant.price;
            document.getElementById("total-amount").innerText = `$${newTotal.toFixed(2)}`;
        } else {
            const type = document.createElement("div");
            type.innerHTML = `
      <div id="cart-${plant.id}" class="flex justify-between items-center bg-[#F0FDF4] p-[15px] rounded-xl">
                <div class="space-y-2">
                    <h1 class="font-bold">${plant.name}</h1>
                    <p class="cart-price text-gray-500">$${plant.price} × <span class="cart-quantity">1</span></p>
                </div>
                <p onclick="removeCart(${plant.id})" class="cursor-pointer text-gray-500"><i class="fa-solid fa-xmark"></i></p>
            </div>
            `;
            cart.appendChild(type);
            const newTotal = totalAmount + plant.price;
            document.getElementById("total-amount").innerText = `$${newTotal.toFixed(2)}`;
        }
    });
}

const removeCart = (id) => {
    const item = document.getElementById(`cart-${id}`);
    if (!item) {
        return;
}
    const quantitySpan = item.querySelector(".cart-quantity");
    const quantity = parseInt(quantitySpan.innerText);

const priceText = item.querySelector(".cart-price").innerText;
    const priceMatch = priceText.match(/\$([0-9.]+)/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : 0;

    const totalAmountText = document.getElementById("total-amount").innerText;
 const totalAmount = Number(totalAmountText.replace(/[^0-9.]/g, ""));

const newTotal = Math.max(0, totalAmount - price);

    if (quantity > 1) {
      quantitySpan.innerText = quantity - 1;
    } else {
  item.remove();
    }

    document.getElementById("total-amount").innerText = `$${newTotal.toFixed(2)}`;
};
