// ---------- Sample country/state/city data (expand as needed) ----------
const LOCATION_DATA = {
  "India": {
    "Bihar": ["Patna", "Gaya", "Bhagalpur"],
    "Karnataka": ["Bengaluru", "Mysore"],
    "Telangana": ["Hyderabad", "Warangal"]
  },
  "United States": {
    "California": ["San Francisco", "Los Angeles"],
    "Texas": ["Austin", "Houston"]
  }
};

// ---------- Disposable email domains sample ----------
const DISPOSABLE_DOMAINS = [
  "tempmail.com", "mailinator.com", "10minutemail.com", "guerrillamail.com"
];

// ---------- Helpers ----------
const $ = id => document.getElementById(id);
const form = $('regForm');
const submitBtn = $('submitBtn');
const topErrors = $('topErrors');
const successBox = $('successBox');

// Populate country/state/city
function populateCountries(){
  const countryEl = $('country');
  countryEl.innerHTML = '<option value="">Select Country</option>';
  Object.keys(LOCATION_DATA).forEach(c => {
    const opt = document.createElement('option'); opt.value=c; opt.textContent=c;
    countryEl.appendChild(opt);
  });
  populateStates(); populateCities();
}
function populateStates(){
  const country = $('country').value;
  const stateEl = $('state'); stateEl.innerHTML = '<option value="">Select State</option>';
  if(country && LOCATION_DATA[country]){
    Object.keys(LOCATION_DATA[country]).forEach(s=>{
      const opt = document.createElement('option'); opt.value=s; opt.textContent=s;
      stateEl.appendChild(opt);
    });
  }
  populateCities();
}
function populateCities(){
  const country = $('country').value;
  const state = $('state').value;
  const cityEl = $('city'); cityEl.innerHTML = '<option value="">Select City</option>';
  if(country && state && LOCATION_DATA[country] && LOCATION_DATA[country][state]){
    LOCATION_DATA[country][state].forEach(c=>{
      const opt = document.createElement('option'); opt.value=c; opt.textContent=c;
      cityEl.appendChild(opt);
    });
  }
}

// Validation functions
function isDisposableEmail(email){
  if(!email) return false;
  const domain = email.split('@')[1] || '';
  return DISPOSABLE_DOMAINS.includes(domain.toLowerCase());
}
function validateEmailField(){
  const email = $('email').value.trim();
  const err = $('errEmail');
  if(!email){ err.textContent = "Email is required."; return false; }
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!re.test(email)){ err.textContent = "Enter a valid email."; return false; }
  if(isDisposableEmail(email)){ err.textContent = "Disposable emails are not allowed."; return false; }
  err.textContent = ""; return true;
}
function validateNameFields(){
  const f = $('firstName').value.trim(), l = $('lastName').value.trim();
  $('errFirstName').textContent = f ? "" : "First name required.";
  $('errLastName').textContent = l ? "" : "Last name required.";
  return !!f && !!l;
}
function validatePhone(){
  const phone = $('phone').value.trim();
  const err = $('errPhone');
  if(!phone){ err.textContent="Phone number required."; return false; }
  // simple international phone check: starts with + and digits, length 7-16
  const re = /^\+\d{7,15}$/;
  if(!re.test(phone)){ err.textContent="Include country code and digits, e.g. +919876543210"; return false; }
  err.textContent=""; return true;
}
function validateGender(){
  const radios = document.getElementsByName('gender');
  const checked = Array.from(radios).some(r=>r.checked);
  $('errGender').textContent = checked ? "" : "Select gender.";
  return checked;
}
function validatePasswords(){
  const p = $('password').value, c = $('confirmPassword').value;
  const err = $('errConfirm');
  if(p && c && p !== c){ err.textContent = "Passwords do not match."; return false; }
  err.textContent = ""; return true;
}
function validateTerms(){
  const ok = $('terms').checked;
  $('errTerms').textContent = ok ? "" : "You must accept terms.";
  return ok;
}

function updatePwdStrength(){
  const p = $('password').value;
  let score = 0;
  if(p.length >= 8) score++;
  if(/[A-Z]/.test(p)) score++;
  if(/[0-9]/.test(p)) score++;
  if(/[^A-Za-z0-9]/.test(p)) score++;
  $('pwdMeter').value = score;
  const s = $('pwdStrength');
  const labels = ["Very weak","Weak","Okay","Good","Strong"];
  s.textContent = p ? labels[score] : "";
}

// Main overall form validity check
function checkFormValidity(){
  const ok = validateNameFields() && validateEmailField() && validatePhone() && validateGender() && validatePasswords() && validateTerms();
  submitBtn.disabled = !ok;
  return ok;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  populateCountries();
  // wire up selects
  $('country').addEventListener('change', ()=>{ populateStates(); checkFormValidity(); });
  $('state').addEventListener('change', ()=>{ populateCities(); checkFormValidity(); });
  $('firstName').addEventListener('input', checkFormValidity);
  $('lastName').addEventListener('input', checkFormValidity);
  $('email').addEventListener('input', ()=>{ validateEmailField(); checkFormValidity(); });
  $('phone').addEventListener('input', checkFormValidity);
  document.getElementsByName('gender').forEach(g=>g.addEventListener('change', checkFormValidity));
  $('password').addEventListener('input', ()=>{ updatePwdStrength(); validatePasswords(); checkFormValidity(); });
  $('confirmPassword').addEventListener('input', ()=>{ validatePasswords(); checkFormValidity(); });
  $('terms').addEventListener('change', checkFormValidity);

  // Form submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    topErrors.textContent = "";
    successBox.style.display = 'none';
    if(!checkFormValidity()){
      topErrors.textContent = "Fix the highlighted errors and try again.";
      return;
    }
    // Simulate backend success (since no server)
    successBox.style.display = 'block';
    successBox.textContent = "Registration Successful! Your profile has been submitted successfully.";
    // Reset form after success
    setTimeout(()=> {
      form.reset();
      $('pwdMeter').value = 0; $('pwdStrength').textContent = "";
      submitBtn.disabled = true;
      successBox.style.display = 'none';
    }, 2200);
  });
});
