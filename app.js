(function () {
  const STORAGE_PREFIX = "supptrack:";
  const slotListEl = document.getElementById("slotList");
  const slotTemplate = document.getElementById("slotTemplate");
  const dayProgressFill = document.getElementById("dayProgressFill");
  const dayProgressLabel = document.getElementById("dayProgressLabel");

  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function minutesNow() {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  function minutesFromTime(time) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  function loadState(dateKey) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + dateKey);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveState(dateKey, state) {
    localStorage.setItem(STORAGE_PREFIX + dateKey, JSON.stringify(state));
  }

  function pruneOldState(currentDateKey) {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX) && key !== STORAGE_PREFIX + currentDateKey) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }

  let currentDateKey = todayKey();
  let state = loadState(currentDateKey);
  pruneOldState(currentDateKey);

  function checkmarkSvg() {
    return `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8.5L6.2 11.7L13 4" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  function getCurrentSlotIndex() {
    const now = minutesNow();
    let lastPastIndex = -1;
    for (let i = 0; i < SCHEDULE.length; i++) {
      if (minutesFromTime(SCHEDULE[i].time) <= now) {
        lastPastIndex = i;
      }
    }
    if (lastPastIndex === -1) return 0;
    return lastPastIndex;
  }

  function slotStatus(slotIndex) {
    const slot = SCHEDULE[slotIndex];
    const total = slot.items.length;
    let checkedCount = 0;
    for (let i = 0; i < total; i++) {
      if (state[`${slotIndex}-${i}`]) checkedCount++;
    }

    const now = minutesNow();
    const nextSlot = SCHEDULE[slotIndex + 1];
    const windowEnded = nextSlot ? minutesFromTime(nextSlot.time) <= now : false;

    if (checkedCount === total) return { status: "complete", checkedCount, total };
    if (checkedCount > 0) return { status: "partial", checkedCount, total };
    if (windowEnded) return { status: "missed", checkedCount, total };
    return { status: "none", checkedCount, total };
  }

  function render() {
    slotListEl.innerHTML = "";
    const currentSlotIndex = getCurrentSlotIndex();
    let totalItems = 0;
    let totalChecked = 0;

    SCHEDULE.forEach((slot, slotIndex) => {
      const node = slotTemplate.content.cloneNode(true);
      const card = node.querySelector(".slot-card");
      const timeEl = node.querySelector(".slot-time");
      const statusEl = node.querySelector(".slot-status");
      const itemListEl = node.querySelector(".item-list");

      const { status, checkedCount, total } = slotStatus(slotIndex);
      totalItems += total;
      totalChecked += checkedCount;

      timeEl.textContent = slot.label;
      card.classList.add(`status-${status}`);
      if (slotIndex === currentSlotIndex) card.classList.add("is-current");
      card.id = `slot-${slotIndex}`;

      const statusLabels = {
        complete: "Done",
        partial: `${checkedCount}/${total}`,
        missed: "Missed",
        none: `${checkedCount}/${total}`,
      };
      statusEl.textContent = statusLabels[status];

      slot.items.forEach((item, itemIndex) => {
        const itemId = `${slotIndex}-${itemIndex}`;
        const li = document.createElement("li");
        li.className = "item-row" + (state[itemId] ? " checked" : "");
        li.innerHTML = `<span class="item-checkbox">${checkmarkSvg()}</span><span class="item-label">${item}</span>`;
        li.addEventListener("click", () => toggleItem(itemId));
        itemListEl.appendChild(li);
      });

      slotListEl.appendChild(node);
    });

    dayProgressFill.style.width = totalItems ? `${(totalChecked / totalItems) * 100}%` : "0%";
    dayProgressLabel.textContent = `${totalChecked} / ${totalItems} taken`;

    return currentSlotIndex;
  }

  function toggleItem(itemId) {
    state[itemId] = !state[itemId];
    if (!state[itemId]) delete state[itemId];
    saveState(currentDateKey, state);
    render();
  }

  function checkForNewDay() {
    const key = todayKey();
    if (key !== currentDateKey) {
      currentDateKey = key;
      state = loadState(currentDateKey);
      pruneOldState(currentDateKey);
      render();
    }
  }

  function scrollToCurrent(slotIndex) {
    const el = document.getElementById(`slot-${slotIndex}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const initialCurrentSlot = render();
  scrollToCurrent(initialCurrentSlot);

  setInterval(() => {
    checkForNewDay();
    render();
  }, 30000);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      checkForNewDay();
      render();
    }
  });
})();
