<template>
  <footer class="nexus-footer">
    <div class="container-xl">
      <div class="footer-inner">
        <span class="footer-logo">
          <span class="logo-bracket">[</span>NEXUS<span class="logo-accent">PLAY</span><span class="logo-bracket">]</span>
        </span>
        <span class="footer-copy">© NexusPlay 2026 | All rights reserved</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.nexus-footer {
  border-top: 1px solid var(--np-border);
  background: rgba(10, 10, 15, 0.95);
  padding: 1.25rem 0;
  margin-top: auto;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.footer-logo {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--np-text);
  letter-spacing: 0.04em;
}

.logo-accent { color: var(--np-primary); }
.logo-bracket { color: var(--np-secondary); }

.footer-copy {
  color: var(--np-muted);
  font-size: 0.82rem;
}
</style>
