const addCustomerForm = document.querySelector("#addCustomerForm");
const addTransactionForm = document.querySelector("#addTransactionForm");
const editForm = document.querySelector("#editForm");
const customersDivs = document.querySelector("#customersDivs");
const singleCustomerDiv = document.querySelector("#singleCustomerDiv");

const customerObj=[
    {key:"accNum",default:Date.now()},
    {key:"name",default:null},
    {key:"balance",default:null},
    {key:"transactions",default:[]}
];

const writeToLocalStorage=(data,key="customers")=>{
    try{
        if(key=="customers"){
            if(!Array.isArray(data)) throw new Error('invalid format');
        }
        localStorage.setItem(key,JSON.stringify(data));
        
    }catch(e){
        console.log(e);
    }
}

const addCustomer=(e,allCustomers)=>{
    e.preventDefault();

    const data={};

    customerObj.forEach((head)=>{
        if(head.default===null) data[head.key]=addCustomerForm.elements[head.key].value;
        else data[head.key]=head.default;
    });

    allCustomers.push(data);
    writeToLocalStorage(allCustomers);

    window.location.href="index.html";
}

const readFromLocalStorage=(key="customers",option="array")=>{
    let data;
    try{
        if(option=="string") return Number(localStorage.getItem(key));
        else if(option=="object") return JSON.parse(localStorage.getItem(key));
        else{
            data=JSON.parse(localStorage.getItem(key)) || [];
            if(!Array.isArray(data)) throw new Error('invalid format');
        }
    }catch(e){
        console.log(e);
        data=[];
    }
    return data;
}

const createElement=(child,parent,classes,value="")=>{
    const element = document.createElement(child);
    element.classList=classes;
    if(value!="") element.innerHTML=value;
    parent.appendChild(element);
    return element;
}

const showSingleCustomer = (i,allCustomers)=>{
    writeToLocalStorage(i,"customerIndex");
    writeToLocalStorage(allCustomers[i],"singleCustomer");
    window.location.href = "singleCustomer.html";
}

const showCustomerTransaction = (i,allCustomers)=>{
    writeToLocalStorage(i,"customerIndex");
    writeToLocalStorage(allCustomers[i],"singleCustomer");
    window.location.href = "addTransaction.html";
}

const editCustomer = (i,allCustomers)=>{
    writeToLocalStorage(i,"customerIndex");
    writeToLocalStorage(allCustomers[i],"singleCustomer");
    window.location.href = "editCustomer.html";
}

const deleteCustomer = (i,allCustomers)=>{
    allCustomers.splice(i,1);
    writeToLocalStorage(allCustomers);
    localStorage.setItem("customerIndex","");
    localStorage.setItem("singleCustomer","");
    if(customersDivs) drawData(allCustomers);
    else if(singleCustomerDiv) window.location.href="index.html";
}

const drawSingleCustomer=(customer,i,allCustomers,bodyDiv)=>{
    const div1=createElement("div",bodyDiv,"card w-25 my-5 p-3");
    customerObj.forEach((head)=>{
        if(!Array.isArray(head.default)){
            const h3 = createElement("h3",div1,"");
            h3.innerHTML=head.key+": "+customer[head.key];
        }
    });
    const btnShow = createElement("button",div1,"btn btn-primary w-75 m-auto","Show");
    const btnEdit = createElement("button",div1,"btn btn-primary w-75 m-auto mt-3","Edit");
    const btnTransaction = createElement("button",div1,"btn btn-primary w-75 m-auto mt-3","Add Transaction");
    const btnDelete = createElement("button",div1,"btn btn-danger w-75 m-auto mt-3","Delete")
    btnShow.addEventListener("click",()=>showSingleCustomer(i,allCustomers));
    btnEdit.addEventListener("click",()=>editCustomer(i,allCustomers));
    btnTransaction.addEventListener("click",()=>showCustomerTransaction(i,allCustomers));
    btnDelete.addEventListener("click",()=>deleteCustomer(i,allCustomers));
}

