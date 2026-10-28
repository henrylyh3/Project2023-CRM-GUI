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
Compatibility exceptions: TypeScript 7 is outside Angular 22's compiler range;
Jasmine 7 freezes APIs patched by Zone.js testing and fails before tests execute.
Jasmine 6.3.0 and `@types/jasmine` 6.0.0 are retained as the latest compatible
pair for this Zone-based suite. No persistent peer-dependency bypass is used.

Unused jQuery and legacy Popper v1 were removed; ng-bootstrap uses Popper v2.
Bootstrap now loads its distributed CSS, preserving its original stylesheet
order without deprecated application-level Sass imports. The application
builder still writes deployment files to `dist/crm-gui`, preserving the old path.

- `npm run build`: passed. Initial bundle 806.38 kB raw / 155.57 kB estimated
  transfer. Existing 500 kB warning threshold remains exceeded; 1 MB error
  threshold remains unchanged.
- `npm run test:ci`: 22 tests passed in Chrome Headless. Coverage includes HTTP
  URLs/methods/payloads, list rendering, filtering, pagination, add/edit form
  behavior, cancellation, delete confirmation, and backend error branches.
- `npm ls --depth=0`: passed, with no invalid direct dependencies.
- Browser smoke check: listing shell, Add dialog, and Cancel work.
- Live backend check: `https://localhost:5266/api/User/users` refused connection.
  Real backend CRUD and deployment remain unverified.

## What `standalone: false` means

A component with `standalone: false` must be declared in an NgModule. That
module imports the directives, pipes, forms, and Material modules used by the
component's template. It does not disable the component or lazy loading.

Angular 16 defaulted to NgModule components. Angular 19 changed the default to
standalone. Explicit `standalone: false` lets this application retain its
existing `AppModule` and lazy-loaded `UniversalModule` structure.

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
| Component organization | NgModule-based components by default | Standalone components by default | Keep NgModules; explicitly mark existing components `standalone: false` |
| Template control flow | `*ngIf`, `*ngFor`, `*ngSwitch` | Built-in `@if`, `@for`, `@switch`; older directives deprecated | Use `@if` for conditional buttons |
| Reactivity | Signals introduced as developer preview | Mature signals ecosystem, including computed state and signal-based component APIs | Existing RxJS HTTP streams and template-driven forms remain valid |
| Change detection | Zone.js normally schedules view checks after async work | Zoneless is the default for modern applications | Explicitly retain Zone-based change detection for current subscription-driven state |
| Component checking | `Default` checks components eagerly | `OnPush` is the default; old `Default` strategy is named `Eager` | Explicitly preserve eager checking for existing mutable component state |
| Build tooling | Webpack `browser` builder | Modern application builder using esbuild and a Vite-based development server | Migrate build configuration; verify production output |
| HTTP setup | `HttpClientModule` common | `provideHttpClient()` provider API preferred | Retain HTTP URLs, verbs, DTOs, and error behavior |
| Bootstrap API | `platformBrowserDynamic().bootstrapModule(AppModule)` | `platformBrowser()` for existing module applications; `bootstrapApplication()` for standalone applications | Retain module bootstrap using current platform API |
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
> dependencies together, migrated the build configuration, and retained the
> existing lazy-loaded NgModule architecture with explicit `standalone: false`.
> I preserved eager component checking and Zone-based change detection because
> the application updates UI state
> through RxJS subscriptions. I modernized deprecated setup APIs and added
> regression coverage for the API contract and CRM workflows. The production
> build and 22 Chrome Headless tests passed; the real backend was offline, so I
> distinguished those results from live integration verification.

If asked why not rewrite everything:

> My goal was a working framework upgrade with controlled behavior changes.
> Standalone components and zoneless state management can be adopted separately.
> Keeping those changes separate makes regressions easier to isolate.

If asked whether the upgrade makes the application faster:

> The modern builder improves the development/build pipeline, but I would measure
> build time, bundle size, and browser performance before claiming a speedup.

## Validation boundaries

Automated browser tests use fixture contacts and mocked HTTP. They can verify
templates, form binding, API request contracts, pagination, dialogs, and error
branches without touching real contacts. They do not prove that the external
backend, its TLS certificate, or a deployment works.

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
