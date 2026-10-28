# Angular upgrade and interview notes

## Installed versions and verification

Verified on 28 October 2026:

| Package | Before (lockfile) | After |
| --- | --- | --- |
| Angular framework | 16.2.5 | 22.2.3 |
| Angular CLI / build tooling | 16.2.2 | 22.2.5 |
| Material / CDK | 16.2.4 | 22.2.4 |
| TypeScript | 5.1.6 | 6.0.3 |
| ng-bootstrap | 15.1.1 | 21.0.0 |
| ngx-spinner | 16.0.2 | 22.0.1 |
| RxJS | 7.8.1 | 7.8.2 |
| Zone.js | 0.13.3 | 0.16.3 |

All direct dependencies were checked against npm's latest stable releases.
Compatibility exception: TypeScript 7 is outside Angular 22's compiler range.
No persistent peer-dependency bypass is used.

After step 2, all six test files, test TypeScript configuration, Karma target,
test commands, and direct test-only dependencies were removed at the user's
request. Test results below describe historical verification before removal;
the current checkout has no automated test suite.

Unused jQuery and legacy Popper v1 were removed; ng-bootstrap uses Popper v2.
Bootstrap now loads its distributed CSS, preserving its original stylesheet
order without deprecated application-level Sass imports. The application
builder still writes deployment files to `dist/crm-gui`, preserving the old path.

- `npm run build` after routing consolidation: passed. Initial bundle 790.89 kB raw / 149.96 kB estimated
  transfer. Existing 500 kB warning threshold remains exceeded; 1 MB error
  threshold remains unchanged.
- Historical step 2 test run: 26 tests passed in Chrome Headless. Coverage included HTTP
  URLs/methods/payloads, list rendering, filtering, pagination, add/edit form
  behavior, cancellation, delete confirmation, and backend error branches.
  Integration tests also exercised the real lazy route injector and actual
  standalone Add, Confirmation, and Alert dialogs, including Cancel and OK.
- `npm ls --depth=0`: passed, with no invalid direct dependencies.
- Browser smoke check: listing shell, Add dialog, and Cancel work.
- Live backend check: `https://localhost:5266/api/User/users` refused connection.
  Real backend CRUD and deployment remain unverified.

## Standalone migration: steps 1 and 2 complete

All five application components are standalone: `AppComponent`, `UserComponent`,
`AddEditUserComponent`, `AlertDialogComponent`, and `ConfirmationDialogComponent`.
Each component imports the directives or Material/forms modules used by its own
template. Angular 22 defaults `standalone` to true, so the flag is omitted.

| Previous configuration | Current equivalent |
| --- | --- |
| `AppModule` root component declaration | Standalone `AppComponent` imports `RouterOutlet` |
| `AppModule` providers/imported providers | `app.config.ts` application providers |
| `platformBrowser().bootstrapModule(AppModule)` | `bootstrapApplication(AppComponent, appConfig)` |
| `AppRoutingModule` with `RouterModule.forRoot(...)` | `app.routes.ts` with `provideRouter(routes)` |
| Lazy `UniversalModule` and its routing module | One `app.routes.ts` with lazy `loadComponent` entries |
| `UniversalModule.providers` confirmation service | Shared service with `providedIn: 'root'` |
| Module-supplied template imports | Each standalone component's `imports` |

Removed `app.module.ts`, `app-routing.module.ts`, `main/universal.module.ts`, and
`main/universal-routing.module.ts`. No application-owned NgModules remain.
Third-party NgModules such as `MatButtonModule` can still be imported by
standalone components. `importProvidersFrom(NgxSpinnerModule, NgbModule)` retains
the existing root library providers; `provideAnimations()` preserves animation
setup. HTTP still uses XHR and DI interceptors.

The `/` and `/user` route definitions and their title metadata are retained.
After step 2, routing was simplified for this small application: all routes now
live in `app.routes.ts`; `main/main.routes.ts` was removed. Each route uses a
dynamic `loadComponent` import. `app.config.ts` still registers the single router
through `provideRouter(routes)`.

`ConfirmationDialogService` now uses `providedIn: 'root'`, supplying one shared
application service without importing it into the route configuration. This
intentionally replaces the previous feature-route provider scope. Standalone
components continue declaring their own template dependencies.

The `/user` URL previously pointed to a dialog-only component requiring
`MatDialogRef` and `MAT_DIALOG_DATA`. Those injections are now optional so the
component can render as a page or a popup. Closing/cancelling a popup still
closes its dialog; closing/cancelling the routed form navigates to `/`. Existing
save outcomes use that same close/navigation behavior.

Browser verification after consolidation: `/user` renders without injection
errors, name binding updates, routed Cancel returns to `/`, and the Add popup
still opens and cancels. No contacts were saved during these checks.

This migration retains templates, DTOs, HTTP methods/URLs, CRUD request payloads,
template-driven forms, lifecycle hooks, eager checking, and Zone-based scheduling.
Signals, OnPush, and zoneless conversion are separate future steps.

Measured production initial bundle: 806.38 kB before standalone conversion,
787.38 kB after step 2, and 790.89 kB after single-file routing consolidation.
These are bundle-size measurements, not measured runtime speedups.

