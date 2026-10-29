# Remaining Angular modernization steps

Suggested order. Complete and verify one step before starting the next.
These are modernization options, not requirements for running Angular 22.

1. **Modernize forms — optional**
   - Choose typed reactive forms or evaluate Signal Forms; do not implement both.
   - Migrate the add/edit form separately, preserving DTOs and API contracts.
   - Define required/email validation and verify Add, Update, and Cancel behavior.
   - Existing template-driven forms remain supported.

2. **Review deprecated animation setup and unused libraries**
   - Check remaining consumers of `provideAnimations()` and `@angular/animations`.
   - Remove legacy setup only when installed UI libraries no longer need it;
     use CSS or `animate.enter` / `animate.leave` for suitable custom animations.
   - Review unused ng-bootstrap and spinner providers/packages before removal.
   - Verify dialog transitions, focus handling, and closing behavior.

3. **Reduce the production bundle**
   - Analyze the latest production build and identify avoidable dependencies/CSS.
   - Preserve lazy loading, required styles, and existing CRM behavior.
   - Work toward the existing 500 kB initial-bundle warning budget.
   - Measure changes; do not hide the warning by increasing the budget.

4. **Complete live backend verification**
   - Run the configured API and verify list, add, edit, delete, cancellation,
     filtering, pagination, and error handling against the real backend.
   - Verify both direct `/user` navigation and popup form usage.
   - Confirm production hosting supports direct navigation to application routes.

For each implemented step: run `npm run build`, run `git diff --check`, and
manually verify the affected workflows. Keep test files removed as requested.
