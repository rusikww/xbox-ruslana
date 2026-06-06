import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCpkTej8NTbUi4vVxkSnQz_sa6fMUDpFA8",
  authDomain: "xbox-ruslana.firebaseapp.com",
  projectId: "xbox-ruslana",
  storageBucket: "xbox-ruslana.firebasestorage.app",
  messagingSenderId: "531731476028",
  appId: "1:531731476028:web:d46a35b5021e4316961d39",
  measurementId: "G-VMNDFHYMPD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const emailEl = document.getElementById("email");
const passEl = document.getElementById("password");
const updatedEl = document.getElementById("updated");
const videoLink = document.getElementById("videoLink");
const reviewsCount = document.getElementById("reviewsCount");
const sellerOnline = document.getElementById("sellerOnline");
const topOnline = document.getElementById("topOnline");

onSnapshot(doc(db, "site", "config"), (snap) => {
  if (!snap.exists()) {
    emailEl.value = "Нет данных";
    passEl.value = "Нет данных";
    return;
  }
  const data = snap.data();
  emailEl.value = data.email || "";
  passEl.value = data.password || "";
  updatedEl.textContent = data.updated || "";
  reviewsCount.textContent = data.reviews || "489";
  const status = data.online || "онлайн";
  sellerOnline.textContent = status === "онлайн" ? "онлайн на FunPay" : "оффлайн на FunPay";
  topOnline.textContent = status;
  if (data.video) videoLink.href = data.video;
}, () => {
  emailEl.value = "Ошибка загрузки";
  passEl.value = "Ошибка загрузки";
});


async function loadFunPayStats(){
  try{
    const res = await fetch("/.netlify/functions/funpay-stats?cache=" + Date.now());
    const data = await res.json();

    if(data.ok){
      if(data.reviews){
        reviewsCount.textContent = data.reviews;
      }

      if(data.online){
        const status = data.online;
        sellerOnline.textContent = status === "онлайн" ? "онлайн на FunPay" : "оффлайн на FunPay";
        topOnline.textContent = status;
      }
    }
  }catch(e){
    console.warn("FunPay stats fallback:", e);
  }
}

loadFunPayStats();
setInterval(loadFunPayStats, 120000);

window.copyValue = async function(id){
  const el = document.getElementById(id);
  await navigator.clipboard.writeText(el.value);
  showToast("Скопировано");
};

window.copyCommand = async function(){
  const command = 'Get-AppxPackage -AllUsers| Foreach {Add-AppxPackage -DisableDevelopmentMode -Register "$($_.InstallLocation)\\AppXManifest.xml"}';
  await navigator.clipboard.writeText(command);
  showToast("Команда скопирована");
};

window.quickSearch = function(text){
  const input = document.getElementById("errorSearch");
  input.value = text;
  input.dispatchEvent(new Event("input"));
  input.scrollIntoView({behavior:"smooth", block:"center"});
};

window.goSearch = function(){
  const heroInput = document.getElementById("heroSearch");
  quickSearch(heroInput.value || "");
  document.getElementById("errors").scrollIntoView({behavior:"smooth"});
};

function showToast(text){
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1400);
}

const search = document.getElementById("errorSearch");
const items = [...document.querySelectorAll("#errorList details")];
search.addEventListener("input", () => {
  const q = search.value.trim().toLowerCase();
  items.forEach(item => {
    const text = (item.textContent + " " + item.dataset.keywords).toLowerCase();
    item.hidden = q && !text.includes(q);
    if(q && !item.hidden) item.open = true;
  });
});
