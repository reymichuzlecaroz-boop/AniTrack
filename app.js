const DAY_MS = 24 * 60 * 60 * 1000;
const today = startOfToday();

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value, options = { month: "short", day: "numeric", year: "numeric" }) {
  return new Intl.DateTimeFormat("en-PH", options).format(parseDate(value));
}

function daysFromToday(value) {
  return Math.round((parseDate(value) - today) / DAY_MS);
}

function makeCrop(id, name, emoji, field, area, plantedDate, harvestDate, status, description) {
  return {
    id,
    name,
    category: "Vegetable",
    emoji,
    field,
    area,
    plantedDate,
    harvestDate,
    status,
    description
  };
}

const crops = [
  makeCrop(1, "Tomato", "🍅", "North Plot", 0.18, "2026-10-01", "2026-11-01", "Growing", "Tomato plants are growing well. Check the leaves and keep the soil evenly moist."),
  makeCrop(2, "Eggplant", "🍆", "East Plot", 0.22, "2026-10-05", "2026-11-14", "Planted", "Eggplant seedlings are newly planted. Water gently while they establish."),
  makeCrop(3, "Bell Pepper", "🫑", "West Plot", 0.16, "2026-10-08", "2026-11-18", "Growing", "Bell pepper plants are developing. Keep the soil moist and check for new growth."),
  makeCrop(4, "Pechay", "🥬", "Purok 2 Garden", 0.10, "2026-10-12", "2026-11-05", "Planted", "Pechay seedlings are establishing. Water gently and check for healthy leaves."),
  makeCrop(5, "Okra", "🌱", "South Plot", 0.20, "2026-10-03", "2026-10-20", "Ready for Harvest", "Okra pods are ready to pick. Harvest regularly to encourage more pods."),
  makeCrop(6, "Bitter Gourd", "🌿", "North Plot", 0.15, "2026-10-07", "2026-11-11", "Growing", "Bitter gourd vines are developing. Support the vines as they begin to climb.")
];

const fieldActivities = [
  {
    date: toDateInputValue(addDays(today, 1)),
    name: "Check soil moisture",
    crop: "All active plots",
    type: "Field care",
    emoji: "💧"
  },
  {
    date: toDateInputValue(addDays(today, 10)),
    name: "Prepare the next seedbed",
    crop: "East Plot",
    type: "Planting",
    emoji: "🌱"
  }
];

const $ = (selector, root = document) => root.querySelector(selector);
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

function cropProgress(crop) {
  const planted = parseDate(crop.plantedDate);
  const harvest = parseDate(crop.harvestDate);
  const duration = Math.max(1, (harvest - planted) / DAY_MS);
  const elapsed = (today - planted) / DAY_MS;
  return Math.max(0, Math.min(100, Math.round((elapsed / duration) * 100)));
}

function cropStatus(crop) {
  return crop.status;
}

function statusForDates(plantedDate, harvestDate) {
  if (daysFromToday(harvestDate) <= 7) return "Ready for Harvest";
  if ((today - parseDate(plantedDate)) / DAY_MS <= 14) return "Planted";
  return "Growing";
}

function badge(status) {
  const className = status === "Growing" ? "badge-growing" : status === "Planted" ? "badge-planted" : "badge-ready";
  return `<span class="badge ${className}">${escapeHTML(status)}</span>`;
}

function cropCell(crop) {
  return `<span class="crop-name-cell"><span class="crop-emoji" aria-hidden="true">${crop.emoji}</span>${escapeHTML(crop.name)}</span>`;
}

function getSchedule() {
  const harvestActivities = crops.map((crop) => ({
    date: crop.harvestDate,
    name: `Harvest ${crop.name}`,
    crop: `${crop.name} · ${crop.field}`,
    type: "Harvest",
    emoji: crop.emoji
  }));
  return [...fieldActivities, ...harvestActivities].sort((a, b) => a.date.localeCompare(b.date));
}

