import { fromEvent, Subject, Observable, interval } from "rxjs";
import {
  flatMap,
  take,
  multicast,
  refCount,
  publish,
  share,
  publishLast,
  publishBehavior,
  publishReplay
} from "rxjs/operators";
import { load, loadWithFetch } from "./loader";

//#region load and loadFetch

let output = document.getElementById("output");
let button = document.getElementById("button");

let click = fromEvent(button, "click");

function renderMovies(movies) {
  movies.forEach(m => {
    let div = document.createElement("div");
    div.innerText = m.title;
    output.appendChild(div);
  });
}

let subscription = load("movies.json").subscribe(
  renderMovies,
  e => console.error(`error: ${e}`),
  () => console.log("complete")
);

console.log(subscription);
subscription.unsubscribe();

click
  .pipe(flatMap(() => loadWithFetch("movies.json")))
  .subscribe(
    renderMovies,
    e => console.log(`error: ${e}`),
    () => console.log("complete")
  );

//#endregion

//#region Using subjects and Multicasted Observables

// let subject$ = new Subject();

// subject$.subscribe(
//   value => console.log(`Observer 1: ${value}`)
// );

// subject$.subscribe(
//   value => console.log(`Observer 2: ${value}`)
// );

// subject$.next('Hello!');

// let source$ = new Observable(subscriber => {
//   subscriber.next('Greetings!');
// });

// source$.subscribe(subject$);

let source$ = interval(1000).pipe(
  take(4),
  // multicast(new Subject()),
  // publish(),
  // publishLast(),
  // publishBehavior(42),
  publishReplay(),
  refCount()
  // share()
);

// let subject$ = new Subject();
// source$.subscribe(subject$);

source$.subscribe(value => console.log(`Observer 1: ${value}`));

setTimeout(() => {
  source$.subscribe(value => console.log(`Observer 2: ${value}`));
}, 1000);

setTimeout(() => {
  source$.subscribe(value => console.log(`Observer 3: ${value}`));
}, 2000);

setTimeout(() => {
  source$.subscribe(value => console.log(`Observer 4: ${value}`), null, () =>
    console.log("Observer 4 completed.")
  );
}, 4500);

// source$.connect();

//#endregion
