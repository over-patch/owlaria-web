const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealElements = [
  ...document.querySelectorAll<HTMLElement>('[data-reveal]'),
];

if (!reducedMotion.matches && revealElements.length > 0) {
  document.documentElement.classList.add('motion-ready');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }

      if (
        revealElements.every((element) =>
          element.classList.contains('is-revealed'),
        )
      ) {
        observer.disconnect();
      }
    },
    { rootMargin: '0px 0px -8%', threshold: 0.12 },
  );

  for (const element of revealElements) {
    observer.observe(element);
  }
}
