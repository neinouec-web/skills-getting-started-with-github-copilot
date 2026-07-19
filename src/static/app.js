document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const participants = Array.isArray(details.participants) ? details.participants : [];
        const spotsLeft = Math.max(details.max_participants - participants.length, 0);

        activityCard.innerHTML = `
          <div class="activity-card-header">
            <h4>${name}</h4>
            <span class="availability-badge">${spotsLeft} spots left</span>
          </div>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <div class="participants">
            <strong>Participants:</strong>
            ${participants.length > 0
              ? `<div class="participants-list">${participants
                  .map((participant) => `
                    <div class="participant-row">
                      <span>${participant}</span>
                      <button class="remove-participant-btn" data-activity="${name}" data-email="${participant}" aria-label="Remove ${participant}">
                        ✕
                      </button>
                    </div>
                  `)
                  .join("")}</div>`
              : `<p class="participants-empty">No participants yet.</p>`}
          </div>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  async function refreshActivities() {
    await fetchActivities();
  }

  activitiesList.addEventListener("click", async (event) => {
    const button = event.target.closest(".remove-participant-btn");
    if (!button) return;

    const activity = button.dataset.activity;
    const email = button.dataset.email;

    try {
      const response = await fetch(`/activities/${encodeURIComponent(activity)}/remove?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        await refreshActivities();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to remove participant.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error removing participant:", error);
    }
  });

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
        await fetchActivities();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