const drawData=(allCustomers)=>{
    customersDivs.innerHTML="";
    if(allCustomers.length<=0 && (customersDivs)){
        const nouserDiv=document.querySelector("#nouserDiv");
        nouserDiv.classList="card d-block text-center m-auto mt-5 p-5 w-75";
    }
    allCustomers.forEach((customer,i)=>{
        drawSingleCustomer(customer,i,allCustomers,customersDivs);
    });
}

const showCustomerInputs=(customer,form)=>{
    customerObj.forEach((head)=>{
        if(head.default===null) form.elements[head.key].value=customer[head.key];
    });
}

const addToBalance = (i,allCustomers,amount, typeValue)=>{
    if(amount>0){
        allCustomers[i].balance = Number(allCustomers[i].balance) + amount;
        allCustomers[i].transactions.push({ type: typeValue, value: amount});
        writeToLocalStorage(allCustomers);
        writeToLocalStorage(i,"customerIndex");
        writeToLocalStorage(allCustomers[i],"singleCustomer");
        window.location.href="index.html";
    }
}

const withDraw = (i,allCustomers,amount,typeValue)=>{
    if(amount<=allCustomers[i].balance){
        allCustomers[i].balance = Number(allCustomers[i].balance) - amount;
        allCustomers[i].transactions.push({ type: typeValue, value: amount});
        writeToLocalStorage(allCustomers);
        writeToLocalStorage(i,"customerIndex");
        writeToLocalStorage(allCustomers[i],"singleCustomer");
        window.location.href="index.html";
    }
}

const addTransactionFun = (e,i,allCustomers)=>{
    e.preventDefault();

    const amountInput = addTransactionForm.elements["amount"];
    const transactionSelector = addTransactionForm.elements["transaction"];

    if(transactionSelector.value=="addToBalance"){
        addToBalance(i,allCustomers,Number(amountInput.value),transactionSelector.value);
    }else if(transactionSelector.value=="withdraw"){
        withDraw(i,allCustomers,Number(amountInput.value),transactionSelector.value);
    }
}

const editFun = (e,i,allCustomers)=>{
    e.preventDefault();
    let dataValid=true;
    
    customerObj.forEach((head)=>{
        if(head.default===null){
            if(!editForm.elements[head.key].value) dataValid=false;
            allCustomers[i][head.key]=editForm.elements[head.key].value;
        }
    });

    if(!dataValid)
     return;

    writeToLocalStorage(allCustomers);
    writeToLocalStorage(allCustomers[i],"singleCustomer");
    window.location.href = "index.html";
}

if(addCustomerForm){
    const allCustomers=readFromLocalStorage();
    addCustomerForm.addEventListener("submit",(e)=>addCustomer(e,allCustomers));
}

if(customersDivs){
    const allCustomers=readFromLocalStorage();
    drawData(allCustomers);
}

if(singleCustomerDiv){
    const allCustomers=readFromLocalStorage();
    const i=readFromLocalStorage("customerIndex","string");
    const customer = readFromLocalStorage("singleCustomer","object");

    if(i>=allCustomers.length || i<0) singleCustomerDiv.innerHTML="<p>invalid ID</p>";
    else drawSingleCustomer(customer,i,allCustomers,singleCustomerDiv);
}

if(addTransactionForm){
    const allCustomers=readFromLocalStorage();
    const i=readFromLocalStorage("customerIndex","string");
    const customer = readFromLocalStorage("singleCustomer","object");
    
    showCustomerInputs(customer,addTransactionForm);
    addTransactionForm.addEventListener("submit",(e)=>addTransactionFun(e,i,allCustomers));
}

if(editForm){
    const allCustomers=readFromLocalStorage();
    const i=readFromLocalStorage("customerIndex","string");
    const customer = readFromLocalStorage("singleCustomer","object");

    showCustomerInputs(customer,editForm);
    editForm.addEventListener("submit",(e)=>editFun(e,i,allCustomers));
}