function renderDashboardStats() {
  const fieldCount = new Set(crops.map((crop) => crop.field)).size;
  const upcomingHarvests = crops.filter((crop) => {
    const days = daysFromToday(crop.harvestDate);
    return days >= 0 && days <= 14;
  });
  const averageProgress = crops.length
    ? Math.round(crops.reduce((total, crop) => total + cropProgress(crop), 0) / crops.length)
    : 0;
  const nextHarvest = upcomingHarvests.sort((a, b) => a.harvestDate.localeCompare(b.harvestDate))[0];

  $("#total-crops").textContent = String(crops.length).padStart(2, "0");
  $("#nav-crop-count").textContent = String(crops.length);
  $("#field-count").textContent = `${fieldCount} active ${fieldCount === 1 ? "field" : "fields"}`;
  $("#field-count-detail").textContent = String(fieldCount);
  $("#total-area").textContent = crops.reduce((total, crop) => total + crop.area, 0).toFixed(2);
  $("#upcoming-harvest-count").textContent = String(upcomingHarvests.length).padStart(2, "0");
  $("#next-harvest-note").textContent = nextHarvest
    ? `Next: ${nextHarvest.name} in ${Math.max(0, daysFromToday(nextHarvest.harvestDate))} days`
    : "No harvests expected in 14 days";
  $("#season-progress").textContent = String(averageProgress);
  $("#season-progress-bar").style.width = `${averageProgress}%`;
}

function renderOverviewCrops() {
  $("#overview-crop-rows").innerHTML = crops.map((crop) => `
    <tr><td>${cropCell(crop)}</td><td>${escapeHTML(crop.category)}</td><td class="field-cell">${escapeHTML(crop.field)}</td><td>${formatDate(crop.plantedDate, { month: "short", day: "numeric", year: "numeric" })}</td><td>${badge(cropStatus(crop))}</td></tr>
  `).join("");
}

function renderRecords() {
  const query = $("#crop-search").value.trim().toLowerCase();
  const selectedStatus = $("#status-filter").value;
  const filteredCrops = crops.filter((crop) => {
    const matchesQuery = `${crop.name} ${crop.category} ${crop.field}`.toLowerCase().includes(query);
    return matchesQuery && (selectedStatus === "all" || cropStatus(crop) === selectedStatus);
  });
  $("#record-count").textContent = `${filteredCrops.length} ${filteredCrops.length === 1 ? "crop" : "crops"}`;
  $("#records-empty").hidden = filteredCrops.length !== 0;
  $("#crop-record-rows").innerHTML = filteredCrops.map((crop) => `
    <tr>
      <td>${cropCell(crop)}</td><td>${escapeHTML(crop.category)}</td><td class="field-cell">${escapeHTML(crop.field)}</td><td>${crop.area.toFixed(2)} ha</td>
      <td>${formatDate(crop.plantedDate)}</td><td>${formatDate(crop.harvestDate)}</td><td>${badge(cropStatus(crop))}</td>
      <td><button class="row-action" data-detail="${crop.id}" aria-label="View ${escapeHTML(crop.name)} details">···</button></td>
    </tr>
  `).join("");
}

function renderMiniSchedule() {
  $("#overview-schedule").innerHTML = getSchedule().slice(0, 3).map((item) => `
    <div class="schedule-item"><div class="date-chip"><strong>${formatDate(item.date, { day: "numeric" })}</strong><span>${formatDate(item.date, { month: "short" })}</span></div>
      <div class="schedule-copy"><strong>${escapeHTML(item.name)}</strong><span>${escapeHTML(item.crop)}</span></div>
      <span class="schedule-kind ${item.type === "Field care" ? "prep" : ""}">${escapeHTML(item.type)}</span>
    </div>
  `).join("");
}

