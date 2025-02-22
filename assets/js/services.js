document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector("[data-json]");
  if (!container) {
    console.error("No data-json attribute found.");
    return;
  }

  // Add loading overlay to the service details section
  const serviceDetails = document.querySelector(".col-lg-8");
  const loadingOverlay = document.createElement("div");
  loadingOverlay.classList.add("loading-overlay");
  loadingOverlay.innerHTML = `
    <div class="spinner-border" style="color: #1bbd36" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `;
  serviceDetails.style.position = "relative";
  serviceDetails.appendChild(loadingOverlay);

  const ugv_uav_only_container = document.querySelector("#ui-uav-only-container");

  // Add CSS for the loading overlay
  const style = document.createElement("style");
  style.textContent = `
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .loading-overlay.active {
      display: flex;
    }
  `;
  document.head.appendChild(style);

  const jsonFilePath = container.dataset.json;

  fetch(jsonFilePath)
    .then(response => response.json())
    .then(services => {
      const servicesList = document.getElementById("services-list");
      const serviceImage = document.getElementById("service-image");
      const serviceTitle = document.getElementById("service-title");
      const serviceContent = document.getElementById("service-content");

      services.forEach((service, index) => {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = service.title;
        link.dataset.index = index;
        if (index === 0) link.classList.add("active");

        link.addEventListener("click", function (event) {
          event.preventDefault();
          loadingOverlay.classList.add("active");
          
          // Create a new image to preload
          const img = new Image();
          img.onload = function() {
            updateServiceDetails(services[this.dataset.index]);
            setTimeout(() => {
              loadingOverlay.classList.remove("active");
            }, 300); // Minimum loading time for smooth transition
          }.bind(this);
          img.onerror = function() {
            updateServiceDetails(services[this.dataset.index]);
            loadingOverlay.classList.remove("active");
          }.bind(this);
          img.src = services[this.dataset.index].image;

          document.querySelectorAll("#services-list a").forEach(a => a.classList.remove("active"));
          this.classList.add("active");
        });

        servicesList.appendChild(link);
      });

      if (services.length > 0) updateServiceDetails(services[0]);

      function updateServiceDetails(service) {
        serviceImage.src = service.image;
        serviceTitle.textContent = service.title;
        serviceContent.innerHTML = "";


        if (ugv_uav_only_container) {
          const isUgvOrUav = service.title === "UAVs" || service.title === "UGVs";
          ugv_uav_only_container.classList.toggle("d-none", !isUgvOrUav);
        } 

        service.content.forEach(item => {
          if (item.type === "paragraph") {
            const p = document.createElement("p");
            p.textContent = item.text;
            serviceContent.appendChild(p);
          } else if (item.type === "title") {
            const h4 = document.createElement("h4");
            h4.textContent = item.text;
            serviceContent.appendChild(h4);
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
            imgWrapper.classList.add("img-fluid", "text-center", "my-3");
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