## What `standalone: false` meant before conversion

A component with `standalone: false` must be declared in an NgModule. That
module imports the directives, pipes, forms, and Material modules used by the
component's template. It does not disable the component or lazy loading.

Angular 16 defaulted to NgModule components. Angular 19 changed the default to
standalone. The initial upgrade used explicit `standalone: false` to retain
`AppModule` and lazy-loaded `UniversalModule`. Steps 1 and 2 then replaced that
structure with standalone components and route/provider configuration.

```ts
@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
```

A standalone component instead declares its own template imports and is not
listed in an NgModule's `declarations`. Standalone components can coexist with
NgModules; converting the whole application is not required for an upgrade.

## Angular 16 versus Angular 22

These changes accumulated across versions 17–22; they were not all introduced
in version 22.

| Topic | Angular 16 | Angular 22 | Application decision |
| --- | --- | --- | --- |
| Component organization | NgModule-based components by default | Standalone components by default | All five components now standalone; application NgModules removed |
| Template control flow | `*ngIf`, `*ngFor`, `*ngSwitch` | Built-in `@if`, `@for`, `@switch`; older directives deprecated | Use `@if` for conditional buttons |
| Reactivity | Signals introduced as developer preview | Mature signals ecosystem, including computed state and signal-based component APIs | Existing RxJS HTTP streams and template-driven forms remain valid |
| Change detection | Zone.js normally schedules view checks after async work | Zoneless is the default for modern applications | Explicitly retain Zone-based change detection for current subscription-driven state |
| Component checking | `Default` checks components eagerly | `OnPush` is the default; old `Default` strategy is named `Eager` | Explicitly preserve eager checking for existing mutable component state |
| Build tooling | Webpack `browser` builder | Modern application builder using esbuild and a Vite-based development server | Migrate build configuration; verify production output |
| HTTP setup | `HttpClientModule` common | `provideHttpClient()` provider API preferred | Retain HTTP URLs, verbs, DTOs, and error behavior |
| Bootstrap API | `platformBrowserDynamic().bootstrapModule(AppModule)` | `bootstrapApplication()` for standalone applications | Bootstrap standalone root with `app.config.ts` providers |
| TypeScript | 5.1.x | 6.0.x required by current Angular compiler | Use latest compatible 6.0 patch, not unsupported TypeScript 7 |
| UI libraries | Material/CDK 16 and ng-bootstrap 15 | Material/CDK 22 and ng-bootstrap 21 | Keep CRM layout and existing Material 2 theme |
| Deferred rendering | No built-in `@defer` blocks | `@defer` can delay eligible dependencies until a trigger fires | Available feature; not needed for this small CRM |
| New v22 APIs | No Signal Forms or Angular Aria | Signal Forms, asynchronous signals, and Angular Aria are stable | Available features; no rewrite of existing forms required |

Signals do not replace RxJS in every use case. Signals suit synchronous UI state;
RxJS suits asynchronous streams, cancellation, and operators such as `switchMap`.
Standalone components do not automatically make an application zoneless. These
are separate architectural choices.

## Interview answer

> I upgraded a small CRM from Angular 16 to Angular 22, applying the official
> migrations one major version at a time. I updated Angular, Material, and their
> dependencies together and migrated the build configuration. In a separate
> step, I converted all five components to standalone, replaced NgModules with
> route/provider configuration, and retained lazy loading. I then consolidated
> the small application's routes into one file and used shared root service DI.
> I preserved eager component checking and Zone-based change detection because
> the application updates UI state
> through RxJS subscriptions. I modernized deprecated setup APIs and added
> regression coverage for the API contract and CRM workflows. The production
> build and 26 Chrome Headless tests passed before the test suite was later
> removed. The real backend was offline, so I distinguished those results from
> live integration verification.

If asked why not rewrite everything:

> My goal was a working framework upgrade with controlled behavior changes.
> I adopted standalone components separately from zoneless state management.
> Keeping those changes separate makes regressions easier to isolate.

If asked whether the upgrade makes the application faster:

> The modern builder improves the development/build pipeline, but I would measure
> build time, bundle size, and browser performance before claiming a speedup.

## Validation boundaries

The removed browser tests used fixture contacts and mocked HTTP to verify
templates, form binding, API request contracts, pagination, dialogs, and error
branches without touching real contacts. Those historical results do not prove
that the external backend, its TLS certificate, or a deployment works. Future
changes currently require manual verification and a production build.

## Official references

- [Angular version compatibility](https://angular.dev/reference/versions)
- [Angular update guide](https://angular.dev/update-guide)
- [NgModules and standalone declarations](https://angular.dev/guide/ngmodules/overview)
- [Zoneless change detection](https://angular.dev/guide/zoneless)
- [Build system migration](https://angular.dev/tools/cli/build-system-migration)
- [Template control flow](https://angular.dev/guide/templates/control-flow)
- [Signals](https://angular.dev/guide/signals)
- [Component change detection strategy](https://angular.dev/api/core/ChangeDetectionStrategy)
- [Angular 22 release highlights](https://angular.dev/events/v22)
- [ng-bootstrap compatibility](https://github.com/ng-bootstrap/ng-bootstrap#dependencies)
