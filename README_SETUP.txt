STUDENT TRACKER SYSTEM - QUICK SETUP

Upload these two files to your GitHub repository:
1. student-login.html
2. student-tracker.js

Use this login link:
https://saidahkhwar11-lang.github.io/dl-lesson/student-login.html

IMPORTANT:
This tracker saves marks for:
- Reading Rush
- Skill Clash
- DL Lesson

Do NOT connect Imposter because it is for fun only.

HOW TO PROTECT AN ACTIVITY PAGE:
Add these scripts in the <head> or before </body> of Reading Rush, Skill Clash, and DL Lesson:

<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js"></script>
<script src="student-tracker.js"></script>
<script>
window.addEventListener("load", function(){
  requireStudentLogin();
  addSecureStudentBar();
});
</script>

HOW TO SAVE MARKS:
When a student finishes an activity, call:

saveActivityPerformance({
  activityType: "Reading Rush",
  activityName: "Reading Rush - Current Collection",
  score: studentScore,
  total: totalMarks,
  notes: "Completed collection"
});

For Skill Clash:
activityType: "Skill Clash"

For DL Lesson:
activityType: "DL Lesson"
