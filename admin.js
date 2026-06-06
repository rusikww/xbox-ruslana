import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const ADMIN_PASSWORD = "Manera_vip";

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

const loginBtn = document.getElementById("loginBtn");
const saveBtn = document.getElementById("saveBtn");
const form = document.getElementById("form");
const loginArea = document.getElementById("loginArea");
const statusEl = document.getElementById("saveStatus");

loginBtn.addEventListener("click", unlock);
saveBtn.addEventListener("click", saveData);

async function unlock(){
  if(document.getElementById("adminPass").value !== ADMIN_PASSWORD){
    alert("Неверный пароль");
    return;
  }
  form.classList.remove("hidden");
  loginArea.classList.add("hidden");

  const snap = await getDoc(doc(db, "site", "config"));
  if(snap.exists()){
    const data = snap.data();
    document.getElementById("newEmail").value = data.email || "";
    document.getElementById("newPassword").value = data.password || "";
    document.getElementById("newUpdated").value = data.updated || "";
    document.getElementById("newVideo").value = data.video || "";
    document.getElementById("newReviews").value = data.reviews || "489";
    document.getElementById("newOnline").value = data.online || "онлайн";
  }
}

async function saveData(){
  saveBtn.disabled = true;
  saveBtn.textContent = "Сохраняю...";
  const data = {
    email: document.getElementById("newEmail").value.trim(),
    password: document.getElementById("newPassword").value.trim(),
    updated: document.getElementById("newUpdated").value.trim(),
    video: document.getElementById("newVideo").value.trim(),
    reviews: document.getElementById("newReviews").value.trim(),
    online: document.getElementById("newOnline").value
  };
  try{
    await setDoc(doc(db, "site", "config"), data);
    statusEl.textContent = "Готово. Данные обновились на сайте.";
    showToast("Сохранено");
  }catch(e){
    statusEl.textContent = "Ошибка сохранения. Проверьте Firestore Rules.";
    console.error(e);
  }finally{
    saveBtn.disabled = false;
    saveBtn.textContent = "Сохранить изменения";
  }
}

function showToast(text){
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1400);
}
