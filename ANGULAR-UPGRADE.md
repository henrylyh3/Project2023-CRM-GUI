# Remaining Angular modernization steps

Suggested order. Complete and verify one step before starting the next.
These are modernization options, not requirements for running Angular 22.

1. **Review Observable subscription lifetimes**
   - Identify subscriptions that can outlive their component.
   - Use `takeUntilDestroyed()` where component-bound cleanup is appropriate.
   - Pass an injected `DestroyRef` when calling it outside an injection context.
   - HTTP and dialog-close Observables normally complete; avoid blanket rewrites.
   - Preserve request completion and refresh behavior when dialogs close.

2. **Adopt OnPush one component at a time**
   - Start with a simple dialog, then migrate the list and add/edit form.
   - Replace explicit eager checking with `ChangeDetectionStrategy.OnPush`.
   - Ensure HTTP results and other async state changes notify Angular through
     signals, `AsyncPipe`, or `markForCheck()` as appropriate.
   - Review mutable object/input updates and verify all displayed state changes.

3. **Migrate to zoneless change detection**
   - First verify every async UI update has an Angular notification mechanism.
   - Remove `provideZoneChangeDetection()`, the `zone.js` polyfill, and the
     dependency after checking third-party compatibility.
   - Verify list loading, filtering, pagination, dialogs, and CRUD outcomes.

4. **Modernize forms — optional**
   - Choose typed reactive forms or evaluate Signal Forms; do not implement both.
   - Migrate the add/edit form separately, preserving DTOs and API contracts.
   - Define required/email validation and verify Add, Update, and Cancel behavior.
   - Existing template-driven forms remain supported.

5. **Review deprecated animation setup and unused libraries**
   - Check remaining consumers of `provideAnimations()` and `@angular/animations`.
   - Remove legacy setup only when installed UI libraries no longer need it;
     use CSS or `animate.enter` / `animate.leave` for suitable custom animations.
   - Review unused ng-bootstrap and spinner providers/packages before removal.
   - Verify dialog transitions, focus handling, and closing behavior.

6. **Reduce the production bundle**
   - Analyze the latest production build and identify avoidable dependencies/CSS.
   - Preserve lazy loading, required styles, and existing CRM behavior.
   - Work toward the existing 500 kB initial-bundle warning budget.
   - Measure changes; do not hide the warning by increasing the budget.

7. **Complete live backend verification**
   - Run the configured API and verify list, add, edit, delete, cancellation,
     filtering, pagination, and error handling against the real backend.
   - Verify both direct `/user` navigation and popup form usage.
   - Confirm production hosting supports direct navigation to application routes.

For each implemented step: run `npm run build`, run `git diff --check`, and
manually verify the affected workflows. Keep test files removed as requested.