function renderHarvest() {
  const readyCount = crops.filter((crop) => cropStatus(crop) === "Ready for Harvest").length;
  const soonCount = crops.filter((crop) => {
    const days = daysFromToday(crop.harvestDate);
    return days >= 0 && days <= 14;
  }).length;
  const averageProgress = crops.length
    ? Math.round(crops.reduce((total, crop) => total + cropProgress(crop), 0) / crops.length)
    : 0;

  $("#overview-harvest").innerHTML = crops.slice(0, 3).map((crop) => {
    const progress = cropProgress(crop);
    return `
      <div class="harvest-row"><div class="harvest-crop">${cropCell(crop)}<span class="harvest-copy"><strong>${escapeHTML(crop.name)}</strong><span>Est. ${formatDate(crop.harvestDate, { month: "short", day: "numeric" })}</span></span></div><span class="harvest-percent">${progress}%</span>
        <div class="harvest-bar"><span style="width:${progress}%"></span></div>
      </div>
    `;
  }).join("");

  $("#harvest-overview-cards").innerHTML = `
    <article class="harvest-overview-card"><div class="card-top"><span>Ready to harvest</span><span class="status-dot orange-status"></span></div><strong>${String(readyCount).padStart(2, "0")} <span class="stat-unit">crops</span></strong><div class="card-note">Expected within the next 7 days</div></article>
    <article class="harvest-overview-card"><div class="card-top"><span>Harvesting soon</span><span class="status-dot orange-status"></span></div><strong>${String(soonCount).padStart(2, "0")} <span class="stat-unit">crops</span></strong><div class="card-note">Expected within the next 14 days</div></article>
    <article class="harvest-overview-card"><div class="card-top"><span>Average progress</span><span class="green-icon summary-icon">↗</span></div><strong>${averageProgress}<span class="percent">%</span></strong><div class="card-note">Across all sample crops</div></article>
  `;
  $("#full-harvest-list").innerHTML = crops.map((crop) => {
    const progress = cropProgress(crop);
    return `
      <div class="harvest-detail-row"><div class="harvest-detail-crop">${cropCell(crop)}</div><div><div class="progress-copy"><span>Growing progress</span><strong>${progress}%</strong></div><div class="harvest-bar"><span style="width:${progress}%"></span></div></div><div class="harvest-date">Expected harvest<strong>${formatDate(crop.harvestDate)}</strong></div></div>
    `;
  }).join("");
}

function renderSchedule() {
  const activities = getSchedule();
  const harvestCount = activities.filter((item) => item.type === "Harvest").length;
  const fieldCareCount = activities.filter((item) => item.type !== "Harvest").length;
  $("#schedule-month").textContent = formatDate(toDateInputValue(today), { month: "long", year: "numeric" });
  $("#schedule-month-tag").textContent = formatDate(toDateInputValue(today), { month: "long", year: "numeric" }).toUpperCase();
  $("#schedule-activity-count").textContent = String(activities.length);
  $("#schedule-harvest-count").textContent = String(harvestCount);
  $("#schedule-field-care-count").textContent = String(fieldCareCount);
  $("#full-schedule-list").innerHTML = activities.map((item) => `
    <div class="full-schedule-day"><div class="full-date"><strong>${formatDate(item.date, { weekday: "short", month: "short", day: "numeric" })}</strong>${formatDate(item.date, { year: "numeric" })}</div>
      <div class="timeline-marker ${item.type === "Planting" ? "preparation" : ""}"><span></span></div>
      <div class="activity-card"><div class="activity-main"><span class="crop-emoji" aria-hidden="true">${item.emoji}</span><span class="activity-copy"><strong>${escapeHTML(item.name)}</strong><span>${escapeHTML(item.crop)} · ${escapeHTML(item.type)}</span></span></div><span class="activity-status pending">Upcoming</span></div>
    </div>
  `).join("");
}

