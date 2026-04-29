registerPageModule('courses', function coursesPage() {
  return `
    <section class="page" id="page-courses">
      <div class="page-header">
        <h1>Courses</h1>
        <div class="page-header-actions">
          <div class="search-bar-inline">
            <input type="text" id="courseSearch" placeholder="Search courses..." oninput="filterCourses()" />
          </div>
        </div>
      </div>
      <div class="course-grid" id="courseGrid">Loading...</div>
    </section>
  `;
});

registerPageModule('course-detail', function courseDetailPage() {
  return `
    <section class="page" id="page-course-detail">
      <button class="back-btn" onclick="navigate('courses')">Back to Courses</button>
      <div id="courseDetailContent"></div>
    </section>
  `;
});
