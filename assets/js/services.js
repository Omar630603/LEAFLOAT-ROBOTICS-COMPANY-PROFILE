document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector("[data-json]");
  if (!container) {
    console.error("No data-json attribute found.");
    return;
  }

  const jsonFilePath = container.dataset.json; // Get JSON path dynamically

  fetch(jsonFilePath)
    .then(response => response.json())
    .then(services => {
      const servicesList = document.getElementById("services-list");
      const serviceImage = document.getElementById("service-image");
      const serviceTitle = document.getElementById("service-title");
      const serviceContent = document.getElementById("service-content");

      // Populate service list
      services.forEach((service, index) => {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = service.title;
        link.dataset.index = index;
        if (index === 0) link.classList.add("active"); // Default active

        link.addEventListener("click", function (event) {
          event.preventDefault();
          updateServiceDetails(services[this.dataset.index]);

          // Update active link
          document.querySelectorAll("#services-list a").forEach(a => a.classList.remove("active"));
          this.classList.add("active");
        });

        servicesList.appendChild(link);
      });

      // Load first service by default
      if (services.length > 0) updateServiceDetails(services[0]);

      function updateServiceDetails(service) {
        serviceImage.src = service.image;
        serviceTitle.textContent = service.title;

        // Clear previous content
        serviceContent.innerHTML = "";

        // Generate dynamic content
        service.content.forEach(item => {
          if (item.type === "paragraph") {
            const p = document.createElement("p");
            p.textContent = item.text;
            serviceContent.appendChild(p);
          } else if (item.type === "check-list") {
            const ul = document.createElement("ul");
            item.items.forEach(point => {
              const li = document.createElement("li");
              li.innerHTML = `<i class="bi bi-check-circle"></i> <span>${point}</span>`;
              ul.appendChild(li);
            });
            serviceContent.appendChild(ul);
          } else if (item.type === "image") {
            const imgWrapper = document.createElement("div");
            imgWrapper.classList.add("img-fluid", "text-center", "my-3"); // Responsive styling
            const img = document.createElement("img");
            img.src = item.src;
            img.classList.add("img-fluid");
            img.alt = "Service Image";
            imgWrapper.appendChild(img);
            serviceContent.appendChild(imgWrapper);
          } else if (item.type === "video") {
            const videoWrapper = document.createElement("div");
            videoWrapper.classList.add("watch-video", "d-flex", "align-items-center", "position-relative", "my-3");
            videoWrapper.innerHTML = `
                <i class="bi bi-play-circle"></i>
                <a href="${item.href}" class="glightbox stretched-link">Watch Video</a>
            `;
            serviceContent.appendChild(videoWrapper);
            setTimeout(() => {
                if (typeof GLightbox === "function") {
                    GLightbox({ selector: ".glightbox" });
                }
            }, 100);
          } else if (item.type === "ordered-list") {
            const ol = document.createElement("ol");
            item.items.forEach(point => {
              const li = document.createElement("li");
              li.textContent = point;
              ol.appendChild(li);
            });
            serviceContent.appendChild(ol);
          } else if (item.type === "bullet-list") {
            const ul = document.createElement("ul");
            item.items.forEach(point => {
              const li = document.createElement("li");
              li.innerHTML = `<i class="bi bi-dot"></i> <span>${point}</span>`;
              ul.appendChild(li);
            });
            serviceContent.appendChild(ul);
          }
          
        });
      }
    })
    .catch(error => console.error("Error loading services:", error));
});
