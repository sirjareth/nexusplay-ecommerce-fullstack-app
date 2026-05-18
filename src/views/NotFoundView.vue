<template>
  <div class="container d-flex justify-content-center align-items-center" style="min-height: calc(100vh - 70px);">
    <div class="text-center">
      <div class="not-found-code">404</div>
      <h2 style="font-family: var(--font-display); font-size: 1.8rem; color: var(--np-muted);">LEVEL NOT FOUND</h2>
      <p style="color: var(--np-muted); font-size: 0.9rem; margin-bottom: 2rem;">This page doesn't exist in our universe.</p>
      <router-link to="/products" class="btn btn-nexus">
        <i class="bi bi-house me-2"></i>Back to Store
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found-code {
  font-family: var(--font-display);
  font-size: 10rem;
  line-height: 1;
  background: var(--np-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
