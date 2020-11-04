const EL = (sel) => document.querySelector(sel);
const chk = EL("#chk");
chk.addEventListener("input", function() {
  EL("#submit").disabled = !(this.value == this.placeholder);
});
