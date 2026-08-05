document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const serviceField = document.getElementById("serviceField");
  const submit = document.getElementById("contactSubmit");
  const status = document.getElementById("formStatus");

  const params = new URLSearchParams(window.location.search);
  const service = params.get("service");
  if (service && [...serviceField.options].some(option => option.value === service)) {
    serviceField.value = service;
  }

  function validate(field) {
    const wrapper = field.closest(".field");
    const error = wrapper?.querySelector("small");
    wrapper?.classList.remove("invalid");
    if (error) error.textContent = "";

    if (field.type === "checkbox" && !field.checked) {
      wrapper?.classList.add("invalid");
      if (error) error.textContent = "Please confirm before submitting.";
      return false;
    }
    if (field.required && !String(field.value).trim()) {
      wrapper?.classList.add("invalid");
      if (error) error.textContent = "This field is required.";
      return false;
    }
    if (field.type === "email" && !field.checkValidity()) {
      wrapper?.classList.add("invalid");
      if (error) error.textContent = "Enter a valid email address.";
      return false;
    }
    return true;
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    status.textContent = "";
    const required = [...form.querySelectorAll("[required]")];
    if (!required.map(validate).every(Boolean)) {
      form.querySelector(".invalid input,.invalid select,.invalid textarea")?.focus();
      return;
    }

    const client = window.mathoraSupabase;
    if (!client) {
      status.textContent = "The contact service could not connect. Please try again.";
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    submit.disabled = true;
    submit.innerHTML = "Sending…";

    const { error } = await client.from("contact_enquiries").insert({
      full_name: data.fullName.trim(),
      email: data.email.trim(),
      phone: (data.phone || "").trim() || null,
      qualification: data.qualification || null,
      exam_board: (data.examBoard || "").trim() || null,
      year_group: (data.yearGroup || "").trim() || null,
      current_grade: (data.currentGrade || "").trim() || null,
      target_grade: (data.targetGrade || "").trim() || null,
      service: data.service,
      preferred_contact: data.preferredContact,
      best_time: (data.bestTime || "").trim() || null,
      message: data.message.trim(),
      source_page: document.referrer || window.location.href,
      status: "new"
    });

    if (error) {
      console.error(error);
      status.textContent = `The enquiry could not be submitted: ${error.message}`;
      submit.disabled = false;
      submit.innerHTML = 'Send enquiry <span>→</span>';
      return;
    }

    window.location.href = "./thank-you.html";
  });
});