document.addEventListener("DOMContentLoaded", () => {
  const noticeBoardWrap = document.querySelector(".notice-board-wrap");
  if (noticeBoardWrap) {
    fetch("http://localhost:3000/api/assignments")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch assignments data");
        return response.json();
      })
      .then((assignments) => {
        console.log(assignments); // Log to inspect the data
        noticeBoardWrap.innerHTML = ""; // Clear existing content

        assignments.forEach((assignment) => {
          console.log(assignment); // Log each assignment for inspection
          const postDate = new Date(assignment.date).toLocaleDateString();
          const now = new Date();
          const postTime = Math.floor(
            (now - new Date(assignment.date)) / 60000
          ); // Time in minutes

          // Create a new notice item
          const noticeItem = document.createElement("div");
          noticeItem.className = "notice-list";

          noticeItem.innerHTML = `
                  <div class="post-date ${
                    postTime < 1440 ? "bg-skyblue" : "bg-yellow"
                  }">${postDate}</div>
                  <h6 class="notice-title">
                    <a href="${
                      assignment.link
                    }" style="color: blue; text-decoration: underline;">${
            assignment.heading
          }</a>
                  </h6>
                  <div class="entry-meta">Posted / <span>${postTime} min ago</span></div>
              `;

          noticeBoardWrap.appendChild(noticeItem);
        });
      })
      .catch((error) => {
        console.error("Error fetching assignments:", error);
        noticeBoardWrap.innerHTML =
          "<p>Error loading assignments. Please try again later.</p>";
      });
  }
  const noticeForm = document.getElementById("notice-form");

  if (noticeForm) {
    noticeForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(noticeForm);

      try {
        const response = await fetch("http://localhost:3000/api/notices", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          alert(result.message || "Notice created successfully!");
          noticeForm.reset();
        } else {
          alert(result.message || "Failed to create notice.");
        }
      } catch (error) {
        console.error("Error creating notice:", error);
        alert("An error occurred. Please try again.");
      }
    });
  }
});
