import { fromEvent, Subject, Observable } from "rxjs";
import { flatMap } from "rxjs/operators";
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

let subject$ = new Subject();

subject$.subscribe(
  value => console.log(`Observer 1: ${value}`) 
);

subject$.subscribe(
  value => console.log(`Observer 2: ${value}`)
);

subject$.next('Hello!');

let source$ = new Observable(subscriber => {
  subscriber.next('Greetings!');
});

source$.subscribe(subject$);

//#endregion
