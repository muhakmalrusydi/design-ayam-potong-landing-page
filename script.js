document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.querySelector(".nav-toggle");
  const sidebar = document.getElementById("menu");

  toggleBtn.addEventListener("click", function () {
    sidebar.classList.toggle("sidebar--active");
  });

  document.addEventListener("click", function (e) {
    if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
      sidebar.classList.remove("sidebar--active");
    }
  });
});
