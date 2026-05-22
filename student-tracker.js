/* =========================================================
   Student Tracker Connection
   Use in: Reading Rush, Skill Clash, DL Lesson
   Do NOT use for Imposter.
   Saves activity marks to teacher-control.html records.
========================================================= */

const TRACKER_FIREBASE_CONFIG = {
  apiKey:"AIzaSyAe9rRwly1MvZh889dVq33RGyUbj4FVcQI",
  authDomain:"online-english-lesson-grade-9.firebaseapp.com",
  databaseURL:"https://online-english-lesson-grade-9-default-rtdb.firebaseio.com",
  projectId:"online-english-lesson-grade-9",
  storageBucket:"online-english-lesson-grade-9.firebasestorage.app",
  appId:"1:542666648554:web:5190c68ea73b3536dae093"
};

const TRACKER_SESSION_KEY = "DL_SECURE_STUDENT_LOGIN";

function trackerCleanKey(t){
  return String(t||"").trim().replace(/[.#$\[\]\/]/g,"_").replace(/\s+/g,"_");
}

function getLoggedStudent(){
  try{
    return JSON.parse(localStorage.getItem(TRACKER_SESSION_KEY) || "null");
  }catch(e){
    return null;
  }
}

function requireStudentLogin(){
  const student = getLoggedStudent();
  if(!student || !student.classId || !student.studentId){
    const next = encodeURIComponent(location.pathname.split("/").pop() + location.search);
    location.href = "student-login.html?next=" + next;
    return null;
  }
  return student;
}

function logoutSecureStudent(){
  localStorage.removeItem(TRACKER_SESSION_KEY);
  location.href = "student-login.html";
}

function initTrackerFirebase(){
  if(typeof firebase === "undefined"){
    console.warn("Firebase library is not loaded. Add Firebase scripts before student-tracker.js");
    return null;
  }
  if(!firebase.apps.length){
    firebase.initializeApp(TRACKER_FIREBASE_CONFIG);
  }
  return firebase.database();
}

/* Save performance to Teacher Control Center.
   activityType should be: "Reading Rush", "Skill Clash", or "DL Lesson"
*/
async function saveActivityPerformance({activityType, activityName, score, total, notes}){
  const student = getLoggedStudent();
  if(!student) return;

  const db = initTrackerFirebase();
  if(!db) return;

  const classId = trackerCleanKey(student.classId);
  const studentId = trackerCleanKey(student.studentId);
  const recordId = "rec_" + Date.now() + "_" + Math.floor(Math.random()*999);

  const record = {
    classId,
    className: student.className || student.classId,
    studentId,
    studentName: student.name,
    studentPassword: student.password,
    activityType: activityType || "Activity",
    activityName: activityName || document.title || "Class Activity",
    score: Number(score || 0),
    total: Number(total || 0),
    notes: notes || "",
    date: new Date().toLocaleDateString(),
    time: Date.now()
  };

  await db.ref("teacherControlCenter/records/" + classId + "/" + studentId + "/" + recordId).set(record);
}

/* Optional: call this on every activity page after loading.
   It shows who is logged in and gives logout button.
*/
function addSecureStudentBar(){
  const s = getLoggedStudent();
  if(!s) return;

  const bar = document.createElement("div");
  bar.style.cssText = `
    position:fixed;right:12px;bottom:12px;z-index:999999;
    background:white;border:1px solid #dfe8ff;border-radius:18px;
    padding:10px 12px;box-shadow:0 10px 24px rgba(55,75,135,.16);
    font-family:Arial,sans-serif;font-size:12px;color:#203a78;
  `;
  bar.innerHTML = `
    <b>👩‍🎓 ${s.name}</b><br>
    <span>${s.className || s.classId}</span>
    <button onclick="logoutSecureStudent()" style="
      margin-left:8px;border:none;border-radius:10px;padding:5px 8px;
      background:#ef5267;color:white;font-weight:bold;cursor:pointer;
    ">Logout</button>
  `;
  document.body.appendChild(bar);
}