function showPage(page) {
  document.querySelectorAll(".page-view").forEach((view) => view.classList.toggle("active", view.id === `page-${page}`));
  document.querySelectorAll(".nav-link").forEach((link) => {
    const active = link.dataset.page === page;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  const labels = { overview: "Overview", records: "Crop records", schedule: "Planting schedule", harvest: "Harvest status" };
  $("#current-page-label").textContent = labels[page];
}

function showCropDetails(id) {
  const crop = crops.find((item) => item.id === Number(id));
  if (!crop) return;
  const progress = cropProgress(crop);
  $("#detail-title").textContent = `${crop.emoji} ${crop.name}`;
  $("#detail-content").innerHTML = `
    <div class="detail-description">${escapeHTML(crop.description)}</div>
    <div class="detail-grid"><div><span>Category</span><strong>${escapeHTML(crop.category)}</strong></div><div><span>Field</span><strong>${escapeHTML(crop.field)}</strong></div><div><span>Area</span><strong>${crop.area.toFixed(2)} hectares</strong></div><div><span>Planting date</span><strong>${formatDate(crop.plantedDate)}</strong></div><div><span>Expected harvest</span><strong>${formatDate(crop.harvestDate)}</strong></div><div><span>Status</span><strong>${escapeHTML(cropStatus(crop))}</strong></div><div><span>Growing progress</span><strong>${progress}%</strong></div></div>
  `;
  $("#detail-dialog").showModal();
}

function openAddCropDialog() {
  const form = $("#crop-form");
  form.reset();
  form.elements.name.setCustomValidity("");
  form.elements.category.setCustomValidity("");
  form.elements.field.setCustomValidity("");
  form.elements.area.setCustomValidity("");
  form.elements.harvest.setCustomValidity("");
  form.elements.planted.max = toDateInputValue(today);
  form.elements.planted.value = toDateInputValue(today);
  form.elements.harvest.min = toDateInputValue(today);
  $("#crop-dialog").showModal();
}

document.querySelectorAll(".nav-link").forEach((link) => link.addEventListener("click", () => showPage(link.dataset.page)));
document.querySelectorAll("[data-go]").forEach((button) => button.addEventListener("click", () => showPage(button.dataset.go)));
$("#crop-search").addEventListener("input", renderRecords);
$("#status-filter").addEventListener("change", renderRecords);
$("#crop-record-rows").addEventListener("click", (event) => {
  const button = event.target.closest("[data-detail]");
  if (button) showCropDetails(button.dataset.detail);
});
$("#add-crop-button").addEventListener("click", openAddCropDialog);
$("#add-crop-button-records").addEventListener("click", openAddCropDialog);
$("#crop-close").addEventListener("click", () => $("#crop-dialog").close());
$("#cancel-crop").addEventListener("click", () => $("#crop-dialog").close());
$("#detail-close").addEventListener("click", () => $("#detail-dialog").close());
$("#crop-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const plantedDate = String(data.get("planted"));
  const harvestDate = String(data.get("harvest"));
  if (parseDate(harvestDate) < parseDate(plantedDate)) {
    form.elements.harvest.setCustomValidity("Harvest date must be on or after the planting date.");
    form.elements.harvest.reportValidity();
    form.elements.harvest.addEventListener("input", () => form.elements.harvest.setCustomValidity(""), { once: true });
    return;
  }
  const name = String(data.get("name")).trim();
  const category = String(data.get("category")).trim();
  const field = String(data.get("field")).trim();
  const area = Number(data.get("area"));
  if (!name) {
    form.elements.name.setCustomValidity("Enter a crop name.");
    form.elements.name.reportValidity();
    form.elements.name.addEventListener("input", () => form.elements.name.setCustomValidity(""), { once: true });
    return;
  }
  if (!field) {
    form.elements.field.setCustomValidity("Enter a field name.");
    form.elements.field.reportValidity();
    form.elements.field.addEventListener("input", () => form.elements.field.setCustomValidity(""), { once: true });
    return;
  }
  if (!Number.isFinite(area) || area <= 0) {
    form.elements.area.setCustomValidity("Enter a valid crop area in hectares.");
    form.elements.area.reportValidity();
    form.elements.area.addEventListener("input", () => form.elements.area.setCustomValidity(""), { once: true });
    return;
  }
  crops.unshift({
    id: Date.now(),
    name,
    category,
    field,
    emoji: "🌱",
    area,
    plantedDate,
    harvestDate,
    status: statusForDates(plantedDate, harvestDate),
    description: `${name} has been added as a sample crop record.`
  });
  renderDashboardStats();
  renderOverviewCrops();
  renderRecords();
  renderMiniSchedule();
  renderHarvest();
  renderSchedule();
  $("#crop-dialog").close();
  showPage("records");
});

$("#today-label").textContent = formatDate(toDateInputValue(today), {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric"
});
$("#today-label").setAttribute("datetime", toDateInputValue(today));
$("#footer-year").textContent = String(today.getFullYear());
renderDashboardStats();
renderOverviewCrops();
renderRecords();
renderMiniSchedule();
renderHarvest();
renderSchedule();

